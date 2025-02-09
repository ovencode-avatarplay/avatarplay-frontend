import React, {useState} from 'react';
import styles from './MessageTabMenu.module.css';

export enum MessageTabType {
  Chat = 'Chat',
  Story = 'Story',
  DM = 'DM',
  ForYou = 'ForYou',
}

interface Props {
  onTabChange?: (tab: MessageTabType) => void;
}

const MessageTabMenu: React.FC<Props> = ({onTabChange}) => {
  const [activeTab, setActiveTab] = useState<MessageTabType>(MessageTabType.Chat);

  const handleTabClick = (tab: MessageTabType) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab); // 외부에서 상태를 알 수 있도록 콜백 실행
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        {Object.values(MessageTabType).map(tab => (
          <div
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
            <div className={styles.underline} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageTabMenu;
