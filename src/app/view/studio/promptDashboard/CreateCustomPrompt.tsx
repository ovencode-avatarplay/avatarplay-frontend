import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomPrompt.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useEffect, useRef, useState} from 'react';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {LineSetting} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import AutoCompleteCustomPrompt from './AutoCompleteCustomPrompt';
import {CustomModulePrompt} from '@/app/NetWork/CustomModulesNetwork';

interface Props {
  prompt: CustomModulePrompt;
  onSave: (updatedPrompt: CustomModulePrompt) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const KEYWORDS: Record<string, string> = {
  '{{user}}': 'User',
  '{{char}}': 'Character',
  '{{char_persona}}': 'Character Persona',
  '{{world_scenario}}': 'World Scenario',
  '{{secrets}}': 'Secrets',
};

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

const CreateCustomPrompt: React.FC<Props> = ({prompt, onSave}) => {
  const [promptName, setPromptName] = useState(prompt.title);
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [previewOptionOpen, setPreviewOptionOpen] = useState<boolean>(false);

  const [showAutoCompleteMain, setShowAutoCompleteMain] = useState(false);
  const [showAutoCompleteInstruction, setShowAutoCompleteInstruction] = useState(false);
  const [showAutoCompleteResponse, setShowAutoCompleteResponse] = useState(false);
  const [showAutoCompleteGpt, setShowAutoCompleteGpt] = useState(false);

  //#region Mandarin
  const [mainPrompt, setMainPrompt] = useState('');
  const [instruction, setInstruction] = useState('');
  const [response, setResponse] = useState('');
  //#endregion

  //#region  GPT
  const [gptPrompt, setGptPrompt] = useState(prompt.chatGPT);

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

  const promptRefs = {
    main: useRef<HTMLDivElement>(null),
    instruction: useRef<HTMLDivElement>(null),
    response: useRef<HTMLDivElement>(null),
    gpt: useRef<HTMLDivElement>(null),
  };

  const [editableExamples, setEditableExamples] = useState<{[key: string]: string}>(
    keywordData.reduce((acc, item) => ({...acc, [item.keyword]: item.example}), {}),
  );

  const handleMainPromptInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e, setMainPrompt);
    checkForAutoComplete(e, setShowAutoCompleteMain);
  };

  const handleInstructionInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e, setInstruction);
    checkForAutoComplete(e, setShowAutoCompleteInstruction);
  };

  const handleResponseInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e, setResponse);
    checkForAutoComplete(e, setShowAutoCompleteResponse);
  };

  const handleGptPromptInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    setGptPrompt(text);
    checkForAutoComplete(e, setShowAutoCompleteGpt);
  };
  const checkForAutoComplete = (
    e: React.FormEvent<HTMLDivElement>,
    setShowAutoComplete: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    const text = e.currentTarget.innerText;
    if (text.includes('{') && !text.includes('}')) {
      setShowAutoComplete(true);
    } else {
      setShowAutoComplete(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    const div = e.currentTarget;
    let html = div.innerHTML;

    // 키워드 감지 후 변환
    Object.keys(KEYWORDS).forEach(keyword => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g'); // 안전한 정규식 처리
      html = html.replace(
        regex,
        `<span class="${styles['cm-chip']} ${styles['cm-keyword']}" contenteditable="false">${KEYWORDS[keyword]}</span>`,
      );
    });

    div.innerHTML = html;
    setState(html);
    placeCaretAtEnd(div);
  };

  const decodeHTMLEntities = (html: string): string => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;

    return txt.value;
  };

  const replaceChipsWithKeywords = (html: string): string => {
    // Step 1: HTML 엔티티 변환 (HTML 태그 방지 추가)
    html = decodeHTMLEntities(html);

    // Step 2: Chip을 원래 키워드로 변환
    Object.keys(KEYWORDS).forEach(keyword => {
      const regex = new RegExp(`<span[^>]*?contenteditable="false"[^>]*?>${KEYWORDS[keyword]}</span>`, 'g');
      html = html.replace(regex, keyword);
    });

    // Step 3: <, >를 안전하게 변환 (HTML 해석 방지) -> 서버 api에서 다시 <, >로 변환 해야 할 수도 있음
    html = html.replace(/</g, '〈').replace(/>/g, '〉');

    // Step 4: <div>, <br> 태그를 개행 문자로 변환
    html = html.replace(/<div><br><\/div>/g, '\n');
    html = html.replace(/<div>/g, '\n');
    html = html.replace(/<\/div>/g, '');
    html = html.replace(/<br>/g, '\n');

    // Step 5: 모든 HTML 태그 제거
    html = html.replace(/<[^>]*>/g, '');

    return html === '〈br〉' || html.trim() === '' ? '' : html;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const node = range?.startContainer;

    // Chip을 삭제할 때
    if (e.key === 'Backspace' && node?.nodeType === Node.ELEMENT_NODE) {
      const chip = node as HTMLElement;
      if (chip.classList.contains('cm-chip')) {
        chip.remove();
        e.preventDefault();
      }
    }
  };

  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const handleExampleChange = (keyword: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableExamples(prev => ({
      ...prev,
      [keyword]: e.target.value,
    }));
  };

  const handleSavePrompt = () => {
    onSave({...prompt, title: promptName, claude: '', chatGPT: gptPrompt});
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
                ? `### Main Prompt:\n${replaceChipsWithKeywords(
                    mainPrompt,
                  )}\n\n### Instruction:\n${replaceChipsWithKeywords(
                    instruction,
                  )}\n\n### Response:\n${replaceChipsWithKeywords(response)}`
                : selectedModel === 1
                ? `${replaceChipsWithKeywords(prefixGPT + gptPrompt + suffixGPT)}`
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
        <div
          className={styles.promptInput}
          ref={promptRefs.main}
          contentEditable
          suppressContentEditableWarning
          onInput={handleMainPromptInput}
          onKeyDown={handleKeyDown}
        ></div>
        {showAutoCompleteMain && (
          <AutoCompleteCustomPrompt
            keywords={KEYWORDS}
            inputRef={promptRefs.main}
            onInput={handleMainPromptInput}
            onKeyDown={handleKeyDown}
          />
        )}

        <div className={styles.promptTitle}>### Instruction :</div>
        <div
          className={styles.promptInput}
          ref={promptRefs.instruction}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInstructionInput}
          onKeyDown={handleKeyDown}
        ></div>
        {showAutoCompleteInstruction && (
          <AutoCompleteCustomPrompt
            keywords={KEYWORDS}
            inputRef={promptRefs.instruction}
            onInput={handleInstructionInput}
            onKeyDown={handleKeyDown}
          />
        )}

        <div className={styles.promptTitle}>### Response :</div>
        <div
          className={styles.promptInput}
          ref={promptRefs.response}
          contentEditable
          suppressContentEditableWarning
          onInput={handleResponseInput}
          onKeyDown={handleKeyDown}
        ></div>
        {showAutoCompleteResponse && (
          <AutoCompleteCustomPrompt
            keywords={KEYWORDS}
            inputRef={promptRefs.response}
            onInput={handleResponseInput}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    );
  };

  const renderPromptTemplateChatGPT = () => {
    return (
      <div className={styles.promptInputList}>
        <div className={styles.fixedPrompt}>{prefixGPT}</div>
        <div
          className={styles.promptInput}
          ref={promptRefs.gpt}
          contentEditable
          suppressContentEditableWarning
          onInput={handleGptPromptInput}
          onKeyDown={handleKeyDown}
        >
          {gptPrompt}
        </div>
        <div className={styles.fixedPrompt}> {suffixGPT}</div>
        {showAutoCompleteGpt && (
          <AutoCompleteCustomPrompt
            keywords={KEYWORDS}
            inputRef={promptRefs.main}
            onInput={handleGptPromptInput}
            onKeyDown={handleKeyDown}
          />
        )}
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
        label={
          <span>
            Name <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
          </span>
        }
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
