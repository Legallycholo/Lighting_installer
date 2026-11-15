import { Inter, Merriweather } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { MeasurementEvents } from "@/components/layout/MeasurementEvents";
import { shell } from "@/content/shell";
import { rootMetadata } from "@/lib/metadata";
import "@/styles/globals.css";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  display: "swap",
  weight: "800",
});
export const metadata = rootMetadata;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          {shell.skip}
        </a>
        <aside className="preview-notice">
          <span>{shell.preview}</span>
          <span>{shell.previewShort}</span>
        </aside>
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileContactBar />
        <MeasurementEvents />
      </body>
    </html>
  );
}
