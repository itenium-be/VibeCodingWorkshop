export interface AppPrompt {
	paragraphs: string[];
	tool: string;
}

export function parsePrompts(md: string): Record<string, AppPrompt> {
	const tools = Object.fromEntries(
		[...md.matchAll(/^\|([^|\n]+)\|[^|\n]+\|([^|\n]+)\|$/gm)].map(m => [m[1].trim(), m[2].trim()]));
	const prompts: Record<string, AppPrompt> = {};
	for (const section of md.split(/^## /m).slice(1)) {
		const title = section.slice(0, section.indexOf('\n')).replace(/^\S+\s+/, '').trim();
		const quote = section.split('\n').filter(l => l.startsWith('>')).map(l => l.slice(1).trim()).join('\n');
		prompts[title] = { paragraphs: quote.split(/\n{2,}/).filter(Boolean), tool: tools[title] };
	}
	return prompts;
}
