# Password Manager (Demo)

A small client-side Password Manager demo built with plain HTML, CSS, and JavaScript.

## Summary

This project demonstrates a simple single-page password manager UI that stores password entries in the browser's `localStorage` for demo and learning purposes. It includes a basic password generator and a custom modal popup for confirmations and editing.

Important: This project is for learning/demo use only. It is not secure for storing real, sensitive passwords in production.

## Features

- Add website, username, and password entries.
- List saved entries with show/hide, copy, edit, and delete actions.
- Password generator with options for length, lowercase, uppercase, numbers, and symbols.
- Custom popup modal used for messages and editing.

## Quick start

No build tools are required. Open the project in a modern browser.

Option 1 — Open file directly:

- Double-click `index.html` in the project folder or open it in your browser.

Option 2 — Serve with a local HTTP server (recommended for clipboard and some APIs):

In PowerShell (Windows):

```powershell
# From the project folder containing index.html
python -m http.server 8000
# Then open http://localhost:8000/ in your browser
```

Or with Node.js installed:

```powershell
npx http-server -p 8000
```

## Files

- `index.html` — main HTML page. Contains the DOM structure for the password list, form controls, generator panel, and the custom popup markup.
- `script.js` — main JavaScript file. Handles data persistence (localStorage), rendering the list, interactions (add/edit/delete/copy/toggle), the custom popup implementation, and password generation logic.
- `styles.css` — project stylesheet. Handles layout, generator styling, popup styling, and responsive rules.

## Data format

Passwords are saved in `localStorage` under the key `passwords` as a JSON-encoded array. Example item:

```json
{ "website": "example.com", "username": "alice", "password": "s3cr3t" }
```

## Security note (READ BEFORE USING)

- This demo stores passwords in plaintext in the browser's `localStorage`. This is insecure for real credentials.
- Do NOT use this approach for real secrets in production apps.
- If you want to evolve this project for real use, consider:
  - Encrypting entries before storing them client-side (with a user-provided master password that is not stored in plaintext).
  - Moving storage to a secure backend with proper authentication and encryption.
  - Using browser-provided secure storage APIs or dedicated password manager backends.

## Development tips

- If you rename any element IDs in `index.html` (for example `#website`, `#add-btn`, `#password-list`, `#generate-btn`), update the selectors in `script.js` accordingly.
- The project currently uses inline `onclick` attributes for action icons; consider refactoring to event delegation for cleaner separation of concerns.
- Extract repeating color values to CSS variables at the top of `styles.css` (for example `--primary`, `--success`, `--danger`) to make theming easier.
- Add ARIA attributes and proper `<label>` elements for better accessibility.

## Possible improvements

- Replace localStorage with encrypted storage or a backend API.
- Add search and filtering for saved passwords.
- Add categories/tags and import/export functionality (e.g., encrypted JSON export).
- Add tests (unit tests for generator and storage helpers).

## License

This project is provided as-is for learning and demonstration purposes.

---

If you'd like, I can also:

- Add a short `CONTRIBUTING.md` or sample tests.
- Implement CSS variables and small refactor to use event delegation in `script.js`.

Tell me which of those you'd like and I'll implement it.
