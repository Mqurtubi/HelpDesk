using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelpDesk.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixTicketCommentDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketComments_AppUsers_AppUserId",
                table: "TicketComments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AppUsers_CreatedByUserId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_TicketComments_AppUserId",
                table: "TicketComments");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "TicketComments");

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_UserId",
                table: "TicketComments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketComments_AppUsers_UserId",
                table: "TicketComments",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AppUsers_CreatedByUserId",
                table: "Tickets",
                column: "CreatedByUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketComments_AppUsers_UserId",
                table: "TicketComments");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AppUsers_CreatedByUserId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_TicketComments_UserId",
                table: "TicketComments");

            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "TicketComments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketComments_AppUserId",
                table: "TicketComments",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketComments_AppUsers_AppUserId",
                table: "TicketComments",
                column: "AppUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AppUsers_CreatedByUserId",
                table: "Tickets",
                column: "CreatedByUserId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
