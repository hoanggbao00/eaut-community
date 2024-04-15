import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { CommunityFollowValidator } from '@/lib/validators/community';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
	try {
		const session = await getAuthSession();

		if (!session?.user)
			return NextResponse.json('Unauthorized', { status: 401 });

		const body = await req.json();

		const { communityId } = CommunityFollowValidator.parse(body);

		const followExists = await prisma.follow.findFirst({
			where: {
				communityId,
				userId: session.user.id,
			},
		});

		if (followExists)
			return NextResponse.json('You are already following this community', {
				status: 400,
			});

		await prisma.follow.create({
			data: {
				communityId,
				userId: session.user.id,
			},
		});

		return NextResponse.json(communityId);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json('Invalid request data passed', { status: 422 });
		}
		return NextResponse.json('Could not follow, please try again later', {
			status: 500,
		});
	}
}
