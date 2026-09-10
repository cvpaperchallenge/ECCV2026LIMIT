#!/usr/bin/env python3
"""Render the Best Paper Award social card and the per-author certificates.

The award is announced in three places that have to agree with each other: the
page, the card a social crawler shows when the page is pasted somewhere, and
the certificate an author puts on a CV. Only the page can read `people.json`
at run time, so this script exists to give the other two the same source: it
reads the award straight out of `src/data/`, lays the text out itself, and
writes the finished PNG and PDFs into `public/`.

Run it whenever the award, the paper title, the author list or the workshop
details change:

    python3 scripts/award-assets/render_award_assets.py

The rendered files are committed. CI only ever serves them -- it does not run
this script, which is deliberate: rendering needs Helvetica Neue and the two
converters below, all of which are present on macOS and none of which are in
the Linux build container. Keeping the outputs in git also means the social
card a crawler fetches cannot change from under a link someone already posted.

Requires: rsvg-convert (librsvg) and magick (ImageMagick 7), both from
Homebrew, plus Pillow for text measurement.
"""

from __future__ import annotations

import base64
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import ImageFont

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "src" / "data"
PUBLIC_DIR = REPO_ROOT / "public"
CERTIFICATE_DIR = PUBLIC_DIR / "certificates"

SITE_URL = "https://eccv2026-limit-workshop.limitlab.xyz"
AWARD_PATH = "/best-paper-award"

# Helvetica Neue stands in for Inter, which the site loads from Google Fonts
# and which is not installed here. It is the closest of the fonts macOS ships:
# same grotesque skeleton, same near-vertical terminals. The index picks a cut
# out of the .ttc, and is needed for measurement as well as rendering, so the
# wrap this script computes matches what librsvg later draws.
FONT_FILE = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_FAMILY = "Helvetica Neue"
FONT_INDEX = {
    ("normal", 400): 0,
    ("normal", 500): 10,
    ("normal", 700): 1,
    ("italic", 400): 2,
    ("italic", 700): 3,
    ("normal", 300): 7,
}

# Radix Blue, the same scale src/app/app.css builds the site's theme from, so
# the card and the certificate are in the palette the page is in.
BLUE_1 = "#fdfdfe"
BLUE_9 = "#3d63dd"
BLUE_11_LIGHT = "#395bc7"
BLUE_11_DARK = "#93b4ff"
BLUE_12_LIGHT = "#1d2e5c"
INK = "#0c111c"


def fail(message: str) -> None:
    sys.exit(f"error: {message}")


@dataclass(frozen=True)
class Award:
    """Everything both artefacts need, resolved from src/data once."""

    award: str
    title: str
    authors: list[str]
    conference: str
    conference_full_name: str
    signatory_name: str
    signatory_role: str
    date: str
    venue: str
    location: str

    @property
    def billing(self) -> str:
        """`LIMIT Workshop @ ECCV 2026 · Malmö, Sweden`, the one line that
        says which workshop this was and where, used on both artefacts."""
        return f"LIMIT Workshop @ {self.conference} · {self.location}"


def load_award() -> Award:
    people = json.loads((DATA_DIR / "people.json").read_text("utf-8"))
    workshop = json.loads((DATA_DIR / "workshop.json").read_text("utf-8"))

    winners = [
        paper
        for paper in people["program"]["acceptedPapers"]
        if paper.get("award")
    ]
    if not winners:
        fail("no accepted paper in people.json carries an `award` field")
    if len(winners) > 1:
        # Rendering the rest is a loop, but the card can only show one paper,
        # so which one it should show becomes a decision this script must not
        # make silently.
        fail(f"{len(winners)} papers carry an `award` field; expected exactly 1")

    winner = winners[0]
    event = workshop["home"]["eventInfo"]
    certificate = workshop["awards"]["certificate"]
    signatory = certificate["signatory"]

    return Award(
        award=winner["award"],
        title=winner["title"],
        # Author strings in people.json are comma-separated throughout.
        authors=[name.strip() for name in winner["authors"].split(",")],
        # `subtitle` is "ECCV 2026 Workshop"; the word is dropped here because
        # every use of this sits next to "LIMIT Workshop" already, and
        # "LIMIT Workshop @ ECCV 2026 Workshop" is how it reads otherwise.
        conference=re.sub(
            r"\s*workshop\s*$", "", workshop["home"]["subtitle"], flags=re.I
        ).strip(),
        conference_full_name=certificate["conferenceFullName"],
        signatory_name=signatory["name"],
        signatory_role=signatory["role"],
        date=event["date"],
        venue=event["venue"],
        location=event["location"],
    )


def font(weight: int = 400, style: str = "normal") -> str:
    index = FONT_INDEX.get((style, weight))
    if index is None:
        fail(f"no font cut for {style} {weight}")
    return index


def measure(text: str, size: float, weight: int = 400, style: str = "normal") -> float:
    loaded = ImageFont.truetype(FONT_FILE, int(size), index=font(weight, style))
    return loaded.getlength(text)


def wrap(
    text: str,
    width: float,
    size: float,
    weight: int = 400,
    style: str = "normal",
) -> list[str]:
    """Greedy wrap against real glyph metrics rather than a character count.

    A title like "RIPE++: Reinforced Keypoint Learning from Positive Pairs
    Only" is mostly narrow letters, and a character-count wrap would break it
    a word early and leave the card looking short of its own margins.
    """
    words = text.split()
    if not words:
        return []

    lines = [words[0]]
    for word in words[1:]:
        candidate = f"{lines[-1]} {word}"
        if measure(candidate, size, weight, style) <= width:
            lines[-1] = candidate
        else:
            lines.append(word)
    return lines


def fit(
    text: str,
    width: float,
    sizes: list[float],
    max_lines: int,
    weight: int = 400,
    style: str = "normal",
) -> tuple[float, list[str]]:
    """The largest of `sizes` at which `text` wraps into `max_lines` or fewer.

    Used for the lines whose length is not known until the data is read. The
    recipient line is three names joined by commas and runs past the margins
    at the size a single name is set in, but dropping every certificate to the
    size the longest case needs would make a one-author award look timid.
    """
    for size in sizes:
        lines = wrap(text, width, size, weight, style)
        if len(lines) <= max_lines:
            return size, lines

    smallest = sizes[-1]
    return smallest, wrap(text, width, smallest, weight, style)


def slugify(name: str) -> str:
    """`Johannes Künzel` -> `johannes-kunzel`, for a filename that survives
    being emailed around, unzipped on Windows and pasted into a URL."""
    decomposed = unicodedata.normalize("NFKD", name)
    ascii_only = decomposed.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_only.lower()).strip("-")


def run(command: list[str]) -> None:
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        fail(f"{command[0]} failed:\n{result.stderr.strip()}")


def require_tools() -> None:
    missing = [tool for tool in ("rsvg-convert", "magick") if not shutil.which(tool)]
    if missing:
        fail(f"missing required tool(s): {', '.join(missing)} (brew install librsvg imagemagick)")
    if not Path(FONT_FILE).exists():
        fail(f"missing font: {FONT_FILE}")


def data_uri(path: Path) -> str:
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def text_element(
    content: str,
    x: float,
    y: float,
    size: float,
    fill: str,
    weight: int = 400,
    style: str = "normal",
    spacing: float = 0,
    anchor: str = "start",
    opacity: float = 1.0,
) -> str:
    attrs = [
        f'x="{x}"',
        f'y="{y}"',
        f'font-family="{FONT_FAMILY}"',
        f'font-size="{size}"',
        f'font-weight="{weight}"',
        f'fill="{fill}"',
    ]
    if style != "normal":
        attrs.append(f'font-style="{style}"')
    if spacing:
        attrs.append(f'letter-spacing="{spacing}"')
    if anchor != "start":
        attrs.append(f'text-anchor="{anchor}"')
    if opacity != 1.0:
        attrs.append(f'fill-opacity="{opacity}"')
    return f"<text {' '.join(attrs)}>{escape(content)}</text>"


# --------------------------------------------------------------------------
# Social card
# --------------------------------------------------------------------------

OG_WIDTH, OG_HEIGHT = 1200, 630
OG_MARGIN = 76


def build_og_overlay(award: Award) -> str:
    """The text layer, drawn over the darkened Malmö photo the site already
    uses. Left-aligned and ragged-right: a crawler's card is read at a glance
    and at thumbnail size, so the eye wants one edge to start from."""
    content_width = OG_WIDTH - OG_MARGIN * 2

    title_size = 56
    title_lines = wrap(award.title, content_width, title_size, weight=700)
    if len(title_lines) > 3:
        # Long titles get a size down rather than a fourth line, which would
        # collide with the authors.
        title_size = 46
        title_lines = wrap(award.title, content_width, title_size, weight=700)

    parts: list[str] = []

    # A wash that is heaviest bottom-left, under the text, and lets the Turning
    # Torso on the right of the photo stay visible.
    parts.append(
        f'<rect width="{OG_WIDTH}" height="{OG_HEIGHT}" fill="url(#shade)"/>'
    )

    kicker_y = 250 - (len(title_lines) - 2) * 34
    parts.append(
        text_element(
            award.award.upper(),
            OG_MARGIN,
            kicker_y,
            24,
            BLUE_11_DARK,
            weight=700,
            spacing=4.5,
        )
    )

    y = kicker_y + 78
    for line in title_lines:
        parts.append(text_element(line, OG_MARGIN, y, title_size, "#ffffff", weight=700))
        y += title_size * 1.2

    y += 14
    authors = ", ".join(award.authors)
    for line in wrap(authors, content_width, 27, weight=400):
        parts.append(
            text_element(line, OG_MARGIN, y, 27, "#ffffff", opacity=0.88)
        )
        y += 27 * 1.35

    # Footer rule and attribution, pinned to the bottom margin so cards for
    # differently sized titles still share one baseline.
    rule_y = OG_HEIGHT - OG_MARGIN - 44
    parts.append(
        f'<rect x="{OG_MARGIN}" y="{rule_y}" width="88" height="3" rx="1.5" '
        f'fill="{BLUE_11_DARK}" fill-opacity="0.9"/>'
    )
    parts.append(
        text_element(
            award.billing,
            OG_MARGIN,
            rule_y + 40,
            23,
            "#ffffff",
            weight=500,
            opacity=0.85,
        )
    )

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{OG_WIDTH}" height="{OG_HEIGHT}"
     viewBox="0 0 {OG_WIDTH} {OG_HEIGHT}">
  <defs>
    <linearGradient id="shade" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="{INK}" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="{INK}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="{INK}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  {"".join(parts)}
</svg>
"""


def render_og_card(award: Award, workdir: Path) -> Path:
    background = PUBLIC_DIR / "cover.jpg"
    if not background.exists():
        fail(f"missing background image: {background}")

    overlay_svg = workdir / "og-overlay.svg"
    overlay_png = workdir / "og-overlay.png"
    base_png = workdir / "og-base.png"
    output = PUBLIC_DIR / "best-paper-award-ogp.png"

    overlay_svg.write_text(build_og_overlay(award), "utf-8")
    run(["rsvg-convert", "-f", "png", "-o", str(overlay_png), str(overlay_svg)])
    run(
        [
            "magick",
            str(background),
            "-resize",
            f"{OG_WIDTH}x{OG_HEIGHT}^",
            "-gravity",
            "center",
            "-extent",
            f"{OG_WIDTH}x{OG_HEIGHT}",
            str(base_png),
        ]
    )
    # PNG rather than JPEG: the card is mostly crisp text over a photograph,
    # and JPEG rings around white letterforms at the sizes this is viewed at.
    run(
        [
            "magick",
            str(base_png),
            str(overlay_png),
            "-composite",
            "-strip",
            str(output),
        ]
    )
    return output


# --------------------------------------------------------------------------
# Certificates
# --------------------------------------------------------------------------

# A4 landscape at 96dpi. A4 rather than Letter because the workshop is in
# Sweden and the organisers are split across Europe and Japan; it prints
# without scaling on the paper most of them have.
CERT_WIDTH, CERT_HEIGHT = 1122.5, 793.7


def build_certificate(
    award: Award, recipients: str, limit_logo_uri: str, eccv_logo_uri: str
) -> str:
    centre = CERT_WIDTH / 2
    parts: list[str] = []

    # Double rule, the outer hairline and an inner keyline. Restrained on
    # purpose: the certificate has to look like a record, not like a template
    # someone downloaded.
    parts.append(
        f'<rect x="28" y="28" width="{CERT_WIDTH - 56}" height="{CERT_HEIGHT - 56}" '
        f'fill="none" stroke="{BLUE_9}" stroke-width="2.5"/>'
    )
    parts.append(
        f'<rect x="42" y="42" width="{CERT_WIDTH - 84}" height="{CERT_HEIGHT - 84}" '
        f'fill="none" stroke="{BLUE_9}" stroke-width="0.8" stroke-opacity="0.55"/>'
    )

    # The two marks side by side, ECCV first because the conference is the
    # larger context and reading order puts it there. They are separated by a
    # hairline and sized to a common optical height rather than a common
    # width, the aspect ratios being nothing like each other.
    #
    # Co-branding rather than a single mark, because neither on its own is
    # accurate: the prize is the workshop's to give, not the conference's, and
    # the workshop is not a thing that happened independently of ECCV. The
    # billing line directly beneath resolves it in words.
    eccv_height = ECCV_WIDTH_PT * ECCV_ASPECT
    limit_height = LIMIT_WIDTH_PT * LIMIT_ASPECT
    block_width = ECCV_WIDTH_PT + LOGO_GAP_PT + LIMIT_WIDTH_PT
    block_left = centre - block_width / 2
    logo_centre_y = 122

    parts.append(
        f'<image href="{eccv_logo_uri}" x="{block_left}" '
        f'y="{logo_centre_y - eccv_height / 2}" '
        f'width="{ECCV_WIDTH_PT}" height="{eccv_height}"/>'
    )
    divider_x = block_left + ECCV_WIDTH_PT + LOGO_GAP_PT / 2
    parts.append(
        f'<rect x="{divider_x}" y="{logo_centre_y - 30}" width="1" height="60" '
        f'fill="{INK}" fill-opacity="0.16"/>'
    )
    parts.append(
        f'<image href="{limit_logo_uri}" '
        f'x="{block_left + ECCV_WIDTH_PT + LOGO_GAP_PT}" '
        f'y="{logo_centre_y - limit_height / 2}" '
        f'width="{LIMIT_WIDTH_PT}" height="{limit_height}"/>'
    )

    # Two lines rather than the one the social card uses: the conference under
    # its full formal name, then the workshop within it. A certificate is read
    # once, slowly, by someone deciding whether to believe it, and the venue
    # spelled out in full is part of what it is asserting. The card is read at
    # a glance in a feed and keeps the short form.
    parts.append(
        text_element(
            award.conference_full_name,
            centre,
            178,
            14,
            INK,
            opacity=0.58,
            anchor="middle",
        )
    )
    parts.append(
        text_element(
            f"LIMIT Workshop · {award.location}",
            centre,
            200,
            15,
            BLUE_11_LIGHT,
            weight=500,
            spacing=2.6,
            anchor="middle",
        )
    )

    parts.append(
        text_element(
            award.award.upper(),
            centre,
            268,
            50,
            BLUE_12_LIGHT,
            weight=700,
            spacing=6,
            anchor="middle",
        )
    )
    parts.append(
        f'<rect x="{centre - 54}" y="292" width="108" height="3" rx="1.5" fill="{BLUE_9}"/>'
    )

    parts.append(
        text_element("is presented to", centre, 356, 19, INK, opacity=0.62, anchor="middle")
    )

    # The recipients are the paper's authors, named together on one
    # certificate: the award is to the paper, and splitting it into a copy per
    # author would issue three documents for one prize.
    # One line if it can be had at all: a list of names broken across two is
    # read as two groups of people rather than one author list. The ladder is
    # fine-grained because this is the certificate's biggest type and a step
    # down of five points is visible next to the heading above it. Only a
    # very long author list falls through to wrapping at the smallest size.
    recipient_size, recipient_lines = fit(
        recipients, CERT_WIDTH - 260, [43, 40, 38, 36, 34, 32, 30], 1, weight=700
    )
    y = 418
    for line in recipient_lines:
        parts.append(
            text_element(line, centre, y, recipient_size, INK, weight=700, anchor="middle")
        )
        y += recipient_size * 1.18

    y += 12
    parts.append(
        text_element("for the paper", centre, y, 19, INK, opacity=0.62, anchor="middle")
    )

    y += 42
    # Upright and in quotation marks, where a title would normally be set in
    # italic.
    #
    # The italic was reported as running its letters together in Preview. It
    # could not be reproduced in either librsvg's own output path or poppler,
    # both of which draw the line correctly, so the cause was never pinned
    # down -- but this was the only italic on the certificate, and the only
    # thing that made the line different from the ones around it that render
    # correctly everywhere. A certificate is a document that has to come out
    # right in whatever a recipient happens to open it in, years from now, so
    # the face that is under suspicion is not worth keeping for the sake of a
    # convention that quotation marks satisfy just as well.
    quoted_title = f"“{award.title}”"
    title_size, title_lines = fit(quoted_title, CERT_WIDTH - 260, [25, 22, 20], 2)
    for line in title_lines:
        parts.append(
            text_element(line, centre, y, title_size, INK, anchor="middle")
        )
        y += title_size * 1.4

    occasion_y = y + 34
    parts.append(
        text_element(
            f"presented at the LIMIT Workshop on {award.date}, {award.venue}, {award.location}",
            centre,
            occasion_y,
            16,
            INK,
            opacity=0.72,
            anchor="middle",
        )
    )

    # The closing cluster is measured up from the frame rather than down from
    # the title, so that the attribution and the verification line sit on the
    # same baselines on every certificate however many lines the title took.
    baseline = CERT_HEIGHT - 58
    signature_rule_y = baseline - 112
    signature_name_y = baseline - 88
    signature_role_y = baseline - 69
    divider_y = baseline - 44
    verify_label_y = baseline - 22
    verify_url_y = baseline

    # The title is the only part of the certificate whose height is not known
    # in advance, so it is the only thing that can push into the cluster
    # below. Better to stop with a message than to write a PDF that has an
    # author's name overprinted on the verification URL.
    if occasion_y + 30 > signature_rule_y:
        fail(
            "certificate layout overflowed: the paper title needs "
            f"{len(title_lines)} lines and leaves no room above the "
            "signature block. Reduce title_size in build_certificate()."
        )

    # Who conferred it, named, with the role that gave them standing to. A
    # committee named as a body says less than a person does: the reader of a
    # certificate wants to know who put their name to it.
    #
    # The rule stays empty rather than carrying a scanned signature. A
    # signature image in a public repository is a signature anyone can lift
    # and paste onto a document of their own, and it buys nothing here — what
    # makes this checkable is the address printed below it, not the autograph.
    # The line is left for a wet signature on the printed copy.
    parts.append(
        f'<rect x="{centre - 130}" y="{signature_rule_y}" width="260" height="1" '
        f'fill="{INK}" fill-opacity="0.28"/>'
    )
    parts.append(
        text_element(
            award.signatory_name,
            centre,
            signature_name_y,
            16,
            INK,
            weight=700,
            opacity=0.85,
            anchor="middle",
        )
    )
    parts.append(
        text_element(
            award.signatory_role,
            centre,
            signature_role_y,
            13,
            INK,
            opacity=0.6,
            anchor="middle",
        )
    )

    # The line that makes the document checkable. A PDF proves nothing on its
    # own -- anyone can typeset one -- so what is actually being certified is
    # that the workshop's own site says the same thing, and this is the
    # address where it says it.
    parts.append(
        f'<rect x="{centre - 190}" y="{divider_y}" width="380" height="1" '
        f'fill="{INK}" fill-opacity="0.14"/>'
    )
    parts.append(
        text_element(
            "Verify this award at",
            centre,
            verify_label_y,
            13,
            INK,
            opacity=0.55,
            spacing=1.4,
            anchor="middle",
        )
    )
    parts.append(
        text_element(
            f"{SITE_URL}{AWARD_PATH}",
            centre,
            verify_url_y,
            15,
            BLUE_11_LIGHT,
            weight=500,
            anchor="middle",
        )
    )

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm"
     viewBox="0 0 {CERT_WIDTH} {CERT_HEIGHT}">
  <rect width="{CERT_WIDTH}" height="{CERT_HEIGHT}" fill="{BLUE_1}"/>
  {"".join(parts)}
</svg>
"""


# Printed widths of the two marks, chosen so their heights come out close to
# each other (66pt and 62pt) despite the aspect ratios being far apart.
ECCV_WIDTH_PT = 150
LIMIT_WIDTH_PT = 190
LOGO_GAP_PT = 60

# Intrinsic proportions: the ECCV logo's SVG viewBox, and the LIMIT.LAB PNG's
# pixel dimensions.
ECCV_ASPECT = 189 / 430
LIMIT_ASPECT = 484 / 1495


def logo_render_width(printed_width: float) -> int:
    """Pixels to rasterise a mark at, for 300dpi at its printed size.

    300dpi is the resolution a certificate is ever going to be looked at, and
    embedding a mark at its source size is wasted weight: the LIMIT wordmark
    is 1495px wide and put 180KB of base64 into the PDF for a logo two inches
    across.
    """
    return int(printed_width / 96 * 300)


def render_certificates(award: Award, workdir: Path) -> tuple[Path, str]:
    limit_logo = PUBLIC_DIR / "limitlab-logo-black-wide.png"
    eccv_logo = PUBLIC_DIR / "eccv-navbar-logo.svg"
    for path in (limit_logo, eccv_logo):
        if not path.exists():
            fail(f"missing logo: {path}")

    scaled_limit = workdir / "limit-logo.png"
    run(
        [
            "magick",
            str(limit_logo),
            "-resize",
            f"{logo_render_width(LIMIT_WIDTH_PT)}x",
            "-strip",
            str(scaled_limit),
        ]
    )

    # The ECCV mark is vector. Rasterising it here rather than nesting the SVG
    # keeps both logos on the same path through librsvg, and the skyline has
    # enough fine detail that an unbounded nested SVG is the slower option.
    scaled_eccv = workdir / "eccv-logo.png"
    run(
        [
            "rsvg-convert",
            "-f",
            "png",
            "-w",
            str(logo_render_width(ECCV_WIDTH_PT)),
            "-o",
            str(scaled_eccv),
            str(eccv_logo),
        ]
    )

    CERTIFICATE_DIR.mkdir(parents=True, exist_ok=True)
    recipients = ", ".join(award.authors)

    svg_path = workdir / "certificate.svg"
    output = CERTIFICATE_DIR / f"limit-eccv2026-{slugify(award.award)}.pdf"
    svg_path.write_text(
        build_certificate(
            award, recipients, data_uri(scaled_limit), data_uri(scaled_eccv)
        ),
        "utf-8",
    )
    run(["rsvg-convert", "-f", "pdf", "-o", str(output), str(svg_path)])

    return output, recipients


def write_manifest(award: Award, certificate: Path, recipients: str) -> Path:
    """Record the certificate's filename for the page to read.

    The award page offers it as a download and has no way to work out the
    filename for itself: it would have to reimplement `slugify` in TypeScript
    and stay in step with it. Writing the name down once, here, where it was
    decided, removes the second implementation and the dead link the first
    divergence between the two would produce.
    """
    manifest = DATA_DIR / "award-certificates.json"
    payload = {
        "_comment": (
            "Generated by scripts/award-assets/render_award_assets.py. "
            "Do not edit by hand -- re-run the script instead."
        ),
        "award": award.award,
        "certificate": {
            "recipients": recipients,
            "file": f"/{certificate.relative_to(PUBLIC_DIR).as_posix()}",
        },
    }
    manifest.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", "utf-8"
    )
    return manifest


def main() -> None:
    require_tools()
    award = load_award()

    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        card = render_og_card(award, workdir)
        certificate, recipients = render_certificates(award, workdir)

    manifest = write_manifest(award, certificate, recipients)

    print(f"{award.award}: {award.title}")
    for path in [card, certificate, manifest]:
        print(f"  wrote {path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
