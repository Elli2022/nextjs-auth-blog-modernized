import { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import ModeToggle from "@/components/ModeToggle";
import RootLayout from "@/app/layout";

// _app.tsx
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Navbar />
      <ModeToggle />
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
