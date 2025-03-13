import React, {useEffect, useState} from 'react';
import styles from './DrawerDonation.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {BoldRadioButton, BoldRadioButtonSelectedBlack, BoldStar, LineRegenerate} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import CustomInput from '@/components/layout/shared/CustomInput';

interface DrawerDonationProps {
  isOpen: boolean;
  sponsoredName: string; // 후원받을 사람 이름
  onClose: () => void;
}

const DrawerDonation: React.FC<DrawerDonationProps> = ({isOpen, sponsoredName, onClose}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile); // 내 피디 이름
  const [inputValue, setInputValue] = useState('');

  const handleRadioClick = (value: number) => {
    setSelectedValue(value);
    setInputValue(value.toString()); // 숫자를 문자열로 변환하여 input 필드에 반영
  };

  // 입력값 변경 시 실행되는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    setInputValue(value); // 입력 필드의 값 업데이트
  };

  // Send 버튼 클릭 시 alert 창에 숫자 출력
  const handleSendClick = () => {
    if (inputValue !== '') {
      alert(`입력된 후원 금액: ${inputValue} EA`); // 알림창 띄우기
    } else {
      alert('후원 금액을 입력하세요!'); // 값이 없을 때 경고 메시지
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(null); // 라디오 버튼 선택 초기화
      setInputValue(''); // 입력 필드 초기화
    }
  }, [isOpen]);

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
          <img className={styles.star} src={BoldStar.src}></img>
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

        <div className={styles.itemArea}>
          <CustomInput
            inputType="TwoIcon"
            textType="InputOnly"
            state="Default"
            value={inputValue}
            placeholder={''}
            onChange={handleInputChange}
            customClassName={[styles.inputField]}
            iconLeftImage={BoldStar.src}
            iconLeftStyle={{
              width: '24px',
              height: '24px',
              padding: '0',
              filter:
                'brightness(0) saturate(100%) invert(72%) sepia(76%) saturate(708%) hue-rotate(358deg) brightness(102%) contrast(107%)',
            }}
            iconRight="EA"
          />
        </div>
        <div className={styles.buttonContainer}>
          <CustomButton
            size="Medium"
            type="Tertiary"
            state="Normal"
            onClick={onClose}
            customClassName={[styles.newButton]}
          >
            Cancel
          </CustomButton>
          <CustomButton
            size="Medium"
            type="Primary"
            state="Normal"
            onClick={handleSendClick}
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
