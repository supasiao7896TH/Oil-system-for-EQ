interface Props {
  text: string;
  query: string;
}

/**
 * Highlights the first case-insensitive literal occurrence of `query` within `text`.
 * Renders as plain React text-node children wrapped in a real <mark> element — never
 * builds or injects an HTML string, so there is no XSS surface here regardless of
 * what a user types into the search box.
 */
export function HighlightedText({ text, query }: Props) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + trimmed.length);
  const after = text.slice(idx + trimmed.length);

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}
