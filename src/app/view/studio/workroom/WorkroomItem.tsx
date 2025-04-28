import {BoldAudio, BoldBookMark, BoldBookMarkWhite, BoldFolder, BoldMenuDots, LineBookMark} from '@ui/Icons';
import styles from './WorkroomItem.module.css';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

interface Props {
  detailView: boolean;
  item: WorkroomItemInfo;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClickFavorite: (favorite: boolean) => void;
  onClickMenu: () => void;
  onClickPreview: () => void;
  onClickItem: () => void;
}

export interface WorkroomItemInfo {
  id: number;
  name: string;
  detail: string;
  mediaState: MediaState;
  imgUrl?: string;
  folderLocation?: number[];
  favorite?: boolean;
  trash?: boolean;
  trashedTime?: string;
  generatedInfo?: GeneratedItemInfo | null;
  profileId?: number | null;
}

export interface GeneratedItemInfo {
  generatedType: number /* number or Enum */;
  generateModel: string /* number or Enum */;
  positivePrompt: string;
  negativePrompt: string;
  seed: number;
  imageSize: string;
  isUploaded: boolean;
}

const WorkroomItem: React.FC<Props> = ({
  detailView,
  item,
  isSelecting,
  isSelected,
  onSelect,
  onClickFavorite,
  onClickMenu,
  onClickPreview,
  onClickItem,
}) => {
  const renderFileInfoArea = () => {
    return (
      <div className={styles.fileInfoArea}>
        <div className={styles.infoLeftArea}>
          <div className={styles.fileName}>{item.name}</div>
          <div className={styles.fileDetail}>{item.detail}</div>
        </div>
        <div className={styles.infoRightArea}>
          {detailView && !item.trash && (
            <button
              className={styles.bookMarkButton}
              onClick={e => {
                e.stopPropagation();
                onClickFavorite(!item.favorite);
              }}
            >
              <img
                className={`${styles.bookMarkIcon} ${item.favorite ? styles.selected : ''}`}
                src={item.favorite ? BoldBookMark.src : LineBookMark.src}
              />
            </button>
          )}
          <button
            className={styles.btnMenu}
            onClick={e => {
              e.stopPropagation();
              onClickMenu();
            }}
          >
            <img className={styles.btnIcon} src={BoldMenuDots.src} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.workroomItem}
      onClick={e => {
        e.stopPropagation();
        onClickItem();
      }}
    >
      {detailView ? (
        <div className={styles.detailViewContainer}>
          {isSelecting && (
            <div className={styles.selectButton} onClick={e => e.stopPropagation()}>
              <CustomCheckbox
                displayType="buttonOnly"
                shapeType="square"
                checked={isSelected}
                onToggle={onSelect}
                containerStyle={{width: '100%', height: '100%'}}
              />
            </div>
          )}
          {item.mediaState === MediaState.None || item.mediaState === MediaState.Audio ? (
            <div
              className={styles.itemIcon}
              onClick={e => {
                e.stopPropagation();
                onClickPreview();
              }}
            >
              <img
                src={
                  item.mediaState === MediaState.None
                    ? BoldFolder.src
                    : item.mediaState === MediaState.Audio
                    ? BoldAudio.src
                    : ''
                }
              />
            </div>
          ) : item.mediaState === MediaState.Video ? (
            <video
              className={styles.fileImage}
              src={item.imgUrl}
              muted
              preload="metadata"
              onClick={e => {
                e.stopPropagation();
                onClickPreview();
              }}
              style={{objectFit: 'cover'}}
            />
          ) : (
            <div
              className={styles.fileImage}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                  item.imgUrl ? item.imgUrl : '/images/001.png'
                })`,
                backgroundSize: 'cover',
              }}
              onClick={e => {
                e.stopPropagation();
                onClickPreview();
              }}
            ></div>
          )}
          {renderFileInfoArea()}
        </div>
      ) : (
        <div
          className={styles.largeViewContainer}
          onClick={e => {
            e.stopPropagation();
            onClickPreview();
          }}
        >
          <div
            className={styles.fileImage}
            style={{
              backgroundImage:
                item.mediaState === MediaState.Video
                  ? undefined
                  : `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                      item.imgUrl ? item.imgUrl : '/images/001.png'
                    })`,
              backgroundSize: 'cover',
              position: 'relative',
            }}
            onClick={e => {
              e.stopPropagation();
              onClickPreview();
            }}
          >
            {item.mediaState === MediaState.Video && (
              <video
                src={item.imgUrl}
                muted
                preload="metadata"
                className={styles.videoPreview}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 'inherit',
                }}
              />
            )}
            {isSelecting && (
              <div className={styles.selectButton}>
                <CustomCheckbox
                  displayType="buttonOnly"
                  shapeType="square"
                  checked={isSelected}
                  onToggle={onSelect}
                  containerStyle={{width: '100%', height: '100%'}}
                />
              </div>
            )}
            {!item.trash && (
              <button
                className={styles.bookMarkButton}
                onClick={e => {
                  e.stopPropagation();
                  onClickFavorite(!item.favorite);
                }}
              >
                <img
                  className={`${styles.bookMarkIcon} ${item.favorite ? styles.selected : ''}`}
                  src={item.favorite ? BoldBookMark.src : BoldBookMarkWhite.src}
                />
              </button>
            )}
          </div>
          {renderFileInfoArea()}
        </div>
      )}
    </div>
  );
};

export default WorkroomItem;
