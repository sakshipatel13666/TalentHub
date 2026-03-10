import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TalentHub | Discover, Hire, & Learn',
  description: 'The ultimate marketplace for world-class talent and expert-led workshops.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
