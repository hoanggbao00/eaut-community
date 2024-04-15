import { AvatarProps } from '@radix-ui/react-avatar';

import { Icons } from './icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ShowAvatarProps extends AvatarProps {
	data: { name: string | null | undefined; image: string | null | undefined };
}

export function ShowAvatar({ data, ...props }: ShowAvatarProps) {
	return (
		<Avatar {...props}>
			{data.image ? (
				<div className='relative aspect-square size-full'>
					<AvatarImage
						src={data.image}
						alt='profile picture'
						referrerPolicy='no-referrer'
						className='rounded-ful'
					/>
				</div>
			) : (
				<AvatarFallback>
					<span className='sr-only'>{data?.name}</span>
					<Icons.user className='size-4' />
				</AvatarFallback>
			)}
		</Avatar>
	);
}
