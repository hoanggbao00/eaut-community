import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import Header from "@/components/header/header";
import Providers from "@/providers/providers";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'EAUT Community',
    template: '%s | EAUT Community'
  },
  description: "QnA Community of EAUT",
};

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.className,
        )}
      >
        <NextTopLoader />
        <Providers>
          <Header />
          {authModal}
          <main className="mx-auto h-full px-2 pt-20 sm:container sm:px-2 xl:pl-72">
            {children}
          </main>
          <Toaster />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
