import styles from './WorkroomItem.module.css';

interface Props {
  detailView: boolean;
}

const WorkroomItem: React.FC<Props> = ({detailView}) => {
  const renderFileInfoArea = () => {
    return (
      <div className={styles.fileInfoArea}>
        <div className={styles.infoLeftArea}>
          <div className={styles.fileName}></div>
          <div className={styles.fileDetail}></div>
        </div>
        <div className={styles.infoRightArea}></div>
      </div>
    );
  };

  return (
    <div className={styles.workroomItem}>
      {detailView ? (
        <div className={styles.detailViewContainer}>
          <div className={styles.fileImage} style={{background: ''}} />
          {renderFileInfoArea()}
        </div>
      ) : (
        <div className={styles.largeViewContainer}>
          <div className={styles.fileImage} style={{background: ''}} />
          {renderFileInfoArea()}
        </div>
      )}
    </div>
  );
};

export default WorkroomItem;
