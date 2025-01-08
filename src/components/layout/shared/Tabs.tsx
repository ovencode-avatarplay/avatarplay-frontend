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
  contentStyle?: React.CSSProperties;
  isDark?: boolean;
  placeholderWidth?: string; // 더미 탭의 width
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  initialActiveTab = 0,
  contentStyle,
  isDark = false,
  placeholderWidth = '50vw', // 기본값: 50vw
}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  return (
    <div className={`${styles.tabsContainer} ${isDark ? styles.darkMode : ''}`}>
      {/* Tabs Header */}
      <div className={`${styles.tabsHeader} ${isDark ? styles.darkHeader : ''}`}>
        {tabs.map((tab, index) =>
          tab.isPlaceholder ? (
            <div key={index} className={styles.placeholderTab} style={{width: placeholderWidth}}></div>
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
