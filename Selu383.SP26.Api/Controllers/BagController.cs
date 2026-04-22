using Selu383.SP26.Api.Features.Bag;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Items;
using Selu383.SP26.Api.Features.Auth;


namespace Selu383.SP26.Api.Controllers
{
    [ApiController]
    [Route("api/bag")]
    public class BagController : ControllerBase
    {
        private readonly IBagService _bagsService;
        public BagController(IBagService bagsService)
        {
            _bagsService = bagsService;
        }

        [HttpGet]
        public async Task<ActionResult<BagDto>> GetBag([FromQuery] int pointsToUse = 0)
        {
            var bag = await _bagsService.GetOrCreateBagAsync();

            var items = bag.Items.Select(i => new BagItemDto
            {
                ItemId = i.ItemId,
                Name = i.Item?.Name ?? string.Empty,
                Price = i.UnitPriceSnapshot,
                Quantity = i.Quantity
            }).ToList();

            var subtotal = items.Sum(x => x.LineTotal);

            decimal discount = 0;
            var userId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId != null && pointsToUse > 0)
            {
                decimal maxDiscount = subtotal * 0.10m;
                int maxPoints = (int)Math.Floor(maxDiscount * 100);

                var usablePoints = Math.Min(pointsToUse, maxPoints);
                discount = usablePoints / 100m;
            }

            var dto = new BagDto
            {
                Id = bag.Id,
                Items = items,
                Subtotal = subtotal,
                Discount = discount,
                Total = subtotal - discount
            };

            return Ok(dto);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItemToBag([FromBody] AddItemDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                await _bagsService.AddItemAsync(request.ItemId, request.Quantity);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }

        }

        [HttpPatch("items/{itemId}")]
        public async Task<IActionResult> UpdateItemQuantity([FromRoute] int itemId, [FromBody] UpdateItemDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                await _bagsService.UpdateItemQuantityAsync(itemId, request.Quantity);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
        }

        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> RemoveItem([FromRoute] int itemId)
        {
            try
            {
                await _bagsService.RemoveItemAsync(itemId);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutDto dto)
        {
            try
            {
                await _bagsService.CheckoutAsync(dto.PointsToUse);
                return Ok(new
                {
                    message = "Checkout successful"
                });

            }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
        }

        [HttpGet("checkedout")]
        [Authorize(Roles = RoleNames.Admin + ", " + RoleNames.Manager + ", " + RoleNames.Employee)]
        public async Task<ActionResult<IEnumerable<BagDto>>> GetCheckedOutBags()
        {
            var bags = await _bagsService.GetCheckedOutBagsAsync();

            var dtos = bags.Select(b => new BagDto
            {
                Id = b.Id,
                Items = b.Items.Select(i => new BagItemDto
                {
                    ItemId = i.ItemId,
                    Name = i.Item?.Name ?? string.Empty,
                    Price = i.UnitPriceSnapshot,
                    Quantity = i.Quantity
                }).ToList(),
                Subtotal = b.Items.Sum(i => i.LineTotal)
            });

            return Ok(dtos);
        }

        
    }

}
