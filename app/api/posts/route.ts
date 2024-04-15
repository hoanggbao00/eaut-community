import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await prisma.follow.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map((com) => com.community.id);
  }

  try {
    const { limit, page, userId, communityName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        userId: z.string().nullish().optional(),
        communityName: z.string().nullish().optional(),
      })
      .parse({
        userId: url.searchParams.get("userId"),
        communityName: url.searchParams.get("communityName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (communityName) {
      whereClause = {
        community: {
          name: communityName,
        },
      };
    } else if (userId){
      whereClause = {
        authorId: userId
      }
    } else if (session) {
      whereClause = {
        community: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }
    
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      include: {
        community: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json("Could not fetch posts", { status: 500 });
  }
}
