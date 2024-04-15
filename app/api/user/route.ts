import { getAuthSession } from '@/lib/auth';
import { STATUS_CODE } from '@/lib/constants';
import prisma from '@/lib/db/prisma';
import { ProfileValidator } from '@/lib/validators/username';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return NextResponse.json('Unauthorized', { status: 401 });
		}

		const body = await req.json();
		const { name, username } = ProfileValidator.parse(body);

		// check if username is taken
		const isTaken = await prisma.user.findFirst({
			where: {
				username: name,
			},
		});

		if (isTaken) {
			return NextResponse.json('Username is taken', { status: STATUS_CODE.DUPLICATE });
		}

		// update username
		await prisma.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				...body
			},
		});

		return NextResponse.json('OK');
	} catch (error) {
		error;

		if (error instanceof z.ZodError) {
			return NextResponse.json(error.message, { status: 400 });
		}

		return NextResponse.json(
			'Could not update at this time. Please try later',
			{ status: 500 }
		);
	}
}
