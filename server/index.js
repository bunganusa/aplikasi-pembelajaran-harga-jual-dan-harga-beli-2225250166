import dotenv from 'dotenv'
import express from 'express'
import chat from './chat.js'

dotenv.config({ override: true })

const app = express()
app.use(express.json({ limit: '20kb' }))
app.post('/api/chat', chat)

app.listen(3001, () => {
  console.log('API lokal berjalan di http://localhost:3001')
})
