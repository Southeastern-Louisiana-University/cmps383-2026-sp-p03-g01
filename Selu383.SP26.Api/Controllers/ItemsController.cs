using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Selu383.SP26.Api.Data;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Items;

namespace Selu383.SP26.Api.Controllers;

[Route("api/items")]
[ApiController]
public class ItemsController(DataContext dataContext) : ControllerBase
{
    [HttpGet]
    public IQueryable<ItemDto> GetAll()
    {
        return dataContext.Set<Item>()
            .Select(x => new ItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                Description = x.Description,
                Nutrition = x.Nutrition,
                ImageUrl = x.ImageUrl,
                Extras = x.Extras
                    .Select(e => new ExtraOptionDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                        Price = e.Price,
                        Description = e.Description
                    }).ToList()
            });
    }

    [HttpGet("{id}")]
    public ActionResult<ItemDto> GetById(int id)
    {
        var result = dataContext.Set<Item>()
            .FirstOrDefault(x => x.Id == id);

        if (result == null)
        {
            return NotFound();
        }

        var dto = new ItemDto
        {
            Id = result.Id,
            Name = result.Name,
            Price = result.Price,
            Description = result.Description,
            Nutrition = result.Nutrition,
            ImageUrl = result.ImageUrl,
            Extras = result.Extras
                .Select(e => new ExtraOptionDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Price = e.Price,
                    Description = e.Description
                })
                .ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<ItemDto>> Create([FromForm] ItemCreateDto dto)
    {
        var fileName = "";

        if (dto.Image != null)
        {
            var uploadsFolder = Path.Combine("wwwroot", "images");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await dto.Image.CopyToAsync(stream);
        }

        var item = new Item
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            Nutrition = dto.Nutrition,
            ImageUrl = fileName != "" ? "/images/" + fileName : "",
            Extras = dto.Extras
                .Select(e => new ExtraOption
                {
                    Name = e.Name,
                    Price = e.Price,
                    Description = e.Description
                })
                .ToList()
        };

        dataContext.Set<Item>().Add(item);
        dataContext.SaveChanges();

        return CreatedAtAction(nameof(GetById), new { id = item.Id }, new ItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            Description = item.Description,
            Nutrition = item.Nutrition,
            ImageUrl = item.ImageUrl,
            Extras = item.Extras
                .Select(e => new ExtraOptionDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Price = e.Price,
                    Description = e.Description
                })
                .ToList()
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public async Task<ActionResult<ItemDto>> Update(
        int id,
        [FromForm] ItemCreateDto dto)
    {
        var item = dataContext.Set<Item>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        // update basic fields
        item.Name = dto.Name;
        item.Price = dto.Price;
        item.Description = dto.Description;
        item.Nutrition = dto.Nutrition;

        // handle image upload (optional)
        if (dto.Image != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 🧹 delete old image
            if (!string.IsNullOrEmpty(item.ImageUrl))
            {
                var oldPath = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    item.ImageUrl.TrimStart('/')
                );

                if (System.IO.File.Exists(oldPath))
                {
                    System.IO.File.Delete(oldPath);
                }
            }

            // 💾 save new image
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await dto.Image.CopyToAsync(stream);

            item.ImageUrl = "/images/" + fileName;
        }

        // (optional) update extras if you want consistency with POST
        item.Extras = dto.Extras
            .Select(e => new ExtraOption
            {
                Name = e.Name,
                Price = e.Price,
                Description = e.Description
            })
            .ToList();

        dataContext.SaveChanges();

        // return updated DTO
        var result = new ItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            Description = item.Description,
            Nutrition = item.Nutrition,
            ImageUrl = item.ImageUrl,
            Extras = item.Extras
                .Select(e => new ExtraOptionDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Price = e.Price,
                    Description = e.Description
                })
                .ToList()
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult Delete(int id)
    {
        var item = dataContext.Set<Item>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        // delete image file if it exists
        if (!string.IsNullOrEmpty(item.ImageUrl))
        {
            var path = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                item.ImageUrl.TrimStart('/')
            );

            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }

        // remove item from database
        dataContext.Set<Item>().Remove(item);
        dataContext.SaveChanges();

        return Ok();
    }

}

