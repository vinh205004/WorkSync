using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkSync.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRemainingLeaveHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "RemainingLeaveHours",
                table: "Employees",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RemainingLeaveHours",
                table: "Employees");
        }
    }
}
