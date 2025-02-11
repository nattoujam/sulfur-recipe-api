export const toKatakana = (hiragana: string): string => {
  return hiragana.replace(/[\u3041-\u3096]/g, (match: string) => {
    const code = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(code);
  });
};

export const toHiragana = (katakana: string): string => {
  return katakana.replace(/[\u30A1-\u30F6]/g, (match: string) => {
    const code = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(code);
  });
};
