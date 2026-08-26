import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

const SITE_ICON = "/favicon.svg?v=3";
const SITE_ICON_FALLBACK = "/favicon.ico";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Community Grants Portal" },
      { name: "description", content: "Governmental grant portal." },
      { name: "author", content: "Lovable" },
      { name: "theme-color", content: "#1B2A4A" },
      { property: "og:title", content: "Community Grants Portal" },
      { property: "og:description", content: "governmental  grant portal." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: SITE_ICON },
      { property: "og:image:alt", content: "Community Grants Portal icon" },
      { property: "og:image:type", content: "image/svg+xml" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:image", content: SITE_ICON },
      { name: "twitter:image:alt", content: "Community Grants Portal icon" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: SITE_ICON, type: "image/svg+xml" },
      { rel: "icon", href: SITE_ICON_FALLBACK, type: "image/x-icon" },
      { rel: "shortcut icon", href: SITE_ICON_FALLBACK, type: "image/x-icon" },
      { rel: "apple-touch-icon", href: SITE_ICON },
      { rel: "manifest", href: "/site.webmanifest?v=3" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Public+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}
