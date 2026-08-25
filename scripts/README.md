# Local Practice Draft Authoring

The production site uses only the reviewed static question banks under `src/content/practice/`. Gemini is optional and is never called by the browser.

To generate a local draft for one of the initial lessons:

```bash
GEMINI_API_KEY="your-local-key" npm run practice:draft -- 020
```

On Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="your-local-key"
npm run practice:draft -- 020
```

The script reads `GEMINI_API_KEY` only from the current process environment, writes a validated draft to `tmp/practice-drafts/`, and never edits committed content automatically. Review the draft, verify every Python output, then manually transfer approved questions into the matching file under `src/content/practice/`.

Never put the key in source code, `.env` files committed to Git, Vite client variables, URLs shared with others, or issue/PR text. The normal site build and test suite do not require a Gemini key or a network connection.
