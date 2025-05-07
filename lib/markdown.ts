import MarkdownIt from 'markdown-it';
import doPlugin from '@digitalocean/do-markdownit';

const md = new MarkdownIt().use(doPlugin);

export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}