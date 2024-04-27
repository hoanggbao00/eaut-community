import { getAuthSession } from "@/lib/auth";
import { isAdmin } from "@/lib/db/db";
import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { communityName: string } },
) {
  try {
    const community = await prisma.community.findFirst({
      where: {
        name: {
          equals: params.communityName,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        description: true,
        rules: true,
        creatorId: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
          },
        },
        updateHistory: true,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json("Could not get community", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { communityName: string } },
) {
  try {
    const session = await getAuthSession();
    if (!session?.user)
      return NextResponse.json("Unauthorized", {
        status: 401,
      });

    if (!isAdmin(session.user.role)) {
      return NextResponse.json("Not permission", {
        status: 403,
      });
    }

    await prisma.community.delete({
      where: {
        name: params.communityName,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong.", {
      status: 500,
    });
  }
}
