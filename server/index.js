import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import profileRoutes from './routes/profile.js'
import habitsRoutes  from './routes/habits.js'
import logsRoutes    from './routes/logs.js'
import streakRoutes  from './routes/streak.js'
import adminRoutes   from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middlewares globaux ──
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ──
app.use('/api/profile', profileRoutes)
app.use('/api/habits',  habitsRoutes)
app.use('/api/logs',    logsRoutes)
app.use('/api/streak',  streakRoutes)
app.use('/api/admin',   adminRoutes)

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

// ── 404 ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable' })
})

app.listen(PORT, () => {
  console.log(`✅ Willpower OS API — http://localhost:${PORT}`)
  console.log(`   Routes :`)
  console.log(`   GET  /api/health`)
  console.log(`   GET/PUT  /api/profile`)
  console.log(`   GET/POST/DEL  /api/habits`)
  console.log(`   GET/PUT  /api/logs/today`)
  console.log(`   GET  /api/streak`)
  console.log(`   [ADMIN] GET  /api/admin/users`)
  console.log(`   [ADMIN] PUT  /api/admin/users/:id/role`)
})
