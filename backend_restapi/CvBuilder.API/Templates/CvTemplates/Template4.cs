using CvBuilder.API.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CvBuilder.API.Templates.CvTemplates;

public class Template4
{
    private const string AccentColor = "#b0a48a"; // The tan color from the image

    public void Compose(IDocumentContainer container, Resume resume)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(0);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Black).FontFamily(Fonts.Verdana));

            page.Content().Column(col =>
            {
                // --- TAN HEADER BAR ---
                col.Item().Background(AccentColor).PaddingVertical(30).PaddingHorizontal(50).Row(row =>
                {
                    // Profile Image (QuestPDF only supports local file paths, not URLs)
                    row.ConstantItem(100).Height(100).Width(100)
                        .Background(Colors.White)
                        .AlignCenter()
                        .Element(container =>
                        {
                            // Only load image if it exists and is a local file path (not a URL)
                            if (!string.IsNullOrEmpty(resume.Image) && 
                                !resume.Image.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
                                !resume.Image.StartsWith("https://", StringComparison.OrdinalIgnoreCase) &&
                                System.IO.File.Exists(resume.Image))
                            {
                                container.Image(resume.Image);
                            }
                        });

                    row.RelativeItem().PaddingLeft(30).Column(headerCol =>
                    {
                        headerCol.Item().PaddingTop(10);
                        headerCol.Item().Text(resume.Name ?? "NAME").FontSize(22).ExtraBold().FontColor(Colors.Black);
                        headerCol.Item().Text(resume.Title ?? "TITLE").FontSize(12).SemiBold().FontColor(Colors.Black);

                        // Contact Info Row
                        headerCol.Item().PaddingTop(10).Row(contactRow =>
                        {
                            contactRow.Spacing(15);
                            contactRow.RelativeItem().Column(c =>
                            {
                                if (!string.IsNullOrEmpty(resume.Phone)) c.Item().Text($"📞 {resume.Phone}").FontSize(8);
                                if (!string.IsNullOrEmpty(resume.Email)) c.Item().Text($"✉️ {resume.Email}").FontSize(8);
                                if (!string.IsNullOrEmpty(resume.Location)) c.Item().Text($"📍 {resume.Location}").FontSize(8);
                            });
                            contactRow.RelativeItem().Column(c =>
                            {
                                if (!string.IsNullOrEmpty(resume.GitHub)) c.Item().Text($"🔗 {resume.GitHub}").FontSize(8);
                                if (!string.IsNullOrEmpty(resume.LinkedIn)) c.Item().Text($"in {resume.LinkedIn}").FontSize(8);
                            });
                        });
                    });
                });

                // --- TWO-COLUMN MAIN BODY ---
                col.Item().PaddingHorizontal(40).PaddingVertical(30).Row(bodyRow =>
                {
                    // LEFT COLUMN (Skills & Languages)
                    bodyRow.ConstantItem(170).Column(sidebar =>
                    {
                        if (resume.Skills != null && resume.Skills.Any())
                        {
                            sidebar.Item().Element(c => ComposeSectionTitle(c, "SKILLS"));
                            foreach (var skill in resume.Skills)
                                sidebar.Item().PaddingBottom(4).Text(skill).FontSize(9);
                        }

                        if (resume.Languages != null && resume.Languages.Any())
                        {
                            sidebar.Item().PaddingTop(20).Element(c => ComposeSectionTitle(c, "LANGUAGES"));
                            foreach (var lang in resume.Languages)
                                sidebar.Item().PaddingBottom(4).Text(lang).FontSize(9);
                        }
                    });

                    bodyRow.ConstantItem(30); // Spacer

                    // RIGHT COLUMN (Profile, Experience, Education, Projects)
                    bodyRow.RelativeItem().Column(main =>
                    {
                        // Profile
                        if (!string.IsNullOrEmpty(resume.Summary))
                        {
                            main.Item().Element(c => ComposeSectionTitle(c, "PROFILE"));
                            main.Item().Text(resume.Summary).FontSize(9).Justify().LineHeight(1.2f);
                        }

                        // Work Experience
                        if (resume.Experiences != null && resume.Experiences.Any())
                        {
                            main.Item().PaddingTop(20).Element(c => ComposeSectionTitle(c, "WORK EXPERIENCE"));
                            foreach (var exp in resume.Experiences.OrderBy(e => e.Order))
                            {
                                main.Item().PaddingBottom(15).Column(expCol =>
                                {
                                    expCol.Item().Row(r =>
                                    {
                                        r.RelativeItem().Text(exp.Position).Bold().FontSize(10);
                                        r.AutoItem().Text($"{exp.StartDate} - {exp.EndDate ?? "Present"}").FontSize(8).FontColor(Colors.Grey.Medium);
                                    });
                                    expCol.Item().Text(exp.Company).Italic().FontSize(9).FontColor(Colors.Grey.Darken2);
                                    
                                    if (exp.Description != null)
                                    {
                                        foreach (var bullet in exp.Description)
                                        {
                                            expCol.Item().PaddingLeft(5).Text($"• {bullet}").FontSize(8).LineHeight(1.1f);
                                        }
                                    }
                                });
                            }
                        }

                        // Education
                        if (resume.Educations != null && resume.Educations.Any())
                        {
                            main.Item().PaddingTop(10).Element(c => ComposeSectionTitle(c, "EDUCATION"));
                            foreach (var edu in resume.Educations)
                            {
                                main.Item().PaddingBottom(10).Row(r =>
                                {
                                    r.RelativeItem().Column(c => {
                                        c.Item().Text(edu.Degree).Bold().FontSize(9);
                                        c.Item().Text($"{edu.Institution} / {edu.EndDate}").FontSize(8).FontColor(Colors.Grey.Darken2);
                                    });
                                });
                            }
                        }

                        // Projects
                        if (resume.Projects != null && resume.Projects.Any())
                        {
                            main.Item().PaddingTop(10).Element(c => ComposeSectionTitle(c, "PROJECTS"));
                            foreach (var proj in resume.Projects.OrderBy(p => p.Order))
                            {
                                main.Item().PaddingBottom(10).Column(pCol =>
                                {
                                    pCol.Item().Text(proj.Name).Bold().FontSize(9);
                                    if (!string.IsNullOrEmpty(proj.Description))
                                        pCol.Item().Text(proj.Description).FontSize(8).LineHeight(1.1f);
                                });
                            }
                        }
                    });
                });
            });
        });
    }

    void ComposeSectionTitle(IContainer container, string title)
    {
        container.PaddingBottom(8).Text(title).FontSize(11).ExtraBold();
    }
}