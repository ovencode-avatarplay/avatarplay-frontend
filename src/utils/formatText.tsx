import React from 'react';

/**
 * 템플릿 문자열에서 `{0}, {1}` 등의 플레이스홀더를 실제 값으로 변환하고 `<br>` 태그를 JSX 개행으로 변환
 */
const formatText = (text: string, replacements?: string[]): React.ReactNode => {
  // replacements가 없으면 바로 <br> 변환 수행
  if (!replacements || replacements.length === 0) {
    return text.split('<br>').map((line, index, arr) =>
      index < arr.length - 1 ? (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ) : (
        line
      ),
    );
  }

  // 플레이스홀더 치환
  let formattedText = replacements.reduce((formattedText, value, index) => {
    const regex = new RegExp(`\\{${index}\\}`, 'g'); // {0}, {1}, {2} 등의 플레이스홀더 치환
    return formattedText.replace(regex, value);
  }, text);

  // <br> 태그를 JSX 개행(<br />)으로 변환
  return formattedText.split('<br>').map((line, index, arr) =>
    index < arr.length - 1 ? (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ) : (
      line
    ),
  );
};

export default formatText;
