using CvBuilder.API.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace CvBuilder.API.Templates.CvTemplates;

public class Template1
{
    private const string SidebarColor = "#e9e5d9";
    private const string AccentGold = "#b29b7d";
    private const string TextDark = "#333333";

    public void Compose(IDocumentContainer container, Resume resume)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4); 
            page.Margin(0);
            page.PageColor(Colors.White);
            page.DefaultTextStyle(x => x.FontSize(9).FontFamily(Fonts.Verdana).FontColor(TextDark));

            page.Content().Row(row =>
            {
                // --- SIDEBAR (180pt) ---
                row.ConstantItem(180)
                    .Background(SidebarColor)
                    .PaddingVertical(40)
                    .PaddingHorizontal(20)
                    .Column(column =>
                    {
                        if (!string.IsNullOrEmpty(resume.Image))
                        {
                            column.Item().AlignCenter().Width(110).Height(110).Image(resume.Image);
                        }
                        
                        column.Item().PaddingBottom(30);

                        // Contact
                        column.Item().Text("CONTACT").FontSize(11).Bold();
                        column.Item().PaddingTop(8).PaddingBottom(25).Column(c => {
                            if (!string.IsNullOrEmpty(resume.Phone)) c.Item().PaddingBottom(5).Text($"📞 {resume.Phone}").FontSize(8);
                            if (!string.IsNullOrEmpty(resume.Email)) c.Item().PaddingBottom(5).Text($"✉️ {resume.Email}").FontSize(8);
                            if (!string.IsNullOrEmpty(resume.Location)) c.Item().PaddingBottom(5).Text($"📍 {resume.Location}").FontSize(8);
                        });

                        // Skills
                        if (resume.Skills?.Any() == true)
                        {
                            column.Item().Text("SKILLS").FontSize(11).Bold();
                            column.Item().PaddingTop(8).Column(s => {
                                foreach (var skill in resume.Skills)
                                    s.Item().PaddingBottom(3).Text($"• {skill}").FontSize(8);
                            });
                        }

                        // Languages
                        if (resume.Languages?.Any() == true)
                        {
                            column.Item().PaddingTop(25).Text("LANGUAGES").FontSize(11).Bold();
                            column.Item().PaddingTop(8).Column(l => {
                                foreach (var lang in resume.Languages)
                                    l.Item().PaddingBottom(3).Text($"• {lang}").FontSize(8);
                            });
                        }
                    });

                // --- MAIN CONTENT (Fluid Remaining Space) ---
                row.RelativeItem()
                    .PaddingVertical(50)
                    .PaddingHorizontal(35)
                    .Column(main =>
                    {
                        // Header
                        main.Item().Text(resume.Name ?? "").FontSize(24).Bold().FontColor(Colors.Black);
                        main.Item().Text(resume.Title ?? "").FontSize(14).FontColor(AccentGold).SemiBold();
                        main.Item().PaddingBottom(25);

                        // Profile
                        if (!string.IsNullOrEmpty(resume.Summary))
                        {
                            main.Item().Text("PROFILE").FontSize(12).Bold();
                            main.Item().PaddingTop(5).PaddingBottom(30).Text(resume.Summary).FontSize(9).LineHeight(1.3f).Justify();
                        }

                        // Work Experience
                        if (resume.Experiences?.Any() == true)
                        {
                            main.Item().Text("WORK EXPERIENCE").FontSize(12).Bold();
                            main.Item().PaddingTop(15);

                            foreach (var exp in resume.Experiences.OrderBy(e => e.Order))
                            {
                                main.Item().PaddingBottom(20).Column(expCol =>
                                {
                                    expCol.Item().Row(r =>
                                    {
                                        r.RelativeItem().Text(exp.Position).Bold().FontSize(10);
                                        r.AutoItem().Text($"{exp.StartDate} - {exp.EndDate ?? "Present"}").FontSize(8).FontColor(Colors.Grey.Medium);
                                    });
                                    expCol.Item().Text(exp.Company).FontSize(9).FontColor(AccentGold).SemiBold();
                                    
                                    if (exp.Description != null)
                                    {
                                        expCol.Item().PaddingTop(5);
                                        foreach (var bullet in exp.Description)
                                            expCol.Item().PaddingLeft(8).Text($"• {bullet}").FontSize(8.5f).LineHeight(1.2f);
                                    }
                                });
                            }
                        }

                        // Projects Section (Added)
                        if (resume.Projects?.Any() == true)
                        {
                            main.Item().PaddingTop(10).Text("PROJECTS").FontSize(12).Bold();
                            main.Item().PaddingTop(15);

                            foreach (var proj in resume.Projects.OrderBy(p => p.Order))
                            {
                                main.Item().PaddingBottom(15).Column(projCol =>
                                {
                                    projCol.Item().Row(r =>
                                    {
                                        r.RelativeItem().Text(proj.Name).Bold().FontSize(10);
                                        if (!string.IsNullOrEmpty(proj.Url))
                                            r.AutoItem().Text(proj.Url).FontSize(8).FontColor(Colors.Blue.Medium).Underline();
                                    });

                                    if (!string.IsNullOrEmpty(proj.Description))
                                        projCol.Item().PaddingTop(2).Text(proj.Description).FontSize(8.5f).LineHeight(1.2f);

                                    if (proj.Technologies?.Any() == true)
                                        projCol.Item().PaddingTop(2).Text($"Technologies: {string.Join(", ", proj.Technologies)}").FontSize(8).Italic().FontColor(Colors.Grey.Medium);
                                });
                            }
                        }

                        // Education
                        if (resume.Educations?.Any() == true)
                        {
                            main.Item().PaddingTop(10).Text("EDUCATION").FontSize(12).Bold();
                            main.Item().PaddingTop(15);

                            foreach (var edu in resume.Educations)
                            {
                                main.Item().PaddingBottom(15).Column(eduCol => 
                                {
                                    eduCol.Item().Row(r => {
                                        r.RelativeItem().Text(edu.Degree).Bold().FontSize(10);
                                        r.AutoItem().Text(edu.EndDate).FontSize(8).FontColor(Colors.Grey.Medium);
                                    });
                                    eduCol.Item().Text(edu.Institution).FontSize(9).FontColor(AccentGold);
                                });
                            }
                        }
                    });
            });
        });
    }
}