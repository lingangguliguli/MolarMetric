import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://molarmetric.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/refund-policy", "/contact", "/dpa", "/security"],
        disallow: [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/onboarding",
          "/dashboard",
          "/dashboard/*",
          "/leads",
          "/leads/*",
          "/follow-ups",
          "/appointments",
          "/treatments",
          "/team",
          "/reports",
          "/settings",
          "/templates",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
