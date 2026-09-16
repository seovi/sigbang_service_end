import type { Metadata } from "next";
import { service, SERVICE_END_PAGE_NOINDEX } from "./service";

export const serviceMetadata: Metadata = {
  title: service.title,
  description: service.description,
  robots: { index: !SERVICE_END_PAGE_NOINDEX, follow: true },
  openGraph: {
    title: service.title,
    description: service.description,
    siteName: service.name,
    locale: "ko_KR",
    type: "website",
  },
  icons: { icon: "/brand-icon.png", apple: "/brand-icon.png" },
};
