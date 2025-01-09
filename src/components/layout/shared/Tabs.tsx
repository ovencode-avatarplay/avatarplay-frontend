import React, {useState} from 'react';
import styles from './Tabs.module.css';

interface Tab {
  label: string;
  preContent?: React.ReactNode;
  content: React.ReactNode;
  isPlaceholder?: boolean; // 더미 탭
}

interface TabsProps {
  tabs: Tab[];
  initialActiveTab?: number;
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  isDark?: boolean;
  placeholderWidth?: string; // 더미 탭의 width
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  initialActiveTab = 0,
  headerStyle,
  contentStyle,
  isDark = false,
  placeholderWidth = '50vw', // 기본값: 50vw
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const calculateMaxWidth = () => {
    if (placeholderWidth.endsWith('vw')) {
      const vwValue = parseFloat(placeholderWidth.replace('vw', ''));
      return `${(402 * (vwValue / 100)).toFixed(2)}px`;
    }
    return placeholderWidth; // 만약 vw가 아니면 그대로 반환
  };
  return (
    <div className={`${styles.tabsContainer} ${isDark ? styles.darkMode : ''}`}>
      {/* Tabs Header */}
      <div className={`${styles.tabsHeader} ${isDark ? styles.darkHeader : ''}`} style={headerStyle}>
        {tabs.map((tab, index) =>
          tab.isPlaceholder ? (
            <div
              key={index}
              className={styles.placeholderTab}
              style={{width: placeholderWidth, maxWidth: calculateMaxWidth()}}
            ></div>
          ) : (
            <div
              key={index}
              className={`${styles.tabLabel} ${activeTab === index ? styles.activeTab : ''} ${
                isDark ? styles.darkTabLabel : ''
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
              {activeTab === index && (
                <div className={`${styles.tabDivider} ${isDark ? styles.darkDivider : ''}`}></div>
              )}
            </div>
          ),
        )}
      </div>

      {tabs[activeTab] && tabs[activeTab].preContent}

      <div className={`${styles.tabContent} ${isDark ? styles.darkContent : ''}`} style={contentStyle}>
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
