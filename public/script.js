const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

// This asynchronous function is responsible for uploading a file to the server.
async function uploadFile(data) {
    try {
        // Send a POST request to the "api/uploadFile" endpoint with the provided data.
        const response = await fetch("api/uploadFile", {
            method: 'POST',
            body: data
        });

        // Check if the response status is OK (in the range 200-299).
        if (response.ok) {
            // If the response is successful, parse the JSON response.
            const responseJson = response.json();
            return responseJson;
        }

        // If the response is not OK, throw an error indicating a failed request.
        throw new Error('Request failed!');

    } catch (error) {
        // If there's an error during the process, log the error to the console for debugging.
        console.log(error);
    }
}


// This function is used to handle form submission.
function submitForm(e) {
    // Prevent the default form submission behavior, which would cause a page reload.
    e.preventDefault();

    // Get references to the "name" and "files" input elements in the form.
    const name = document.getElementById("name");
    const files = document.getElementById("files");

    // Create a new FormData object to prepare data for submission.
    const formData = new FormData();

    // Append the value of the "name" input field to the formData.
    formData.append("name", name.value);

    // Loop through the selected files in the "files" input field and append them to formData.
    for (let i = 0; i < files.files.length; i++) {
        formData.append("file", files.files[i]);
    }

    // Call the uploadFile function to handle the upload of the form data.
    uploadFile(formData);
}
