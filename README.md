<div align="center">

<img src="public/assets/logo_light.png" alt="Mix logo" width="200" />

# Concepta Website

**Concepta's product site and documentation for Mix and Ack.**

[concepta.dev](https://concepta.dev) · [Mix documentation](https://concepta.dev/documentation/mix/overview/introduction) · [Ack documentation](https://concepta.dev/documentation/ack/getting-started/overview)

</div>

---

This repository hosts the Concepta website and product documentation. It pairs a Next.js + Nextra frontend with a Flutter preview bundle so Mix widget examples in the docs are live, interactive Flutter apps compiled to WebAssembly.

## Tech stack

| Layer       | Stack                                                             |
| ----------- | ----------------------------------------------------------------- |
| Site and docs | Next.js 15, Nextra 4, React 19, Tailwind CSS 4, TypeScript      |
| Previews    | Flutter 3.44+, Dart 3.12+, [Mix](https://pub.dev/packages/mix) 2+ |
| Search      | Pagefind                                                          |
| Deployment  | Vercel + GitHub Actions                                           |

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) 10.29+
- [Flutter](https://flutter.dev) 3.44+ (managed via [FVM](https://fvm.app), version pinned in `.fvmrc`)

## Getting started

Install dependencies for both the website and the Flutter preview package:

```bash
pnpm install
(cd packages/mix_docs_preview && flutter pub get)
```

Build the Flutter preview bundle and copy it into `public/previews/`:

```bash
bash packages/mix_docs_preview/scripts/build_web_previews.sh
```

Start the Next.js dev server:

```bash
pnpm dev
```

Open <http://localhost:3000> to view the site.

> [!NOTE]
> The Flutter bundle only needs to be rebuilt when you change preview code in `packages/mix_docs_preview/`. Regular MDX and component edits are hot-reloaded by Next.js.

## Project structure

```
.
├── src/
│   ├── app/                    # Next.js app router
│   └── content/                # MDX documentation pages
├── components/                 # React components (FlutterPreview, etc.)
├── packages/
│   └── mix_docs_preview/       # Flutter app that renders the previews
│       ├── lib/                # Preview widgets, mirrors the docs layout
│       ├── scripts/            # build_web_previews.sh
│       └── tool/               # Manifest generator
├── public/previews/            # Built Flutter web bundle (generated)
├── scripts/
│   ├── vercel-build.sh         # Vercel build entrypoint
│   └── check-previews-manifest.mjs
└── .github/workflows/          # CI for validating previews
```

## How previews work

1. Each preview is a Dart widget under `packages/mix_docs_preview/lib/` organized to mirror the docs (`overview/`, `guides/`, `widgets/`, `tutorials/`, `ecosystem/`).
2. Widgets are registered in `lib/preview_registry.dart` with a doc-scoped `previewId` (e.g. `widgets/box.0`).
3. `build_web_previews.sh` compiles the Flutter app to WebAssembly, extracts source files, and generates `previews-manifest.json`.
4. In MDX, `<FlutterPreview previewId="widgets/box.0" />` loads the bundle and displays the widget alongside its source.

See [`packages/mix_docs_preview/README.md`](packages/mix_docs_preview/README.md) for details on adding a new preview.

## Scripts

| Command                  | What it does                                      |
| ------------------------ | ------------------------------------------------- |
| `pnpm dev`               | Run the Next.js dev server with Turbopack        |
| `pnpm build`             | Build the docs site for production               |
| `pnpm start`             | Serve the production build                        |
| `pnpm check:previews`    | Validate `previews-manifest.json` integrity       |

## Deployment

The site is deployed to Vercel. `scripts/vercel-build.sh` orchestrates the full build: it installs Flutter at the version pinned in `.fvmrc`, compiles the preview bundle to WASM, copies it into `public/previews/`, validates the manifest, and finally builds the Next.js app.

A matching GitHub Actions workflow (`.github/workflows/preview-docs.yml`) runs on pull requests to catch preview or manifest regressions before merge.

> [!IMPORTANT]
> Flutter web builds are CPU and memory intensive. Expect the preview build step to dominate CI time.

## Community

- [Discord](https://discord.gg/Ycn6GS2VQT)
- [Twitter](https://twitter.com/btwld)
- [pub.dev](https://pub.dev/packages/mix)
