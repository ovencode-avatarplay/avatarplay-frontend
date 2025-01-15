import React from 'react';
import styles from './CustomTypography.module.css';

type TypographyProps = {
  Type: 'Title' | 'Body' | 'Callout' | 'Subheadline' | 'Footnote' | 'Caption1' | 'Caption2';
  SubType?: 'Large' | 'Title1' | 'Title2' | 'Title3' | 'Headline'; // 'Title'일 때만 사용 가능
  Style?: 'Regular' | 'Bold' | 'Semibold' | 'SMItalic' | 'MedItalic' | 'Italic';
  Size?: string; // 사용자 지정 폰트 크기
  LineHeight?: string; // 사용자 지정 줄 높이
  customStyle?: React.CSSProperties; // 인라인 스타일
  customClassName?: string; // 추가 클래스
  children: React.ReactNode;
};

const CustomTypography: React.FC<TypographyProps> = ({
  Type,
  SubType,
  Style = 'Regular',
  Size,
  LineHeight,
  customStyle,
  customClassName,
  children,
}) => {
  // 시멘틱 태그 매핑
  const semanticTagMap: Record<string, keyof JSX.IntrinsicElements> = {
    Large: 'h1',
    Title1: 'h2',
    Title2: 'h3',
    Title3: 'h4',
    Headline: 'h5',
  };

  const getTag = (): keyof JSX.IntrinsicElements => {
    if (Type === 'Title' && SubType && semanticTagMap[SubType]) {
      return semanticTagMap[SubType];
    }
    return 'span'; // 기본적으로 span 사용
  };

  const Tag = getTag();

  // 클래스 생성
  const className = [
    styles[`${Type}-${SubType || 'Default'}-${Style}`], // 키값 조합된 클래스
    customClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // 인라인 스타일 생성
  const style: React.CSSProperties = {
    fontSize: Size,
    lineHeight: LineHeight,
    ...customStyle,
  };

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
};

export default CustomTypography;
