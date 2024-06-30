import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) return NextResponse.json("No query provided", { status: 400 });

  const results = await prisma.$transaction([
    prisma.community.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        _count: true,
        image: true,
      }
    }),
    prisma.post.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        _count: true,
        title: true,
        community: {
          select: {
            name: true,
          }
        }
      }
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        _count: true,
        username: true,
        name: true,
        image: true,
      },
    }),
  ]);

  return NextResponse.json(results);
}
