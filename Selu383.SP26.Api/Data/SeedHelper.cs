using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP26.Api.Features.Auth;
using Selu383.SP26.Api.Features.Locations;
using Selu383.SP26.Api.Features.Items;

namespace Selu383.SP26.Api.Data;

public static class SeedHelper
{
    public static async Task MigrateAndSeed(IServiceProvider serviceProvider)
    {
        var dataContext = serviceProvider.GetRequiredService<DataContext>();

        await dataContext.Database.MigrateAsync();

        await AddRoles(serviceProvider);
        await AddUsers(serviceProvider);

        await AddLocations(dataContext);
        await AddItems(dataContext);
    }



    private static async Task AddUsers(IServiceProvider serviceProvider)
    {
        const string defaultPassword = "Password123!";
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        if (userManager.Users.Any())
        {
            return;
        }

        var adminUser = new User
        {
            UserName = "galkadi"
        };
        await userManager.CreateAsync(adminUser, defaultPassword);
        await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);

        var bob = new User
        {
            UserName = "bob"
        };
        await userManager.CreateAsync(bob, defaultPassword);
        await userManager.AddToRoleAsync(bob, RoleNames.User);

        var sue = new User
        {
            UserName = "sue"
        };
        await userManager.CreateAsync(sue, defaultPassword);
        await userManager.AddToRoleAsync(sue, RoleNames.User);
    }

    private static async Task AddRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        if (roleManager.Roles.Any())
        {
            return;
        }
        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.Admin
        });

        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.User
        });
    }

    private static async Task AddLocations(DataContext dataContext)
    {
        if (dataContext.Set<Location>().Any())
        {
            return;
        }
        dataContext.Set<Location>().AddRange(
            new Location { Name = "Hammond Location", Address = "110 N Cate St, Hammond, LA 70403", TableCount = 10 },
            new Location { Name = "New York Location", Address = "72 E 1st St, New York, NY 10003", TableCount = 20 },
            new Location { Name = "New Orleans Location", Address = "1140 S Carrollton Ave, New Orleans, LA 70118", TableCount = 15 }
        );

        await dataContext.SaveChangesAsync();
    }

    private static async Task AddItems(DataContext dataContext)
    {
        if (dataContext.Set<Item>().Any())
        {
            return;
        }
        dataContext.Set<Item>().AddRange(
            // Drinks
            new Item { Name = "Iced Latte", Price = 5.50m, Description = "Espresso and milk served over ice for a refreshing coffee drink.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Supernova", Price = 7.95m, Description = "A unique coffee blend with a complex, balanced profile and subtle sweetness. Delicious as espresso or paired with milk.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Roaring Frappe", Price = 6.20m, Description = "Cold brew, milk, and ice blended together with a signature syrup or flavor, topped with whipped cream.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Black & White Cold Brew", Price = 5.15m, Description = "Cold brew made with both dark and light roast beans, finished with a drizzle of condensed milk.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Strawberry Limeade", Price = 5.00m, Description = "Fresh lime juice blended with strawberry purée for a refreshing, tangy drink.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Shaken Lemonade", Price = 5.00m, Description = "Fresh lemon juice and simple syrup vigorously shaken for a bright, refreshing lemonade.", Nutrition = "", Extras = new List<ExtraOption>() },

            // Sweet Crepes
            new Item { Name = "Mannino Honey Crepe", Price = 10.00m, Description = "A sweet crepe drizzled with Mannino honey and topped with mixed berries.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Downtowner", Price = 10.75m, Description = "Strawberries and bananas wrapped in a crepe, finished with Nutella and Hershey's chocolate sauce.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Funky Monkey", Price = 10.00m, Description = "Nutella and bananas wrapped in a crepe, served with whipped cream.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Le S'mores", Price = 9.50m, Description = "Marshmallow cream and chocolate sauce inside a crepe, topped with graham cracker crumbs.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Strawberry Fields", Price = 10.00m, Description = "Fresh strawberries with Hershey's chocolate drizzle and a dusting of powdered sugar.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Bonjour", Price = 8.50m, Description = "A sweet crepe filled with syrup and cinnamon, finished with powdered sugar.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Banana Foster", Price = 8.95m, Description = "Bananas with cinnamon in a crepe, topped with a generous drizzle of caramel sauce.", Nutrition = "", Extras = new List<ExtraOption>() },

            // Savory Crepes
            new Item { Name = "Matt's Scrambled Eggs", Price = 5.00m, Description = "Scrambled eggs and melted mozzarella cheese wrapped in a crepe.", Nutrition = "", Extras = new List<ExtraOption>(), ImageUrl = "" },
            new Item { Name = "Meanie Mushroom", Price = 10.50m, Description = "Sautéed mushrooms, mozzarella, tomato, and bacon inside a delicate crepe.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Turkey Club", Price = 10.50m, Description = "Sliced turkey, bacon, spinach, and tomato wrapped in a savory crepe.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Green Machine", Price = 10.00m, Description = "Spinach, artichokes, and mozzarella cheese inside a fresh crepe.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Perfect Pair", Price = 10.00m, Description = "A unique combination of bacon and Nutella wrapped in a crepe.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Crepe Fromage", Price = 8.00m, Description = "A savory crepe filled with a blend of cheeses.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Farmers Market Crepe", Price = 10.50m, Description = "Turkey, spinach, and mozzarella wrapped in a savory crepe.", Nutrition = "", Extras = new List<ExtraOption>() },

            // Bagels
            new Item { Name = "Travis Special", Price = 14.00m, Description = "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Crème Brulagel", Price = 8.00m, Description = "A toasted bagel with a caramelized sugar crust inspired by crème brûlée, served with cream cheese.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "The Fancy One", Price = 13.00m, Description = "Smoked salmon, cream cheese, and fresh dill on a toasted bagel.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "Breakfast Bagel", Price = 9.50m, Description = "A toasted bagel with your choice of ham, bacon, or sausage, a fried egg, and cheddar cheese.", Nutrition = "", Extras = new List<ExtraOption>() },
            new Item { Name = "The Classic", Price = 5.25m, Description = "A toasted bagel with cream cheese.", Nutrition = "", Extras = new List<ExtraOption>() }
        );
        await dataContext.SaveChangesAsync();
    }
}