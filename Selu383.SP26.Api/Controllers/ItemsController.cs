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
                Category = x.Category,
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
            Category = result.Category,
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
    public ActionResult<ItemDto> Create(ItemDto dto)
    {
        var item = new Item
        {
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            Nutrition = dto.Nutrition,
            ImageUrl = dto.ImageUrl,
            Category = dto.Category,
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

        dto.Id = item.Id;
        for (int i = 0; i < item.Extras.Count; i++)
        {
            dto.Extras[i].Id = item.Extras[i].Id;
        }

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<ItemDto> Update(int id, ItemDto dto)
    {
        var item = dataContext.Set<Item>()
            .FirstOrDefault(x => x.Id == id);

        if (item == null)
        {
            return NotFound();
        }

        item.Name = dto.Name;
        item.Price = dto.Price;
        item.Description = dto.Description;
        item.Nutrition = dto.Nutrition;
        item.Category = dto.Category;
        item.ImageUrl = dto.ImageUrl;

        item.Extras = dto.Extras
        .Select(e => new ExtraOption
        {
            Name = e.Name,
            Price = e.Price,
            Description = e.Description
        })
        .ToList();

        dataContext.SaveChanges();

        dto.Id = item.Id;

        return Ok(dto);
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

        dataContext.Set<Item>().Remove(item);
        dataContext.SaveChanges();

        return Ok();
    }
}

