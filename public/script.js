const form = document.getElementById("form");
const outputTextArea = document.querySelector('.output-text-container');

form.addEventListener("submit", submitForm);

// This asynchronous function is responsible for uploading a file to the server.
async function extractText(data) {
    try {
        // Send a POST request to the "api/uploadFile" endpoint with the provided data.
        const response = await fetch("api/extract/powerpoint", {
            method: 'POST',
            body: data
        });

        if (response.ok) {
            const responseJson = await response.json();
            return responseJson.extractedText;
        }

        throw new Error('Request failed!');

    } catch (error) {
        console.log(error);
    }
}


// This function is used to handle form submission.
function submitForm(e) {
    // Prevent the default form submission behavior, which would cause a page reload.
    e.preventDefault();

    // Get references to and "files" input elements in the form.
    const files = document.getElementById("files");

    // Create a new FormData object to prepare data for submission.
    const formData = new FormData();

    // Loop through the selected files in the "files" input field and append them to formData.
    for (let i = 0; i < files.files.length; i++) {
        formData.append("file", files.files[i]);
    }

    // Call the uploadFile function to handle the upload of the form data.
    renderExtractedText(formData);
}

async function renderExtractedText(data) {
    const extractedText = await extractText(data);
    outputTextArea.innerHTML = extractedText;
    // outputTextArea.display = 'block';
}