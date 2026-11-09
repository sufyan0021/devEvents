import type { Metadata } from 'next';
import { Schibsted_Grotesk, Martian_Mono } from 'next/font/google';
import './globals.css';
import LightRaysWrapper from '@/components/LightRays/LightRaysWrapper';
import NavBar from '@/components/NavBar/NavBar';

const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
});

const martianMono = Martian_Mono({
  variable: '--font-martian-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dev Event',
  description: "The Hub of Every Dev Event You Mustn't Miss",
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <NavBar />
        <LightRaysWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
