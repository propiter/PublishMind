import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { Toaster } from "@/components/ui/toaster";
import { defaultMetadata } from '@/components/seo/metadata';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}