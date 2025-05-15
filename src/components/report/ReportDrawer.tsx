import getLocalizedText from '@/utils/getLocalizedText';
import CustomDrawer from '../layout/shared/CustomDrawer';
import CustomInput from '../layout/shared/CustomInput';
import CustomRadioButton from '../layout/shared/CustomRadioButton';
import styles from './ReportDrawer.module.css';
import {useState} from 'react';
import CustomButton from '../layout/shared/CustomButton';
import CustomCheckbox from '../layout/shared/CustomCheckBox';

interface ReportDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ReportDrawer: React.FC<ReportDrawerProps> = ({open, onClose}) => {
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const [input, setInput] = useState<string[]>(['', '', '', '', '']);
  const [agreement, setAgreement] = useState<boolean>(false);

  const handleReport = async () => {
    console.log('Report : ' + selectedValue + '/' + input[selectedValue]);

    onClose();
  };

  interface ReportItem {
    onClickRadio: () => void;
    title: string;
    desc?: string;
    value: number;
    selectedValue: number;
    input: string;
    placeholder: string;
    isButton?: boolean;
    buttonText?: string;
    onClickButton?: () => void;
  }

  const renderReportItem = (reportItem: ReportItem) => {
    return (
      <div className={styles.reportItem}>
        <div className={styles.reportTopArea}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonOnly"
            onSelect={reportItem.onClickRadio}
            value={reportItem.value}
            selectedValue={selectedValue}
          />
          <div className={styles.reportTextArea}>
            <div className={styles.reportTitle}>{getLocalizedText(reportItem.title)}</div>
            {reportItem.desc && <div className={styles.reportDesc}>{getLocalizedText(reportItem.desc)}</div>}
          </div>
        </div>
        {selectedValue === reportItem.value && !reportItem.isButton && (
          <CustomInput
            inputType="Basic"
            textType="InputOnly"
            placeholder={getLocalizedText(reportItem.placeholder)}
            value={reportItem.input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newInput = [...input];
              newInput[reportItem.value] = e.target.value;
              setInput(newInput);
            }}
          />
        )}
        {selectedValue === reportItem.value && reportItem.isButton && (
          <CustomButton size="Medium" type="Primary" state="Normal" onClick={reportItem.onClickButton}>
            {reportItem.buttonText ? getLocalizedText(reportItem.buttonText) : ''}
          </CustomButton>
        )}
      </div>
    );
  };

  return (
    <CustomDrawer open={open} onClose={onClose}>
      <div className={styles.reportDrawer}>
        <h1 className={styles.reportDrawerTitle}>{getLocalizedText('TODO : Report')}</h1>
        <p className={styles.reportDrawerDesc}>{getLocalizedText('TODO : Please Select a reason for the report')}</p>
        <div className={styles.reportDrawerItemArea}>
          {renderReportItem({
            title: 'TODO : Inappropriate Content',
            desc: 'TODO : Content that is offensive, disturbing, or inappropriate',
            value: 0,
            selectedValue: selectedValue,
            input: input[0],
            placeholder: 'TODO : Please provide additional details if necessary.(optional)',
            onClickRadio: () => {
              setSelectedValue(0);
            },
          })}
          {renderReportItem({
            title: 'TODO : NSFW designation is required.',
            desc: 'TODO : Adult or explicit content not properly marked as NSFW',
            value: 1,
            selectedValue: selectedValue,
            input: input[1],
            placeholder: 'TODO : Please provide additional details if necessary.(optional)',
            onClickRadio: () => {
              setSelectedValue(1);
            },
          })}
          {renderReportItem({
            title: 'TODO : Story Violation',
            desc: 'TODO : Inappropriate or harmful story content.',
            value: 2,
            selectedValue: selectedValue,
            input: input[2],
            placeholder: 'TODO : Please provide additional details if necessary.(optional)',
            onClickRadio: () => {
              setSelectedValue(2);
            },
          })}
          {renderReportItem({
            title: 'TODO : Copyright Violation',
            value: 3,
            selectedValue: selectedValue,
            input: '',
            placeholder: '',
            isButton: true,
            buttonText: 'TODO : Start copyright Report',
            onClickRadio: () => {
              setSelectedValue(3);
            },
            onClickButton: () => {
              // TODO : Copy right Report는 Google Form으로 이동
              window.open('https://forms.gle/123425', '_blank');
              onClose();
            },
          })}
          {renderReportItem({
            title: 'Other',
            value: 4,
            selectedValue: selectedValue,
            input: input[4],
            placeholder: `TODO : If your issue is not listed among the report categories, please select 'Other' and provide a detailed description.`,
            onClickRadio: () => {
              setSelectedValue(4);
            },
          })}
        </div>
        <p className={styles.reportDrawerAlert}>
          {getLocalizedText(
            'TODO : Your report will be reviewed by an administrator and appropriate action will be taken in accordance with our internal policies.',
          )}
        </p>
      </div>
      <div className={styles.agreementArea}>
        <CustomCheckbox
          shapeType="square"
          displayType="buttonOnly"
          onToggle={checked => {
            setAgreement(checked);
          }}
          checked={agreement}
        />
        <div className={styles.agreementTextArea}>
          <p className={styles.agreementTitle}>
            {getLocalizedText('TODO : I agree to account restrictions for false reports. ')}
          </p>
          <div className={styles.agreementDescArea}>
            <p className={styles.agreementDesc}>
              {getLocalizedText(
                'TODO : If a false report is confirmed, your account may be temporarily or permanently suspended.',
              )}
            </p>
            <p className={styles.agreementLink}>{getLocalizedText('TODO : Show more')}</p>
          </div>
        </div>
      </div>
      <div className={styles.reportDrawerButtonArea}>
        <CustomButton
          size="Medium"
          type="Tertiary"
          state="Normal"
          onClick={onClose}
          customClassName={[styles.reportDrawerButton]}
        >
          {getLocalizedText('TODO : Cancel')}
        </CustomButton>
        <CustomButton
          size="Medium"
          type="Primary"
          state="Normal"
          onClick={handleReport}
          customClassName={[styles.reportDrawerButton]}
          isDisabled={!agreement}
        >
          {getLocalizedText('TODO : Report')}
        </CustomButton>
      </div>
    </CustomDrawer>
  );
};

export default ReportDrawer;
