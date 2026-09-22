const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
  "has", "this", "that", "from", "into", "who", "what", "when", "where",
  "job", "role", "work", "working", "team", "teams", "years", "year", "experience",
  "ability", "able", "strong", "excellent", "including", "such", "etc", "using",
  "responsibilities", "requirements", "required", "preferred", "must", "plus",
  "about", "across", "within", "other", "than", "also", "can", "not", "all",
  "new", "one", "more", "most", "each", "any", "per", "via",
]);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? []).filter(
    (word) => word.length > 2 && !STOPWORDS.has(word)
  );
}

export function scoreAgainst(text: string, keywords: Set<string>): number {
  let score = 0;
  for (const word of tokenize(text)) {
    if (keywords.has(word)) score += 1;
  }
  return score;
}
