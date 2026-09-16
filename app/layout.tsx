import type { ReactNode } from "react";
import { serviceMetadata } from "../config/metadata";

export const metadata = serviceMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head><link rel="stylesheet" href="/notice.css" /></head>
      <body>{children}</body>
    </html>
  );
}
