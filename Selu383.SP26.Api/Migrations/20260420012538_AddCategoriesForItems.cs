using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriesForItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Items",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Items");
        }
    }
}
