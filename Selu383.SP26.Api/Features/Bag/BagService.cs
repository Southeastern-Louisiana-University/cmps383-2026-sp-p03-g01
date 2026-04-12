
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Bag;
using Selu383.SP26.Api.Features.Items;

namespace Selu383.SP26.Api.Features.Bag;

    public class BagService : IBagService
{
    private const string SessionCookieName = "bag_session";
    private readonly DataContext _db;
    private readonly IHttpContextAccessor _http;

    public BagService(DataContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    private string? GetOrCreateSessionId()
    {
        var ctx = _http.HttpContext!;
        
        if (ctx.Request.Headers.TryGetValue("X-Session-Id", out var header) && Guid.TryParse(header, out _))
            return header.ToString();

        
        if (ctx.Request.Cookies.TryGetValue(SessionCookieName, out var sid) && Guid.TryParse(sid, out _))
            return sid;

      
        var newSid = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = ctx.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        };
        ctx.Response.Cookies.Append(SessionCookieName, newSid, cookieOptions);
        return newSid;
    }

    public async Task<Bag> GetOrCreateBagAsync()
    {
        var ctx = _http.HttpContext!;
        var userId = ctx.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var sessionId = GetOrCreateSessionId();

        if (!string.IsNullOrEmpty(userId))
        {
            var userBag = await _db.Set<Bag>()
                .Include(b => b.Items)
                .ThenInclude(i => i.Item)
                .FirstOrDefaultAsync(b => b.UserId == userId && b.Status == BagStatus.Open);

            if (userBag != null)
            {
                
                if (!string.IsNullOrEmpty(sessionId))
                {
                    var anon = await _db.Set<Bag>()
                        .Include(b => b.Items)
                        .FirstOrDefaultAsync(b => b.SessionId == sessionId && b.Status == BagStatus.Open);

                    if (anon != null)
                    {
                        
                        using var tx = await _db.Database.BeginTransactionAsync();
                        try
                        {
                            MergeAnonymousBagIntoUserBag(anon, userBag);
                            _db.Remove(anon);
                            await _db.SaveChangesAsync();
                            await tx.CommitAsync();
                        }
                        catch
                        {
                            await tx.RollbackAsync();
                            throw;
                        }
                    }
                }
                return userBag;
            }

          
            if (!string.IsNullOrEmpty(sessionId))
            {
                var anon = await _db.Set<Bag>()
                    .Include(b => b.Items)
                    .FirstOrDefaultAsync(b => b.SessionId == sessionId && b.Status == BagStatus.Open);

                if (anon != null)
                {
                    
                    using var tx = await _db.Database.BeginTransactionAsync();
                    try
                    {
                        anon.UserId = userId;
                        anon.SessionId = null;
                        await _db.SaveChangesAsync();
                        await tx.CommitAsync();
                        return anon;
                    }
                    catch
                    {
                        await tx.RollbackAsync();
                        throw;
                    }
                }
            }

            
            var newBag = new Bag { UserId = userId, Status = BagStatus.Open };
            _db.Add(newBag);
            await _db.SaveChangesAsync();
            return newBag;
        }

        if (string.IsNullOrEmpty(sessionId))
            sessionId = GetOrCreateSessionId();

        var bag = await _db.Set<Bag>()
            .Include(b => b.Items)
            .ThenInclude(i => i.Item)
            .FirstOrDefaultAsync(b => b.SessionId == sessionId && b.Status == BagStatus.Open);

        if (bag != null) return bag;

        var anonBag = new Bag { SessionId = sessionId, Status = BagStatus.Open };
        _db.Add(anonBag);
        await _db.SaveChangesAsync();
        return anonBag;
    }

    private void MergeAnonymousBagIntoUserBag(Bag anon, Bag userBag)
    {
        foreach (var anonItem in anon.Items)
        {
            var existing = userBag.Items.FirstOrDefault(i => i.ItemId == anonItem.ItemId);
            if (existing != null)
            {
                existing.Quantity += anonItem.Quantity;
            }
            else
            {
                userBag.Items.Add(new BagItem
                {
                    ItemId = anonItem.ItemId,
                    Quantity = anonItem.Quantity,
                    UnitPriceSnapshot = anonItem.UnitPriceSnapshot
                });
            }
        }
    }

    public async Task AddItemAsync(int itemId, int quantity)
    {
        var bag = await GetOrCreateBagAsync();
        var existing = bag.Items.FirstOrDefault(i => i.ItemId == itemId);
        if (existing != null)
        {
            existing.Quantity += quantity;
        }
        else
        {
            var item = await _db.Set<Item>().FindAsync(itemId);
            bag.Items.Add(new BagItem
            {
                ItemId = itemId,
                Quantity = quantity,
                UnitPriceSnapshot = item != null ? item.Price : 0m 
            });
        }
        await _db.SaveChangesAsync();
    }

    public async Task RemoveItemAsync(int itemId)
    {
        var bag = await GetOrCreateBagAsync();
        var existing = bag.Items.FirstOrDefault(i => i.ItemId == itemId);
        if (existing == null)
            throw new KeyNotFoundException("Item not found in bag");

        bag.Items.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateItemQuantityAsync(int itemId, int quantity)
    {
        if (quantity <= 0)
        {
            await RemoveItemAsync(itemId);
            return;
        }

        var bag = await GetOrCreateBagAsync();
        var existing = bag.Items.FirstOrDefault(i => i.ItemId == itemId);
        if (existing == null)
            throw new KeyNotFoundException("Item not found in bag");

        existing.Quantity = quantity;
        await _db.SaveChangesAsync();
    }

    public async Task CheckoutAsync()
    {
        var bag = await GetOrCreateBagAsync();
        if (bag.Items == null || !bag.Items.Any())
            throw new InvalidOperationException("Cannot checkout an empty bag");

        
        bag.Status = BagStatus.CheckedOut;
        bag.UpdateAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
    
}