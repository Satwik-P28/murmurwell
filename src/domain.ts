export type Change = { before: string; after: string; reason: string };
export type ProtectedTerm = { spoken: string; written: string };

export function parseProtectedTerms(value: string): ProtectedTerm[] {
  return value.split('\n').map((line) => {
    const [spoken, ...rest] = line.split('=>');
    return { spoken: spoken?.trim() ?? '', written: rest.join('=>').trim() };
  }).filter((item) => item.spoken && item.written).slice(0, 30);
}

export function polishTranscript(raw: string, protectedTerms: ProtectedTerm[]) {
  let transcript = raw.trim().replace(/\s+/g, ' ');
  const changes: Change[] = [];

  for (const { spoken, written } of protectedTerms) {
    const expression = new RegExp(`\\b${spoken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (expression.test(transcript)) {
      const before = transcript;
      transcript = transcript.replace(expression, written);
      changes.push({ before, after: transcript, reason: `Protected term: ${spoken} → ${written}` });
    }
  }

  const withoutFillers = transcript.replace(/\b(um+|uh+|you know|like)\b[,.]?\s*/gi, '').replace(/\s+/g, ' ').trim();
  if (withoutFillers !== transcript) {
    changes.push({ before: transcript, after: withoutFillers, reason: 'Removed conversational filler words' });
    transcript = withoutFillers;
  }

  if (transcript) {
    const punctuated = transcript[0].toUpperCase() + transcript.slice(1).replace(/\s+([,.!?])/g, '$1');
    const final = /[.!?]$/.test(punctuated) ? punctuated : `${punctuated}.`;
    if (final !== transcript) changes.push({ before: transcript, after: final, reason: 'Applied sentence casing and final punctuation' });
    transcript = final;
  }

  return { transcript, changes };
}
