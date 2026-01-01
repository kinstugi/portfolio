using CvBuilder.API.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CvBuilder.API.Templates.CvTemplates;

public class Template2
{
    public void Compose(IDocumentContainer container, Resume resume)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(0);
            page.PageColor(Colors.White);

            page.Content()
                .Row(row =>
                {
                    // --- MAIN CONTENT (Now on the Left) ---
                    row.RelativeItem()
                        .PaddingVertical(50)
                        .PaddingHorizontal(40)
                        .Column(column =>
                        {
                            // Header
                            column.Item().Text(resume.Name).FontSize(32).Bold().FontColor(Colors.Black);
                            if (!string.IsNullOrEmpty(resume.Title))
                            {
                                column.Item().Text(resume.Title).FontSize(14).FontColor(Colors.Grey.Darken2);
                            }
                            column.Item().PaddingBottom(30);

                            // Summary
                            if (!string.IsNullOrEmpty(resume.Summary))
                            {
                                column.Item().Text("PROFESSIONAL SUMMARY").FontSize(14).Bold().FontColor(Colors.Black);
                                column.Item().PaddingBottom(10);
                                column.Item().Text(resume.Summary).FontSize(11).FontColor(Colors.Black).LineHeight(1.6f);
                                column.Item().PaddingBottom(30);
                            }

                            // Experience
                            if (resume.Experiences != null && resume.Experiences.Any())
                            {
                                column.Item().Text("EXPERIENCE").FontSize(14).Bold().FontColor(Colors.Black);
                                column.Item().PaddingBottom(15);

                                foreach (var exp in resume.Experiences.OrderBy(e => e.Order))
                                {
                                    column.Item().Row(r =>
                                    {
                                        r.RelativeItem().Column(col =>
                                        {
                                            col.Item().Text(exp.Position).FontSize(13).Bold();
                                            col.Item().Text(exp.Company).FontSize(11).FontColor("#b0a48a");
                                        });
                                        r.AutoItem().Text($"{exp.StartDate} - {exp.EndDate ?? "Present"}").FontSize(10).FontColor(Colors.Grey.Darken2);
                                    });

                                    if (!string.IsNullOrEmpty(exp.Location))
                                    {
                                        column.Item().Text(exp.Location).FontSize(10).FontColor(Colors.Grey.Darken2);
                                    }

                                    if (exp.Description != null && exp.Description.Any())
                                    {
                                        column.Item().PaddingTop(8);
                                        foreach (var desc in exp.Description)
                                        {
                                            column.Item().Text($"• {desc}").FontSize(10).LineHeight(1.5f);
                                        }
                                    }

                                    column.Item().PaddingBottom(20);
                                }

                                column.Item().PaddingBottom(30);
                            }

                            // Education
                            if (resume.Educations != null && resume.Educations.Any())
                            {
                                column.Item().Text("EDUCATION").FontSize(14).Bold().FontColor(Colors.Black);
                                column.Item().PaddingBottom(15);

                                foreach (var edu in resume.Educations.OrderBy(e => e.Order))
                                {
                                    column.Item().Row(r =>
                                    {
                                        r.RelativeItem().Column(col =>
                                        {
                                            col.Item().Text(edu.Degree).FontSize(13).Bold();
                                            col.Item().Text(edu.Institution).FontSize(11).FontColor("#b0a48a");
                                            if (!string.IsNullOrEmpty(edu.Field))
                                            {
                                                col.Item().Text(edu.Field).FontSize(10).FontColor(Colors.Grey.Darken2);
                                            }
                                        });
                                        if (!string.IsNullOrEmpty(edu.StartDate) || !string.IsNullOrEmpty(edu.EndDate))
                                        {
                                            r.AutoItem().Text($"{edu.StartDate} - {edu.EndDate}").FontSize(10).FontColor(Colors.Grey.Darken2);
                                        }
                                    });

                                    if (!string.IsNullOrEmpty(edu.Location))
                                    {
                                        column.Item().Text(edu.Location).FontSize(10).FontColor(Colors.Grey.Darken2);
                                    }

                                    column.Item().PaddingBottom(20);
                                }

                                column.Item().PaddingBottom(30);
                            }

                            // Projects
                            if (resume.Projects != null && resume.Projects.Any())
                            {
                                column.Item().Text("PROJECTS").FontSize(14).Bold().FontColor(Colors.Black);
                                column.Item().PaddingBottom(15);

                                foreach (var proj in resume.Projects.OrderBy(p => p.Order))
                                {
                                    column.Item().Row(r =>
                                    {
                                        r.RelativeItem().Text(proj.Name).FontSize(13).Bold();
                                        if (!string.IsNullOrEmpty(proj.Url))
                                        {
                                            r.AutoItem().Text(proj.Url).FontSize(10).FontColor(Colors.Blue.Darken2).Underline();
                                        }
                                    });

                                    if (!string.IsNullOrEmpty(proj.Description))
                                    {
                                        column.Item().Text(proj.Description).FontSize(10).LineHeight(1.5f);
                                    }

                                    if (proj.Technologies != null && proj.Technologies.Any())
                                    {
                                        column.Item().Text($"Technologies: {string.Join(", ", proj.Technologies)}").FontSize(9).FontColor(Colors.Grey.Darken2);
                                    }

                                    column.Item().PaddingBottom(20);
                                }
                            }
                        });

                    // --- SIDEBAR (Now on the Right) ---
                    // Fixed to 190pt as requested
                    row.ConstantItem(190)
                        .Background("#b0a48a")
                        .PaddingVertical(50)
                        .PaddingHorizontal(20)
                        .Column(column =>
                        {
                            // Profile Image
                            if (!string.IsNullOrEmpty(resume.Image))
                            {
                                column.Item()
                                    .Width(130) // Adjusted slightly for the 190pt width
                                    .Height(130)
                                    .AlignCenter()
                                    .Image(resume.Image);
                                    
                                column.Item().PaddingBottom(40);
                            }

                            // Contact Information
                            column.Item().Text("CONTACT").FontSize(12).Bold().FontColor(Colors.White);
                            column.Item().PaddingBottom(15);

                            if (!string.IsNullOrEmpty(resume.Location))
                                column.Item().PaddingBottom(5).Text(resume.Location).FontSize(9).FontColor(Colors.White);

                            if (!string.IsNullOrEmpty(resume.Phone))
                                column.Item().PaddingBottom(5).Text(resume.Phone).FontSize(9).FontColor(Colors.White);

                            if (!string.IsNullOrEmpty(resume.Email))
                                column.Item().PaddingBottom(5).Text(resume.Email).FontSize(9).FontColor(Colors.White);

                            if (!string.IsNullOrEmpty(resume.GitHub))
                                column.Item().PaddingBottom(5).Text($"GitHub: {resume.GitHub}").FontSize(9).FontColor(Colors.White);

                            if (!string.IsNullOrEmpty(resume.LinkedIn))
                                column.Item().PaddingBottom(5).Text($"LinkedIn: {resume.LinkedIn}").FontSize(9).FontColor(Colors.White);

                            column.Item().PaddingBottom(30);

                            // Skills
                            if (resume.Skills != null && resume.Skills.Any())
                            {
                                column.Item().Text("SKILLS").FontSize(12).Bold().FontColor(Colors.White);
                                column.Item().PaddingBottom(10);
                                foreach (var skill in resume.Skills)
                                {
                                    column.Item().PaddingBottom(3).Text($"• {skill}").FontSize(9).FontColor(Colors.White);
                                }
                                column.Item().PaddingBottom(30);
                            }

                            // Certifications
                            if (resume.Certifications != null && resume.Certifications.Any())
                            {
                                column.Item().Text("CERTIFICATIONS").FontSize(12).Bold().FontColor(Colors.White);
                                column.Item().PaddingBottom(10);
                                foreach (var cert in resume.Certifications)
                                {
                                    column.Item().PaddingBottom(3).Text($"• {cert}").FontSize(9).FontColor(Colors.White);
                                }
                                column.Item().PaddingBottom(30);
                            }

                            // Languages
                            if (resume.Languages != null && resume.Languages.Any())
                            {
                                column.Item().Text("LANGUAGES").FontSize(12).Bold().FontColor(Colors.White);
                                column.Item().PaddingBottom(10);
                                foreach (var lang in resume.Languages)
                                {
                                    column.Item().PaddingBottom(3).Text($"• {lang}").FontSize(9).FontColor(Colors.White);
                                }
                            }
                        });
                });
        });
    }
}