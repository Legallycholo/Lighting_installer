import type { NextConfig } from "next";

const isHostedProduction =
  process.env.DEPLOY_TARGET === "production" ||
  process.env.VERCEL_ENV === "production" ||
  process.env.CONTEXT === "production";
const wantsIndexing = process.env.NEXT_PUBLIC_INDEXABLE === "true";
if (isHostedProduction || wantsIndexing) {
  if (process.env.CONTENT_APPROVED !== "true") {
    throw new Error(
      "Production publication is blocked: replace all placeholder content/assets and set CONTENT_APPROVED=true after owner review. Local production builds remain available.",
    );
  }
  const canonical = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  );
  if (
    canonical.protocol !== "https:" ||
    ["localhost", "example.com", "happylightsmiami.com"].some(
      (host) =>
        canonical.hostname === host || canonical.hostname.endsWith(`.${host}`),
    )
  ) {
    throw new Error(
      "Production requires NEXT_PUBLIC_SITE_URL to be the project-owned HTTPS origin.",
    );
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...(wantsIndexing && process.env.CONTENT_APPROVED === "true"
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
