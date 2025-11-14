import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibey Tickets',
  description: 'A smart price-watching application that helps budget-conscious fans track ticket prices for live events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}

