import express from 'express'
import cors from 'cors'
import { IProject } from './models/project.interface'
import { v4 as uuid } from 'uuid'
import { createServer } from 'http'
import * as WebSocket from 'ws'

const app = express()
const PORT = 3000
// In-memory storage for projects and chat messages
const projects: IProject[] = []
const chatHistory: string[] = []

// Allow cross-origin requests and JSON bodies
app.use(cors({ origin: '*', methods: ['GET','POST'], credentials: true }))
app.use(express.json())

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!')
})

// Create a new project
app.post('/projects', (req, res) => {
  const { project } = req.body as { project: Omit<IProject,'id'> }
  const newProject: IProject = {
    id: uuid(),
    name: project.name,
    description: project.description
  }
  projects.push(newProject)
  res.status(201).json(newProject)
})

// Retrieve all projects
app.get('/projects', (_req, res) => {
  res.status(200).json(projects)
})

// Create HTTP server and attach WebSocket server on /chat
const server = createServer(app)
const wss = new WebSocket.Server({ server, path: '/chat' })

wss.on('connection', (ws: WebSocket) => {
  // Send existing chat history to the new client
  chatHistory.forEach(msg => ws.send(msg))

  // On incoming message, store and broadcast
  ws.on('message', (data: WebSocket.Data) => {
    const message = data.toString()
    chatHistory.push(message)
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })
})

// Start listening
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
