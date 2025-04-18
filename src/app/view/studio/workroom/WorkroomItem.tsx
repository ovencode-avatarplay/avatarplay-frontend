import {BoldBookMark, BoldBookMarkWhite, BoldMenuDots, LineBookMark} from '@ui/Icons';
import styles from './WorkroomItem.module.css';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';

interface Props {
  detailView: boolean;
  item: WorkroomItemInfo;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClickFavorite: (favorite: boolean) => void;
  onClickMenu: () => void;
  onClickPreview: () => void;
}

export interface WorkroomItemInfo {
  id: number;
  imgUrl: string;
  name: string;
  detail: string;
  favorite?: boolean;
  trash?: boolean;
  trashedTime?: string;
  generatedInfo?: GeneratedItemInfo | null;
}

export interface GeneratedItemInfo {
  generatedType: number /* number or Enum */;
  generateModel: string /* number or Enum */;
  positivePrompt: string;
  negativePrompt: string;
  seed: number;
  imageSize: string;
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
}) => {
  const renderFileInfoArea = () => {
    return (
      <div className={styles.fileInfoArea}>
        <div className={styles.infoLeftArea}>
          <div className={styles.fileName}>{item.name}</div>
          <div className={styles.fileDetail}>{item.detail}</div>
        </div>
        <div className={styles.infoRightArea}>
          {detailView && (
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
          <button className={styles.btnMenu} onClick={onClickMenu}>
            <img className={styles.btnIcon} src={BoldMenuDots.src} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.workroomItem}>
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
          {renderFileInfoArea()}
        </div>
      ) : (
        <div className={styles.largeViewContainer}>
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
          >
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
          </div>
          {renderFileInfoArea()}
        </div>
      )}
    </div>
  );
};

export default WorkroomItem;
