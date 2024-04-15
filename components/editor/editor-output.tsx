'use client';

import { FC, useMemo } from 'react';
import { generateHTML } from '@tiptap/html';
import { defaultExtensions } from '@/lib/editor-extensions';

interface EditorOutputProps {
	content: any;
}

function formatContent(json: any) {
	if (!json) return '<div>Content not provided</div>';

	return generateHTML(json, defaultExtensions);
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
	const html = useMemo(() => formatContent(content), [content]);
	return (
		<div
			className='text-sm prose dark:prose-invert max-w-full'
			dangerouslySetInnerHTML={{ __html: html }}
		></div>
	);
};

export default EditorOutput;
