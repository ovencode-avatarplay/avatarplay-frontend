import React, {useState} from 'react';
import {Modal} from '@mui/material';
import {useDispatch} from 'react-redux'; // Redux 액션을 디스패치하기 위한 훅

import styles from './ContentLLMsetup.module.css'; // 스타일 파일
import {BoldRadioButton, BoldRadioButtonSelected, BoldRuby} from '@ui/Icons';

import llmModelData from './ContentLLMsetup.json';

import {LLMSetupInfo} from '@/redux-store/slices/ContentInfo';
import {setLlmSetupInfo} from '@/redux-store/slices/PublishInfo';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import MaxTextInput from '@/components/create/MaxTextInput';

interface ModelOption {
  value: number;
  label: string;
  description: string;
  disabled: boolean;
}

interface ContentLLMSetupProps {
  open: boolean;
  onClose: () => void;
  onModelSelected?: (selectedmodel: number) => void;
}

const ContentLLMSetup: React.FC<ContentLLMSetupProps> = ({open, onClose, onModelSelected = null}) => {
  const dispatch = useDispatch(); // Redux 액션 디스패치 훅

  const [modelOptions] = useState<ModelOption[]>(llmModelData);

  const [selectedModel, setSelectedModel] = useState<number>(6); // 기본값을 0으로 설정 (GPT-4o)
  const [customApiKey, setCustomApiKey] = useState<string>(''); // Custom API 입력 상태 관리

  // 라디오 버튼 값 변경 핸들러
  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedModel(selectedValue);

    // Custom API가 선택되지 않으면 API 키 초기화
    if (selectedValue !== 9) {
      setCustomApiKey(''); // Custom API가 아닌 경우 API 키 초기화
    }
  };

  // Custom API 입력 핸들러
  const handleApiKeyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomApiKey(event.target.value);
  };

  // 모달 닫기 및 Redux에 데이터 저장
  const handleSaveAndClose = () => {
    if (onModelSelected !== null) {
      onModelSelected(selectedModel);
      onClose();
    } else {
      const llmSetupInfo: LLMSetupInfo = {
        llmModel: selectedModel,
        customApi: selectedModel === 9 ? customApiKey : '', // CustomAPI 선택 시 API 키 저장
      };

      // Redux 스토어에 LLM 설정 정보 저장
      dispatch(setLlmSetupInfo(llmSetupInfo));

      onClose(); // 모달 닫기
    }
  };

  const handleSelection = (value: number) => {
    setSelectedModel(value);
    if (selectedModel !== 9) {
      setCustomApiKey(''); // Custom API가 아닌 경우 API 키 초기화
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {background: 'rgba(0, 0, 0, 0.7)'},
      }}
    >
      <div className={styles.modalContainer}>
        <CreateDrawerHeader title="LLM" onClose={onClose}>
          <div className={styles.costArea}>
            <div className={styles.costButton}>
              <img className={styles.costIcon} src={BoldRuby.src} />
              <div className={styles.costText}>150</div>
            </div>
            <div className={styles.costDesc}>per chat</div>
          </div>
        </CreateDrawerHeader>
        <div className={styles.categoryArea}>
          <div className={styles.categoryList}>
            {modelOptions.map(option => (
              <div
                key={option.value}
                className={`${styles.llmCategory} ${option.disabled ? styles.disabled : ''}`}
                onClick={() => !option.disabled && handleSelection(option.value)}
              >
                <img
                  className={styles.radioButton}
                  src={selectedModel === option.value ? BoldRadioButtonSelected.src : BoldRadioButton.src}
                  alt="Radio Button"
                />
                <div className={styles.textArea}>
                  <div className={styles.llmName}>{option.label}</div>
                  <div className={styles.llmDesc}>{option.description}</div>
                </div>
              </div>
            ))}
            <MaxTextInput
              promptValue={customApiKey}
              disabled={selectedModel !== 9}
              handlePromptChange={handleApiKeyChange}
              hint="You can validate your API Key on OpenAI API"
            />
          </div>
        </div>

        {/* 저장 버튼 */}
        <button className={styles.confirmButton} onClick={handleSaveAndClose}>
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ContentLLMSetup;
