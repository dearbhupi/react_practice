import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const linksFile = resolve(appRoot, '../data/user-links.json')
const port = Number(process.env.API_PORT ?? 8787)
const maxRequestBytes = 4096

async function ensureLinksFile() {
  await mkdir(dirname(linksFile), { recursive: true })
  try {
    await readFile(linksFile, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    await writeFile(linksFile, '[]\n', { flag: 'wx' })
  }
}

async function readLinks() {
  return JSON.parse(await readFile(linksFile, 'utf8'))
}

let writeQueue = Promise.resolve()

function saveLink(url) {
  const operation = writeQueue.then(async () => {
    const links = await readLinks()
    const existing = links.find((link) => link.url === url)
    if (existing) return existing

    const link = { id: randomUUID(), url, addedAt: new Date().toISOString() }
    const temporaryFile = `${linksFile}.${randomUUID()}.tmp`
    await writeFile(temporaryFile, `${JSON.stringify([...links, link], null, 2)}\n`, { flag: 'wx' })
    await rename(temporaryFile, linksFile)
    return link
  })
  writeQueue = operation.then(() => undefined, () => undefined)
  return operation
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

async function readRequestBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxRequestBytes) throw new Error('Request body is too large.')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = createServer(async (request, response) => {
  if (request.url === '/api/links' && request.method === 'GET') {
    try {
      sendJson(response, 200, await readLinks())
    } catch (error) {
      console.error('Could not read saved links:', error)
      sendJson(response, 500, { error: 'Saved links could not be read.' })
    }
    return
  }

  if (request.url === '/api/links' && request.method === 'POST') {
    try {
      const body = await readRequestBody(request)
      if (!body || typeof body !== 'object' || Array.isArray(body)
        || typeof body.url !== 'string' || body.url.length > 2048) {
        sendJson(response, 400, { error: 'Provide a valid HTTP or HTTPS link.' })
        return
      }

      let parsedUrl
      try {
        parsedUrl = new URL(body.url)
      } catch {
        sendJson(response, 400, { error: 'Provide a valid HTTP or HTTPS link.' })
        return
      }
      if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname
        || parsedUrl.username || parsedUrl.password) {
        sendJson(response, 400, { error: 'Only public HTTP or HTTPS links can be saved.' })
        return
      }

      sendJson(response, 200, { link: await saveLink(parsedUrl.href) })
    } catch (error) {
      const isMalformedJson = error instanceof SyntaxError
      if (isMalformedJson || error.message === 'Request body is too large.') {
        sendJson(response, 400, { error: isMalformedJson ? 'The request was not valid JSON.' : error.message })
        return
      }
      console.error('Could not save link:', error)
      sendJson(response, 500, { error: 'The link could not be saved.' })
    }
    return
  }

  sendJson(response, 404, { error: 'API route not found.' })
})

await ensureLinksFile()
server.listen(port, '127.0.0.1', () => {
  console.log(`Saved-link API listening at http://127.0.0.1:${port}`)
})
