import os
from pptx import Presentation

# Specify the uploads directory path
uploads_directory = 'uploads'

# List all files in the uploads directory
files = os.listdir(uploads_directory)
print(files)


# Filter out only files with a .pptx extension
pptx_files = [file for file in files if file.endswith(".pptx")]

if pptx_files:
    # Get the first .pptx file in the directory
    first_pptx_file = os.path.join(uploads_directory, pptx_files[0])
    print("First .pptx file in the uploads directory:", first_pptx_file)

    # Now, you can extract text from the first .pptx file
    extracted_text = extract_text_from_pptx(first_pptx_file)

    # Print the extracted text
    print("Extracted Text:")
    print(extracted_text)
else:
    print("No .pptx files found in the uploads directory.")
