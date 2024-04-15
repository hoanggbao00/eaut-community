'use client';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const CloseAuthModal = ({ forSubmit }: { forSubmit?: boolean }) => {
	const router = useRouter();

	return forSubmit ? (
		<Button
			aria-label='close modal'
			className=''
			variant='outline'
			onClick={() => router.back()}
		>
			Close
		</Button>
	) : (
		<Button
			aria-label='close modal'
			className='h-6 w-6 p-0 rounded-lg'
			variant='ghost'
			onClick={() => router.back()}
		>
			<X className='h-4 w-4' />
		</Button>
	);
};

export default CloseAuthModal;
