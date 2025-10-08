import "./globals.css";

export const metadata = {
  title: "E-channel Prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex">
        <main className="p-6">{children}</main>
      </body>
    </html >
  );
}
