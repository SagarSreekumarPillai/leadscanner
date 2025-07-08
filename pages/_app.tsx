// pages/_app.tsx
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <>
      <Component {...pageProps} />
      <Toaster richColors position="top-center" />
      </>
    </ThemeProvider>
  );
}

export default MyApp;
