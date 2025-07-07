import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"; // Correct path for Next.js global styles

// Register service worker on client-side only
function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  }
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}