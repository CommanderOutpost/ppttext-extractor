# PPTText Extractor

An API that extracts text from PowerPoint (`.pptx`) files. Upload a presentation
and get back its text — including tables, grouped shapes and speaker notes — as
one string per paragraph.

## Requirements

- Node.js 18+
- Python 3.9+ with [`python-pptx`](https://python-pptx.readthedocs.io/)

```bash
npm install
pip install -r requirements.txt
```

## Run

```bash
npm start            # listens on :4001
PORT=8080 npm start
npm run dev          # restart on change
```

## API

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /api/extract`

`multipart/form-data` with a single `file` field containing a `.pptx` file
(max 10 MB).

```bash
curl -F "file=@deck.pptx" http://localhost:4001/api/extract
```

```json
{ "extractedText": "Quarterly Report\nRevenue grew 12%\n..." }
```

| Status | Meaning |
| ------ | ------- |
| 200 | Text extracted |
| 400 | Missing file, wrong extension, or not a real `.pptx` |
| 413 | File exceeds the size limit |
| 422 | The file is a valid archive but cannot be parsed as a presentation |
| 500 | Text extraction is unavailable on the server |

Each request is handled independently: uploads get a unique name, text is
returned over stdout, and the temporary file is deleted whether parsing
succeeds or fails.

## Configuration

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `PORT` | `4001` | HTTP port |
| `CORS_ORIGIN` | `*` | Comma-separated list of allowed origins |
| `PYTHON` | `python3` | Python interpreter used for extraction |
| `NODE_ENV` | — | `production` enables combined request logs |

## Test

```bash
npm test
```

The integration tests post real uploads to the Express app, so Python and
`python-pptx` must be installed. The fixture can be regenerated with
`python3 test/fixtures/make_fixture.py`.

## Docker

```bash
docker build -t ppttext-extractor .
docker run -p 4001:4001 ppttext-extractor
```

The image installs `python-pptx` at build time; the package is not installed at
startup.
