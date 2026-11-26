import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const databaseDirectory = path.join(currentDirectory, 'data');
fs.mkdirSync(databaseDirectory, { recursive: true });

const database = new DatabaseSync(path.join(databaseDirectory, 'portfolio.db'));
database.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    number TEXT NOT NULL,
    url TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const projectCount = database.prepare('SELECT COUNT(*) AS count FROM projects').get();
if (projectCount.count === 0) {
  const addProject = database.prepare(
    'INSERT INTO projects (title, category, description, number, url) VALUES (?, ?, ?, ?, ?)',
  );
  addProject.run(
    'Portfolio / 2025',
    'DESIGN & DEVELOPMENT',
    'A bold, personal space to bring my work, process and ideas together.',
    '01',
    null,
  );
  addProject.run(
    'Campus Connect',
    'FULL-STACK WEB APP',
    'A student-first platform for sharing campus events and useful resources.',
    '02',
    null,
  );
  addProject.run(
    'Taskflow',
    'PRODUCTIVITY TOOL',
    'A clean task manager designed to make everyday planning feel effortless.',
    '03',
    null,
  );
}

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: '20kb' }));

app.get('/api/profile', (_request, response) => {
  response.json({
    name: 'Kumar Shubham',
    greeting: 'Hello, I’m',
    role: 'Full-Stack Developer',
    education: 'CSE Student · Problem Solver',
    bio: 'I build modern, responsive and user-focused web applications with clean code and a great user experience. Passionate about DSA, full-stack development and AI.',
    email: 'hello@shubham.dev',
    availability: 'Available for hire',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Express', 'SQLite'],
  });
});

app.get('/api/projects', (_request, response) => {
  const projects = database
    .prepare('SELECT id, title, category, description, number, url FROM projects ORDER BY id')
    .all();
  response.json(projects);
});

app.post('/api/contact', (request, response) => {
  const { name, email, message } = request.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !message.trim()
  ) {
    response.status(400).json({ error: 'Please enter a name, valid email and message.' });
    return;
  }

  if (name.trim().length > 100 || email.trim().length > 254 || message.trim().length > 2000) {
    response.status(400).json({ error: 'Your message is longer than the allowed limit.' });
    return;
  }

  const result = database
    .prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)')
    .run(name.trim(), email.trim(), message.trim());
  response.status(201).json({ id: Number(result.lastInsertRowid), message: 'Message received.' });
});

app.use(express.static(path.join(projectRoot, 'dist')));
app.get(/.*/, (_request, response, next) => {
  const indexFile = path.join(projectRoot, 'dist', 'index.html');
  if (fs.existsSync(indexFile)) {
    response.sendFile(indexFile);
    return;
  }
  next();
});

app.listen(port, () => {
  console.log(`Portfolio API running at http://localhost:${port}`);
});
