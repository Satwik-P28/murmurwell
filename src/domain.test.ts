import { describe, expect, it } from 'vitest';
import { parseProtectedTerms, polishTranscript } from './domain';

describe('transcript cleanup', () => {
  it('removes filler words and adds punctuation', () => {
    const result = polishTranscript('um ship the draft you know tomorrow', []);
    expect(result.transcript).toBe('Ship the draft tomorrow.');
    expect(result.changes).toHaveLength(2);
  });

  it('honors protected term mappings before cleanup', () => {
    const terms = parseProtectedTerms('murmur well => Murmurwell\nopen ai => OpenAI');
    expect(polishTranscript('send this from murmur well to open ai', terms).transcript).toBe('Send this from Murmurwell to OpenAI.');
  });

  it('ignores malformed mappings', () => {
    expect(parseProtectedTerms('missing arrow\nspoken => written')).toEqual([{ spoken: 'spoken', written: 'written' }]);
  });
});
