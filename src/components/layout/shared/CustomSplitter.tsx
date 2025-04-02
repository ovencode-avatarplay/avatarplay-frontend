import React, {useEffect, useState} from 'react';
import styles from './CustomSplitter.module.css';

export type SplitterLabelType = 'OnlyLabel' | 'OnlyIcon';

export interface Splitter {
  label: string;
  labelType?: SplitterLabelType;
  labelIconSrc?: string;
  preContent?: React.ReactNode;
  content: React.ReactNode;
  isPlaceholder?: boolean;
  isDisabled?: boolean;
}

interface SplittersProps {
  splitters: Splitter[];
  initialActiveSplitter?: number;
  onSelectSplitButton?: (index: number) => void;
  splitterStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  isDark?: boolean;
  placeholderWidth?: string;
}

const Splitters: React.FC<SplittersProps> = ({
  splitters,
  initialActiveSplitter = 0,
  onSelectSplitButton,
  splitterStyle,
  headerStyle,
  contentStyle,
  itemStyle,
  isDark = false,
  placeholderWidth = '50vw',
}) => {
  const [activeSplitter, setActiveSplitter] = useState(initialActiveSplitter);
  useEffect(() => {
    setActiveSplitter(initialActiveSplitter);
  }, [initialActiveSplitter]);
  const calculateMaxWidth = () => {
    if (placeholderWidth.endsWith('vw')) {
      const vwValue = parseFloat(placeholderWidth.replace('vw', ''));
      return `${(402 * (vwValue / 100)).toFixed(2)}px`;
    }
    return placeholderWidth; // 만약 vw가 아니면 그대로 반환
  };
  return (
    <div className={`${styles.splittersContainer} ${isDark ? styles.darkMode : ''}`} style={splitterStyle}>
      {/* Splitters Header */}
      <div className={`${styles.splittersHeader} ${isDark ? styles.darkHeader : ''}`} style={headerStyle}>
        {splitters.map((splitter, index) =>
          splitter.isPlaceholder ? (
            <div
              key={index}
              className={styles.placeholderSplitter}
              style={{width: placeholderWidth, maxWidth: calculateMaxWidth()}}
            ></div>
          ) : (
            <div key={index} className={styles.splitterItem} style={itemStyle}>
              {splitter.labelType && splitter.labelType === 'OnlyIcon' ? (
                <div
                  key={index}
                  className={`${styles.splitterLabel} ${activeSplitter === index ? styles.activeSplitter : ''} ${
                    isDark ? styles.darkSplitterLabel : ''
                  } ${splitter.isDisabled ? styles.disabledSplitter : ''}`}
                  onClick={() => {
                    if (!splitter.isDisabled) {
                      setActiveSplitter(index);
                      if (onSelectSplitButton) onSelectSplitButton(index);
                    }
                  }}
                >
                  <img className={styles.labelIcon} src={splitter.labelIconSrc} />
                </div>
              ) : (
                <div
                  key={index}
                  className={`${styles.splitterLabel} ${activeSplitter === index ? styles.activeSplitter : ''} ${
                    isDark ? styles.darkSplitterLabel : ''
                  } ${splitter.isDisabled ? styles.disabledSplitter : ''}`}
                  onClick={() => {
                    if (!splitter.isDisabled) {
                      setActiveSplitter(index);
                      if (onSelectSplitButton) onSelectSplitButton(index);
                    }
                  }}
                >
                  {splitter.label}
                </div>
              )}
              {activeSplitter === index && (
                <div className={`${styles.splitterDivider} ${isDark ? styles.darkDivider : ''}`}></div>
              )}
            </div>
          ),
        )}
      </div>

      {splitters[activeSplitter] && splitters[activeSplitter].preContent}

      <div className={`${styles.splitterContent} ${isDark ? styles.darkContent : ''}`} style={contentStyle}>
        {splitters[activeSplitter] && splitters[activeSplitter].content}
      </div>
    </div>
  );
};

export default Splitters;
