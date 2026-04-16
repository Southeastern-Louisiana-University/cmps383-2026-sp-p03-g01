using Selu383.SP26.Api.Features.Bag;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Items;


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
        public async Task<ActionResult<BagDto>> GetBag()
        {
            var bag = await _bagsService.GetOrCreateBagAsync();

            
            var items = bag.Items.Select(i => new BagItemDto
            {
                ItemId = i.ItemId,
                Name = i.Item?.Name ?? string.Empty,
                Price = i.UnitPriceSnapshot,
                Quantity = i.Quantity
            }).ToList();

            var dto = new BagDto
            {
                Id = bag.Id,
                Items = items,
                Subtotal = items.Sum(x => x.LineTotal)
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
    }

}
