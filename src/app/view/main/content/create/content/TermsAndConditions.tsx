import React, {useState} from 'react';
import styles from './TermsAndConditions.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {LineDashboard} from '@ui/Icons';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import getLocalizedText from '@/utils/getLocalizedText';

interface TermsAndConditionsProps {
  isSingle: boolean;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({isSingle}) => {
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();
  const handleConfirm = () => {
    if (isChecked) {
      if (!isSingle) {
        pushLocalizedRoute(`/create/content/series`, router);
      } else pushLocalizedRoute(`/create/content/single`, router);
    } else {
      alert('You need to agree to the terms before proceeding.');
    }
  };

  return (
    <div className={styles.container}>
      <CustomArrowHeader
        title={getLocalizedText('createcontent002_title_001')}
        onClose={() => {
          pushLocalizedRoute(`/main/homefeed`, router);
        }}
        children={
          <div className={styles.rightArea}>
            <button className={styles.dashBoard} onClick={() => {}}>
              <img className={styles.dashBoardIcon} src={LineDashboard.src} />
            </button>
          </div>
        }
      />
      <div className={styles.articleList}>
        <div className={styles.titleText}>{getLocalizedText('createcontent002_label_002')}</div>

        <div className={styles.termsArea}>
          <div className={styles.contentBox}>
            <p className={styles.termsText}>
              Register
              <br />
              New Series
            </p>
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className={styles.checkbox}
            />
            <span className={styles.agreeText}>{getLocalizedText('createcontent002_desc_003')}</span>
          </div>
        </div>

        <button className={styles.confirmButton} onClick={handleConfirm}>
          {getLocalizedText('common_button_confirm')}
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
