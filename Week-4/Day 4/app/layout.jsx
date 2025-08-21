import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "GitHub User Search Dashboard",
  description:
    "Search and discover GitHub users with a modern, minimalist interface",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
