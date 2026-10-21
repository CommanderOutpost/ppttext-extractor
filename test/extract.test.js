const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const app = require('../server');

const fixturePath = path.join(__dirname, 'fixtures', 'sample.pptx');
const uploadsDirectory = path.join(__dirname, '..', 'server', 'uploads');

let server;
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
});

function postFile(buffer, filename, type = 'application/octet-stream') {
    const form = new FormData();
    form.append('file', new Blob([buffer], { type }), filename);
    return fetch(`${baseUrl}/api/extract`, { method: 'POST', body: form });
}

test('health check', async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
});

test('extracts text, tables, grouped shapes and notes', async () => {
    const response = await postFile(fs.readFileSync(fixturePath), 'sample.pptx');

    assert.equal(response.status, 200);
    const { extractedText } = await response.json();

    for (const expected of [
        'Quarterly Report',
        'Revenue grew 12%',
        'EMEA',
        '42',
        'Grouped caption',
        'Appendix notes',
        'Speaker note for slide two',
    ]) {
        assert.ok(extractedText.includes(expected), `missing ${JSON.stringify(expected)}`);
    }
});

test('removes the uploaded file after a successful request', async () => {
    const response = await postFile(fs.readFileSync(fixturePath), 'sample.pptx');
    assert.equal(response.status, 200);

    assert.deepEqual(fs.readdirSync(uploadsDirectory), []);
});

test('removes the uploaded file after a failed request', async () => {
    const response = await postFile(Buffer.from('not a presentation'), 'broken.pptx');
    assert.notEqual(response.status, 200);

    assert.deepEqual(fs.readdirSync(uploadsDirectory), []);
});

test('rejects files that are not .pptx', async () => {
    const response = await postFile(Buffer.from('hello'), 'notes.txt');

    assert.equal(response.status, 400);
    assert.equal(await response.text(), 'Only .pptx files are allowed!');
});

test('rejects a renamed file that is not a ZIP archive', async () => {
    const response = await postFile(Buffer.from('MZ\x90\x00 definitely not a zip'), 'evil.pptx');

    assert.equal(response.status, 400);
    assert.equal(await response.text(), 'Uploaded file is not a valid .pptx file');
});

test('reports a corrupt presentation as unprocessable', async () => {
    const response = await postFile(
        Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.from('garbage')]),
        'corrupt.pptx',
    );

    assert.equal(response.status, 422);
    assert.equal(await response.text(), 'Could not extract text from the presentation');
});

test('rejects a request without a file', async () => {
    const form = new FormData();
    form.append('notAFile', 'value');
    const response = await fetch(`${baseUrl}/api/extract`, { method: 'POST', body: form });

    assert.equal(response.status, 400);
    assert.equal(await response.text(), 'No file was uploaded');
});
