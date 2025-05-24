import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import 'react-image-lightbox/style.css';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import { KeepAlive } from '@/components/KeepAlive';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: 'Image Enhancer - Transform & Optimize Your Images',
    description:
        'Transform and optimize your images with our powerful image processing tool. Resize, crop, enhance, and more.',
    keywords:
        'image processing, image optimization, image transformation, image enhancement, image resizing, image cropping',
    authors: [{ name: 'Image Enhancer Team' }],
    creator: 'Image Enhancer',
    publisher: 'Image Enhancer',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_APP_URL,
        title: 'Image Enhancer - Transform & Optimize Your Images',
        description:
            'Transform and optimize your images with our powerful image processing tool. Resize, crop, enhance, and more.',
        siteName: 'Image Enhancer',
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon-32x32.png', type: 'image/png' },
            { url: '/favicon-16x16.png', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.json',
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <KeepAlive />
                        <Header />
                        <main className="min-h-screen">{children}</main>
                        <Toaster />
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
