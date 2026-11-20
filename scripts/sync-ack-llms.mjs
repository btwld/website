#!/usr/bin/env node
// Mirrors btwld/ack's root llms.txt into public/ack/llms.txt so
// https://concepta.dev/ack/llms.txt always matches the Ack repository.
//
// The repository file links to repo-relative paths (README.md, docs/...mdx).
// Served from concepta.dev those would 404, so they are rewritten to absolute
// GitHub URLs pinned to the same ref.
//
// Env:
//   ACK_LLMS_REF     git ref to mirror (default: main)
//   ACK_LLMS_STRICT  "1" to fail the build when the fetch fails (default: keep
//                    the committed copy and warn)
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ref = process.env.ACK_LLMS_REF || 'main'
const strict = process.env.ACK_LLMS_STRICT === '1'
const root = fileURLToPath(new URL('..', import.meta.url))
const target = join(root, 'public/ack/llms.txt')
const source = `https://raw.githubusercontent.com/btwld/ack/${ref}/llms.txt`
const blobBase = `https://github.com/btwld/ack/blob/${ref}/`

export function rewriteLinks(text, base = blobBase) {
  // Markdown links whose target is not absolute, an anchor, or mailto.
  return text.replace(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g, (_, path) => {
    return `](${new URL(path.replace(/^\.\//, ''), base).href})`
  })
}

export async function fetchAckLlms() {
  const res = await fetch(source, { signal: AbortSignal.timeout(15_000) })
  if (!res.ok) throw new Error(`${source} -> HTTP ${res.status}`)
  const body = await res.text()
  if (!body.trim().startsWith('# Ack')) throw new Error(`${source} does not look like the Ack llms.txt`)
  return rewriteLinks(body)
}

async function main() {
  let body
  try {
    body = await fetchAckLlms()
  } catch (error) {
    if (strict) throw error
    console.warn(`WARN: could not refresh Ack llms.txt (${error.message}); keeping committed copy.`)
    readFileSync(target, 'utf8')
    return
  }
  writeFileSync(target, body)
  console.log(`Synced ${source} -> public/ack/llms.txt`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
