'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'nextra/components'
import {
    ChevronDown,
    Github,
    Menu,
    Search as SearchIcon,
    Twitter,
    X,
} from 'lucide-react'
import clsx from 'clsx'
import {
    ACK_GITHUB_URL,
    CONCEPTA_GITHUB_URL,
    MIX_GITHUB_URL,
    NAKED_UI_GITHUB_URL,
    REMIX_GITHUB_URL,
    ROCKETS_GITHUB_URL,
} from './constants'

function DiscordIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
    )
}

type ProductId = 'concepta' | 'mix' | 'remix' | 'naked-ui' | 'ack' | 'rockets' | 'stargate' | 'code-analysis' | 'voyager'

function getActiveProduct(pathname: string | null): ProductId {
    if (!pathname) return 'concepta'
    if (pathname === '/') return 'concepta'
    if (pathname === '/reports' || pathname.startsWith('/reports/')) return 'concepta'
    if (pathname === '/contact') return 'concepta'
    if (pathname === '/fluttercon2026' || pathname.startsWith('/fluttercon2026/')) return 'concepta'
    if (pathname.startsWith('/documentation/remix')) return 'remix'
    if (pathname === '/remix' || pathname.startsWith('/remix/')) return 'remix'
    if (pathname === '/naked-ui' || pathname.startsWith('/naked-ui/')) return 'naked-ui'
    if (pathname.startsWith('/documentation/ack')) return 'ack'
    if (pathname === '/ack' || pathname.startsWith('/ack/')) return 'ack'
    if (pathname === '/rockets' || pathname.startsWith('/rockets/')) return 'rockets'
    if (pathname === '/stargate' || pathname.startsWith('/stargate/')) return 'stargate'
    if (pathname === '/code-analysis' || pathname.startsWith('/code-analysis/')) return 'code-analysis'
    if (pathname === '/voyager' || pathname.startsWith('/voyager/')) return 'voyager'
    return 'mix'
}

const PILL =
    'rounded-full bg-[color:var(--mix-surface)]/70 backdrop-blur-md border border-[color:var(--mix-border-card)] shadow-[0_8px_24px_rgba(0,0,0,0.25)]'

const MENU_PANEL =
    'rounded-xl bg-[color:var(--mix-surface-bright)]/95 backdrop-blur-md border border-[color:var(--mix-border-card)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]'

const VERSION_ITEMS = [
    { label: 'Mix v2', href: '/mix' },
    { label: 'Mix v1', href: 'https://mix-docs-gosljkd74-fluttertools.vercel.app/' },
]

const TWITTER_URL = 'https://twitter.com/leoafarias'
const DISCORD_URL = 'https://discord.com/invite/Ycn6GV3m2k'
const MIX_DOCS_URL = '/documentation/mix/overview/introduction'
const REMIX_DOCS_URL = '/documentation/remix'
const NAKED_UI_DOCS_URL = 'https://docs.page/btwld/naked_ui'
const ACK_DOCS_URL = '/documentation/ack/getting-started/overview'
const ROCKETS_DOCS_URL = 'https://github.com/btwld/rockets#readme'

// Stargate and Code Analysis have no public docs or repos yet.
function getDocsHref(product: ProductId): string | null {
    if (product === 'mix') return MIX_DOCS_URL
    if (product === 'remix') return REMIX_DOCS_URL
    if (product === 'naked-ui') return NAKED_UI_DOCS_URL
    if (product === 'ack') return ACK_DOCS_URL
    if (product === 'rockets') return ROCKETS_DOCS_URL
    return null
}

function getGithubHref(product: ProductId): string | null {
    if (product === 'concepta') return CONCEPTA_GITHUB_URL
    if (product === 'mix') return MIX_GITHUB_URL
    if (product === 'remix') return REMIX_GITHUB_URL
    if (product === 'naked-ui') return NAKED_UI_GITHUB_URL
    if (product === 'ack') return ACK_GITHUB_URL
    if (product === 'rockets') return ROCKETS_GITHUB_URL
    return null
}

// Mix versioning does not apply to the standalone product landing pages.
function hasVersionMenu(product: ProductId) {
    return product === 'mix' || product === 'remix'
}

type Product = {
    id: ProductId
    label: string
    href: string
    logo: string
    /** Set for square glyph logos that need the text label rendered beside them. */
    showLabel?: boolean
}

// The Concepta home is not a product: it's reachable via the outline glyph
// at the left edge of the pill, not through the product switcher.
const PRODUCTS: Product[] = [
    {
        id: 'mix' as const,
        label: 'Mix',
        href: '/mix',
        logo: '/assets/logo_mix_sidebar.png',
    },
    {
        id: 'remix' as const,
        label: 'Remix',
        href: '/remix',
        logo: '/assets/logo_remix_sidebar.png',
    },
    {
        id: 'naked-ui' as const,
        label: 'Naked UI',
        href: '/naked-ui',
        logo: '/assets/logo_naked_ui_sidebar.svg',
        showLabel: true,
    },
    {
        id: 'ack' as const,
        label: 'Ack',
        href: '/ack',
        logo: '/assets/logo_ack_sidebar.svg',
        showLabel: true,
    },
    {
        id: 'rockets' as const,
        label: 'Rockets',
        href: '/rockets',
        logo: '/assets/logo_rockets_mark.svg',
        showLabel: true,
    },
    {
        id: 'stargate' as const,
        label: 'Stargate',
        href: '/stargate',
        // Mark-only glyph (no background plate) so the menu's white-silhouette
        // filter renders the shape, not a solid square.
        logo: '/assets/logo_stargate_mark.svg',
        showLabel: true,
    },
    {
        id: 'code-analysis' as const,
        label: 'Code Analysis',
        href: '/code-analysis',
        logo: '/assets/logo_code_analysis_mark.svg',
        showLabel: true,
    },
]

// Voyager is intentionally available only by direct URL while its positioning
// is being tested. It needs a real shell identity without appearing in either
// desktop or mobile product menus.
const VOYAGER_PRODUCT: Product = {
    id: 'voyager',
    label: 'Voyager',
    href: '/voyager',
    logo: '/assets/logo_voyager_mark.svg',
    showLabel: true,
}

function getProductMeta(id: ProductId) {
    if (id === 'voyager') return VOYAGER_PRODUCT
    return PRODUCTS.find((product) => product.id === id)
}

type DocsEntry =
    | { label: string; href: string }
    | { label: string; pages: { label: string; href: string }[] }

const DOCS_SECTIONS: Partial<Record<ProductId, DocsEntry[]>> = {
    mix: [
        {
            label: 'Overview',
            pages: [
                { label: 'Introduction', href: '/documentation/mix/overview/introduction' },
                { label: 'Getting started', href: '/documentation/mix/overview/getting-started' },
                { label: 'Utility-First', href: '/documentation/mix/overview/utility-first' },
                { label: 'Comparative Overview', href: '/documentation/mix/overview/comparison' },
                { label: 'Migration', href: '/documentation/mix/overview/migration' },
            ],
        },
        {
            label: 'Guides',
            pages: [
                { label: 'Styling', href: '/documentation/mix/guides/styling' },
                { label: 'Design Tokens', href: '/documentation/mix/guides/design-token' },
                { label: 'Dynamic Styling', href: '/documentation/mix/guides/dynamic-styling' },
                { label: 'Widget Modifiers', href: '/documentation/mix/guides/widget-modifiers' },
                { label: 'Animations', href: '/documentation/mix/guides/animations' },
                { label: 'Directives', href: '/documentation/mix/guides/directives' },
                { label: 'Common Patterns', href: '/documentation/mix/guides/common-patterns' },
            ],
        },
        {
            label: 'Widgets',
            pages: [
                { label: 'StyleWidgets', href: '/documentation/mix/widgets/stylewidgets' },
                { label: 'Box', href: '/documentation/mix/widgets/box' },
                { label: 'FlexBox', href: '/documentation/mix/widgets/flexbox' },
                { label: 'Text', href: '/documentation/mix/widgets/text' },
                { label: 'Icon', href: '/documentation/mix/widgets/icon' },
                { label: 'Image', href: '/documentation/mix/widgets/image' },
                { label: 'Pressable', href: '/documentation/mix/widgets/pressable' },
                { label: 'Stack', href: '/documentation/mix/widgets/stack' },
            ],
        },
        {
            label: 'Tutorials',
            pages: [
                { label: 'Creating a Widget', href: '/documentation/mix/tutorials/creating-a-widget' },
                { label: 'Advanced Widget State Control', href: '/documentation/mix/tutorials/controlling-widget-state' },
                { label: 'Theming', href: '/documentation/mix/tutorials/theming' },
                { label: 'Creating Context Variants', href: '/documentation/mix/tutorials/creating-context-variants' },
                { label: 'Creating Custom Tokens', href: '/documentation/mix/tutorials/creating-custom-tokens' },
            ],
        },
        {
            label: 'Ecosystem',
            pages: [
                { label: 'mix_winds', href: '/documentation/mix/ecosystem/mix-winds' },
                { label: 'mix_schema', href: '/documentation/mix/ecosystem/mix-schema' },
                { label: 'mix_lint', href: '/documentation/mix/ecosystem/mix-lint' },
                { label: 'mix_generator', href: '/documentation/mix/ecosystem/mix-generator' },
            ],
        },
    ],
    remix: [
        { label: 'Getting Started', href: '/documentation/remix' },
        { label: 'Styler API', href: '/documentation/remix/styler-api' },
        { label: 'Fortal', href: '/documentation/remix/fortal' },
        {
            label: 'Components',
            pages: [
                { label: 'Accordion', href: '/documentation/remix/components/accordion' },
                { label: 'Avatar', href: '/documentation/remix/components/avatar' },
                { label: 'Badge', href: '/documentation/remix/components/badge' },
                { label: 'Button', href: '/documentation/remix/components/button' },
                { label: 'Callout', href: '/documentation/remix/components/callout' },
                { label: 'Card', href: '/documentation/remix/components/card' },
                { label: 'Checkbox', href: '/documentation/remix/components/checkbox' },
                { label: 'Dialog', href: '/documentation/remix/components/dialog' },
                { label: 'Divider', href: '/documentation/remix/components/divider' },
                { label: 'IconButton', href: '/documentation/remix/components/icon_button' },
                { label: 'Menu', href: '/documentation/remix/components/menu' },
                { label: 'Popover', href: '/documentation/remix/components/popover' },
                { label: 'Progress', href: '/documentation/remix/components/progress' },
                { label: 'Radio', href: '/documentation/remix/components/radio' },
                { label: 'Select', href: '/documentation/remix/components/select' },
                { label: 'Slider', href: '/documentation/remix/components/slider' },
                { label: 'Spinner', href: '/documentation/remix/components/spinner' },
                { label: 'Switch', href: '/documentation/remix/components/switch' },
                { label: 'Tabs', href: '/documentation/remix/components/tabs' },
                { label: 'TextField', href: '/documentation/remix/components/textfield' },
                { label: 'Toggle', href: '/documentation/remix/components/toggle' },
                { label: 'Toggle Group', href: '/documentation/remix/components/toggle_group' },
                { label: 'Tooltip', href: '/documentation/remix/components/tooltip' },
            ],
        },
    ],
    ack: [
        {
            label: 'Getting Started',
            pages: [
                { label: 'Overview', href: '/documentation/ack/getting-started/overview' },
                { label: 'Installation', href: '/documentation/ack/getting-started/installation' },
                { label: 'Quickstart Tutorial', href: '/documentation/ack/getting-started/quickstart-tutorial' },
            ],
        },
        {
            label: 'Essentials',
            pages: [
                { label: 'Schema Types', href: '/documentation/ack/essentials/schemas' },
                { label: 'Validation Rules', href: '/documentation/ack/essentials/validation' },
                { label: 'Error Handling', href: '/documentation/ack/essentials/error-handling' },
                { label: 'JSON Serialization', href: '/documentation/ack/essentials/json-serialization' },
            ],
        },
        {
            label: 'How-To Guides',
            pages: [
                { label: 'Flutter Form Validation', href: '/documentation/ack/how-to-guides/flutter-form-validation' },
                { label: 'Common Recipes', href: '/documentation/ack/how-to-guides/common-recipes' },
                { label: 'Custom Validation', href: '/documentation/ack/how-to-guides/custom-validation' },
            ],
        },
        {
            label: 'Advanced',
            pages: [
                { label: 'Codecs', href: '/documentation/ack/advanced/codecs' },
                { label: 'Model Code Generation', href: '/documentation/ack/advanced/typesafe-schemas' },
                { label: 'JSON Schema Integration', href: '/documentation/ack/advanced/json-schema-integration' },
                { label: 'Configuration', href: '/documentation/ack/advanced/configuration' },
                { label: 'Adapter Package Quickstart', href: '/documentation/ack/advanced/schema-converter-quickstart' },
                { label: 'Creating Adapter Packages', href: '/documentation/ack/advanced/creating-schema-converter-packages' },
            ],
        },
        {
            label: 'Reference',
            pages: [
                { label: 'API Reference', href: '/documentation/ack/reference/api-reference' },
                { label: 'AI & llms.txt', href: '/documentation/ack/reference/llms-txt' },
            ],
        },
    ],
}

function VersionMenu() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/80 hover:text-white"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                Version
                <ChevronDown className="h-3 w-3" />
            </button>
            {open && (
                <div
                    className={clsx(
                        'absolute top-full mt-3 right-0 min-w-[10rem] p-1',
                        MENU_PANEL,
                    )}
                    role="menu"
                >
                    {VERSION_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-1.5 text-sm rounded-md text-white/80 hover:text-white hover:bg-white/5"
                            onClick={() => setOpen(false)}
                            role="menuitem"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

function ProductMenu() {
    const pathname = usePathname()
    const active = getActiveProduct(pathname)
    // Undefined on the Concepta home — the trigger falls back to "Projects".
    const activeProduct = getProductMeta(active)

    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={
                    activeProduct
                        ? `Switch product (current: ${activeProduct.label})`
                        : 'Browse projects'
                }
            >
                {activeProduct ? (
                    <>
                        <img
                            src={activeProduct.logo}
                            alt={activeProduct.label}
                            className="h-5 w-auto"
                        />
                        {activeProduct.showLabel && (
                            <span className="text-sm whitespace-nowrap">
                                {activeProduct.label}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-sm whitespace-nowrap">Projects</span>
                )}
                <ChevronDown className="h-3 w-3" />
            </button>
            {open && (
                <div
                    className={clsx(
                        'absolute top-full mt-3 left-1/2 -translate-x-1/2 p-1 flex flex-col gap-1',
                        MENU_PANEL,
                    )}
                    role="menu"
                >
                    {PRODUCTS.map((product) => {
                        const isActive = product.id === active
                        return (
                            <Link
                                key={product.id}
                                href={product.href}
                                onClick={() => setOpen(false)}
                                role="menuitem"
                                aria-label={product.label}
                                aria-current={isActive ? 'page' : undefined}
                                className={clsx(
                                    'group flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors',
                                    isActive ? 'bg-white/5' : 'hover:bg-white/5',
                                )}
                            >
                                <img
                                    src={product.logo}
                                    alt={product.label}
                                    style={{ height: 20, width: 'auto' }}
                                    className={clsx(
                                        'max-w-none transition-[filter,opacity]',
                                        isActive
                                            ? 'filter-none'
                                            : '[filter:brightness(0)_invert(1)] opacity-60 group-hover:opacity-100 group-hover:filter-none',
                                    )}
                                />
                                {product.showLabel && (
                                    <span
                                        className={clsx(
                                            'text-sm whitespace-nowrap transition-colors',
                                            isActive
                                                ? 'text-white'
                                                : 'text-white/60 group-hover:text-white',
                                        )}
                                    >
                                        {product.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function MobileDrawer({
    onClose,
    docsHref,
    githubHref,
    productCtaHref,
    productCtaLabel,
    activeProduct,
    isDocsActive,
}: {
    onClose: () => void
    docsHref: string | null
    githubHref: string | null
    productCtaHref: string
    productCtaLabel: string
    activeProduct: ProductId
    isDocsActive: boolean
}) {
    const docsSections = DOCS_SECTIONS[activeProduct] ?? []
    return (
        <div className="fixed inset-0 z-[60] md:hidden">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="absolute top-0 inset-x-0 max-h-screen overflow-y-auto bg-[var(--mix-surface)] border-b border-[color:var(--mix-border-card)] p-4">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 text-white/80 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex flex-col gap-1">
                    <div className="px-3 pb-1 text-xs uppercase tracking-wider text-white/40">
                        Product
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                    >
                        <img
                            src="/assets/logo_concepta_icon_outline.svg"
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-auto"
                        />
                        Concepta
                    </Link>
                    {PRODUCTS.map((product) => (
                        <Link
                            key={product.id}
                            href={product.href}
                            className="flex items-center gap-2.5 px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                        >
                            <img
                                src={product.logo}
                                alt=""
                                aria-hidden="true"
                                className="h-5 w-auto"
                            />
                            {product.label}
                        </Link>
                    ))}
                    {isDocsActive ? (
                        <>
                            {docsSections.map((entry) =>
                                'pages' in entry ? (
                                    <Fragment key={entry.label}>
                                        <div className="px-3 pt-3 text-xs uppercase tracking-wider text-white/40">
                                            {entry.label}
                                        </div>
                                        {entry.pages.map((page) => (
                                            <Link
                                                key={page.href}
                                                href={page.href}
                                                className="px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                                            >
                                                {page.label}
                                            </Link>
                                        ))}
                                    </Fragment>
                                ) : (
                                    <Link
                                        key={entry.href}
                                        href={entry.href}
                                        className="px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                                    >
                                        {entry.label}
                                    </Link>
                                ),
                            )}
                        </>
                    ) : docsHref ? (
                        <Link
                            href={docsHref}
                            className="px-3 py-2 text-white/90 hover:bg-white/5 rounded mt-2"
                        >
                            Docs
                        </Link>
                    ) : activeProduct === 'concepta' ? (
                        <>
                            <Link
                                href="/#projects"
                                onClick={onClose}
                                className="px-3 py-2 text-white/90 hover:bg-white/5 rounded mt-2"
                            >
                                Projects
                            </Link>
                            <Link
                                href="/reports"
                                onClick={onClose}
                                className="px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                            >
                                Reports
                            </Link>
                            <Link
                                href="/contact"
                                onClick={onClose}
                                className="px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                            >
                                Contact
                            </Link>
                        </>
                    ) : (
                        <Link
                            href={productCtaHref}
                            onClick={onClose}
                            className="px-3 py-2 text-white/90 hover:bg-white/5 rounded mt-2"
                        >
                            {productCtaLabel}
                        </Link>
                    )}
                    {hasVersionMenu(activeProduct) && (
                        <>
                            <div className="px-3 pt-3 text-xs uppercase tracking-wider text-white/40">
                                Version
                            </div>
                            {VERSION_ITEMS.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </>
                    )}
                    <div className="px-3 pt-3 text-xs uppercase tracking-wider text-white/40">
                        Links
                    </div>
                    {githubHref && (
                        <a
                            href={githubHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                        >
                            <Github className="h-4 w-4" /> GitHub
                        </a>
                    )}
                    <a
                        href={TWITTER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                    >
                        <Twitter className="h-4 w-4" /> Twitter
                    </a>
                    <a
                        href={DISCORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/5 rounded"
                    >
                        <DiscordIcon className="h-4 w-4" /> Discord
                    </a>
                </nav>
            </div>
        </div>
    )
}

export default function FloatingNavbar() {
    const pathname = usePathname()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const isDocsActive = pathname?.startsWith('/documentation') ?? false
    const isReportsActive = pathname?.startsWith('/reports') ?? false
    const isContactActive = pathname === '/contact'
    const activeProduct = getActiveProduct(pathname)
    const homeHref = getProductMeta(activeProduct)?.href ?? '/'
    const isHomeActive = pathname === homeHref
    const docsHref = getDocsHref(activeProduct)
    const githubHref = getGithubHref(activeProduct)
    const isVoyagerReadiness = pathname?.startsWith('/voyager/readiness') ?? false
    const productCtaHref = isVoyagerReadiness ? '#request' : '#waitlist'
    const productCtaLabel = isVoyagerReadiness ? 'Request assessment' : 'Join waitlist'

    useEffect(() => {
        setDrawerOpen(false)
        setSearchOpen(false)
    }, [pathname])

    useEffect(() => {
        document.documentElement.setAttribute('data-product', activeProduct)
    }, [activeProduct])

    return (
        <>
            {/* In-flow spacer so page content starts below the fixed pill */}
            <div className="h-20" aria-hidden="true" />

            {/* Desktop centered pill */}
            <div
                className={clsx(
                    'fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 pl-2 pr-2 py-1',
                    PILL,
                )}
            >
                <Link
                    href="/"
                    aria-label="Concepta home"
                    className={clsx(
                        'flex items-center px-2 py-1.5 transition-opacity',
                        activeProduct === 'concepta'
                            ? 'opacity-100'
                            : 'opacity-60 hover:opacity-100',
                    )}
                >
                    <img
                        src="/assets/logo_concepta_icon_outline.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-auto"
                    />
                </Link>
                <span className="h-4 w-px bg-white/10" />
                <ProductMenu />
                <span className="h-4 w-px bg-white/10" />
                {activeProduct === 'concepta' && (
                    <>
                        <Link
                            href="/reports"
                            className={clsx(
                                'px-3 py-1.5 text-sm transition-colors',
                                isReportsActive
                                    ? 'text-[color:var(--mix-accent)]'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            Reports
                        </Link>
                        <Link
                            href="/contact"
                            className={clsx(
                                'px-3 py-1.5 text-sm transition-colors',
                                isContactActive
                                    ? 'text-[color:var(--mix-accent)]'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            Contact
                        </Link>
                        <span className="h-4 w-px bg-white/10" />
                    </>
                )}
                {activeProduct !== 'concepta' && (
                    <>
                        <Link
                            href={homeHref}
                            className={clsx(
                                'px-3 py-1.5 text-sm transition-colors',
                                isHomeActive
                                    ? 'text-[color:var(--mix-accent)]'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            Home
                        </Link>
                        <span className="h-4 w-px bg-white/10" />
                        {docsHref ? (
                            <Link
                                href={docsHref}
                                className={clsx(
                                    'px-3 py-1.5 text-sm transition-colors',
                                    isDocsActive
                                        ? 'text-[color:var(--mix-accent)]'
                                        : 'text-white/80 hover:text-white',
                                )}
                            >
                                Docs
                            </Link>
                        ) : (
                            <Link
                                href={productCtaHref}
                                className="px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
                            >
                                {productCtaLabel}
                            </Link>
                        )}
                        <span className="h-4 w-px bg-white/10" />
                    </>
                )}
                <div className="relative floating-search [&_input]:!bg-transparent [&_input]:!border-0 [&_input]:!shadow-none [&_input]:!text-sm [&_input]:!w-44 [&_input]:!h-8 [&_input]:!pl-7 [&_input:focus]:!ring-0 [&_input:focus]:!outline-none [&_input:focus]:!border-0 [&_input:focus]:!shadow-none">
                    <SearchIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
                    />
                    <Search placeholder="Search" />
                </div>
            </div>

            {/* Desktop right icons */}
            <div
                className={clsx(
                    'fixed top-4 right-6 z-50 hidden md:flex items-center gap-1 pl-1 pr-1.5 py-1',
                    PILL,
                )}
            >
                {hasVersionMenu(activeProduct) && (
                    <>
                        <VersionMenu />
                        <span className="h-4 w-px bg-white/10" />
                    </>
                )}
                {githubHref && (
                    <a
                        href={githubHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="p-2 text-white/70 hover:text-white"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                )}
                <a
                    href={TWITTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="p-2 text-white/70 hover:text-white"
                >
                    <Twitter className="h-4 w-4" />
                </a>
                <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord"
                    className="p-2 text-white/70 hover:text-white"
                >
                    <DiscordIcon className="h-4 w-4" />
                </a>
            </div>

            {/* Mobile compact pill */}
            <div
                className={clsx(
                    'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-1 px-1.5 py-1',
                    PILL,
                )}
            >
                {searchOpen ? (
                    <>
                        <div className="relative floating-search [&_input]:!bg-transparent [&_input]:!border-0 [&_input]:!shadow-none [&_input]:!text-sm [&_input]:!w-48 [&_input]:!h-8 [&_input]:!pl-7 [&_input:focus]:!ring-0 [&_input:focus]:!outline-none [&_input:focus]:!border-0 [&_input:focus]:!shadow-none">
                            <SearchIcon
                                aria-hidden="true"
                                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
                            />
                            <Search placeholder="Search" />
                        </div>
                        <button
                            onClick={() => setSearchOpen(false)}
                            aria-label="Close search"
                            className="p-2 text-white/70 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/"
                            aria-label="Concepta home"
                            className="flex items-center p-2 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img
                                src="/assets/logo_concepta_icon_outline.svg"
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-auto"
                            />
                        </Link>
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="p-2 text-white/70 hover:text-white"
                        >
                            <SearchIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                            className="p-2 text-white/70 hover:text-white"
                        >
                            <Menu className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {drawerOpen && (
                <MobileDrawer
                    onClose={() => setDrawerOpen(false)}
                    docsHref={docsHref}
                    githubHref={githubHref}
                    productCtaHref={productCtaHref}
                    productCtaLabel={productCtaLabel}
                    activeProduct={activeProduct}
                    isDocsActive={isDocsActive}
                />
            )}
        </>
    )
}
