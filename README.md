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

## Personalize

Update the sample profile in `server/index.js` and replace the example email
address. Edit the initial project entries there; the sample projects are seeded
only when the SQLite projects table is empty.
