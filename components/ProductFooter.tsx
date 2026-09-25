'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    CONCEPTA_GITHUB_URL,
    MIX_GITHUB_URL,
    REMIX_GITHUB_URL,
    ROCKETS_GITHUB_URL,
} from './constants'

function isAckPath(pathname: string | null) {
    return pathname === '/ack'
        || pathname?.startsWith('/ack/')
        || pathname?.startsWith('/documentation/ack')
}

function isNakedUiPath(pathname: string | null) {
    return pathname === '/naked-ui' || pathname?.startsWith('/naked-ui/')
}

function isRocketsPath(pathname: string | null) {
    return pathname === '/rockets' || pathname?.startsWith('/rockets/')
}

function isRemixPath(pathname: string | null) {
    return pathname === '/remix'
        || pathname?.startsWith('/remix/')
        || pathname?.startsWith('/documentation/remix')
}

function isMixPath(pathname: string | null) {
    return pathname === '/mix'
        || pathname?.startsWith('/mix/')
        || pathname?.startsWith('/documentation/mix')
}

function isVoyagerPath(pathname: string | null) {
    return pathname === '/voyager' || pathname?.startsWith('/voyager/')
}

function isProductWithoutPublicRepo(pathname: string | null) {
    return pathname === '/stargate'
        || pathname?.startsWith('/stargate/')
        || pathname === '/code-analysis'
        || pathname?.startsWith('/code-analysis/')
        || pathname === '/voyager'
        || pathname?.startsWith('/voyager/')
}

function getGithubHref(pathname: string | null) {
    if (isRemixPath(pathname)) return REMIX_GITHUB_URL
    if (isMixPath(pathname)) return MIX_GITHUB_URL
    if (isRocketsPath(pathname)) return ROCKETS_GITHUB_URL
    if (isProductWithoutPublicRepo(pathname)) return null
    return CONCEPTA_GITHUB_URL
}

function getPubDevHref(pathname: string | null) {
    if (isRemixPath(pathname)) return 'https://pub.dev/packages/remix'
    if (isMixPath(pathname)) return 'https://pub.dev/packages/mix'
    return null
}

export default function ProductFooter() {
    const pathname = usePathname()
    const isVoyager = isVoyagerPath(pathname)

    if (isAckPath(pathname)) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-sm text-[var(--mix-text-muted)]">
                <span>Built for trustworthy Dart boundaries.</span>
                <div className="flex items-center gap-5">
                    <a href="https://github.com/btwld/ack" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    <a href="https://pub.dev/packages/ack" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">pub.dev</a>
                    <Link href="/ack/llms.txt" className="hover:text-white transition-colors">llms.txt</Link>
                </div>
            </div>
        )
    }

    if (isNakedUiPath(pathname)) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-sm text-[var(--mix-text-muted)]">
                <span>Behavior-first Flutter primitives. Styling is yours.</span>
                <div className="flex items-center gap-5">
                    <a href="https://github.com/btwld/naked_ui" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    <a href="https://pub.dev/packages/naked_ui" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">pub.dev</a>
                    <a href="https://docs.page/btwld/naked_ui" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Docs</a>
                </div>
            </div>
        )
    }

    if (isRocketsPath(pathname)) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-sm text-[var(--mix-text-muted)]">
                <span>Describe the backend. Ship the domain.</span>
                <div className="flex items-center gap-5">
                    <a href={ROCKETS_GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                    <a href="https://www.npmjs.com/package/@bitwild/rockets" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">npm</a>
                    <a href={ROCKETS_GITHUB_URL + '#readme'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Guide</a>
                </div>
            </div>
        )
    }

    // Public products link their own repo/package. Concepta pages link the org,
    // while products without a public repo omit GitHub, matching the navbar.
    const githubHref = getGithubHref(pathname)
    const pubDevHref = getPubDevHref(pathname)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-sm text-[var(--mix-text-muted)]">
            <span className="flex items-center gap-2.5">
                <Link
                    href={isVoyager ? '/voyager' : '/'}
                    aria-label={isVoyager ? 'Voyager home' : 'Concepta home'}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                >
                    <img
                        src={isVoyager ? '/assets/logo_voyager_mark.svg' : '/assets/logo_concepta.svg'}
                        alt={isVoyager ? 'Voyager' : 'Concepta'}
                        className={isVoyager ? 'h-4 w-auto' : 'h-3.5 w-auto'}
                    />
                </Link>
                <span>&copy; 2026 {isVoyager ? 'Voyager.' : 'Concepta Tech.'}</span>
            </span>
            <div className="flex items-center gap-5">
                <Link href="/reports" className="hover:text-white transition-colors">Reports</Link>
                {githubHref && (
                    <a href={githubHref} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                )}
                {pubDevHref && (
                    <a href={pubDevHref} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">pub.dev</a>
                )}
                <a href="https://discord.com/invite/Ycn6GV3m2k" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
                <a href="https://twitter.com/leoafarias" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            </div>
        </div>
    )
}
