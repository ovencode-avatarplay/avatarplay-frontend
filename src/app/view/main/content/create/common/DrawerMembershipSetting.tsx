import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import styles from './DrawerMembershipSetting.module.css';
import ReactDOM from 'react-dom';
import CustomButton from '@/components/layout/shared/CustomButton';
import React, {useEffect, useState} from 'react';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import {MembershipSetting, PaymentType} from '@/redux-store/slices/StoryInfo';

interface Props {
  onClose: () => void;
  membershipSetting: MembershipSetting;
  onMembershipSettingChange: (updatedInfo: MembershipSetting) => void;
}
enum MembershipMenuType {
  Content = 'content',
  Ip = 'Ip',
}

const DrawerMembershipSetting: React.FC<Props> = ({
  onClose,
  membershipSetting,
  onMembershipSettingChange: onMembershipInfoChange,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [toDoAlertOpen, setToDoAlertOpen] = useState<boolean>(false);
  const [membershipMenuType, setMembershipMenuType] = useState<MembershipMenuType>(MembershipMenuType.Content); // TODO : Content Ip 버튼으로 ui 화면 변경이 있을 경우를 상정하고 작업했음. 기획이 없으니 추후에 기획 사항대로 수정

  const paymentTypeItems = Object.entries(PaymentType)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      label: key,
      value: value as number,
    }));

  const payAmountUSA = [
    {
      label: 'US $35',
      value: 35,
    },
    {
      label: 'US $45',
      value: 45,
    },
  ];

  const payAmountKorea = [
    {
      label: 'KOR 50000₩',
      value: 50000,
    },
    {
      label: 'KOR 65000₩',
      value: 65000,
    },
  ];

  const [payAmount, setPayAmount] = useState(payAmountUSA);

  const handleOnClose = () => {
    setDrawerOpen(false);
    onClose();
  };

  const handleSubscriptionToggle = () => {
    onMembershipInfoChange({...membershipSetting, subscription: membershipSetting.subscription === 0 ? 1 : 0});
  };
  const handlePaymentTypeChange = (value: string | number) => {
    onMembershipInfoChange({...membershipSetting, paymentType: Number(value)});
  };

  const handlePaymentAmountChange = (value: string | number) => {
    onMembershipInfoChange({...membershipSetting, paymentAmount: Number(value)});
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMembershipInfoChange({...membershipSetting, benefits: event.target.value});
  };

  useEffect(() => {
    if (membershipSetting.paymentType === PaymentType.USA) {
      setPayAmount(payAmountUSA);
    } else if (membershipSetting.paymentType === PaymentType.Korea) {
      setPayAmount(payAmountKorea);
    }
  }, [membershipSetting.paymentType]);

  return (
    <div className={styles.membershipSetting}>
      <div className={styles.membershipArea}>
        <div className={styles.settingArea}>
          <div className={styles.settingTitle}>MembershipSetting</div>
          <button
            className={styles.settingButton}
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <div className={styles.settingButtonText}>Setting</div>
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
      <CustomDrawer open={drawerOpen} onClose={handleOnClose} title="Membership Setting">
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
              Content Subscription
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
              IP Subscription
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
              <div className={styles.subsTitle}>Subscription Only</div>
              <div className={styles.subsDesc}>If Selected, Individual sales are not possible</div>
            </div>
          </div>
          <div className={styles.paySettingArea}>
            <div className={styles.payTitle}>Payment Amount</div>
            <div className={styles.paySetting}>
              <CustomDropDown
                displayType="Text"
                items={paymentTypeItems}
                initialValue={membershipSetting.paymentType}
                onSelect={handlePaymentTypeChange}
                style={{minWidth: '120px', maxWidth: '200px'}}
              />

              <CustomDropDown
                displayType="Text"
                items={payAmount}
                initialValue={membershipSetting.paymentAmount}
                onSelect={handlePaymentAmountChange}
                style={{minWidth: '120px', maxWidth: '200px'}}
              />
              <div className={styles.payMonth}>/Month</div>
            </div>
          </div>
          <MaxTextInput
            displayDataType={displayType.Label}
            stateDataType={inputState.Normal}
            inputDataType={inputType.None}
            promptValue={membershipSetting.benefits}
            labelText="Benefits"
            handlePromptChange={handlePromptChange}
            placeholder="Add a description or hashtag"
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
              Complete
            </CustomButton>
          </div>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default DrawerMembershipSetting;
