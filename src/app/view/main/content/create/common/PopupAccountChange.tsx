import React, {useEffect, useState} from 'react';
import styles from './PopupAccountChange.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import getLocalizedText from '@/utils/getLocalizedText';
import {Box, Modal, Typography} from '@mui/material';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {BoldInfo} from '@ui/Icons';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import WithdrawMembership from './WithdrawMembership';
import CustomButton from '@/components/layout/shared/CustomButton';
interface Props {
  open: boolean;
  onClose: () => void;
}
const PopupAccountChange: React.FC<Props> = ({open, onClose}) => {
  const handleConfirm = async () => {};
  const infoList = [
    'Once your member information is deleted, it cannot be recovered by any means.',
    'Upon withdrawal, profile information and other member data created on Caveduck will be deleted.',
    'You cannot sign up with the same email account for 7 days.',
    'Created characters will not be deleted. Please delete them yourself before withdrawing if necessary.',
  ];
  const [onWithdrawMembershipPopup, setOnWithdrawMembershipPopup] = useState(false);
  const [slugValue, setSlugValue] = useState<string>('');
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setSlugValue(e.target.value);
    }
  };
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const [websiteValue, setWebsiteValue] = useState<string>('');
  const handlewebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setWebsiteValue(e.target.value);
    }
  };

  const [introductionValue, setIntroductionValue] = useState<string>('');
  const handleIntroductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setIntroductionValue(e.target.value);
    }
  };

  const [emailValue, setEmailValue] = useState<string>('');
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setEmailValue(e.target.value);
    }
  };

  const [registerValue, setRegisterValue] = useState<string>('');
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setRegisterValue(e.target.value);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="viwer-content-modal"
      aria-describedby="viwer-content-modal-description"
      className={styles.body}
      hideBackdrop
      // componentsProps={{
      //   backdrop: {
      //     style: {backgroundColor: 'rgba(0, 0, 0, 0.8)'}, // 원하는 색상 설정
      //   },
      // }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div className={styles.parent}>
          <div className={styles.header}>
            <CustomArrowHeader
              title={getLocalizedText('shared028_title_001')}
              onClose={() => {
                onClose();
              }}
            />
          </div>
          <div className={styles.container}>
            <CustomInput
              inputType="Basic"
              textType="Label"
              value={slugValue}
              onChange={handleSlugChange}
              label={<span>{getLocalizedText('shared028_label_002')}</span>}
              placeholder={'-'}
              customClassName={[styles.textInput]}
            />
            <CustomInput
              inputType="Basic"
              textType="Label"
              value={websiteValue}
              onChange={handlewebsiteChange}
              label={<span>{getLocalizedText('shared028_label_003')}</span>}
              placeholder={'https://'}
              customClassName={[styles.textInput]}
            />

            <CustomInput
              inputType="Basic"
              textType="Label"
              value={introductionValue}
              onChange={handleIntroductionChange}
              label={<span>{getLocalizedText('common_sample_093')}</span>}
              placeholder={'-'}
              customClassName={[styles.textInput]}
            />

            <CustomInput
              inputType="Basic"
              textType="Label"
              value={emailValue}
              onChange={handleEmailChange}
              label={<span>{getLocalizedText('shared028_label_004')}</span>}
              placeholder={'https://'}
              customClassName={[styles.textInput]}
            />

            <CustomInput
              inputType="Basic"
              textType="Label"
              value={registerValue}
              onChange={handleRegisterChange}
              label={<span>{getLocalizedText('shared028_label_005')}</span>}
              placeholder={'2025.05.29'}
              customClassName={[styles.textInput]}
            />

            <div></div>
            <button
              className={styles.withDraw}
              onClick={() => {
                setOnWithdrawMembershipPopup(true);
              }}
            >
              {getLocalizedText('common_button_withdrawmembership')}
            </button>

            <div className={styles.confirmButtonContainer}>
              <CustomButton
                size="Large"
                state="Normal"
                type="Primary"
                onClick={handleConfirm}
                customClassName={[styles.confirmButton]}
              >
                {getLocalizedText('common_button_submit')}
              </CustomButton>
            </div>
          </div>
        </div>

        <WithdrawMembership
          open={onWithdrawMembershipPopup}
          onClose={() => setOnWithdrawMembershipPopup(false)}
          onWithdraw={() => {
            setIsAgree(true);
          }}
        />
      </Box>
    </Modal>
  );
};

export default PopupAccountChange;
