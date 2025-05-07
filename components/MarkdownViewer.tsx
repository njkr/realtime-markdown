import { renderMarkdown } from '@/lib/markdown';

interface Props {
  content: string;
}

export default function MarkdownViewer({ content }: Props) {
  const html = renderMarkdown(content);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}