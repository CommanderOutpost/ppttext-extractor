async function copyText(element) {
    try {
        await navigator.clipboard.writeText(element.textContent);
    } catch (error) {
        console.error(error);
    }
}

function setCopyButtonText() {
    copyTextButton.innerHTML = "Copied";
    setTimeout(() => {
        copyTextButton.innerHTML = "Copy Text";
    }, 2000)
}