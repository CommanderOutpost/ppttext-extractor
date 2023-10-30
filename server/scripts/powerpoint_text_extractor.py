import os
from pptx import Presentation

# Specify the uploads directory path
uploads_directory = "uploads"

# List all files in the uploads directory
pptx_files = os.listdir(uploads_directory)


def extract_text_from_pptx(pptx_file):
    prs = Presentation(pptx_file)
    all_text = []

    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    for run in paragraph.runs:
                        all_text.append(run.text)

    return "\n".join(all_text)


if pptx_files:
    # Get the first .pptx file in the directory
    first_pptx_file = os.path.join(uploads_directory, pptx_files[0])
    print("First .pptx file in the uploads directory:", first_pptx_file)

    # Now, you can extract text from the first .pptx file
    extracted_text = extract_text_from_pptx(first_pptx_file)

    # Print the extracted text
    print("Extracted Text:")
    print(extracted_text)
    os.remove(first_pptx_file)
    
else:
    print("No .pptx files found in the uploads directory.")
