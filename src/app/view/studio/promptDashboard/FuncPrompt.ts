// FuncPrompt.ts

export const updateDropdownPosition = (
  promptRef: React.RefObject<HTMLDivElement>,
  setDropdownPosition: React.Dispatch<React.SetStateAction<{top: number; left: number}>>,
) => {
  if (!promptRef.current) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  setDropdownPosition({
    top: rect.bottom + window.scrollY - 285, // 약간 아래 위치
    left: rect.left + window.scrollX - 20,
  });
};

export const decodeHTMLEntities = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;

  return txt.value;
};

export const replaceChipsWithKeywords = (html: string, KEYWORDS: Record<string, string>): string => {
  // Step 1: HTML 엔티티 변환 (HTML 태그 방지 추가)
  html = decodeHTMLEntities(html);

  // Step 2: Chip을 원래 키워드로 변환
  Object.keys(KEYWORDS).forEach(keyword => {
    const regex = new RegExp(`<span[^>]*?contenteditable="false"[^>]*?>${KEYWORDS[keyword]}</span>`, 'g');
    html = html.replace(regex, keyword);
  });

  // Step 3: <, >를 안전하게 변환 (HTML 해석 방지)
  html = html.replace(/</g, '〈').replace(/>/g, '〉');

  // Step 4: <div>, <br> 태그를 개행 문자로 변환
  html = html.replace(/<div><br><\/div>/g, '\n');
  html = html.replace(/<div>/g, '\n');
  html = html.replace(/<\/div>/g, '');
  html = html.replace(/<br>/g, '\n');

  // Step 5: 모든 HTML 태그 제거
  html = html.replace(/<[^>]*>/g, '');

  return html === '〈br〉' || html.trim() === '' ? '' : html;
};
