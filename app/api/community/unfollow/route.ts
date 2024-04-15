import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { CommunityFollowValidator } from '@/lib/validators/community';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return NextResponse.json('Unauthorized', { status: 401 });
		}

		const body = await req.json();
		const { communityId } = CommunityFollowValidator.parse(body);

		// check if user has already subscribed or not
		const followExists = await prisma.follow.findFirst({
			where: {
				communityId,
				userId: session.user.id,
			},
		});

		if (!followExists) {
			return NextResponse.json(
				"You've not been followed to this community, yet.",
				{
					status: 400,
				}
			);
		}

		// create community and associate it with the user
		await prisma.follow.delete({
			where: {
				id: followExists.id,
			},
		});

		return NextResponse.json(communityId);
	} catch (error) {
		error;
		if (error instanceof z.ZodError) {
			return NextResponse.json(error.message, { status: 400 });
		}

		return NextResponse.json(
			'Could not unfollow from community at this time. Please try later',
			{ status: 500 }
		);
	}
}
