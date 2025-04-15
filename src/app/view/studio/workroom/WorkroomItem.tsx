import {BoldMenuDots} from '@ui/Icons';
import styles from './WorkroomItem.module.css';

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
          <div
            className={styles.fileImage}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.5)), url(${
                item.imgUrl ? item.imgUrl : '/images/001.png'
              })`,
              backgroundSize: 'cover',
            }}
          />
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
          />
          {renderFileInfoArea()}
        </div>
      )}
    </div>
  );
};

export default WorkroomItem;
