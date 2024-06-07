import "@/globals/globals.css";
import { Inter } from "next/font/google";
import { RequestHeadersProvider } from "@/components/Providers/RequestHeadersProvider";
import ThemeProvider from "@/components/Providers/darkModeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maestranza",
  description: "Realizado por Opencode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + "bg-yellow-500"}>
        <ThemeProvider>
          <RequestHeadersProvider>{children}</RequestHeadersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
