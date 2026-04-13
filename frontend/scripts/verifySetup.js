import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env')
const expectedApiBaseUrl = 'VITE_API_BASE_URL=/api'

if (!fs.existsSync(envPath)) {
  console.error('Preflight failed: frontend/.env is missing.')
  process.exit(1)
}

const envFile = fs.readFileSync(envPath, 'utf8')

if (!envFile.split(/\r?\n/).some((line) => line.trim() === expectedApiBaseUrl)) {
  console.error('Preflight failed: VITE_API_BASE_URL must be /api in frontend/.env.')
  process.exit(1)
}

console.log('Preflight passed: frontend will use the local /api proxy.')
