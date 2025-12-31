using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CvBuilder.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveJobDescriptionAddTailoredApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "JobDescriptions");

            migrationBuilder.CreateTable(
                name: "TailoredApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    JobTitle = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CompanyName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    JobDescription = table.Column<string>(type: "TEXT", nullable: false),
                    TailoredCvJson = table.Column<string>(type: "TEXT", nullable: false),
                    CoverLetter = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    BaseResumeId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TailoredApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TailoredApplications_Resumes_BaseResumeId",
                        column: x => x.BaseResumeId,
                        principalTable: "Resumes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TailoredApplications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TailoredApplications_BaseResumeId",
                table: "TailoredApplications",
                column: "BaseResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_TailoredApplications_UserId",
                table: "TailoredApplications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TailoredApplications");

            migrationBuilder.CreateTable(
                name: "JobDescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FileName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    FilePath = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    FileType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobDescriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_JobDescriptions_UserId",
                table: "JobDescriptions",
                column: "UserId");
        }
    }
}
