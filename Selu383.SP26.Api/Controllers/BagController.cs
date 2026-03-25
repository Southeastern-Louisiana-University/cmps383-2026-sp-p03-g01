using Selu383.SP26.Api.Features.Bag;
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
        public async Task<ActionResult<Bag>> GetBag()
        {
            var bag = await _bagsService.GetOrCreateBagAsync();
            return Ok(bag);
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
        public async Task<IActionResult> Checkout()
        {
            try
            {
                await _bagsService.CheckoutAsync();
                return NoContent();
            }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
        }
    }

}
