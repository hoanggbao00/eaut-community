import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/lib/constants'
import { getAuthSession } from '@/lib/auth'
import prisma from '@/lib/db/prisma'
import { notFound } from 'next/navigation'
import PostFeed from '../post-feed'

const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const followedCommunities = await prisma.follow.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
  })

  const posts = await prisma.post.findMany({
    where: {
      community: {
        name: {
          in: followedCommunities.map((com) => com.community.name),
        },
      },
    },
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
  })

  return <PostFeed session={session} initialPosts={posts} showCommunityName={true} />
}

export default CustomFeed