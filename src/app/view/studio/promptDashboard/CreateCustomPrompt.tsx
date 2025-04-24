import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomPrompt.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useEffect, useRef, useState} from 'react';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {LineSetting} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {CustomModulePrompt} from '@/app/NetWork/CustomModulesNetwork';
import DrawerCustomPromptPreview from './DrawerCustomPromptPreview';
import CustomPromptPreview from './CustomPromptPreview';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import PromptInput from './PromptInput';
import {replaceChipsWithKeywords} from './FuncPrompt';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

interface Props {
  prompt: CustomModulePrompt;
  onSave: (updatedPrompt: CustomModulePrompt) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

//#region  Data

const KEYWORDS: Record<string, string> = {
  '{{user}}': 'User',
  '{{char}}': 'Character',
  '{{char_persona}}': 'Character Persona',
  '{{world_scenario}}': 'World Scenario',
  '{{secrets}}': 'Secrets',
  '{{user_desc}}': 'UserDesc',
  '{{lores}}': 'lores',
  '{{query}}': 'query',
  '{{example_dialogues}}': 'example_dialogues',
};

const keywordData = (user: string, char: string) => [
  {keyword: '{{char}}', description: '캐릭터 이름', example: char, type: 0},
  {
    keyword: '{{char_persona}}',
    description: getLocalizedText('CreateModules', 'createmodules002_desc_002'),
    example: `${char} is very kind and friendly.`,
    type: 1,
  },
  {
    keyword: '{{world_scenario}}',
    description: "캐릭터 생성시 '세계관'에 입력한 내용", //TODO : LQA
    example: `${char} is in a coffee shop. and ${user} is her friend. They are talking about their future plan.`,
    type: 1,
  },
  {
    keyword: '{{secrets}}',
    description: "캐릭터 생성시 '비공개 정보'에 입력한 내용",
    example: `${char} loves ${user}.`,
    type: 1,
  },
  {keyword: '{{user}}', description: '채팅 시작시 사용자가 입력한 본인의 이름', example: user, type: 0},
  {
    keyword: '{{user_desc}}',
    description: '채팅 시작시 사용자가 입력한 본인의 역할, 소개',
    example: `${user} is a very smart guy. He is a student of MIT.`,
    type: 1,
  },
  {
    keyword: '{{lores}}',
    description: '채팅 시 사용자가 입력한 내용 중 로어북에 추가된 단어 정보',
    example: `MIT is a world-renowned research university known for its advancements in science, engineering, and technology.`,
    type: 1,
  },
  {
    keyword: '{{query}}',
    description: '채팅 시 사용자가 입력한 내용 중 로어북에 추가된 단어 정보',
    example: `MIT is a world-renowned research university known for its advancements in science, engineering, and technology.`,
    type: 1,
  },
  {
    keyword: '{{example_dialogues}}',
    description: `캐릭터의 예시 대화 내용.(ChatGPT의 경우 이 키워드를 사용 할 수 없습니다.)`,
    example: [{user: `Nice weather.`}, {char: `It's good for a walk.`}],
    type: 2,
  },
  {
    keyword: '{{dialogues}}',
    description: `사용자와 캐릭터가 주고받은 대화 내용.(ChatGPT의 경우 이 키워드를 사용 할 수 없습니다.)`,
    example: [
      {char: `Hello good to see you buddy.`},
      {user: `Hello ${char}. How are you?`},
      {char: `I'm fine. How about you?`},
      {user: `I'm fine too. What are you doing now?`},
      {char: `I'm reading a book.`},
    ],
    type: 2,
  },
];

const prefixGpt =
  //  `[{"role":"system", "content":"`;
  '';
const suffixGpt =
  // `"},
  // {"role":"assistant","content":"Hello good to see you buddy."},
  // {"role":"user","content":"Hello Kate. How are you?"},
  // {"role":"assistant","content":"I'm fine. How about you?"},
  // {"role":"user","content":"I'm fine too. What are you doing now?"},
  // {"role":"assistant","content":"I'm reading a book."},
  // {"role":"user","content":"What are you going to do this vacation?"}
  // ]`;
  '';

const prefixClaude =
  // `[{"role":"system", "content":"`;
  '';
const suffixClaude =
  // `"},
  // {"role":"assistant","content":"Hello good to see you buddy."},
  // {"role":"user","content":"Hello Kate. How are you?"},
  // {"role":"assistant","content":"I'm fine. How about you?"},
  // {"role":"user","content":"I'm fine too. What are you doing now?"},
  // {"role":"assistant","content":"I'm reading a book."},
  // {"role":"user","content":"What are you going to do this vacation?"}
  // ]`;
  '';

//#endregion

const CreateCustomPrompt: React.FC<Props> = ({prompt, onSave, setIsEditing}) => {
  //#region  선언
  const [promptName, setPromptName] = useState(prompt.title);

  //#region  메뉴 컨트롤
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [previewOptionOpen, setPreviewOptionOpen] = useState<boolean>(false);

  const [isSavePopupOpen, setIsSavePopupOpen] = useState<boolean>(false);
  const promptRefs = {
    gpt: useRef<HTMLDivElement>(null),
    gptViewer: useRef<HTMLDivElement>(null),
    claude: useRef<HTMLDivElement>(null),
    claudeViewer: useRef<HTMLDivElement>(null),
  };
  //#endregion

  //#region  LLM
  const [gptPrompt, setGptPrompt] = useState(prompt.chatGPT);
  const [claudePrompt, setClaudePrompt] = useState(prompt.claude);

  //#endregion

  //#region  Auto Complete

  const [showAutoCompleteGpt, setShowAutoCompleteGpt] = useState(false);
  const [showAutoCompleteClaude, setShowAutoCompleteClaude] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number; left: number}>({top: 0, left: 0});

  //#endregion

  //#region  Preveiw
  const [user, setUser] = useState('Mark');
  const [char, setChar] = useState('Kate');

  const keywords = keywordData(user, char);

  const [editableExamples, setEditableExamples] = useState<{[key: string]: string}>(
    keywords.reduce((acc, item) => ({...acc, [item.keyword]: item.example}), {}),
  );
  //#endregion

  //#endregion

  //#region  함수

  const convertTextToHTML = (text: string): string => {
    let html = text.trim();

    html = html.replace(/\n/g, '<br>');

    Object.keys(KEYWORDS).forEach(keyword => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');
      html = html.replace(
        regex,
        `<span class="${styles['chip']} ${styles[`chip${KEYWORDS[keyword]}`]}" contenteditable="false">${
          KEYWORDS[keyword]
        }</span>\u00A0`,
      );
    });

    return html;
  };

  //#endregion

  //#region  초기화 용도의 useEffect

  useEffect(() => {
    if (promptRefs.gpt.current) promptRefs.gpt.current.innerText = prompt.chatGPT;
    if (promptRefs.claude.current) promptRefs.claude.current.innerText = prompt.claude;
  }, [prompt.chatGPT, prompt.claude]);

  useEffect(() => {
    if (selectedModel === 0 && promptRefs.gpt.current) {
      promptRefs.gpt.current.innerHTML = convertTextToHTML(gptPrompt);
    } else if (selectedModel === 1 && promptRefs.claude.current) {
      promptRefs.claude.current.innerHTML = convertTextToHTML(claudePrompt);
    }
  }, [selectedModel]);

  //#endregion

  //#region 프리뷰 편집

  useEffect(() => {
    setEditableExamples(keywordData(user, char).reduce((acc, item) => ({...acc, [item.keyword]: item.example}), {}));
  }, [user, char]);

  // 예제 값 변경 핸들러
  const handleExampleChange = (keyword: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditableExamples(prev => ({
      ...prev,
      [keyword]: newValue,
    }));

    // user 또는 char가 변경될 경우 상태 업데이트
    if (keyword === `{{user}}`) {
      setUser(newValue);
    }
    if (keyword === `{{char}}`) {
      setChar(newValue);
    }
  };
  //#endregion

  //#region  버튼 액션

  const handleOnClickSave = () => {
    handleSavePrompt();

    setIsSavePopupOpen(false);
    setIsEditing(false);
  };

  const handleSavePrompt = () => {
    onSave({...prompt, title: promptName, chatGPT: replaceChipsWithKeywords(gptPrompt, KEYWORDS)});
  };

  const handleResetPrompt = () => {
    setPromptName('');
    setGptPrompt('');
    setClaudePrompt('');

    if (promptRefs.gpt.current) {
      promptRefs.gpt.current.innerHTML = '';
    }
    if (promptRefs.claude.current) {
      promptRefs.claude.current.innerHTML = '';
    }
  };
  //#endregion

  //#region  Render
  const renderPromptTitleArea = () => {
    return (
      <div className={styles.promptTitleArea}>
        <h2 className={styles.title2}>
          {getLocalizedText('CreateModules', 'createmodules001_label_003')}
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
              {getLocalizedText('Common', 'common_button_chatgpt')}
            </CustomButton>
            <CustomButton
              size="Small"
              state="Normal"
              type={selectedModel === 1 ? 'Primary' : 'Tertiary'}
              onClick={() => setSelectedModel(1)}
            >
              {getLocalizedText('Common', 'common_button_claude')}
            </CustomButton>
          </div>

          <div className={styles.previewButtonArea}>
            <CustomCheckbox
              displayType="buttonText"
              shapeType="square"
              checked={previewOn}
              onToggle={setPreviewOn}
              label={getLocalizedText('Common', 'common_button_preview')}
            />
            <button className={styles.settingButton} onClick={() => setPreviewOptionOpen(!previewOptionOpen)}>
              <img className={styles.settingIcon} src={LineSetting.src} />
            </button>
          </div>
        </div>
        <CustomPromptPreview
          textValue={
            selectedModel === 0
              ? replaceChipsWithKeywords(gptPrompt, KEYWORDS)
              : replaceChipsWithKeywords(claudePrompt, KEYWORDS)
          }
          keywordData={keywords}
          isOpen={previewOn}
          onClose={() => {
            setPreviewOn(false);
          }}
        />
      </div>
    );
  };

  const renderPromptInputArea = () => {
    return (
      <div className={styles.promptInputArea}>
        {selectedModel === 0 && (
          <PromptInput
            prefix={prefixGpt}
            suffix={suffixGpt}
            promptRef={promptRefs.gpt}
            showAutoComplete={showAutoCompleteGpt}
            Keywords={KEYWORDS}
            dropdownPos={dropdownPosition}
            setDropdownPosition={setDropdownPosition}
            setShowAutoComplete={setShowAutoCompleteGpt}
            setState={setGptPrompt}
            dropdownOffset={{top: 0, left: 0}}
          />
        )}

        {selectedModel === 1 && (
          <PromptInput
            prefix={prefixClaude}
            suffix={suffixClaude}
            promptRef={promptRefs.claude}
            showAutoComplete={showAutoCompleteClaude}
            Keywords={KEYWORDS}
            dropdownPos={dropdownPosition}
            setDropdownPosition={setDropdownPosition}
            setShowAutoComplete={setShowAutoCompleteClaude}
            setState={setClaudePrompt}
            dropdownOffset={{top: 0, left: 0}}
          />
        )}
        {previewOn && (
          <textarea
            className={styles.promptPreview}
            readOnly
            value={
              selectedModel === 0
                ? `${replaceChipsWithKeywords(prefixGpt + gptPrompt + suffixGpt, KEYWORDS)}`
                : selectedModel === 1
                ? `${replaceChipsWithKeywords(prefixClaude + claudePrompt + suffixClaude, KEYWORDS)}`
                : ''
            }
          />
        )}
      </div>
    );
  };

  //#endregion

  return (
    <div className={styles.createContainer}>
      <CustomInput
        inputType="Basic"
        textType="Label"
        value={promptName}
        onChange={e => {
          setPromptName(e.target.value);
          setIsEditing(true);
        }}
        label={
          <span>
            {getLocalizedText('CreateModules', 'createmodules001_label_002')}
            <span className={styles.astrisk}>*</span>
          </span>
        }
        placeholder={getLocalizedText('Common', 'common_sample_073')}
      />
      {renderPromptTitleArea()}
      {renderPromptInputArea()}
      <div className={styles.promptGuide}>
        {formatText(getLocalizedText('CreateModules', 'createmodules001_desc_004'))}
      </div>
      <div className={styles.bottomButtonArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Tertiary"
          onClick={handleResetPrompt}
          customClassName={[styles.bottomButton]}
        >
          {getLocalizedText('Common', 'common_button_reset')}
        </CustomButton>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          onClick={() => {
            if (promptName !== '') setIsSavePopupOpen(true);
          }}
          customClassName={[styles.bottomButton]}
        >
          {getLocalizedText('Common', 'common_button_save')}
        </CustomButton>
      </div>
      <CustomDrawer
        open={previewOptionOpen}
        onClose={() => {
          setPreviewOptionOpen(false);
        }}
        title={getLocalizedText('CreateModules', 'createmodules002_title_001')}
      >
        {previewOptionOpen && (
          <DrawerCustomPromptPreview
            keywordData={keywords}
            editableExamples={editableExamples}
            handleExampleChange={handleExampleChange}
          />
        )}
      </CustomDrawer>
      {isSavePopupOpen && (
        <CustomPopup
          type="alert"
          title="Do you want to submit
this prompt?"
          buttons={[
            {
              label: 'No',
              onClick: () => {
                setIsSavePopupOpen(false);
              },
            },
            {
              label: 'Yes',
              isPrimary: true,
              onClick: handleOnClickSave,
            },
          ]}
        />
      )}
    </div>
  );
};

export default CreateCustomPrompt;
