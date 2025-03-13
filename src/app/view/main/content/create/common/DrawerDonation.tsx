import React, {useState} from 'react';
import styles from './DrawerDonation.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {BoldRadioButton, BoldRadioButtonSelectedBlack, BoldStar, LineRegenerate} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

interface DrawerDonationProps {
  isOpen: boolean;
  sponsoredName: string; // 후원받을 사람 이름
  onClose: () => void;
  //onDonationBack: () => {};
}

const DrawerDonation: React.FC<DrawerDonationProps> = ({isOpen, sponsoredName, onClose}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile); // 내 피디 이름

  const handleRadioClick = (value: number) => {
    setSelectedValue(value);
  };
  return (
    <>
      <CustomDrawer
        className={styles.titleText}
        open={isOpen}
        onClose={onClose}
        title="Donation"
        contentStyle={{padding: '0'}}
        customTitle={styles.parentTitleArea}
      >
        <div className={styles.donationUserInfoText}>
          {dataProfile.currentProfile?.name} sponsored {sponsoredName}
        </div>

        <div className={styles.donationHaveStarArea}>
          <img className={styles.donationStar} src={BoldStar.src}></img>
          <span className={styles.donationStarAmount}>999.9K</span>
          <div className={styles.donationCharge}>
            <div className={styles.donationChargeText}>Charge</div>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {[33, 100, 200, 500, 1000, 3000].map(value => (
            <div key={value} className={styles.card} onClick={() => handleRadioClick(value)}>
              <img className={styles.donationStar} src={BoldStar.src} alt="star" />
              <div className={styles.radioRow}>
                {/* ✅ 선택된 경우 checked 이미지 적용 */}
                <img
                  className={styles.radio}
                  src={selectedValue === value ? BoldRadioButtonSelectedBlack.src : BoldRadioButton.src}
                  alt="radio"
                />
                <span>{value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.inputBox}>
          <img src={BoldStar.src} className={styles.donationStar}></img>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Enter Price..."
            value={99}
            onChange={() => {}}
          />
          <span className={styles.starlabel}>EA</span>
        </div>
        <div className={styles.buttonContainer}>
          <CustomButton
            size="Medium"
            type="Tertiary"
            state="Normal"
            onClick={() => {}}
            customClassName={[styles.newButton]}
          >
            Cancel
          </CustomButton>
          <CustomButton
            size="Medium"
            type="Primary"
            state="Normal"
            onClick={() => {}}
            customClassName={[styles.newButton]}
          >
            Send
          </CustomButton>
        </div>
      </CustomDrawer>
    </>
  );
};

export default DrawerDonation;
