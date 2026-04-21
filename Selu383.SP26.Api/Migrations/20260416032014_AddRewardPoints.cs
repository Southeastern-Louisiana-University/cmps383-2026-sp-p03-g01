using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP26.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRewardPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RewardPoints",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RewardPoints",
                table: "AspNetUsers");
        }
    }
}
