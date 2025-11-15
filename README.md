# MovieVerse — Movie Viewer

MovieVerse is a lightweight, dark-themed web application for discovering movies and TV shows using The Movie Database (TMDB) API. It provides browsing by category (Popular / Top Rated), searching for movies or series, user authentication (client-side using localStorage), and rich movie detail modals including trailers.

This repository contains the front-end source (HTML, CSS, and JavaScript) for the app and static assets. It's a static site that can be served from any static file host or local web server.

## Live / Demo

- Open `index.html` in a browser (see notes below about running via a local server).

## Key features

- Browse movie categories (Popular, Top Rated) fetched from TMDB.
- Search for Movies or TV Series (selectable via the dropdown in the header).
- Responsive movie grid with poster, title, release year and vote rating.
- Movie detail modal with overview, genres, runtime, release date and embedded YouTube trailer (when available).
- Simple signup/login stored in browser `localStorage` (this is intentionally client-side for demo purposes).
- Uses Bootstrap 5 for layout and components and Bootstrap Icons for UI icons.

## Project structure

- `index.html` — main application UI and entry point.
- `auth.html` — simple authentication page (sign up / sign in) used before accessing the main app.
- `script.js` — application logic including TMDB API calls, UI rendering, search, category switching and modal handling.
- `auth.js` — client-side auth implementation using `localStorage` (users, currentUser).
- `style.css` — custom styles and small responsive tweaks.
- `assets/` — images, placeholders and favicon used by the app.

## How it works (technical contract)

- Inputs: user actions in the browser (search, category buttons, login/register form, clicking a movie card).
- Outputs: HTTP requests to TMDB (read-only using a bearer token), UI updates to display lists and modal details.
- Error modes: network errors, empty search results, missing poster/backdrop images fall back to placeholders.
- Success criteria: app loads, shows lists from TMDB, search returns results, details modal opens with information or fallback content.

## Important implementation notes

- The app uses a TMDB authorization bearer token embedded in `script.js` (the token is present here for the demo). For production or if you publish this repository, replace the token with your own TMDB v4 token and avoid committing secrets to source control.
- Authentication is purely client-side and stored in `localStorage`. Do not use this method for real applications where security is required.

## Setup & running locally

You can run the app in one of two ways:

1) Open directly (quickest but some browsers block fetches when using the file:// protocol):
	- Double-click `index.html` (or `auth.html`) to open in your browser. If API fetch requests fail due to CORS or file:// restrictions, use a local server as below.

2) Start a local static server (recommended):

Using Python 3 (works in Bash on Windows):

```bash
# from the project root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or using Node.js `http-server` (if you have it installed):

```bash
npx http-server -c-1 . 8080
# then open http://localhost:8080
```

## Authentication flow

- Sign up creates a user object in `localStorage` under the `users` key.
- Sign in checks the stored users and sets `currentUser` in `localStorage`.
- When a user is not signed in, visiting `index.html` will redirect to `auth.html`.
- Logout removes `currentUser` and redirects back to `auth.html`.

Files involved: `auth.html`, `auth.js`, `script.js` (checks `currentUser`).

## TMDB API & tokens

- The app uses TMDB's API (v3 endpoints) and a Bearer token in `script.js` to authenticate requests. The token in the repository is used for demo purposes.
- To use your own token, edit `script.js` and replace the `API_KEY` value with your TMDB v4 read-only token.
- For a production setup, move the token to a server-side component or environment variables and proxy requests through a small API to avoid exposing the token.

API endpoints used (examples):

- /movie/popular and /movie/top_rated (or /tv endpoints depending on search param)
- /search/movie or /search/tv
- /movie/{id}/videos (for trailers)

## UI / UX notes

- The search dropdown toggles between `movie` and `tv` search and updates the placeholder text.
- Movie cards include a rating badge and hover animation (see `style.css`).
- Detail modal will embed a YouTube trailer when TMDB provides one; otherwise the backdrop image or a placeholder is shown.

## Troubleshooting

- Blank screen or immediate redirect to `auth.html`: make sure `currentUser` is set by signing up or signing in on `auth.html`.
- API errors or CORS failures: confirm you're running the app from a server (see above) and that your token is valid.
- Missing images: the app falls back to placeholders in `assets/` when `poster_path` or `backdrop_path` is missing.

## Extending / Next steps

- Move TMDB requests to a server-side proxy to hide API tokens.
- Replace client-side auth with a real backend authentication flow.
- Add pagination and infinite scrolling for large result sets.
- Add unit tests for critical JS functions and end-to-end (E2E) tests for flows like login and searching.

## Contributing

Contributions are welcome. For small changes (docs, bug fixes), open a PR against `main`. For larger features, please open an issue to discuss before implementing.

## License

This project is provided as-is for demo/learning purposes. Add a license of your choice if you plan to publish or reuse the code publicly (MIT, Apache-2.0, etc.).

---
Last updated: 2025-11-16

