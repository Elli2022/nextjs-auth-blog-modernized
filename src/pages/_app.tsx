import { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import ModeToggle from "@/components/ModeToggle";
import "@/app/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <ModeToggle />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
