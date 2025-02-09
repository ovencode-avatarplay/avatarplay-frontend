import React, {useEffect, useRef, useState} from 'react';
import styles from './CustomToolTip.module.css'; // 툴팁 스타일

interface CustomToolTipProps {
  tooltipText: string;
  tooltipStyle?: React.CSSProperties;
}

const CustomToolTip: React.FC<CustomToolTipProps> = ({tooltipText, tooltipStyle}) => {
  const [tooltipClicked, setTooltipClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 툴팁 외부를 클릭하면 툴팁을 닫는 함수
  const handleClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setTooltipClicked(false);
      setShowTooltip(false); // 툴팁 닫기
    }
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => {
    if (!tooltipClicked) {
      setShowTooltip(false);
    }
  };

  const handleOnClick = () => {
    setTooltipClicked(!tooltipClicked);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside); // 컴포넌트 언마운트 시 이벤트 핸들러 제거
    };
  }, []);

  return (
    <div className={styles.tooltipContainer}>
      <button
        ref={buttonRef}
        className={styles.btnToolTip}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOnClick}
      >
        <img className={styles.iconQuestion} src={require('@ui/Icons').BoldQuestion.src} alt="Question" />
      </button>
      {(tooltipClicked || (!tooltipClicked && showTooltip)) && (
        <div ref={tooltipRef} className={styles.tooltip} style={tooltipStyle}>
          <div className={styles.tooltipText}>{tooltipText}</div>
        </div>
      )}
    </div>
  );
};

export default CustomToolTip;
