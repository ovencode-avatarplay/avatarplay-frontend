import React from 'react';
import styles from './GeneratedImagePreViewer.module.css';
import {LineBookMark, LineClose, LineDelete, LineDownload, LineShare} from '@ui/Icons';
import EmptyState from '@/components/search/EmptyState';
import getLocalizedText from '@/utils/getLocalizedText';
import {generatedItemInfo} from '@/app/view/studio/workroom/WorkroomItem';

interface Props {
  generatedInfo: generatedItemInfo;
  onClose: () => void;
}

const GeneratedImagePreViewer: React.FC<Props> = ({generatedInfo, onClose}) => {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={LineClose.src} className={styles.blackIcon} />
        </button>
        {generatedInfo ? (
          <div className={styles.viewerContainer}>
            <div
              className={styles.imageContainer}
              style={{
                backgroundImage: `url(${generatedInfo.imgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className={styles.buttonArea}>
              <button className={styles.buttonItem} onClick={() => {}}>
                <img src={LineBookMark.src} />
              </button>
              <button className={styles.buttonItem} onClick={() => {}}>
                <img src={LineShare.src} />
              </button>
              <button className={styles.buttonItem} onClick={() => {}}>
                <img src={LineDownload.src} />
              </button>
              <button className={styles.buttonItem} onClick={() => {}}>
                <img src={LineDelete.src} />
              </button>
            </div>
            <div className={styles.infoArea}>
              <div className={styles.infoItem}>
                <div className={styles.infoTitle}>{getLocalizedText('TODO : Image Size')}</div>
                <div className={styles.infoDesc}>{generatedInfo.imageSize}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoTitle}>{getLocalizedText('TODO : Generate Model')}</div>
                <div className={styles.infoDesc}>{generatedInfo.generateModel}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoTitle}>{getLocalizedText('TODO : Prompt')}</div>
                <div className={styles.infoDesc}>{generatedInfo.positivePrompt}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoTitle}>{getLocalizedText('TODO : Negative Prompt')}</div>
                <div className={styles.infoDesc}>{generatedInfo.negativePrompt}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoTitle}>{getLocalizedText('TODO : Seed')}</div>
                <div className={styles.infoDesc}>{generatedInfo.seed}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyStateWrapper}>
            <EmptyState stateText="It's Empty!" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedImagePreViewer;
