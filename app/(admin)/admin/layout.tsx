import type { Metadata } from "next";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "Admin Features | %s",
      default: "Admin Features",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch data
  const session = await getAuthSession();

  if (!session) notFound();

  if (session.user.role !== "ADMIN") notFound();
  return <>{children}</>;
}
