import express from 'express';
import cors from 'cors';
import { IProject } from './models/project.interface';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 3000;
// List of projects
const projects: IProject[] = [];

// Setup cors and express.json()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

app.post('/projects', (req, res) => {
  const { project } = req.body as { project: Omit<IProject,'id'> };
  const newProject: IProject = {
    id: uuid(),
    name: project.name,
    description: project.description
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.get('/projects', (_req, res) => {
  res.status(200).json(projects);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
