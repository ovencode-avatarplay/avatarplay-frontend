import React from 'react';
import styles from './DrawerTagSelect.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {LineRegenerate} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';

interface TagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tagList: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onRefreshTags: () => void;
  maxTagCount: number;
  selectedTagAlertOn: boolean;
  setSelectedTagAlertOn: (state: boolean) => void;
}

const DrawerTagSelect: React.FC<TagDrawerProps> = ({
  isOpen,
  onClose,
  tagList,
  selectedTags,
  onTagSelect,
  onRefreshTags,
  maxTagCount,
  selectedTagAlertOn,
  setSelectedTagAlertOn,
}) => {
  return (
    <>
      <CustomDrawer
        open={isOpen}
        onClose={onClose}
        title={getLocalizedText('common_label_002')}
        contentStyle={{padding: '0px', marginTop: '20px'}}
      >
        <div className={styles.tagArea}>
          <button className={styles.tagRefreshButton} onClick={onRefreshTags}>
            <div className={styles.tagRefreshText}>{getLocalizedText('common_button_refresh')}</div>
            <img className={styles.tagRefreshIcon} src={LineRegenerate.src} />
          </button>
          {/* 태그 선택 부분 */}
          <div className={styles.tagSelect}>
            {tagList?.map(tag => (
              <CustomHashtag
                key={tag}
                text={getLocalizedText(`common_tag_${tag.toLowerCase()}`)}
                onClickAction={() => onTagSelect(tag)}
                isSelected={selectedTags.includes(tag)}
              />
            ))}
          </div>
        </div>
      </CustomDrawer>

      {selectedTagAlertOn && (
        <CustomPopup
          type="alert"
          title="Max Tag Count Alert"
          description={`maxTagCount : ${maxTagCount}`}
          buttons={[
            {
              label: 'Close',
              onClick: () => setSelectedTagAlertOn(false),
            },
          ]}
        />
      )}
    </>
  );
};

export default DrawerTagSelect;
