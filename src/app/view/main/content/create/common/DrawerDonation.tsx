import React, {useEffect, useState} from 'react';
import styles from './DrawerDonation.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {BoldRadioButton, BoldRadioButtonSelectedBlack, BoldStar, LineRegenerate} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import CustomInput from '@/components/layout/shared/CustomInput';
import {getLocalizedLink, isLogined} from '@/utils/UrlMove';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {GiftStarReq, sendGiftStar} from '@/app/NetWork/ShopNetwork';
import {setStar} from '@/redux-store/slices/Currency';

interface DrawerDonationProps {
  isOpen: boolean;
  sponsoredName: string; // 후원받을 사람 이름
  giveToPDId: number; // 후원받을 PD ID
  onClose: () => void;
  router?: AppRouterInstance; // 게스트 유저를 로그인 시키기 위한 라우터 ( 로그인할지 판단을 서버에서 판정하지 않고  프론트에서 판단할 때 사용 )
}

const DrawerDonation: React.FC<DrawerDonationProps> = ({isOpen, sponsoredName, giveToPDId, onClose, router}) => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile); // 내 피디 이름
  const [inputValue, setInputValue] = useState('');

  const dataStarInfo = useSelector((state: RootState) => state.starInfo);
  const [starAmount, setStarAmount] = useState<number>(0);
  const starInfo = dataStarInfo.star;

  useEffect(() => {
    // starInfo가 숫자라면 그대로 사용, 아니라면 0으로 설정
    setStarAmount(starInfo);
  }, [starInfo]); // starInfo가 변경될 때마다 실행

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
  const handleSendClick = async () => {
    const reqData: GiftStarReq = {
      giftProfileId: giveToPDId,
      giftStar: Number(inputValue),
    };
    if (inputValue !== '') {
      alert(`입력된 후원 금액: ${inputValue} EA    pdid : ${giveToPDId}`); // 알림창 띄우기
      try {
        const response = await sendGiftStar(reqData);
        if (typeof response.data?.myStar === 'number') {
          dispatch(setStar(response.data?.myStar));
        }
      } catch (error) {
        console.error('Message send failed:', error);
        throw new Error('Failed to send cheat message'); // Propagate the error
      }
    } else {
      alert('후원 금액을 입력하세요!'); // 값이 없을 때 경고 메시지
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedValue(null);
      setInputValue('');

      (async () => {
        const isLoggedIn = await checkLogined();
        if (!isLoggedIn) {
          const urlLogin = getLocalizedLink('/auth');
          router?.push(urlLogin);
        }
      })();
    }
  }, [isOpen]);

  async function checkLogined(): Promise<boolean> {
    return await isLogined();
  }
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
          {dataProfile?.currentProfile?.name} sponsored {sponsoredName}
        </div>

        <div className={styles.donationHaveStarArea}>
          <img className={styles.star} src={BoldStar.src}></img>
          <span className={styles.donationStarAmount}>{starAmount}</span>
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
