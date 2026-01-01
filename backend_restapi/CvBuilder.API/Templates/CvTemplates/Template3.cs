using CvBuilder.API.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CvBuilder.API.Templates.CvTemplates;

public class Template3
{
    public void Compose(IDocumentContainer container, Resume resume)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(40);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Black).FontFamily(Fonts.Verdana));

            page.Content().Column(col =>
            {
                // --- HEADER ---
                col.Item().AlignCenter().Column(header =>
                {
                    header.Item().Text(resume.Name?.ToUpper() ?? "").FontSize(24).ExtraBold();
                    header.Item().Text(resume.Title ?? "").FontSize(13).Medium();
                });

                // --- CONTACT BAR ---
                col.Item().PaddingTop(5).AlignCenter().Row(row =>
                {
                    row.Spacing(10);
                    if (!string.IsNullOrEmpty(resume.Phone)) row.AutoItem().Text($"📞 {resume.Phone}").FontSize(9);
                    if (!string.IsNullOrEmpty(resume.Email)) row.AutoItem().Text($"✉️ {resume.Email}").FontSize(9);
                    if (!string.IsNullOrEmpty(resume.Location)) row.AutoItem().Text($"📍 {resume.Location}").FontSize(9);
                });

                // --- PROFILE ---
                if (!string.IsNullOrEmpty(resume.Summary))
                {
                    col.Item().Element(c => ComposeHeader(c, "Profile"));
                    col.Item().PaddingTop(5).Text(resume.Summary).Justify().LineHeight(1.2f);
                }

                // --- SKILLS (Moved up to follow Profile) ---
                if (resume.Skills?.Any() == true)
                {
                    col.Item().Element(c => ComposeHeader(c, "Skills"));
                    col.Item().PaddingTop(5).Text(string.Join("  •  ", resume.Skills)).FontSize(9);
                }

                // --- EXPERIENCE ---
                if (resume.Experiences?.Any() == true)
                {
                    col.Item().Element(c => ComposeHeader(c, "Work experience"));
                    
                    foreach (var exp in resume.Experiences.OrderBy(e => e.Order))
                    {
                        col.Item().PaddingTop(10).Column(expCol =>
                        {
                            expCol.Item().Row(row =>
                            {
                                row.RelativeItem().Text(exp.Position).Bold().FontSize(11);
                                row.ConstantItem(150).AlignRight().Text($"{exp.StartDate} - {exp.EndDate ?? "Present"}").Italic().FontSize(9);
                            });
                            expCol.Item().Text(exp.Company).Italic().FontColor(Colors.Grey.Darken2);
                            
                            foreach (var bullet in exp.Description ?? new List<string>())
                            {
                                expCol.Item().PaddingLeft(5).Text($"• {bullet}").FontSize(9);
                            }
                        });
                    }
                }

                // --- EDUCATION ---
                if (resume.Educations?.Any() == true)
                {
                    col.Item().Element(c => ComposeHeader(c, "Education"));
                    foreach (var edu in resume.Educations)
                    {
                        col.Item().PaddingTop(10).Row(row =>
                        {
                            row.RelativeItem().Column(c => {
                                c.Item().Text(edu.Degree).Bold();
                                c.Item().Text(edu.Institution).Italic().FontColor(Colors.Grey.Darken2);
                            });
                            row.ConstantItem(100).AlignRight().Text(edu.EndDate).Italic().FontSize(9);
                        });
                    }
                }

                // --- PROJECTS (Added) ---
                if (resume.Projects?.Any() == true)
                {
                    col.Item().Element(c => ComposeHeader(c, "Projects"));
                    
                    foreach (var proj in resume.Projects.OrderBy(p => p.Order))
                    {
                        col.Item().PaddingTop(10).Column(projCol =>
                        {
                            projCol.Item().Row(row =>
                            {
                                row.RelativeItem().Text(proj.Name).Bold().FontSize(11);
                                if (!string.IsNullOrEmpty(proj.Url))
                                {
                                    row.AutoItem().Text(proj.Url).FontSize(9).FontColor(Colors.Blue.Medium).Underline();
                                }
                            });

                            if (!string.IsNullOrEmpty(proj.Description))
                            {
                                projCol.Item().Text(proj.Description).FontSize(9);
                            }

                            if (proj.Technologies?.Any() == true)
                            {
                                projCol.Item().Text(t =>
                                {
                                    t.Span("Technologies: ").FontSize(9).Bold();
                                    t.Span(string.Join(", ", proj.Technologies)).FontSize(9).Italic();
                                });
                            }
                        });
                    }
                }
            });
        });
    }

    void ComposeHeader(IContainer container, string title)
    {
        container
            .PaddingTop(20)
            .PaddingBottom(5)
            .BorderBottom(1)
            .BorderColor(Colors.Black)
            .Text(title)
            .FontSize(14)
            .Bold();
    }
}