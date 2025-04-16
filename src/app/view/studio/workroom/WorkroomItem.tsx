import {BoldMenuDots, LineBookMark} from '@ui/Icons';
import styles from './WorkroomItem.module.css';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';

interface Props {
  detailView: boolean;
  item: WorkroomItemInfo;
}

export interface WorkroomItemInfo {
  imgUrl: string;
  name: string;
  detail: string;
}

const WorkroomItem: React.FC<Props> = ({detailView, item}) => {
  const renderFileInfoArea = () => {
    return (
      <div className={styles.fileInfoArea}>
        <div className={styles.infoLeftArea}>
          <div className={styles.fileName}>{item.name}</div>
          <div className={styles.fileDetail}>{item.detail}</div>
        </div>
        <div className={styles.infoRightArea}>
          {detailView && (
            <button className={styles.bookMarkButton}>
              <img className={`${styles.bookMarkIcon} ${styles.selected}`} src={LineBookMark.src} />
            </button>
          )}
          <button className={styles.btnMenu}>
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
          <div className={styles.selectButton}>
            <CustomCheckbox
              displayType="buttonOnly"
              shapeType="square"
              checked={true}
              onToggle={() => {}}
              containerStyle={{width: '100%', height: '100%'}}
            />
          </div>
          <div
            className={styles.fileImage}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                item.imgUrl ? item.imgUrl : '/images/001.png'
              })`,
              backgroundSize: 'cover',
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
          >
            <div className={styles.selectButton}>
              <CustomCheckbox
                displayType="buttonOnly"
                shapeType="square"
                checked={true}
                onToggle={() => {}}
                containerStyle={{width: '100%', height: '100%'}}
              />
            </div>
            <button className={styles.bookMarkButton}>
              <img className={`${styles.bookMarkIcon} ${styles.selected}`} src={LineBookMark.src} />
            </button>
          </div>
          {renderFileInfoArea()}
        </div>
      )}
    </div>
  );
};

export default WorkroomItem;
