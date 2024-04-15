import prisma from '@/lib/db/prisma';
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/constants';
import PostFeed from '../post-feed';
import { Session } from 'next-auth';

const GeneralFeed = async ({session}: {session: Session | null}) => {
	const posts = await prisma.post.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			community: true,
		},
		take: INFINITE_SCROLL_PAGINATION_RESULTS,
	});

	return <PostFeed session={session} initialPosts={posts} showCommunityName={true}/>;
};

export default GeneralFeed;
