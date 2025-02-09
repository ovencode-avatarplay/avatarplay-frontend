import React, {useState} from 'react';
import styles from './MessageTagList.module.css';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';

export enum MessageTagType {
  All = 'All',
  My = 'My',
  Story = 'Story',
  Music = 'Music',
  Gravure = 'Gravure',
}

interface Props {
  onTagChange?: (tab: MessageTagType) => void;
}

const MessageTagList: React.FC<Props> = ({onTagChange: onTagChange}) => {
  const [activeTag, setActiveTag] = useState<MessageTagType>(MessageTagType.All);

  const handleTagClick = (tab: MessageTagType) => {
    setActiveTag(tab);
    if (onTagChange) {
      onTagChange(tab); // 외부에서 상태를 알 수 있도록 콜백 실행
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tags}>
        {Object.values(MessageTagType).map(tag => (
          <CustomHashtag
            isSelected={activeTag == tag ? true : false}
            onClickAction={() => handleTagClick(tag)}
            text={tag}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageTagList;
