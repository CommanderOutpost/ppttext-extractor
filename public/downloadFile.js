function downloadFile(fileName, fileContent) {
    // Blob with the file to download
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Object URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Set the desired file name

    // Trigger a click event on the link
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);
}

function getFileName() {
    const fileInput = document.querySelector('input[type=file]');
    const path = fileInput.value;
    const fileName = path.split(/(\\|\/)/g).pop();
    const txtFileName = fileName.replace(/\.(pptx|ppt)$/, '');
    return txtFileName;
}
