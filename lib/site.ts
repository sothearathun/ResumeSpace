// www, not the apex — Vercel's domain config 308-redirects resumespace.site
// to www.resumespace.site, so every canonical/sitemap/robots URL has to
// point straight at www or Google's sitemap fetcher chokes on the redirect
// hop. Override with NEXT_PUBLIC_SITE_URL if the domain setup ever changes.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.resumespace.site";
