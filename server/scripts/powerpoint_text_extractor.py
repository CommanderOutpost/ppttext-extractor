"""Extract text from a PowerPoint (.pptx) file and print it to stdout.

Usage:
    python3 powerpoint_text_extractor.py FILE

The extracted text is written to stdout; diagnostics go to stderr. The script
does not touch the filesystem, so concurrent requests cannot interfere with
each other.
"""

import sys

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE


def iter_shape_text(shape):
    """Yield the text of a shape, recursing into groups and tables."""
    if shape.shape_type == MSO_SHAPE_TYPE.GROUP:
        for child in shape.shapes:
            yield from iter_shape_text(child)
        return

    if getattr(shape, "has_table", False) and shape.has_table:
        for row in shape.table.rows:
            for cell in row.cells:
                for paragraph in cell.text_frame.paragraphs:
                    yield paragraph.text
        return

    if getattr(shape, "has_text_frame", False) and shape.has_text_frame:
        for paragraph in shape.text_frame.paragraphs:
            # paragraph.text includes runs that carry no text of their own.
            yield paragraph.text


def iter_slide_text(slide):
    for shape in slide.shapes:
        yield from iter_shape_text(shape)

    if slide.has_notes_slide:
        notes = slide.notes_slide.notes_text_frame
        if notes is not None:
            yield notes.text


def extract_text(pptx_file):
    """Return all text in the presentation, one paragraph per line."""
    presentation = Presentation(pptx_file)
    lines = []
    for slide in presentation.slides:
        for line in iter_slide_text(slide):
            line = line.rstrip()
            if line:
                lines.append(line)
    return "\n".join(lines)


def main(argv):
    if len(argv) != 2:
        print("usage: powerpoint_text_extractor.py FILE", file=sys.stderr)
        return 2

    try:
        text = extract_text(argv[1])
    except Exception as exc:  # noqa: BLE001 - report any parse failure to the caller
        print(f"failed to extract text: {exc}", file=sys.stderr)
        return 1

    sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
