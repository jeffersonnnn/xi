export function buildShareUrl(
  picks_in_xi: number,
  total_picks: number,
): string {
  const text = `${picks_in_xi} of my ${total_picks} picks are in the People's XI for the 2026 World Cup!\n\nVote with your $XI bag at worldcupxi.xyz`;
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function buildXIShareUrl(
  xi: Record<string, { name: string }>,
): string {
  const lines = Object.entries(xi).map(([slot, p]) => `${slot}: ${p.name}`);
  const text = `The People's XI right now:\n\n${lines.join('\n')}\n\nVote with your $XI bag at worldcupxi.xyz`;
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
