// components/EventTriggerContainer.tsx
import React, {ReactNode, useState} from 'react';
import styles from './EventTriggerContainer.module.css';
import {BoldMenuDots, BoldMessenger, BoldStar, LineCopy, LineDelete, LineTime} from '@ui/Icons';
import {CharacterEventTriggerInfo, CharacterEventTriggerType, EmotionState} from '@/app/NetWork/CharacterNetwork';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  triggerType: CharacterEventTriggerType;
  items: CharacterEventTriggerInfo[];
  getHeaderIcon: (type: CharacterEventTriggerType) => string;
  getTriggerName: string | React.ReactNode;
  getEmojiIcon: (emotion: EmotionState) => string;
  onClick: (type: CharacterEventTriggerType) => void;
  onItemClick: (index: number) => void;
  onAddItem: () => void;
  onDeleteTriggerType: (type: CharacterEventTriggerType) => void;
}

const EventTriggerContainer: React.FC<Props> = ({
  triggerType,
  items,
  getHeaderIcon,
  getTriggerName,
  getEmojiIcon,
  onClick,
  onItemClick,
  onAddItem,
  onDeleteTriggerType,
}) => {
  const [isDropDown, setIsDropDown] = useState<boolean>(false);

  return (
    <div className={styles.eventTriggerItemContainer} onClick={() => onClick(triggerType)}>
      <div className={styles.eventTriggerHeader}>
        <div className={styles.headerLeftArea}>
          <img
            className={`${styles.headerIcon} ${
              triggerType !== CharacterEventTriggerType.ChangeBackgroundByEmotion &&
              triggerType !== CharacterEventTriggerType.SendMediaByEmotion
                ? styles.blackIcon
                : ''
            }`}
            src={getHeaderIcon(triggerType)}
          />
          <div className={styles.headerTitle}>{getTriggerName}</div>
        </div>
        <div className={styles.headerRightArea}>
          <div className={styles.triggerCounter}>{items.length}</div>
          <button
            className={styles.headerButton}
            onClick={e => {
              e.stopPropagation();
              // dropdown trigger 가능
              setIsDropDown(true);
            }}
          >
            <img className={styles.headerButtonIcon} src={BoldMenuDots.src} />
          </button>
        </div>
      </div>

      <ul className={styles.eventTriggerList}>
        {items.map((item, index) => (
          <li key={item.id ?? index}>
            <div className={styles.eventTriggerItem}>
              <div className={styles.eventTriggerItemContent}>
                <div className={styles.eventTriggerMedia} onClick={() => onItemClick(index)}>
                  {item.mediaType === MediaState.Video ? (
                    <video
                      src={item.mediaUrl}
                      className={styles.videoPreview}
                      muted
                      preload="metadata"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                      }}
                      controls={false}
                      playsInline
                    />
                  ) : (
                    <div
                      className={styles.imagePreview}
                      style={{
                        backgroundImage: item.mediaUrl ? `url(${item.mediaUrl})` : '',
                        backgroundSize: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  )}

                  {item.triggerType === CharacterEventTriggerType.SendMessageByElapsedTime && (
                    <img className={styles.messageIcon} src={BoldMessenger.src} />
                  )}

                  {item.emotionState !== undefined ? (
                    <div className={styles.emotionBack}>
                      <img className={styles.emotionIcon} src={getEmojiIcon(item.emotionState)} alt="emotion" />
                    </div>
                  ) : item.elapsedTime !== undefined ? (
                    <div className={styles.triggerSummaryBox}>
                      <img className={styles.triggerSummaryIcon} src={LineTime.src} />
                      <div className={styles.triggerSummaryText}>{item.elapsedTime + 'h'}</div>
                    </div>
                  ) : item.getStar !== undefined ? (
                    <div className={styles.triggerSummaryBox}>
                      <img className={styles.triggerSummaryIcon} src={BoldStar.src} />
                      <div className={styles.triggerSummaryText}>{item.getStar}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isDropDown && (
        <>
          <div className={styles.editDropdDownBack} onClick={() => setIsDropDown(false)}></div>
          <div className={styles.editDropdDown}>
            <div className={styles.dropdown}>
              <div
                className={styles.dropdownItem}
                onClick={e => {
                  e.stopPropagation();
                  onAddItem();
                  setIsDropDown(false);
                }}
              >
                <span className={styles.label}>{getLocalizedText('common_button_additem')}</span>
                <img src={LineCopy.src} className={styles.icon} />
              </div>
              <div
                className={`${styles.dropdownItem} ${styles.deleteItemLabel}`}
                onClick={e => {
                  e.stopPropagation();
                  onDeleteTriggerType(triggerType);
                  setIsDropDown(false);
                }}
              >
                <span className={styles.deleteItemLabel}>{getLocalizedText('common_button_delete')}</span>
                <img src={LineDelete.src} className={styles.deleteItemIcon} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventTriggerContainer;
