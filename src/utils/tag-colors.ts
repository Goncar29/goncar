export const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  JavaScript: { bg: "#f7df1e", text: "#000", border: "#f7df1e" },
  HTML: { bg: "#e34f26", text: "#fff", border: "#e34f26" },
  CSS: { bg: "#264de4", text: "#fff", border: "#2965f1" },
  React: { bg: "#61dafb", text: "#000", border: "#61dafb" },
  Vite: { bg: "#646cff", text: "#fff", border: "#646cff" },
  API: { bg: "#10b981", text: "#fff", border: "#10b981" },
  Canvas: { bg: "#f59e0b", text: "#000", border: "#f59e0b" },
  TypeScript: { bg: "#3178c6", text: "#fff", border: "#3178c6" },
  "Node.js": { bg: "#68a063", text: "#fff", border: "#68a063" },
  PostgreSQL: { bg: "#336791", text: "#fff", border: "#336791" },
  Tailwind: { bg: "#06b6d4", text: "#fff", border: "#06b6d4" },
};

const fallback = { bg: "#667eea", text: "#fff", border: "#764ba2" };

export function getTagStyle(tag: string): string {
  const colors = tagColors[tag] || fallback;
  return `background: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.border};`;
}
