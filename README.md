# Kumar Shubham — Portfolio

A small portfolio built with React, CSS, Express and SQLite.

## Run locally

1. Install Node.js 22.13 or newer.
2. Install dependencies with `npm install`.
3. Start the frontend and API with `npm run dev`.
4. Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

The Express API uses SQLite to seed the sample projects and save contact form
messages in `server/data/portfolio.db`. The database is created automatically.
For a production build, run `npm run build` and then `npm start`; Express serves
the built site and API on port 3001.

## Deploy on GitHub Pages

Pushing to `main` runs the GitHub Actions workflow and publishes the static
portfolio. The live site uses local profile/project data; GitHub Pages cannot run
the Express API or SQLite database, so its contact section links to GitHub.
Enable **Settings > Pages > Build and deployment > Source > GitHub Actions**
if Pages is not enabled for the repository yet. After changing the Pages
source, push a commit to `main` or run the workflow manually from **Actions** to
publish the latest build.

## Personalize

Update the profile and project entries in `src/data/portfolio.js`. The Express
API uses the same data and seeds projects into SQLite when its table is empty.
