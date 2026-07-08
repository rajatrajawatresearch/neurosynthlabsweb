import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_CONTENT } from "@/lib/content";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const s = DEFAULT_CONTENT.settings;

export const metadata: Metadata = {
  title: { default: s.seoTitle, template: `%s · ${s.name}` },
  description: s.seoDescription,
  applicationName: s.name,
  authors: [{ name: s.name }],
  keywords: [
    "agentic AI", "AI engineer", "ML engineer", "fullstack developer",
    "Next.js", "RAG", "LLM", "solo studio", s.name,
  ],
  openGraph: {
    title: s.seoTitle,
    description: s.seoDescription,
    siteName: s.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: s.seoTitle, description: s.seoDescription },
  metadataBase: new URL("https://neurosynth.dev"),
};

export const viewport: Viewport = {
  themeColor: "#060814",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`} suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
