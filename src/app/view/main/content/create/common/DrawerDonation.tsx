import React, {useEffect, useState} from 'react';
import styles from './DrawerDonation.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {BoldRadioButton, BoldRadioButtonSelectedBlack, BoldStar, LineRegenerate} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import CustomInput from '@/components/layout/shared/CustomInput';
import {getLocalizedLink, isLogined, pushLocalizedRoute} from '@/utils/UrlMove';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
//import {GiftStarReq, sendGiftStar} from '@/app/NetWork/ShopNetwork';
import {setStar} from '@/redux-store/slices/Currency';
import {formatCurrency} from '@/utils/util-1';
import {useRouter} from 'next/navigation';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {useSignalRContext} from '@/app/view/main/SignalREventInjector';

interface DrawerDonationProps {
  isOpen: boolean;
  sponsoredName: string; // 후원받을 사람 이름
  giveToPDId: number; // 후원받을 PD ID
  onClose: () => void;
}

const DrawerDonation: React.FC<DrawerDonationProps> = React.memo(({isOpen, sponsoredName, giveToPDId, onClose}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile); // 내 피디 이름
  const [inputValue, setInputValue] = useState('');

  const dataCurrencyInfo = useSelector((state: RootState) => state.currencyInfo);
  const [starAmount, setStarAmount] = useState<number>(0);

  const [isShowStarLowMessage, setIsShowStarLowMessage] = useState(false); // star가 부족하다는 메시지박스 출력

  const starInfo = dataCurrencyInfo.star;
  const rubyInfo = dataCurrencyInfo.ruby;

  const signalR = useSignalRContext();
  const {sendGiftStar} = signalR || {};

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

  // 입력창을 클릭했다.
  const handleClickInput = () => {
    if (selectedValue !== null) {
      setSelectedValue(null);
      setInputValue(''); // 입력 필드의 값 업데이트
    }
  };

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  // Send 버튼 클릭 시 alert 창에 숫자 출력
  const handleSendClick = async () => {
    if (inputValue !== '') {
      //alert(`입력된 후원 금액: ${inputValue} EA    pdid : ${giveToPDId}`); // 알림창 띄우기
      if (Number(inputValue) > starInfo) {
        // 애러 메시지
        setIsShowStarLowMessage(true);
      } else {
        if (sendGiftStar) {
          console.log('sendGiftStar');
          await sendGiftStar(giveToPDId, Number(inputValue));
        }
        onClose();
      }
    } else {
      dataToast.open(getLocalizedText('common_alert_112'), ToastType.Normal);
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

  const handleRouterCharge = () => {
    pushLocalizedRoute(`/main/game/shop`, router);
  };
  return (
    <>
      <CustomDrawer
        className={styles.titleText}
        open={isOpen}
        onClose={onClose}
        title={getLocalizedText('shared010_title_001')}
        contentStyle={{padding: '0'}}
        customTitle={styles.parentTitleArea}
      >
        <div className={styles.donationUserInfoText}>
          {formatText(getLocalizedText('shared010_desc_002'), [dataProfile?.currentProfile?.name || '', sponsoredName])}
        </div>

        <div className={styles.donationHaveStarArea}>
          <img className={styles.star} src={BoldStar.src}></img>
          <span className={styles.donationStarAmount}>{formatCurrency(starAmount)}</span>
          <button className={styles.donationCharge} onClick={() => handleRouterCharge()}>
            <div className={styles.donationChargeText}>{getLocalizedText('common_button_charge')}</div>
          </button>
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

        <div className={styles.itemArea} onClick={() => handleClickInput()}>
          <CustomInput
            inputType="TwoIcon"
            textType="InputOnly"
            state="Default"
            border="Round"
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
            iconRight={getLocalizedText('createcontent007_label_010')}
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
            {getLocalizedText('common_button_cancel')}
          </CustomButton>
          <CustomButton
            size="Medium"
            type="Primary"
            state="Normal"
            onClick={handleSendClick}
            customClassName={[styles.newButton]}
          >
            {getLocalizedText('common_button_send')}
          </CustomButton>
        </div>
      </CustomDrawer>
      {isShowStarLowMessage && (
        <CustomPopup
          type="alert"
          title={getLocalizedText('Common', 'common_alert_046')}
          description={getLocalizedText('Common', 'common_alert_073')}
          buttons={[
            {
              label: getLocalizedText('Common', 'common_button_cancel'),
              onClick: () => {
                setIsShowStarLowMessage(false);
              },
              isPrimary: false,
            },
            {
              label: getLocalizedText('Common', 'common_button_charge'),
              onClick: () => {
                handleRouterCharge();
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </>
  );
});

export default DrawerDonation;
