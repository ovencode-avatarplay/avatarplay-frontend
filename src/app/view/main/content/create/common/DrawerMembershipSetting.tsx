import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import styles from './DrawerMembershipSetting.module.css';
import ReactDOM from 'react-dom';
import CustomButton from '@/components/layout/shared/CustomButton';
import React, {useEffect, useState} from 'react';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import {MembershipSetting, PaymentType} from '@/app/NetWork/network-interface/CommonEnums';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomInput from '@/components/layout/shared/CustomInput';

interface Props {
  onClose: () => void;
  membershipSetting: MembershipSetting;
  onMembershipSettingChange: (updatedInfo: MembershipSetting) => void;
}
enum MembershipMenuType {
  Content = 'content',
  Ip = 'Ip',
}

const DrawerMembershipSetting: React.FC<Props> = ({onClose, membershipSetting, onMembershipSettingChange}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [toDoAlertOpen, setToDoAlertOpen] = useState<boolean>(false);
  const [membershipMenuType, setMembershipMenuType] = useState<MembershipMenuType>(MembershipMenuType.Content); // TODO : Content Ip 버튼으로 ui 화면 변경이 있을 경우를 상정하고 작업했음. 기획이 없으니 추후에 기획 사항대로 수정

  const paymentTypeItems = Object.entries(PaymentType)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      label: key,
      value: value as number,
    }));

  const handleOnClose = () => {
    setDrawerOpen(false);
    onClose();
  };

  const handleSubscriptionToggle = () => {
    onMembershipSettingChange({...membershipSetting, subscription: membershipSetting.subscription === 0 ? 1 : 0});
  };
  const handlePaymentTypeChange = (value: string | number) => {
    onMembershipSettingChange({...membershipSetting, paymentType: Number(value)});
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMembershipSettingChange({...membershipSetting, benefits: event.target.value});
  };

  const handleOnChangePayAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value);
    if (!isNaN(numericValue)) {
      onMembershipSettingChange({...membershipSetting, paymentAmount: numericValue});
    }
  };

  return (
    <div className={styles.membershipSetting}>
      <div className={styles.membershipArea}>
        <div className={styles.settingArea}>
          <div className={styles.settingTitle}>
            {getLocalizedText('common_label_007')}
            {/* 나중에 Common에서 Localize 지정되면 거기서 지정된 값으로 바꿔도 됩니다. */}
          </div>
          <button
            type="button"
            className={styles.settingButton}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <div className={styles.settingButtonText}>{getLocalizedText('common_button_setting')}</div>
          </button>
        </div>
      </div>
      {toDoAlertOpen &&
        ReactDOM.createPortal(
          <CustomPopup
            type="alert"
            title="TODO"
            description="12-16"
            buttons={[
              {
                label: 'OK',
                onClick: () => {
                  setToDoAlertOpen(false);
                },
              },
            ]}
          />,
          document.body,
        )}
      <CustomDrawer open={drawerOpen} onClose={handleOnClose} title={getLocalizedText('common_alert_040')}>
        <div className={styles.membershipDrawerContainer}>
          <div className={styles.membershipButtonArea}>
            <CustomButton
              size="Small"
              state="Normal"
              type="Primary"
              onClick={() => {
                setMembershipMenuType(MembershipMenuType.Content);
              }}
              customClassName={[styles.membershipButton]}
            >
              {getLocalizedText('common_button_contentsubscription')}
            </CustomButton>
            <CustomButton
              size="Small"
              state="Normal"
              type="Primary"
              onClick={() => {
                setToDoAlertOpen(true);
                setMembershipMenuType(MembershipMenuType.Ip);
              }}
              customClassName={[styles.membershipButton]}
            >
              {getLocalizedText('common_button_ipsubscription')}
            </CustomButton>
          </div>
          <div className={styles.subsToggleArea}>
            <CustomRadioButton
              displayType="buttonOnly"
              shapeType="square"
              value={1}
              selectedValue={membershipSetting.subscription}
              onSelect={handleSubscriptionToggle}
            />
            <div className={styles.subsDescArea}>
              <div className={styles.subsTitle}>{getLocalizedText('common_alert_059')}</div>
              <div className={styles.subsDesc}>{getLocalizedText('shared016_label_001')}</div>
            </div>
          </div>
          <div className={styles.paySettingArea}>
            <div className={styles.payTitle}>{getLocalizedText('shared016_label_002')}</div>
            <div className={styles.paySetting}>
              <CustomDropDown
                displayType="Text"
                items={paymentTypeItems}
                initialValue={membershipSetting.paymentType}
                onSelect={handlePaymentTypeChange}
                style={{minWidth: '120px', maxWidth: '200px'}}
              />

              {/* <CustomDropDown
                displayType="Text"
                items={payAmount}
                initialValue={membershipSetting.paymentAmount}
                onSelect={handlePaymentAmountChange}
                style={{minWidth: '120px', maxWidth: '200px'}}
              /> */}
              <CustomInput
                textType="InputOnly"
                inputType="Basic"
                onlyNumber={true}
                value={membershipSetting?.paymentAmount}
                onChange={handleOnChangePayAmount}
                customClassName={[styles.payAmountInput]}
              />
              <div className={styles.payMonth}>{getLocalizedText('shared013_label_003')}</div>
            </div>
          </div>
          <MaxTextInput
            displayDataType={displayType.Label}
            stateDataType={inputState.Normal}
            inputDataType={inputType.None}
            promptValue={membershipSetting?.benefits || ''}
            labelText={getLocalizedText('shared016_label_004')}
            handlePromptChange={handlePromptChange}
            placeholder={getLocalizedText('common_sample_047')}
            maxPromptLength={500}
            style={{width: '100%', marginTop: '8px', marginBottom: '10px'}}
          />
          <div className={styles.completeButtonArea}>
            <CustomButton
              size="Large"
              state="Normal"
              type="Primary"
              style={{width: '100%'}}
              onClick={() => {
                handleOnClose();
              }}
            >
              {getLocalizedText('common_button_submit')}
            </CustomButton>
          </div>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default DrawerMembershipSetting;
