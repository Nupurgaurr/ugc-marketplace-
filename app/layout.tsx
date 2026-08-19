import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import {
  Hanken_Grotesk,
  Bricolage_Grotesque,
  JetBrains_Mono,
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Bengali,
  Noto_Sans_Gujarati,
  Noto_Sans_Malayalam,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Kannada,
  Noto_Sans_Arabic,
} from 'next/font/google';
import './globals.css';

const body = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body-loaded', display: 'swap' });
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-loaded', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono-loaded', display: 'swap' });

/**
 * Hanken Grotesk carries none of the Indic scripts or Arabic, so every
 * language label in the application form would otherwise fall back to a
 * system font and look inconsistent. These subsets back --font-indic.
 */
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari', display: 'swap' });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-tamil', display: 'swap' });
const telugu = Noto_Sans_Telugu({ subsets: ['telugu'], variable: '--font-telugu', display: 'swap' });
const bengali = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bengali', display: 'swap' });
const gujarati = Noto_Sans_Gujarati({ subsets: ['gujarati'], variable: '--font-gujarati', display: 'swap' });
const malayalam = Noto_Sans_Malayalam({ subsets: ['malayalam'], variable: '--font-malayalam', display: 'swap' });
const gurmukhi = Noto_Sans_Gurmukhi({ subsets: ['gurmukhi'], variable: '--font-gurmukhi', display: 'swap' });
const kannada = Noto_Sans_Kannada({ subsets: ['kannada'], variable: '--font-kannada', display: 'swap' });
const arabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' });

const fontVariables = [
  body, display, mono,
  devanagari, tamil, telugu, bengali, gujarati, malayalam, gurmukhi, kannada, arabic,
].map((f) => f.variable).join(' ');

export const metadata: Metadata = {
  title: 'blackcoffee. UGC',
  description: 'A managed UGC creator network by Black Coffee Media.',
};

export const viewport: Viewport = {
  themeColor: '#0b0908',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
