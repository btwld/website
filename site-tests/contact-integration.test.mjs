import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { test } from 'node:test'

const root = resolve(import.meta.dirname, '..')

test('wires the Contact page into the Concepta site shell', () => {
  const navbar = readFileSync(join(root, 'components/FloatingNavbar.tsx'), 'utf8')
  const layout = readFileSync(join(root, 'src/app/layout.jsx'), 'utf8')

  assert.ok(existsSync(join(root, 'src/app/contact/page.tsx')))
  assert.match(navbar, /href="\/contact"/)
  assert.match(navbar, /pathname === '\/contact'\) return 'concepta'/)
  assert.match(layout, /p==='\/contact'/)
})

test('posts the contact form to Resend and forwards it to the team', () => {
  const page = readFileSync(join(root, 'components/contact/ContactPage.tsx'), 'utf8')
  const route = readFileSync(join(root, 'src/app/api/contact/route.ts'), 'utf8')

  assert.match(page, /fetch\("\/api\/contact"/)
  assert.match(page, /CONCEPTA_PHONE_DISPLAY/)
  assert.match(page, /CONCEPTA_ADDRESS_DISPLAY/)
  assert.match(route, /getResend\(\)/)
  assert.match(route, /guilherme\.rosa\.c@conceptatech\.com/)
  assert.match(route, /thomas@conceptatech\.com/)
  assert.match(route, /replyTo: input\.email/)
})
