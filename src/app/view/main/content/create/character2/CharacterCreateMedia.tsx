import {BoldInfo, LineArrowDown, LineDelete, LineEdit} from '@ui/Icons';
import styles from './CharacterCreateMedia.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {useState} from 'react';
import {CharacterMediaInfo} from '@/redux-store/slices/ContentInfo';

interface Props {
  mediaItems: CharacterMediaInfo[];
  selectedItemIdx: number;
  onClickCreateMedia: () => void;
  handlePromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
  handleSelected: (value: number) => void;
  handleAddMediaItem: () => void;
  handleDeleteMediaItem: (index: number) => void;
  handleMoveMediaItem: (index: number, direction: 'up' | 'down') => void;
}

const CharacterCreateMedia: React.FC<Props> = ({
  mediaItems,
  selectedItemIdx,
  onClickCreateMedia,
  handlePromptChange,
  handleSelected,
  handleAddMediaItem,
  handleDeleteMediaItem,
  handleMoveMediaItem,
}) => {
  let mediaInfoDesc = `This image is displayed during conversation. If you describe each scene, AI shows it according to the situation. Please write the scene description in English if possible. {{char}} and {{user}} can also be used.`;

  const renderMediaItem = (
    item: CharacterMediaInfo,
    index: number,
    handlerPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void,
    handlerSelected: (value: number) => void,
    handleDelete: (index: number) => void,
    handleMove: (index: number, direction: 'up' | 'down') => void,
  ) => {
    return (
      <div className={styles.mediaItem}>
        <div className={styles.mediaItemContent}>
          <img className={styles.mediaImage} src={item.imageUrl} />
          <div className={styles.imageExplainArea}>
            <MaxTextInput
              inputDataType={inputType.None}
              stateDataType={inputState.Normal}
              displayDataType={displayType.Default}
              promptValue={item.description}
              handlePromptChange={event => handlerPromptChange(event, index)}
              placeholder="Image Explain"
              style={{width: '100%'}}
            />
            <div className={styles.mediaItemButtonArea}>
              <div className={styles.leftButtonGroup}>
                <button className={styles.mediaItemButton} onClick={() => handleDelete}>
                  <img className={styles.mediaButtonIcon} src={LineDelete.src} />
                </button>
                <button className={styles.mediaItemButton} onClick={() => {}}>
                  <img className={styles.mediaButtonIcon} src={LineEdit.src} />
                </button>
              </div>

              <div className={styles.rightButtonGroup}>
                {/* Profile Image
                <CustomRadioButton
                  displayType="buttonOnly"
                  shapeType="square"
                  value={index}
                  selectedValue={selectedItemIdx}
                  onSelect={(value: string | number) => handlerSelected(Number(value))}
                /> */}
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
        <div className={styles.mediaInfoDecs}>{mediaInfoDesc}</div>
      </div>
      <div className={styles.mediaButtonArea}>
        <CustomButton
          size="Small"
          state="Normal"
          type="Primary"
          onClick={onClickCreateMedia}
          customClassName={[styles.mediaAddButton]}
        >
          Create
        </CustomButton>
      </div>

      <ul className={styles.mediaList}>
        {mediaItems.map((item, index) =>
          renderMediaItem(item, index, handlePromptChange, handleSelected, handleDeleteMediaItem, handleMoveMediaItem),
        )}
      </ul>
    </div>
  );
};
export default CharacterCreateMedia;
