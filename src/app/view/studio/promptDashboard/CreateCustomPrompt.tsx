import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomPrompt.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useState} from 'react';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {LineSetting} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {CustomPromptData} from './PromptDashboard';

interface Props {
  prompt: CustomPromptData;
  onSave: (updatedPrompt: CustomPromptData) => void;
}

const CreateCustomPrompt: React.FC<Props> = ({prompt, onSave}) => {
  const [promptName, setPromptName] = useState(prompt.name);
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [previewOptionOpen, setPreviewOptionOpen] = useState<boolean>(false);

  //#region Mandarin
  const [mainPrompt, setMainPrompt] = useState('');
  const [instruction, setInstruction] = useState('');
  const [response, setResponse] = useState('');
  //#endregion

  //#region  GPT
  const [gptPrompt, setGptPrompt] = useState('');

  const prefixGPT = `[{"role":"system", "content":"`;
  const suffixGPT = `"},
{"role":"assistant","content":"Hello good to see you buddy."},
{"role":"user","content":"Hello Kate. How are you?"},
{"role":"assistant","content":"I'm fine. How about you?"},
{"role":"user","content":"I'm fine too. What are you doing now?"},
{"role":"assistant","content":"I'm reading a book."},
{"role":"user","content":"What are you going to do this vacation?"}
]`;

  //#endregion

  const keywordData = [
    {keyword: '{{char}}', description: '캐릭터 이름', example: 'Kate'},
    {
      keyword: '{{char_persona}}',
      description: "캐릭터 생성시 '캐릭터 설명'에 입력한 내용",
      example: 'Kate is very kind and friendly.',
    },
    {
      keyword: '{{world_scenario}}',
      description: "캐릭터 생성시 '세계관'에 입력한 내용",
      example: 'Kate is in a coffee shop. and Mark is her friend. They are talking about their future plan.',
    },
    {keyword: '{{secrets}}', description: "캐릭터 생성시 '비공개 정보'에 입력한 내용", example: 'Kate loves Mark.'},
    {keyword: '{{user}}', description: '채팅 시작시 사용자가 입력한 본인의 이름', example: 'Mark'},
    {
      keyword: '{{user_desc}}',
      description: '채팅 시작시 사용자가 입력한 본인의 역할, 소개',
      example: 'Mark is a very smart guy. He is a student of MIT.',
    },
    {
      keyword: '{{lores}}',
      description: '채팅 시 사용자가 입력한 내용 중 로어북에 추가된 단어 정보',
      example:
        'MIT is a world-renowned research university known for its advancements in science, engineering, and technology.',
    },
  ];

  const [editableExamples, setEditableExamples] = useState<{[key: string]: string}>(
    keywordData.reduce((acc, item) => ({...acc, [item.keyword]: item.example}), {}),
  );

  const handleExampleChange = (keyword: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableExamples(prev => ({
      ...prev,
      [keyword]: e.target.value,
    }));
  };

  const handleSavePrompt = () => {
    onSave({...prompt, name: promptName});
  };

  const handleResetPrompt = () => {
    setPromptName('');
  };

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
            <button className={styles.settingButton} onClick={() => setPreviewOptionOpen(!previewOptionOpen)}>
              <img className={styles.settingIcon} src={LineSetting.src} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPromptInputArea = () => {
    return (
      <div className={styles.promptInputArea}>
        {selectedModel === 0 && renderPromptTemplateMandarin()}
        {selectedModel === 1 && renderPromptTemplateChatGPT()}
        {previewOn && (
          <textarea
            className={styles.promptPreview}
            readOnly
            value={
              selectedModel === 0
                ? `### Main Prompt:\n${mainPrompt}\n\n### Instruction:\n${instruction}\n\n### Response:\n${response}`
                : selectedModel === 1
                ? `${prefixGPT}${gptPrompt}${suffixGPT}`
                : ''
            }
          />
        )}
      </div>
    );
  };

  const renderPromptTemplateMandarin = () => {
    return (
      <div className={styles.promptInputList}>
        <textarea
          className={styles.promptInput}
          placeholder="Enter Prompt..."
          value={mainPrompt}
          onChange={e => setMainPrompt(e.target.value)}
        />

        <div className={styles.promptTitle}>### Instruction :</div>

        <textarea
          className={styles.promptInput}
          placeholder="Enter instruction..."
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
        />
        <div className={styles.promptTitle}>### Response :</div>

        <textarea
          className={styles.promptInput}
          placeholder="Enter response..."
          value={response}
          onChange={e => setResponse(e.target.value)}
        />
      </div>
    );
  };

  const renderPromptTemplateChatGPT = () => {
    return (
      <div className={styles.promptInputList}>
        <div className={styles.fixedPrompt}>{prefixGPT}</div>
        <textarea
          className={styles.promptInput}
          placeholder="Enter Prompt..."
          value={gptPrompt}
          onChange={e => setGptPrompt(e.target.value)}
        />
        <div className={styles.fixedPrompt}> {suffixGPT}</div>
      </div>
    );
  };

  const renderPreviewOption = () => {
    return (
      <div className={styles.previewContainer}>
        <table className={styles.keywordTable}>
          <thead>
            <tr>
              <th className={styles.previewTitle}>Keyword</th>
              <th className={styles.previewTitle}>Example</th>
            </tr>
          </thead>
          <tbody>
            {keywordData.map((item, index) => (
              <tr key={index}>
                <td className={styles.previewDescArea}>
                  <div className={styles.previewKeyword}>{item.keyword}</div>
                  <div className={styles.previewDesc}>{item.description}</div>
                </td>
                <td className={styles.previewExample}>
                  <CustomInput
                    textType="InputOnly"
                    inputType="Basic"
                    value={editableExamples[item.keyword]}
                    onChange={e => handleExampleChange(item.keyword, e)}
                    customClassName={[styles.previewExampleInput]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.createContainer}>
      <CustomInput
        inputType="Basic"
        textType="Label"
        value={promptName}
        onChange={e => setPromptName(e.target.value)}
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
          onClick={handleResetPrompt}
          customClassName={[styles.bottomButton]}
        >
          Reset
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          onClick={handleSavePrompt}
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
        title="Preview Options"
      >
        {previewOptionOpen && renderPreviewOption()}
      </CustomDrawer>
    </div>
  );
};

export default CreateCustomPrompt;
