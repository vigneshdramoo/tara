from __future__ import annotations

import importlib.util
import sys
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


SITE_DIR = Path("/Users/vigneshramoo/Documents/TARA/tara-site")
BUILDER_PATH = SITE_DIR / "scripts/build-crew-scent-handbook.py"
OUTPUT_DIR = Path("/Users/vigneshramoo/Documents/TARA/TARA & Fiends")
OUTPUT_PDF = OUTPUT_DIR / "TARA Crew Scent Handbook - AUREYA ZEPHYR MARIS ELIORA - 2026-05-14.pdf"
LOGO_PATH = SITE_DIR / "netlify/functions/lib/assets/tara-official-wordmark.png"

spec = importlib.util.spec_from_file_location("crew_handbook_builder", BUILDER_PATH)
builder = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules["crew_handbook_builder"] = builder
spec.loader.exec_module(builder)

PAGE_WIDTH, PAGE_HEIGHT = letter
BLACK = colors.HexColor("#0A0A0A")
INK = colors.HexColor("#202020")
MUTED = colors.HexColor("#565656")
GOLD = colors.HexColor("#CA9E5B")
LIGHT_GOLD = colors.HexColor("#F7F1E7")
LINE = colors.HexColor("#D8C7AD")


def get_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            fontName="Times-Bold",
            fontSize=30,
            leading=34,
            textColor=BLACK,
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=16,
            textColor=GOLD,
            alignment=TA_CENTER,
            spaceAfter=22,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1Tara",
            parent=styles["Heading1"],
            fontName="Times-Bold",
            fontSize=22,
            leading=26,
            textColor=BLACK,
            spaceBefore=8,
            spaceAfter=9,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2Tara",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=GOLD,
            spaceBefore=13,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyTara",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=13.2,
            textColor=INK,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallTara",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.3,
            leading=11.2,
            textColor=INK,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CalloutTara",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.3,
            leading=12.7,
            textColor=INK,
            leftIndent=0,
            rightIndent=0,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableText",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.6,
            leading=9.8,
            textColor=INK,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableHeader",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9.5,
            textColor=colors.white,
        )
    )
    return styles


def p(text: str, style):
    safe = (
        str(text or "-")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )
    return Paragraph(safe, style)


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    canvas.setFillColor(BLACK)
    canvas.rect(0, PAGE_HEIGHT - 74, PAGE_WIDTH, 74, stroke=0, fill=1)
    canvas.drawImage(str(LOGO_PATH), 44, PAGE_HEIGHT - 53, width=130, height=28.6, mask="auto")
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(colors.white)
    canvas.drawRightString(PAGE_WIDTH - 44, PAGE_HEIGHT - 43, "TARA CREW SCENT HANDBOOK")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(44, 26, f"TARA Crew Scent Handbook | Page {doc.page}")
    canvas.restoreState()


def callout(text: str, styles, label: str | None = None):
    label_text = f"{label.upper()}: " if label else ""
    table = Table(
        [[p(f"{label_text}{text}", styles["CalloutTara"])]],
        colWidths=[6.2 * inch],
        hAlign="CENTER",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GOLD),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return [table, Spacer(1, 7)]


def bullet_list(items: list[str], styles):
    return ListFlowable(
        [ListItem(p(item, styles["BodyTara"]), leftIndent=14) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        bulletColor=GOLD,
    )


def table_block(rows: list[list[str]], widths: list[float], styles):
    if not rows:
        return []

    styled_rows = []
    for row_index, row in enumerate(rows):
        styled_rows.append(
            [
                p(cell, styles["TableHeader"] if row_index == 0 else styles["TableText"])
                for cell in row
            ]
        )

    table = Table(styled_rows, colWidths=[width * inch for width in widths], hAlign="CENTER", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BLACK),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.45, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return [table, Spacer(1, 8)]


def add_quick_start(story, notes, styles):
    story.append(Paragraph("Crew Quick Start", styles["H1Tara"]))
    story.extend(
        callout(
            "Lead with mood, not ingredients. Ask what the customer wants to feel, then use TARA's approved scent language to guide the test.",
            styles,
            "Booth rhythm",
        )
    )
    story.append(Paragraph("Social Handles To Follow", styles["H2Tara"]))
    story.append(
        bullet_list(
            [
                "Instagram: @tara_scents.my",
                "Website: tarascents.com",
                "Link hub: tarascents.com/links",
                "WhatsApp Concierge: +60 11-4304 2883",
            ],
            styles,
        )
    )
    story.append(Spacer(1, 8))
    story.append(Paragraph("One-Glance Scent Map", styles["H2Tara"]))
    rows = [["Scent", "Position", "Primary Hook", "Customer Direction"]]
    direction = {
        "AUREYA": "Soft, luminous, feminine warmth.",
        "ZEPHYR": "Clean masculine freshness with warmth.",
        "MARIS": "Unisex mineral marine woods.",
        "ELIORA": "Limited golden floral-musk evening secret.",
    }
    for note in notes:
        rows.append([note.name, direction[note.name], note.primary_hook, note.short_description])
    story.extend(table_block(rows, [0.75, 1.35, 1.45, 2.65], styles))
    story.append(Paragraph("Crew Guardrails", styles["H2Tara"]))
    story.append(
        bullet_list(
            [
                "Never say clone, dupe, mix, or inspired-by.",
                "Do not mention internal formula construction, ratios, source blends, or technical polish levels.",
                "Use note language as olfactive impression, not ingredient disclosure.",
                "For ELIORA, keep the story limited, mysterious, and pop-up exclusive.",
                "Keep the sales tone warm, helpful, and quietly confident.",
            ],
            styles,
        )
    )


def add_scent(story, note, styles):
    story.append(PageBreak())
    title = note.name if note.name != "ELIORA" else "ELIORA - Special Launch"
    story.append(Paragraph(title, styles["H1Tara"]))
    if note.primary_hook:
        story.extend(callout(note.primary_hook, styles, "Primary hook"))

    story.append(Paragraph("Positioning", styles["H2Tara"]))
    story.append(p(note.positioning, styles["BodyTara"]))
    story.extend(callout(note.public_positioning, styles, "Public line"))

    story.append(Paragraph(note.script_heading, styles["H2Tara"]))
    script_rows = [["Moment", "What to say"]]
    for cue_name in ["Opening", "Heart", "Drydown"]:
        if cue_name in note.script_cues:
            script_rows.append([cue_name, note.script_cues[cue_name]])
    story.extend(table_block(script_rows, [1.0, 5.2], styles))

    story.append(Paragraph("Marketing Note Pyramid", styles["H2Tara"]))
    story.extend(table_block(note.pyramid, [1.05, 5.15], styles))

    story.append(Paragraph("Top Accord Roles", styles["H2Tara"]))
    story.extend(table_block(note.top_accords, [1.65, 4.55], styles))

    story.append(Paragraph("Approved Product Copy", styles["H2Tara"]))
    for label, copy in [
        ("Short", note.short_description),
        ("Product page", note.product_description),
        ("Launch", note.launch_description),
    ]:
        story.extend(callout(copy, styles, label))

    story.append(Paragraph("Language To Reuse", styles["H2Tara"]))
    story.append(bullet_list(note.note_language, styles))

    story.append(Paragraph("Guardrails", styles["H2Tara"]))
    story.append(bullet_list(note.guardrails, styles))

    story.append(Paragraph("Final Direction", styles["H2Tara"]))
    story.append(p(note.final_direction, styles["BodyTara"]))


def build_pdf():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    notes = [
        builder.parse_notes(name, builder.SOURCE_FILES[name])
        for name in ["AUREYA", "ZEPHYR", "MARIS", "ELIORA"]
    ]
    styles = get_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=1.15 * inch,
        bottomMargin=0.58 * inch,
        title="TARA Crew Scent Handbook",
        author="TARA",
    )
    story = []
    story.append(Spacer(1, 28))
    story.append(Paragraph("Crew Scent Handbook", styles["CoverTitle"]))
    story.append(Paragraph("AUREYA / ZEPHYR / MARIS / ELIORA - Special Launch", styles["CoverSubtitle"]))
    story.extend(
        callout(
            "A fast, polished guide for TARA crews to explain each scent clearly, protect the brand language, and help customers find the fragrance that feels like them.",
            styles,
            "Purpose",
        )
    )
    story.append(Paragraph(f"Prepared for TARA & Friends crews | {datetime.now().strftime('%d %B %Y')}", styles["CoverSubtitle"]))
    story.append(PageBreak())
    add_quick_start(story, notes, styles)
    for note in notes:
        add_scent(story, note, styles)

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    return OUTPUT_PDF


if __name__ == "__main__":
    print(build_pdf())
