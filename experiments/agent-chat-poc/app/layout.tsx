import "./globals.css";

export const metadata = {
  title: "Agent Chat POC",
  description: "A minimal web chat POC for one-shot CLI agent calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

