import React from 'react';

/**
 * Transforms plain text into high-focus Bionic Reading format by
 * emphasizing the initial fixation syllables of words to guide the eye.
 */
export function renderBionicText(text: string, enabled: boolean): React.ReactNode {
  if (!enabled || !text) return text;

  // Split preserving whitespace
  const tokens = text.split(/(\s+)/);

  return tokens.map((token, idx) => {
    if (/^\s+$/.test(token)) {
      return token;
    }

    // Determine fixation length (1-3 chars depending on word length)
    const len = token.length;
    let fixLen = 1;
    if (len >= 4 && len <= 6) fixLen = 2;
    else if (len >= 7 && len <= 9) fixLen = 3;
    else if (len > 9) fixLen = 4;

    const prefix = token.slice(0, fixLen);
    const suffix = token.slice(fixLen);

    return (
      <React.Fragment key={idx}>
        <span className="font-extrabold text-black tracking-tight">{prefix}</span>
        <span className="text-slate-800">{suffix}</span>
      </React.Fragment>
    );
  });
}
