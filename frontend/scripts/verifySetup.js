import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const apiConfigPath = path.resolve(__dirname, '../src/api/api.js')

if (!fs.existsSync(apiConfigPath)) {
  console.error('Preflight failed: src/api/api.js is missing.')
  process.exit(1)
}

const apiConfigFile = fs.readFileSync(apiConfigPath, 'utf8')
const hasApiBaseUrlExport =
  /export\s+const\s+API_BASE_URL\s*=/.test(apiConfigFile) &&
  apiConfigFile.includes('http')

if (!hasApiBaseUrlExport) {
  console.error('Preflight failed: src/api/api.js must export a valid API_BASE_URL.')
  process.exit(1)
}

console.log('Preflight passed: frontend will use the configured API_BASE_URL from src/api/api.js.')
