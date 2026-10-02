import { Inter, JetBrains_Mono } from 'next/font/google'
import { Footer, Layout } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import '../../globals.css'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import FloatingNavbar from '../../components/FloatingNavbar'
import ProductFooter from '../../components/ProductFooter'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
    display: 'swap',
})

const description =
    'Concepta ships the systems your business runs on — and builds the open-source delivery foundation behind them: Mix, Remix, Naked UI, Ack, FVM, Rockets, Stargate, and Code Analysis.'

export const viewport = {
    themeColor: '#111111',
}

export const metadata = {
    metadataBase: new URL('https://concepta.dev'),
    title: 'Concepta',
    description,
    applicationName: 'Concepta',
    // Favicon comes from the app-router file convention: src/app/icon.png +
    // apple-icon.png (Concepta mark from conceptatech.com), with
    // public/favicon.ico as the legacy fallback. Product routes override it
    // with their own icon.svg.
    openGraph: {
        title: 'Concepta',
        description,
        images: ['/og_concepta.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Concepta',
        description,
        images: ['/og_concepta.png'],
    },
    other: {
        'msapplication-TileColor': '#111111',
        'apple-mobile-web-app-title': 'Concepta',
    },
}

const navbar = <FloatingNavbar />

const footer = (
    <Footer>
        <ProductFooter />
    </Footer>
)

export default async function RootLayout({ children }) {
    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
            className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
        >
            <Head />
            <body>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(()=>{try{var p=location.pathname;var d='mix';if(p==='/'||p==='/reports'||p.startsWith('/reports/')||p==='/contact'||p==='/fluttercon2026'||p.startsWith('/fluttercon2026/'))d='concepta';else if(p.startsWith('/documentation/remix')||p==='/remix'||p.startsWith('/remix/'))d='remix';else if(p.startsWith('/documentation/ack')||p==='/ack'||p.startsWith('/ack/'))d='ack';else if(p==='/naked-ui'||p.startsWith('/naked-ui/'))d='naked-ui';else if(p==='/rockets'||p.startsWith('/rockets/'))d='rockets';else if(p==='/stargate'||p.startsWith('/stargate/'))d='stargate';else if(p==='/code-analysis'||p.startsWith('/code-analysis/'))d='code-analysis';else if(p==='/voyager'||p.startsWith('/voyager/'))d='voyager';document.documentElement.setAttribute('data-product',d)}catch(e){}})();`,
                    }}
                />
                <Layout
                    navbar={navbar}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/btwld/mix-docs/tree/main"
                    footer={footer}
                    darkMode={false}
                    copyPageButton={false}
                    navigation={{ prev: true, next: true }}
                    toc={{ float: true, backToTop: "Scroll to top" }}
                    nextThemes={{
                        forcedTheme: "dark",
                        defaultTheme: "dark",
                        storageKey: "theme"
                    }}
                    sidebar={{
                        defaultMenuCollapseLevel: 1,
                        autoCollapse: true,
                        toggleButton: false,
                        defaultOpen: true,
                    }}
                >
                    {children}
                </Layout>
            </body>
        </html>
    )
}
