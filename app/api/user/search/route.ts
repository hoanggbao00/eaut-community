import { getAuthSession } from "@/lib/auth";
import { STATUS_CODE } from "@/lib/constants";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    // Check if user signed in
    const session = await getAuthSession();

    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: STATUS_CODE.UNAUTHORIZED,
      });

    const { q } = z
      .object({
        q: z.string(),
      })
      .parse({
        q: searchParams.get("q"),
      });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        isBanned: true,
        communityModerator: {
          select: {
            communityId: true,
          },
        },
        Follow: {
          select: {
            communityId: true,
            createdDate: true,
          },
        },
        _count: {
          select: {
            Post: true,
            Comment: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json("Could not get community", { status: 500 });
  }
}
