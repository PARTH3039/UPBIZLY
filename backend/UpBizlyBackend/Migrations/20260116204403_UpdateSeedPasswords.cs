using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UpBizlyBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedPasswords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$8yR9rdgbNq.k72phFKVvo.3/OmQq.9dis/oz/p9ZMNDq/5Z4czstO");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$12$D/TReQJpzy48R7G/BvTjIuw28k/BvV7q9uQ0K6KdyjOe4xHRzABvq");
        }
    }
}
