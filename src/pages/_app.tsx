import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();


const myFont = localFont({ src: './fonts/GeistVF.woff' })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={myFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </main>
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}

