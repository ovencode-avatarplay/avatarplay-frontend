import React, {useState} from 'react';
import styles from './TermsAndConditions.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {LineDashboard} from '@ui/Icons';

interface TermsAndConditionsProps {
  onNext: () => void;
  onPrev: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({onNext, onPrev}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onNext();
    } else {
      alert('You need to agree to the terms before proceeding.');
    }
  };

  return (
    <div className={styles.container}>
      <CustomArrowHeader
        title="Terms and conditions"
        onClose={onPrev}
        children={
          <div className={styles.rightArea}>
            <button className={styles.dashBoard} onClick={() => {}}>
              <img className={styles.dashBoardIcon} src={LineDashboard.src} />
            </button>
          </div>
        }
      />
      <div className={styles.titleText}>Terms of Use</div>

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
        <span className={styles.agreeText}>I agree</span>
      </div>

      <button className={styles.confirmButton} onClick={handleConfirm}>
        Confirm
      </button>
    </div>
  );
};

export default TermsAndConditions;
