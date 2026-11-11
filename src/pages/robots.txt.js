// robots.txt. Everything may be read. The AI assistants' crawlers are named on purpose: an assistant can only
// recommend a studio it is allowed to read. While the site is a draft the pages themselves say "noindex" (that only
// works if they can be fetched, so nothing is disallowed here) and no sitemap is announced.
import { SITE, DRAFT } from '../data/site.js';

const AI = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'meta-externalagent', 'CCBot'];

export function GET() {
  const lines = [
    '# SD Design',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI assistants and their search crawlers: welcome too.',
    ...AI.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    DRAFT ? '# Draft: the sitemap is announced once the site has its address.' : `Sitemap: ${SITE.url}/sitemap.xml`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
