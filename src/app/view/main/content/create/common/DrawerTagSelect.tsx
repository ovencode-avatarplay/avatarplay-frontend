import React from 'react';
import ReactDOM from 'react-dom';
import styles from './DrawerTagSelect.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {LineRegenerate} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

interface TagDrawerProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  tagList: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onRefreshTags: () => void;
  maxTagCount: number;
  selectedTagAlertOn: boolean;
  setSelectedTagAlertOn: (state: boolean) => void;
  descValue?: string;
}

const DrawerTagSelect: React.FC<TagDrawerProps> = ({
  title,
  isOpen,
  onClose,
  tagList,
  selectedTags,
  onTagSelect,
  onRefreshTags,
  maxTagCount,
  selectedTagAlertOn,
  setSelectedTagAlertOn,
  descValue = '',
}) => {
  return (
    <>
      <CustomDrawer open={isOpen} onClose={onClose} title={title} contentStyle={{padding: '0px', marginTop: '20px'}}>
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
                text={getLocalizedText(`${tag.toLowerCase()}`)}
                onClickAction={() => onTagSelect(tag)}
                isSelected={selectedTags.includes(tag)}
              />
            ))}
          </div>
        </div>
      </CustomDrawer>

      {selectedTagAlertOn &&
        ReactDOM.createPortal(
          <CustomPopup
            type="alert"
            title={getLocalizedText('common_alert_107')}
            description={formatText(getLocalizedText('common_alert_106'), [descValue, maxTagCount.toString()])}
            buttons={[
              {
                label: getLocalizedText('common_button_cancel'),
                onClick: () => setSelectedTagAlertOn(false),
              },
            ]}
          />,
          document.body,
        )}
    </>
  );
};

export default DrawerTagSelect;
