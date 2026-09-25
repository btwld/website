import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { test } from 'node:test'

const root = resolve(import.meta.dirname, '..')
const contentRoot = join(root, 'src/content')
const ackContentRoot = join(contentRoot, 'documentation/ack')
const ackLanding = join(root, 'components/landing/ack/AckHome.tsx')

function walk(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry)
      return statSync(path).isDirectory() ? walk(path) : [path]
    })
    .filter((path) => ['.md', '.mdx'].includes(extname(path)))
}

function routeForContentFile(path) {
  const contentPath = relative(contentRoot, path).replaceAll('\\', '/').replace(/\.mdx?$/, '')
  const route = contentPath.replace(/(^|\/)index$/, '')
  return `/${route}`.replace(/\/$/, '') || '/'
}

function publicAssetExists(route) {
  try {
    return statSync(join(root, 'public', route)).isFile()
  } catch {
    return false
  }
}

test('wires Ack into the shared product shell', () => {
  const navbar = readFileSync(join(root, 'components/FloatingNavbar.tsx'), 'utf8')
  const layout = readFileSync(join(root, 'src/app/layout.jsx'), 'utf8')
  const docsMeta = readFileSync(join(root, 'src/content/documentation/_meta.js'), 'utf8')
  const rootMeta = readFileSync(join(root, 'src/content/_meta.js'), 'utf8')

  assert.match(navbar, /id: 'ack'/)
  assert.match(navbar, /ACK_DOCS_URL = '\/documentation\/ack\/getting-started\/overview'/)
  assert.match(layout, /p\.startsWith\('\/documentation\/ack'\)/)
  assert.match(docsMeta, /ack: 'Ack'/)
  assert.match(rootMeta, /ack:[\s\S]*?display: 'hidden'/)
  assert.ok(existsSync(join(root, 'src/app/ack/page.tsx')))
  assert.ok(existsSync(join(root, 'src/app/ack/icon.svg')))
  assert.ok(existsSync(join(root, 'public/assets/logo_ack_sidebar.svg')))
  assert.ok(existsSync(join(root, 'public/assets/ack-social.png')))
  assert.ok(existsSync(join(root, 'public/ack/llms.txt')))
})

test('migrates every Ack documentation page into its product namespace', () => {
  const pages = walk(ackContentRoot)

  assert.equal(pages.length, 18)
  for (const path of pages) {
    const source = readFileSync(path, 'utf8')
    assert.doesNotMatch(source, /\/documentation\/(?!ack\/)/)
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n\n# /)
    assert.ok(frontmatter, `${relative(root, path)} has valid frontmatter followed by an H1`)
    assert.match(frontmatter[1], /^title: [^\n]+$/m)
    assert.match(frontmatter[1], /^description: [^\n]+$/m)
  }
})

test('resolves every Ack documentation and landing-page link', () => {
  const allContentFiles = walk(contentRoot)
  const generatedRoutes = new Set(allContentFiles.map(routeForContentFile))
  generatedRoutes.add('/ack')
  generatedRoutes.add('/ack/llms.txt')

  const sources = [
    ...walk(ackContentRoot).map((path) => ({ path, sourceRoute: routeForContentFile(path) })),
    { path: ackLanding, sourceRoute: '/ack' },
  ]
  const failures = []

  for (const { path, sourceRoute } of sources) {
    const source = readFileSync(path, 'utf8')
    const hrefs = [
      ...[...source.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]),
      ...[...source.matchAll(/href=["']([^"']+)["']/g)].map((match) => match[1]),
    ]

    for (const href of hrefs) {
      if (/^(https?:|mailto:|#)/.test(href)) continue

      const withoutHash = href.split('#')[0].split('?')[0]
      if (!withoutHash) continue

      if (withoutHash.startsWith('/')) {
        const target = withoutHash.replace(/\/$/, '') || '/'
        if (!generatedRoutes.has(target) && !publicAssetExists(target)) {
          failures.push(`${relative(root, path)}: ${href} -> ${target}`)
        }
        continue
      }

      const target = resolve(dirname(path), withoutHash)
      if (!existsSync(target) && !existsSync(`${target}.md`) && !existsSync(`${target}.mdx`)) {
        failures.push(`${relative(root, path)} (${sourceRoute}): ${href}`)
      }
    }
  }

  assert.deepEqual(failures, [])
})

test('features codecs and two-way model generation on Ack entry pages', () => {
  const landing = readFileSync(ackLanding, 'utf8')
  const overview = readFileSync(
    join(ackContentRoot, 'getting-started/overview.mdx'),
    'utf8',
  )

  for (const source of [landing, overview]) {
    assert.match(source, /Codecs|CODECS/)
    assert.match(source, /Model code generation|MODEL GENERATION/)
    assert.match(source, /@AckInfer/)
    assert.match(source, /@AckModel/)
    assert.doesNotMatch(source, /@AckType|UserType/)
    assert.match(source, /\/documentation\/ack\/advanced\/codecs/)
    assert.match(source, /\/documentation\/ack\/advanced\/typesafe-schemas/)
  }
})

test('keeps Ack 1.2 setup and generated-part guidance current', () => {
  const installation = readFileSync(
    join(ackContentRoot, 'getting-started/installation.mdx'),
    'utf8',
  )
  const generation = readFileSync(
    join(ackContentRoot, 'advanced/typesafe-schemas.mdx'),
    'utf8',
  )
  const llms = readFileSync(join(root, 'public/ack/llms.txt'), 'utf8')
  const ackSurface = [
    readFileSync(ackLanding, 'utf8'),
    ...walk(ackContentRoot).map((path) => readFileSync(path, 'utf8')),
  ].join('\n')

  assert.match(installation, /ack: \^1\.2\.0/)
  assert.match(installation, /ack_annotations: \^1\.2\.0/)
  assert.match(installation, /ack_generator: \^1\.2\.0/)
  for (const source of [installation, generation, llms]) {
    assert.match(source, /part '[-_a-z]+\.ack\.dart';/)
    assert.match(source, /part '[-_a-z]+\.ack\.g\.dart';/)
    assert.match(source, /@AckInfer/)
    assert.match(source, /@AckModel/)
  }
  assert.doesNotMatch(ackSurface, /github\.com\/conceptadev\/ack/)
  assert.doesNotMatch(ackSurface, /@AckType|UserType/)
  assert.match(llms, /Rename `@AckType\(\)` to `@AckInfer\(\)`/)
})

test('showcases a User codec round trip across the Ack landing page', () => {
  const landing = readFileSync(ackLanding, 'utf8')

  assert.match(landing, /role="group" aria-label="Ack User codec round trip"/)
  assert.doesNotMatch(landing, /ack-roundtrip-panel/)
  assert.doesNotMatch(landing, /ack-proof-strip/)
  assert.match(landing, /className="tok-call">codec<\/span>&lt;<span className="tok-type">User/)
  assert.match(landing, /User\.fromMap/)
  assert.match(landing, /className="tok-call">datetime<\/span>\(\)/)
  assert.match(landing, /userCodec[\s\S]*?className="tok-call">parse<\/span>/)
  assert.match(landing, /userCodec[\s\S]*?className="tok-call">encode<\/span>/)
  assert.match(landing, /01 \/ DEFINE/)
  assert.match(landing, /02 \/ VALIDATE \+ DECODE/)
  assert.match(landing, /03 \/ ENCODE/)
  assert.match(landing, /className="ack-workflow-list"/)
  assert.doesNotMatch(landing, /ack-boundary-trace/)
  assert.doesNotMatch(landing, /ack-example-meta/)
  assert.match(landing, /aria-label="Ack built-in and custom codec catalogue"/)
  assert.match(landing, /<dl className="ack-codec-catalogue"/)
  assert.match(landing, /Ack\.codec\(\.\.\.\)/)
  assert.match(landing, /\/documentation\/ack\/advanced\/codecs/)
})
