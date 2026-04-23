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
        await userManager.AddToRoleAsync(sue, RoleNames.Employee);

        var mark = new User
        {
            UserName = "mark"
        };
        await userManager.CreateAsync(mark, defaultPassword);
        await userManager.AddToRoleAsync(mark, RoleNames.Manager);
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

        await roleManager.CreateAsync(new Role
        {
           Name = RoleNames.Employee
        });

        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.Manager
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
            new Item { Name = "Iced Latte", Price = 5.50m, Description = "Espresso and milk served over ice for a refreshing coffee drink.", Nutrition = "", Category = "Drinks", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/9j2FMdx.png" },
            new Item { Name = "Supernova", Price = 7.95m, Description = "A unique coffee blend with a complex, balanced profile and subtle sweetness. Delicious as espresso or paired with milk.", Category = "Drinks", Nutrition = "", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/sMMzmWG.png" },
            new Item { Name = "Roaring Frappe", Price = 6.20m, Description = "Cold brew, milk, and ice blended together with a signature syrup or flavor, topped with whipped cream.", Nutrition = "", Category = "Drinks", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/gbZk6ES.png" },
            new Item { Name = "Black & White Cold Brew", Price = 5.15m, Description = "Cold brew made with both dark and light roast beans, finished with a drizzle of condensed milk.", Nutrition = "", Category = "Drinks", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/cUjBUDh.png" },
            new Item { Name = "Strawberry Limeade", Price = 5.00m, Description = "Fresh lime juice blended with strawberry purée for a refreshing, tangy drink.", Nutrition = "", Category = "Drinks", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/ZJMRhPL.png" },
            new Item { Name = "Shaken Lemonade", Price = 5.00m, Description = "Fresh lemon juice and simple syrup vigorously shaken for a bright, refreshing lemonade.", Nutrition = "", Category = "Drinks", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/nMIRRb5.png" },

            // Sweet Crepes
            new Item { Name = "Mannino Honey Crepe", Price = 10.00m, Description = "A sweet crepe drizzled with Mannino honey and topped with mixed berries.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/h2uIl5Y.png" },
            new Item { Name = "Downtowner", Price = 10.75m, Description = "Strawberries and bananas wrapped in a crepe, finished with Nutella and Hershey's chocolate sauce.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/gbGzdU2.png" },
            new Item { Name = "Funky Monkey", Price = 10.00m, Description = "Nutella and bananas wrapped in a crepe, served with whipped cream.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/2YeU8Tv.jpeg" },
            new Item { Name = "Le S'mores", Price = 9.50m, Description = "Marshmallow cream and chocolate sauce inside a crepe, topped with graham cracker crumbs.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/7S7BLbt.png" },
            new Item { Name = "Strawberry Fields", Price = 10.00m, Description = "Fresh strawberries with Hershey's chocolate drizzle and a dusting of powdered sugar.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/VJTOxaA.png" }, 
            new Item { Name = "Bonjour", Price = 8.50m, Description = "A sweet crepe filled with syrup and cinnamon, finished with powdered sugar.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/NI13wIc.png" },
            new Item { Name = "Banana Foster", Price = 8.95m, Description = "Bananas with cinnamon in a crepe, topped with a generous drizzle of caramel sauce.", Nutrition = "", Category = "Sweet Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/Cpm2tuP.png" },

            // Savory Crepes
            new Item { Name = "Matt's Scrambled Eggs", Price = 5.00m, Description = "Scrambled eggs and melted mozzarella cheese wrapped in a crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/9HAviGK.png" },
            new Item { Name = "Meanie Mushroom", Price = 10.50m, Description = "Sautéed mushrooms, mozzarella, tomato, and bacon inside a delicate crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/E3QeOKO.png" },
            new Item { Name = "Turkey Club", Price = 10.50m, Description = "Sliced turkey, bacon, spinach, and tomato wrapped in a savory crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/QPahZeT.png" },
            new Item { Name = "Green Machine", Price = 10.00m, Description = "Spinach, artichokes, and mozzarella cheese inside a fresh crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/drUB8dX.png" },
            new Item { Name = "Perfect Pair", Price = 10.00m, Description = "A unique combination of bacon and Nutella wrapped in a crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/JhwN7uL.png" },
            new Item { Name = "Crepe Fromage", Price = 8.00m, Description = "A savory crepe filled with a blend of cheeses.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/Jzrfer7.png" },
            new Item { Name = "Farmers Market Crepe", Price = 10.50m, Description = "Turkey, spinach, and mozzarella wrapped in a savory crepe.", Nutrition = "", Category = "Savory Crepes", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/1F2Pvq6.png" },

            // Bagels
            new Item { Name = "Travis Special", Price = 14.00m, Description = "Cream cheese, salmon, spinach, and a fried egg served on a freshly toasted bagel.", Nutrition = "", Category = "Bagels", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/hg4h9Rd.png" },
            new Item { Name = "Crème Brulagel", Price = 8.00m, Description = "A toasted bagel with a caramelized sugar crust inspired by crème brûlée, served with cream cheese.", Nutrition = "", Category = "Bagels", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/dPNFh8r.png" },
            new Item { Name = "The Fancy One", Price = 13.00m, Description = "Smoked salmon, cream cheese, and fresh dill on a toasted bagel.", Nutrition = "", Category = "Bagels", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/IVC1E3s.png" },
            new Item { Name = "Breakfast Bagel", Price = 9.50m, Description = "A toasted bagel with your choice of ham, bacon, or sausage, a fried egg, and cheddar cheese.", Nutrition = "", Category = "Bagels", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/T8B3p6W.png" },
            new Item { Name = "The Classic", Price = 5.25m, Description = "A toasted bagel with cream cheese.", Nutrition = "", Category = "Bagels", Extras = new List<ExtraOption>(), ImageUrl = "https://i.imgur.com/a26UAgE.png" }
        );
        await dataContext.SaveChangesAsync();
    }
}