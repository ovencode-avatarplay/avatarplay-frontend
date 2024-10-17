import React, {useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  TextField,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch} from 'react-redux'; // Redux 액션을 디스패치하기 위한 훅
import {setLlmSetupInfo} from '@/redux-store/slices/EpisodeInfo'; // 액션 임포트
import {LLMSetupInfo} from '@/types/apps/content/episode/llmSetupInfo';
import styles from './EpisodeLLMSetup.module.css'; // 스타일 파일

interface EpisodeLLMSetupProps {
  open: boolean;
  onClose: () => void; // 부모 컴포넌트로 모달 닫기 요청
}

const EpisodeLLMSetup: React.FC<EpisodeLLMSetupProps> = ({open, onClose}) => {
  const dispatch = useDispatch(); // Redux 액션 디스패치 훅
  const [selectedModel, setSelectedModel] = useState<number>(0); // 기본값을 0으로 설정 (GPT-4o)
  const [customApiKey, setCustomApiKey] = useState<string>(''); // Custom API 입력 상태 관리

  // 라디오 버튼 값 변경 핸들러
  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedModel(selectedValue);

    // Custom API가 선택되지 않으면 API 키 초기화
    if (selectedValue !== 6) {
      setCustomApiKey(''); // Custom API가 아닌 경우 API 키 초기화
    }
  };

  // Custom API 입력 핸들러
  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomApiKey(event.target.value);
  };

  // 모달 닫기 및 Redux에 데이터 저장
  const handleSaveAndClose = () => {
    const llmSetupInfo: LLMSetupInfo = {
      llmModel: selectedModel,
      customApi: selectedModel === 6 ? customApiKey : '', // CustomAPI 선택 시 API 키 저장
    };

    // Redux 스토어에 LLM 설정 정보 저장
    dispatch(setLlmSetupInfo(llmSetupInfo));

    onClose(); // 모달 닫기
  };

  return (
    <Dialog open={open} onClose={handleSaveAndClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">AI Model Setup</Typography>
          <IconButton onClick={handleSaveAndClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="flex-end">
            <Typography>150 tokens per chat</Typography> {/* 상단 토큰 수 */}
          </Box>

          {/* 모델 선택 라디오 버튼 */}
          <RadioGroup value={selectedModel.toString()} onChange={handleModelChange}>
            <FormControlLabel value="0" control={<Radio />} label="GPT-4o - GPT-4보다 2배 빠른 속도" />
            <FormControlLabel value="1" control={<Radio />} label="GPT-4 - OpenAI의 높은 성능의 초거대 언어모델" />
            <FormControlLabel value="2" control={<Radio />} label="GPT-3.5 - 합리적 가성비와 다양한 활용 가능" />
            <FormControlLabel value="3" control={<Radio />} label="Claude 2 - 공부와 토론에 특화된 모델" />
            <FormControlLabel value="4" control={<Radio />} label="Claude 3 Opus - 시리즈 중 가장 높은 지능" />
            <FormControlLabel value="5" control={<Radio />} label="Claude 3 Sonnet - 2배 빠른 속도" />
            <FormControlLabel value="6" control={<Radio />} label="Custom API" />
          </RadioGroup>

          {/* Custom API 입력 필드 - 'CustomAPI'가 선택되었을 때만 활성화 */}
          <TextField
            label="Custom API Key"
            variant="outlined"
            fullWidth
            value={customApiKey}
            onChange={handleApiKeyChange}
            disabled={selectedModel !== 6}
          />
          <Typography variant="body2">You can validate your API Key on OpenAI API</Typography>

          {/* 저장 버튼 */}
          <Button variant="contained" color="primary" onClick={handleSaveAndClose}>
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EpisodeLLMSetup;
