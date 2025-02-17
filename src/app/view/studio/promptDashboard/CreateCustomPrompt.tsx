import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomPrompt.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useState} from 'react';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {LineSetting} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';

interface Props {
  name: string;
}

const CreateCustomPrompt: React.FC<Props> = ({name}) => {
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [previewOptionOpen, setPreviewOptionOpen] = useState<boolean>(false);

  const renderPromptTitleArea = () => {
    return (
      <div className={styles.promptTitleArea}>
        <h2 className={styles.title2}>
          Prompt Template
          <span className={styles.astrisk}>*</span>
        </h2>
        <div className={styles.titleButtonArea}>
          <div className={styles.buttonContainer}>
            <CustomButton
              size="Small"
              state="Normal"
              type={selectedModel === 0 ? 'Primary' : 'Tertiary'}
              onClick={() => setSelectedModel(0)}
            >
              Mandarin
            </CustomButton>
            <CustomButton
              size="Small"
              state="Normal"
              type={selectedModel === 1 ? 'Primary' : 'Tertiary'}
              onClick={() => setSelectedModel(1)}
            >
              ChatGpt
            </CustomButton>
          </div>

          <div className={styles.previewButtonArea}>
            <CustomCheckbox
              displayType="buttonText"
              shapeType="square"
              checked={previewOn}
              onToggle={setPreviewOn}
              label="preview"
            />
            <button className={styles.settingButton}>
              <img className={styles.settingIcon} src={LineSetting.src} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPromptInputArea = () => {
    return <>PromptInputArea</>;
  };

  const renderPreviewOption = () => {
    return <>Preview Option</>;
  };

  return (
    <div className={styles.createContainer}>
      <CustomInput
        inputType="Basic"
        textType="Label"
        value={name}
        onChange={() => {}}
        label="Custom prompt name *"
        placeholder="please enter a title for your post"
      />
      <div className={styles.promptArea}>
        {renderPromptTitleArea()}
        {renderPromptInputArea()}
        <div className={styles.promptGuide}>
          Custom prompt input is optimized for PC. We recommend using it on a PC. You must write in English. Click the
          gear icon next to the preview to check the available keywords.
        </div>
      </div>
      <div className={styles.bottomButtonArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={() => {}}
          customClassName={[styles.bottomButton]}
        >
          Reset
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          onClick={() => {}}
          customClassName={[styles.bottomButton]}
        >
          Save
        </CustomButton>
      </div>
      <CustomDrawer
        open={previewOptionOpen}
        onClose={() => {
          setPreviewOptionOpen(false);
        }}
      >
        <>{renderPreviewOption()}</>
      </CustomDrawer>
    </div>
  );
};

export default CreateCustomPrompt;
