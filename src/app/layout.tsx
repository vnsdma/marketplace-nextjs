import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketplace | Buy and Sell Items Locally',
  description: 'Buy or sell new and used items easily on Marketplace. Find great deals on electronics, furniture, vehicles, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col text-gray-900 bg-[#f0f2f5]`}>
        {children}
      </body>
    </html>
  );
}
