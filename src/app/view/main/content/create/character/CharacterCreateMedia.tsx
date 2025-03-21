'use client';
import {BoldInfo, BoldLock, BoldUnLock, LineArrowDown, LineDelete, LineEdit} from '@ui/Icons';
import styles from './CharacterCreateMedia.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import {CharacterMediaInfo} from '@/app/NetWork/CharacterNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';
import {useState} from 'react';

interface Props {
  mediaItems: CharacterMediaInfo[];
  selectedItemIdx: number;
  onClickCreateMedia: () => void;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
  handleSelected: (value: number) => void;
  handleSetSpoiler: (value: boolean, index: number) => void;
  handleAddMediaItem: () => void;
  handleDeleteMediaItem: (index: number) => void;
  handleEditMediaItem: (index: number) => void;
  handleMoveMediaItem: (index: number, direction: 'up' | 'down') => void;
}

const Header = 'CreateCharacter';

const CharacterCreateMedia: React.FC<Props> = ({
  mediaItems,
  selectedItemIdx,
  onClickCreateMedia,
  handlePromptChange,
  handleSelected,
  handleSetSpoiler,
  handleAddMediaItem,
  handleDeleteMediaItem,
  handleEditMediaItem,
  handleMoveMediaItem,
}) => {
  const renderMediaItem = (
    item: CharacterMediaInfo,
    index: number,
    handlerPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void,
    handlerSelected: (value: number) => void,
    handlerSetSpoiler: (value: boolean, index: number) => void,
    handleDelete: (index: number) => void,
    handleEdit: (index: number) => void,
    handleMove: (index: number, direction: 'up' | 'down') => void,
  ) => {
    const KEYWORDS: Record<string, string> = {
      '{{user}}': 'user',
      '{{char}}': 'character',
    };

    return (
      <div className={styles.mediaItem}>
        <div className={styles.mediaItemContent}>
          <div
            className={`${styles.mediaImage}`}
            style={{backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none'}}
            onClick={() => handlerSelected(index)}
          >
            <button
              className={styles.lockButton}
              onClick={e => {
                e.stopPropagation();
                handlerSetSpoiler(!item.isSpoiler, index);
              }}
            >
              <img className={styles.lockIcon} src={item.isSpoiler ? BoldLock.src : BoldUnLock.src} />
            </button>
          </div>
          <div className={styles.imageExplainArea}>
            {/* <ButtonPromptInput
              promptRef={promptRefs[index]}
              value={item.activationCondition}
              setValue={value => handlePromptChange(value, index)}
              onClickAI={() => {}}
              placeholder={getLocalizedText('Common', 'common_sample_057')}
              Keywords={KEYWORDS}
              showAutoComplete={showAutoCompleteState[index]}
              dropdownPos={dropdownPositionState[index]}
              setDropdownPosition={pos =>
                setDropdownPositionState(prev => {
                  const newState = [...prev];
                  newState[index] = pos;
                  return newState;
                })
              }
            /> */}
            <MaxTextInput
              inputDataType={inputType.None}
              stateDataType={inputState.Normal}
              displayDataType={displayType.Default}
              promptValue={item.activationCondition}
              handlePromptChange={event => handlerPromptChange(event, index)}
              placeholder={getLocalizedText('Common', 'common_sample_057')}
              style={{width: '100%'}}
            />
            <div className={styles.mediaItemButtonArea}>
              <div className={styles.leftButtonGroup}>
                <button className={styles.mediaItemButton} onClick={() => handleDelete(index)}>
                  <img className={styles.mediaButtonIcon} src={LineDelete.src} />
                </button>
                <button className={styles.mediaItemButton} onClick={() => handleEdit(index)}>
                  <img className={styles.mediaButtonIcon} src={LineEdit.src} />
                </button>
              </div>

              <div className={styles.rightButtonGroup}>
                <button className={styles.moveItemIndexButton} onClick={() => handleMove(index, 'up')}>
                  <img
                    className={styles.moveItemIndexIcon}
                    src={LineArrowDown.src}
                    style={{transform: 'rotate(180deg)'}}
                  />
                </button>
                <button className={styles.moveItemIndexButton} onClick={() => handleMove(index, 'down')}>
                  <img className={styles.moveItemIndexIcon} src={LineArrowDown.src} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.mediaContainer}>
      <div className={styles.mediaInfoArea}>
        <div className={styles.mediaInfoButton}>
          <img className={styles.mediaInfoIcon} src={BoldInfo.src} />
        </div>
        <div className={styles.mediaInfoDecs}>
          {formatText(getLocalizedText(Header, 'createcharacter015_desc_001'))}
        </div>
      </div>
      <div className={styles.mediaItemArea}>
        <div className={styles.mediaButtonArea}>
          <CustomButton
            size="Small"
            state="Normal"
            type="Primary"
            onClick={onClickCreateMedia}
            customClassName={[styles.mediaAddButton]}
          >
            {getLocalizedText('Common', 'common_button_add')}
          </CustomButton>
        </div>

        <ul className={styles.mediaList}>
          {mediaItems?.map((item, index) => (
            <li key={item.id ?? index}>
              {renderMediaItem(
                item,
                index,
                handlePromptChange,
                handleSelected,
                handleSetSpoiler,
                handleDeleteMediaItem,
                handleEditMediaItem,
                handleMoveMediaItem,
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CharacterCreateMedia;
