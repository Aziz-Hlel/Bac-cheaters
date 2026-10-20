export const normalizeArabic = (text: string) =>
  text
    ? text
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/\bال/g, '')
        .replace(/[\u064B-\u0652]/g, '')
        .trim()
    : '';
