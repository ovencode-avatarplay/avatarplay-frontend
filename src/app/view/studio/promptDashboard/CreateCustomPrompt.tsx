import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CreateCustomPrompt.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import {useEffect, useRef, useState} from 'react';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {LineSetting} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import AutoCompleteCustomPrompt from './AutoCompleteCustomPrompt';
import {CustomModulePrompt} from '@/app/NetWork/CustomModulesNetwork';
import DrawerCustomPromptPreview from './DrawerCustomPromptPreview';

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
const keywordData = (user: string, char: string) => [
  {keyword: '{{char}}', description: '캐릭터 이름', example: char, type: 0},
  {
    keyword: '{{char_persona}}',
    description: "캐릭터 생성시 '캐릭터 설명'에 입력한 내용",
    example: `${char} is very kind and friendly.`,
    type: 1,
  },
  {
    keyword: '{{world_scenario}}',
    description: "캐릭터 생성시 '세계관'에 입력한 내용",
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

const CreateCustomPrompt: React.FC<Props> = ({prompt, onSave}) => {
  const [promptName, setPromptName] = useState(prompt.title);
  const [selectedModel, setSelectedModel] = useState<number>(0);
  const [previewOn, setPreviewOn] = useState<boolean>(false);
  const [previewOptionOpen, setPreviewOptionOpen] = useState<boolean>(false);

  const [showAutoCompleteGpt, setShowAutoCompleteGpt] = useState(false);
  const [showAutoCompleteClaude, setShowAutoCompleteClaude] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number; left: number}>({top: 0, left: 0});

  //#region  GPT
  const [gptPrompt, setGptPrompt] = useState(prompt.chatGPT);

  const prefixGpt = `[{"role":"system", "content":"`;
  const suffixGpt = `"},
{"role":"assistant","content":"Hello good to see you buddy."},
{"role":"user","content":"Hello Kate. How are you?"},
{"role":"assistant","content":"I'm fine. How about you?"},
{"role":"user","content":"I'm fine too. What are you doing now?"},
{"role":"assistant","content":"I'm reading a book."},
{"role":"user","content":"What are you going to do this vacation?"}
]`;

  //#endregion

  //#region Claude
  const [claudePrompt, setClaudePrompt] = useState(prompt.claude);

  const prefixClaude = `[{"role":"system", "content":"`;
  const suffixClaude = `"},
{"role":"assistant","content":"Hello good to see you buddy."},
{"role":"user","content":"Hello Kate. How are you?"},
{"role":"assistant","content":"I'm fine. How about you?"},
{"role":"user","content":"I'm fine too. What are you doing now?"},
{"role":"assistant","content":"I'm reading a book."},
{"role":"user","content":"What are you going to do this vacation?"}
]`;

  //#endregion

  //#region  Preveiw
  const [focusedStates, setFocusedStates] = useState<{[key: string]: boolean}>({});
  const [typingStates, setTypingStates] = useState<{[key: string]: boolean}>({});

  const [user, setUser] = useState('Mark');
  const [char, setChar] = useState('Kate');

  const keywords = keywordData(user, char);

  const handleFocus = (key: string) => {
    setFocusedStates(prev => ({...prev, [key]: true}));
  };

  const handleBlur = (key: string) => {
    setFocusedStates(prev => ({...prev, [key]: false}));
  };

  const handleTyping = (key: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleExampleChange(key, e);
    setTypingStates(prev => ({...prev, [key]: true}));

    setTimeout(() => {
      setTypingStates(prev => ({...prev, [key]: false}));
    }, 1000); // 1초 후 typing 상태 해제 (디바운스 효과)
  };
  //#endregion

  const promptRefs = {
    gpt: useRef<HTMLDivElement>(null),
    gptViewer: useRef<HTMLDivElement>(null),
    claude: useRef<HTMLDivElement>(null),
    claudeViewer: useRef<HTMLDivElement>(null),
  };
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

  const convertTextToHTML = (text: string): string => {
    let html = text.trim();

    Object.keys(KEYWORDS).forEach(keyword => {
      const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');
      html = html.replace(
        regex,
        `<span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${KEYWORDS[keyword]}</span>`,
      );
    });

    return html;
  };

  //#endregion

  const updateDropdownPosition = () => {
    if (!promptRefs.gpt.current) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY - 285, // 약간 아래 위치
      left: rect.left + window.scrollX - 20,
    });
  };

  //#region  키 입력 대응

  const handleGptPromptInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e, setGptPrompt);
    setGptPrompt(e.currentTarget.innerText);
    checkForAutoComplete(e, setShowAutoCompleteGpt);
  };

  const handleClaudePromptInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleInput(e, setClaudePrompt);
    checkForAutoComplete(e, setShowAutoCompleteClaude);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    const div = e.currentTarget;

    let html = div.innerHTML.trim();

    // 무한 루프 방지
    if (html === setState.toString()) return;

    // 모든 내용이 삭제된 경우 기본 공백 추가
    if (!html || html === '<br>') {
      div.innerHTML = '&nbsp;';
    } else {
      let changed = false;

      Object.keys(KEYWORDS).forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[{}]/g, '\\$&'), 'g');

        if (html.includes(keyword)) {
          html = html.replace(
            regex,
            `<span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${KEYWORDS[keyword]}</span>`,
          );
          changed = true;
        }
      });

      if (changed) {
        div.innerHTML = html;

        // 마지막으로 변경된 chip 요소를 찾고, 그 뒤로 커서를 이동
        const chips = div.querySelectorAll(`.${styles['chip']}`);
        if (chips.length > 0) {
          moveCaretAfterNode(chips[chips.length - 1]); // 가장 마지막 chip 뒤로 이동
        }
      }
    }

    setState(html);
  };

  //   새로운 chip 뒤로 캐럿 이동
  const moveCaretAfterNode = (node: Node) => {
    const range = document.createRange();
    const sel = window.getSelection();

    if (!node || !sel) return;

    range.setStartAfter(node); // chip 요소 뒤로 커서 이동
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Handle change in the editor content
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const node = e.target as HTMLElement;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const div = e.currentTarget;

      // 모든 내용을 삭제했을 경우 <br> 추가하여 커서 유지
      if (div.innerText.trim() === '') {
        e.preventDefault();
        div.innerHTML = '&nbsp;';
        moveCaretToEnd(div);
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 엔터 동작 방지

      const newLine = document.createElement('div');
      newLine.innerHTML = '<br>';

      range.insertNode(newLine);

      moveCaretToEnd(newLine);
    }

    if (e.key === 'Backspace' && node.classList.contains('chip')) {
      node.remove();
      e.preventDefault();
    }
  };
  //#endregion

  //#region  캐럿 (커서) 관련
  // 캐럿 위치 저장
  const saveCaretPosition = (container: HTMLElement): number | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    return preSelectionRange.toString().length; // 캐럿 위치 반환
  };

  // 캐럿 위치 복원
  const restoreCaretPosition = (container: HTMLElement, pos: number | null) => {
    if (pos === null) return;
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.setStart(container, 0);
    range.collapse(true);

    let node: ChildNode | null = container;
    let nodeStack: ChildNode[] = [];
    let charIndex = 0;

    while (node) {
      if (node.nodeType === 3) {
        let nextCharIndex = charIndex + node.nodeValue!.length;
        if (pos <= nextCharIndex) {
          range.setStart(node, pos - charIndex);
          break;
        }
        charIndex = nextCharIndex;
      }

      if (node.firstChild) {
        nodeStack.push(node);
        node = node.firstChild;
      } else if (node.nextSibling) {
        node = node.nextSibling;
      } else {
        while (nodeStack.length > 0) {
          node = nodeStack.pop()!;
          if (node.nextSibling) {
            node = node.nextSibling;
            break;
          }
        }
      }
    }

    // 불필요한 반복 방지: 현재 커서 위치가 동일하면 변경하지 않음
    if (selection.rangeCount > 0 && selection.getRangeAt(0).startOffset === range.startOffset) {
      return;
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // 개행 후, 캐럿을 새로운 줄 끝으로 이동
  const moveCaretToEnd = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  //#endregion

  //#region  Chip 관련
  const handleKeywordInsert = (div: HTMLDivElement, keyword: string) => {
    if (!div) return;

    let html = div.innerHTML.trim();

    //  키워드를 바로 `chip`으로 변환
    html += ` <span class="${styles['chip']} ${styles['chipUser']}" contenteditable="false">${KEYWORDS[keyword]}</span> `;

    div.innerHTML = html;
    setGptPrompt(html);

    //  캐럿을 `chip` 뒤로 이동
    const chips = div.querySelectorAll(`.${styles['chip']}`);
    if (chips.length > 0) {
      moveCaretAfterNode(chips[chips.length - 1]);
    }
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

  //#endregion

  //#region  자동완성 관련
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

  useEffect(() => {
    if (showAutoCompleteGpt) {
      updateDropdownPosition();
    }
  }, [showAutoCompleteGpt, gptPrompt]);

  //#endregion

  //#region  버튼 액션, 등등

  const [editableExamples, setEditableExamples] = useState<{[key: string]: string}>(
    keywords.reduce((acc, item) => ({...acc, [item.keyword]: item.example}), {}),
  );

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

  const handleSavePrompt = () => {
    onSave({...prompt, title: promptName, chatGPT: gptPrompt});
  };

  const handleResetPrompt = () => {
    setPromptName('');
  };
  //#endregion

  //#region  Render
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
              ChatGpt
            </CustomButton>
            <CustomButton
              size="Small"
              state="Normal"
              type={selectedModel === 1 ? 'Primary' : 'Tertiary'}
              onClick={() => setSelectedModel(1)}
            >
              Claude
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
        {selectedModel === 0 && (
          <>
            {renderPromptTemplateChatGPT()}
            {showAutoCompleteGpt && (
              <AutoCompleteCustomPrompt
                keywords={KEYWORDS}
                inputRef={promptRefs.gpt}
                onKeywordInsert={handleKeywordInsert}
                dropdownPosition={dropdownPosition}
              />
            )}
          </>
        )}

        {selectedModel === 1 && (
          <>
            {renderPromptTemplateClaude()}
            {showAutoCompleteClaude && (
              <AutoCompleteCustomPrompt
                keywords={KEYWORDS}
                inputRef={promptRefs.claude}
                onKeywordInsert={handleKeywordInsert}
                dropdownPosition={dropdownPosition}
              />
            )}
          </>
        )}
        {previewOn && (
          <textarea
            className={styles.promptPreview}
            readOnly
            value={
              selectedModel === 0
                ? `${replaceChipsWithKeywords(prefixGpt + gptPrompt + suffixGpt)}`
                : selectedModel === 1
                ? `${replaceChipsWithKeywords(prefixClaude + claudePrompt + suffixClaude)}`
                : ''
            }
          />
        )}
      </div>
    );
  };

  const renderPromptTemplateChatGPT = () => {
    return (
      <div className={styles.promptInputList}>
        <div className={styles.fixedPrompt}>{prefixGpt}</div>

        <div
          ref={promptRefs.gpt}
          className={styles.promptInput}
          contentEditable
          suppressContentEditableWarning
          onInput={handleGptPromptInput}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.fixedPrompt}>{suffixGpt}</div>
      </div>
    );
  };

  const renderPromptTemplateClaude = () => {
    return (
      <div className={styles.promptInputList}>
        <div className={styles.fixedPrompt}>{prefixGpt}</div>

        <div
          ref={promptRefs.claude}
          className={styles.promptInput}
          contentEditable
          suppressContentEditableWarning
          onInput={handleClaudePromptInput}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.fixedPrompt}>{suffixGpt}</div>
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
        onChange={e => setPromptName(e.target.value)}
        label={
          <span>
            Custom prompt name <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
          </span>
        }
        placeholder="please enter a title for your post"
      />
      {renderPromptTitleArea()}
      {renderPromptInputArea()}
      <div className={styles.promptGuide}>
        Custom prompt input is optimized for PC. We recommend using it on a PC. You must write in English. Click the
        gear icon next to the preview to check the available keywords.
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
        {previewOptionOpen && (
          <DrawerCustomPromptPreview
            keywordData={keywords}
            editableExamples={editableExamples}
            handleExampleChange={handleExampleChange}
          />
        )}
      </CustomDrawer>
    </div>
  );
};

export default CreateCustomPrompt;
