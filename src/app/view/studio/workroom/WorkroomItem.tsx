import {
  BoldAudio,
  BoldBookMark,
  BoldBookMarkWhite,
  BoldFolder,
  BoldImage,
  BoldMenuDots,
  BoldVideo,
  LineBookMark,
} from '@ui/Icons';
import styles from './WorkroomItem.module.css';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';
import GeneratedImagePreViewer from '@/components/layout/shared/GeneratedImagePreViewer';
import ImagePreViewer from '@/components/layout/shared/ImagePreViewer';
import VideoPreViewer from '@/components/layout/shared/VideoPreViewer';
import AudioPreViewer from '@/components/layout/shared/AudioPreViewer';
import {useEffect, useState} from 'react';
import getLocalizedText from '@/utils/getLocalizedText';
import {useAtom} from 'jotai';
import {ToastMessageAtom} from '@/app/Root';
import ReactDOM from 'react-dom';

interface Props {
  uploadItem?: boolean;
  detailView: boolean;
  item: WorkroomItemInfo;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClickFavorite?: (favorite: boolean) => void;
  onClickMenu?: () => void;
  blockDefaultPreview?: boolean;
  onClickPreview?: () => void;
  onClickItem?: () => void;
  onClickDelete?: () => void;
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
  profileCharacterIp?: CharacterIP;
  updateAt?: string;
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
  uploadItem,
  detailView,
  item,
  isSelecting,
  isSelected,
  onSelect,
  onClickFavorite,
  onClickMenu,
  blockDefaultPreview,
  onClickPreview,
  onClickItem,
  onClickDelete,
}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);

  const [imageViewOpen, setImageViewOpen] = useState<boolean>();
  const [videoViewerOpen, setVideoViewerOpen] = useState<boolean>();
  const [audioViewerOpen, setAudioViewerOpen] = useState<boolean>();

  const handlePreView = () => {
    console.log('adsf');
    if (!item || blockDefaultPreview) return;
    if (item.mediaState === MediaState.Image) {
      setImageViewOpen(true);
    } else if (item.mediaState === MediaState.Video) {
      setVideoViewerOpen(true);
    } else if (item.mediaState === MediaState.Audio) {
      setAudioViewerOpen(true);
    }
  };

  const handleDownload = () => {
    if (!item?.imgUrl) return;

    const link = document.createElement('a');
    link.href = item.imgUrl;
    link.download = item.name || 'download';
    link.click();

    dataToast.open(getLocalizedText('TODO : Download successfull!'));
  };

  useEffect(() => {
    setImageViewOpen(false);
    setVideoViewerOpen(false);
    setAudioViewerOpen(false);
  }, [item.id, item.trash]);

  const renderFileInfoArea = () => {
    return (
      <div className={uploadItem ? styles.uploadInfoArea : styles.fileInfoArea}>
        <div className={styles.infoLeftArea}>
          <div className={styles.fileNameArea}>
            {uploadItem && (
              <img
                className={detailView ? styles.categoryIconDetailView : styles.categoryIcon}
                src={
                  item.mediaState === MediaState.None
                    ? BoldFolder.src
                    : item.mediaState === MediaState.Image
                    ? BoldImage.src
                    : item.mediaState === MediaState.Video
                    ? BoldVideo.src
                    : item.mediaState === MediaState.Audio
                    ? BoldAudio.src
                    : ''
                }
              />
            )}
            <div className={styles.fileName}>{item.name}</div>
            {!uploadItem && item.profileId && (
              <div className={item.profileCharacterIp === CharacterIP.Original ? styles.original : styles.fan}>
                {item.profileCharacterIp === CharacterIP.Original ? 'Original' : 'Fan'}
              </div>
            )}
          </div>
          {!uploadItem && <div className={styles.fileDetail}>{item.detail}</div>}
        </div>
        {!uploadItem && (
          <div className={styles.infoRightArea}>
            {detailView && !item.trash && (onClickFavorite || item.favorite) && (
              <button
                className={styles.bookMarkButton}
                onClick={e => {
                  e.stopPropagation();
                  if (onClickFavorite) {
                    onClickFavorite(!item.favorite);
                  }
                }}
              >
                <img
                  className={`${styles.bookMarkIcon} ${item.favorite ? styles.selected : ''}`}
                  src={item.favorite ? BoldBookMark.src : LineBookMark.src}
                />
              </button>
            )}

            {onClickMenu && (
              <button
                className={styles.btnMenu}
                onClick={e => {
                  e.stopPropagation();
                  if (onClickMenu) {
                    onClickMenu();
                  }
                }}
              >
                <img className={styles.btnIcon} src={BoldMenuDots.src} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={styles.workroomItem}
      onClick={e => {
        e.stopPropagation();
        if (onClickItem) {
          onClickItem();
        }
      }}
    >
      {detailView ? (
        uploadItem ? (
          <div className={styles.detailUploadItemContainer}>{renderFileInfoArea()}</div>
        ) : (
          <div
            className={styles.detailViewContainer}
            onClick={e => {
              if (item.mediaState === MediaState.Audio) {
                console.log('zxcvz');
                e.stopPropagation();
                if (onClickPreview) {
                  onClickPreview();
                }
                handlePreView();
              }
            }}
          >
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
            {(item.mediaState === MediaState.None && !item.profileId) || item.mediaState === MediaState.Audio ? (
              <div
                className={styles.itemIcon}
                onClick={e => {
                  console.log('zxcvz');
                  e.stopPropagation();
                  if (onClickPreview) {
                    onClickPreview();
                  }
                  handlePreView();
                }}
              >
                <img
                  src={
                    item.mediaState === MediaState.None && !item.profileId
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
                  if (onClickPreview) {
                    onClickPreview();
                  }
                  handlePreView();
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
                  if (onClickPreview) {
                    onClickPreview();
                  }
                  handlePreView();
                }}
              ></div>
            )}
            {renderFileInfoArea()}
          </div>
        )
      ) : (
        <div
          className={styles.largeViewContainer}
          onClick={e => {
            e.stopPropagation();
            if (onClickPreview) {
              onClickPreview();
            }
            handlePreView();
          }}
        >
          <div
            className={styles.fileImage}
            style={{
              backgroundImage:
                item.mediaState === MediaState.Video
                  ? undefined
                  : `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                      item.mediaState === MediaState.Audio
                        ? BoldAudio.src
                        : item.mediaState === MediaState.None && !item.profileId
                        ? BoldFolder.src
                        : item.mediaState === MediaState.None && item.profileId
                        ? item.imgUrl
                        : item.imgUrl
                        ? item.imgUrl
                        : '/images/001.png'
                    })`,
              backgroundSize: 'cover',
              position: 'relative',
            }}
            onClick={e => {
              e.stopPropagation();

              if (onClickPreview) {
                onClickPreview();
              }
              handlePreView();
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
            {!item.trash && (onClickFavorite || item.favorite) && (
              <button
                className={styles.bookMarkButton}
                onClick={e => {
                  e.stopPropagation();
                  if (onClickFavorite) {
                    onClickFavorite(!item.favorite);
                  }
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
      {ReactDOM.createPortal(
        <>
          {imageViewOpen &&
            item &&
            (item.generatedInfo && item.generatedInfo.isUploaded === false ? (
              <GeneratedImagePreViewer
                workroomItemInfo={item}
                onClose={() => setImageViewOpen(false)}
                onToggleFavorite={() => {
                  if (onClickFavorite) onClickFavorite(!item.favorite);
                }}
                onDelete={onClickDelete}
                onDownload={handleDownload}
              />
            ) : (
              <ImagePreViewer imageUrl={item?.imgUrl || ''} onClose={() => setImageViewOpen(false)} />
            ))}
          {videoViewerOpen && item && item.mediaState === MediaState.Video && (
            <VideoPreViewer
              videoName={item.name}
              videoUrl={item?.imgUrl || ''}
              onClose={() => setVideoViewerOpen(false)}
            />
          )}
          {audioViewerOpen && item && item.mediaState === MediaState.Audio && (
            <AudioPreViewer
              audioName={item.name}
              audioUrl={item?.imgUrl || ''}
              thumbnailUrl="/images/001.png"
              onClose={() => setAudioViewerOpen(false)}
            />
          )}
        </>,
        document.body,
      )}
    </div>
  );
};

export default WorkroomItem;
