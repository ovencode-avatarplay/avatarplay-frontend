import React, {useState} from 'react';
import styles from './Tabs.module.css';

interface Tab {
  label: string;
  preContent?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialActiveTab?: number;
}

const Tabs: React.FC<TabsProps> = ({tabs, initialActiveTab = 0}) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  return (
    <>
      <div className={styles.tabsContainer}>
        {/* Tabs Header */}
        <div className={styles.tabsHeader}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`${styles.tabLabel} ${activeTab === index ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
              {activeTab === index && <div className={styles.tabDivider}></div>}
            </div>
          ))}
        </div>

        {tabs[activeTab] && tabs[activeTab].preContent}

        {/* Tabs Content */}
        <div className={styles.tabContent}>{tabs[activeTab] && tabs[activeTab].content}</div>
      </div>
    </>
  );
};

export default Tabs;
