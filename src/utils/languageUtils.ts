/**
 * RTL_Languages Checker
 * Current only supporting Arabic languages (Pashto, Urdu, Farsi, Sindhi, Uyghur, Kashmiri).
 * To add new language in regex, simply add \p{Script=<language>} before the /u.
 */
const RTL_Languages = /\p{Script=Arabic}/u;

export const isRTL = (text: string) => {
  return RTL_Languages.test(text);
};

export const setFontSizeLTR = (textLength: number): string => {
  if (textLength <= 4) return '1.4rem';
  if (textLength <= 5) return '1.1rem';
  if (textLength <= 6) return '0.95rem';
  if (textLength <= 7) return '0.85rem';
  if (textLength <= 9) return '0.7rem';
  if (textLength <= 12) return '0.6rem';
  return '0.5rem';
};

export const setFontSizeRTL = (textLength: number): string => {
  if (textLength <= 6) return '1.4rem';
  return '1.1rem';
};
