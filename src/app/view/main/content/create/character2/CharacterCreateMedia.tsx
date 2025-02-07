import {BoldInfo, LineDelete, LineEdit} from '@ui/Icons';
import styles from './CharacterCreateMedia.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {useState} from 'react';

interface MediaItem {
  index: number;
  promptValue: string;
  selectedValue: string;
}

interface MediaListProps {
  mediaItems: MediaItem[];
  handlerPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
  handlerSelected: (value: string) => void;
}

interface Props {}

const CharacterCreateMedia: React.FC<Props> = ({}) => {
  let mediaInfoDesc = `This image is displayed during conversation. If you describe each scene, AI shows it according to the situation. Please write the scene description in English if possible. {{char}} and {{user}} can also be used.`;
  const [mediaItems, setMediaItems] = useState([
    {index: 0, promptValue: 'Image 1 description', selectedValue: ''},
    {index: 1, promptValue: 'Image 2 description', selectedValue: ''},
    {index: 2, promptValue: 'Image 3 description', selectedValue: ''},
  ]);

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems[index].promptValue = event.target.value;
    setMediaItems(updatedMediaItems);
  };

  const handleSelected = (value: string) => {
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems.forEach(item => {
      item.selectedValue = item.index.toString() === value ? 'selected' : ''; // selected 상태 설정
    });
    setMediaItems(updatedMediaItems);
  };

  const renderMediaItem = (
    item: MediaItem,
    handlerPromptChange: (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void,
    handlerSelected: (value: string) => void,
  ) => {
    return (
      <div className={styles.mediaItem}>
        <div className={styles.mediaItemContent}>
          <div className={styles.mediaImage}></div>
          <div className={styles.imageExplainArea}>
            <MaxTextInput
              inputDataType={inputType.None}
              stateDataType={inputState.Normal}
              displayDataType={displayType.Default}
              promptValue={item.promptValue}
              handlePromptChange={event => handlerPromptChange(event, item.index)}
              placeholder="Image Explain"
              style={{width: '100%'}}
            />
            <div className={styles.mediaButtonArea}>
              <div className={styles.leftButtonGroup}>
                <button className={styles.mediaItemButton}>
                  <img className={styles.mediaButtonIcon} src={LineDelete.src} />
                </button>
                <button className={styles.mediaItemButton}>
                  <img className={styles.mediaButtonIcon} src={LineEdit.src} />
                </button>
              </div>

              <div className={styles.rightButtonGroup}>
                Profile Image
                <CustomRadioButton
                  displayType="buttonOnly"
                  shapeType="square"
                  value={item.index.toString()}
                  selectedValue={item.selectedValue}
                  onSelect={(value: string | number) => handlerSelected(String(value))}
                />
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
      <ul className={styles.mediaButtonArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={() => {}}
          customClassName={[styles.mediaButton]}
        >
          Create
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={() => {}}
          customClassName={[styles.mediaButton]}
        >
          Gallery
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={() => {}}
          customClassName={[styles.mediaButton]}
        >
          Workroom
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={() => {}}
          customClassName={[styles.mediaButton]}
        >
          My device
        </CustomButton>
      </ul>

      <ul className={styles.mediaList}>
        {mediaItems.map(item => renderMediaItem(item, handlePromptChange, handleSelected))}
      </ul>
    </div>
  );
};
export default CharacterCreateMedia;
