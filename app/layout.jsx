import './globals.css';

export const metadata = {
  title: 'Find a UGC creator — Blackcoffee Media',
  description:
    'A vetted UGC creator network for Indian brands. Watch real portfolio work, filter by category, language, city and rate, and shortlist without an account.',
};

export const viewport = {
  themeColor: '#0b0908',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
