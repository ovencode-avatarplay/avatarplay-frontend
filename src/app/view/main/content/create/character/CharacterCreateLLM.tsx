import {sendGetCustomModules} from '@/app/NetWork/CustomModulesNetwork';
import styles from './CharacterCreateLLM.module.css';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAI} from '@ui/Icons';
import {useEffect, useRef, useState} from 'react';
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import formatText from '@/utils/formatText';
import PromptInput from '@/app/view/studio/promptDashboard/PromptInput';
import {replaceChipsWithKeywords} from '@/app/view/studio/promptDashboard/FuncPrompt';

interface Props {
  selectedLang: number;
  characterDesc: string;
  worldScenario: string;
  greeting: string;
  secret: string;
  selectedPromptId: number;
  selectedLorebookId: number;
  onLangChange: (lang: number) => void;
  onSelectedPromptChange: (prompt: number) => void;
  onSelectedLorebookChange: (lorebook: number) => void;
  setCharacterDesc: React.Dispatch<React.SetStateAction<string>>;
  setWorldScenario: React.Dispatch<React.SetStateAction<string>>;
  setGreeting: React.Dispatch<React.SetStateAction<string>>;
  setSecret: React.Dispatch<React.SetStateAction<string>>;
  essentialWarning: boolean;
}

const Header = 'CreateCharacter';
const Common = 'Common';

const CharacterCreateLLM: React.FC<Props> = ({
  selectedLang,
  characterDesc,
  worldScenario,
  greeting,
  secret,
  selectedPromptId,
  selectedLorebookId,
  onLangChange,
  onSelectedPromptChange,
  onSelectedLorebookChange,
  setCharacterDesc,
  setWorldScenario,
  setGreeting,
  setSecret,
  essentialWarning,
}) => {
  const [autoWriteCharacterDesc, setAutoWriteCharacterDesc] = useState<string[]>([]);
  const [autoWriteCharacterWorldScenario, setAutoWriteCharacterWorldScenario] = useState<string[]>([]);
  const [autoWriteCharacterGreeting, setAutoWriteCharacterGreeting] = useState<string[]>([]);
  const [autoWriteCharacterSecret, setAutoWriteCharacterSecret] = useState<string[]>([]);

  const langItems = Object.values(LanguageType)
    .filter(value => typeof value === 'string')
    .map(value => ({
      label: value as string,
      value: LanguageType[value as keyof typeof LanguageType],
    }));

  const [promptItems, setPromptItems] = useState<{label: string; value: number}[]>([]);
  const [lorebookItems, setLorebookItems] = useState<{label: string; value: number}[]>([]);

  const promptRefs = {
    desc: useRef<HTMLDivElement>(null),
    worldScenario: useRef<HTMLDivElement>(null),
    greeting: useRef<HTMLDivElement>(null),
    secret: useRef<HTMLDivElement>(null),
  };

  const [showAutoCompleteState, setShowAutoCompleteState] = useState<Record<keyof typeof promptRefs, boolean>>({
    desc: false,
    worldScenario: false,
    greeting: false,
    secret: false,
  });

  const [dropdownPositionState, setDropdownPositionState] = useState<
    Record<keyof typeof promptRefs, {top: number; left: number}>
  >({
    desc: {top: 0, left: 0},
    worldScenario: {top: 0, left: 0},
    greeting: {top: 0, left: 0},
    secret: {top: 0, left: 0},
  });

  const KEYWORDS: Record<string, string> = {
    '{{user}}': 'user',
    '{{char}}': 'character',
  };

  //#region 초기화

  useEffect(() => {
    if (promptRefs.desc.current) promptRefs.desc.current.innerHTML = convertTextToHTML(characterDesc);
    if (promptRefs.worldScenario.current) promptRefs.worldScenario.current.innerHTML = convertTextToHTML(worldScenario);
    if (promptRefs.greeting.current) promptRefs.greeting.current.innerHTML = convertTextToHTML(greeting);
    if (promptRefs.secret.current) promptRefs.secret.current.innerHTML = convertTextToHTML(secret);
  }, []);

  useEffect(() => {
    //  TODO : Localize 테이블에서 가져올 키값과 헤드 이름 변경필요
    const data1: string[] = [
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_001'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_002'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_003'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_004'),
    ];
    const data2: string[] = [
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_001'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_002'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_003'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_004'),
    ];
    const data3: string[] = [
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_001'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_002'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_003'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_004'),
    ];
    const data4: string[] = [
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_001'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_002'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_003'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_004'),
    ];

    setAutoWriteCharacterDesc(data1);
    setAutoWriteCharacterWorldScenario(data2);
    setAutoWriteCharacterGreeting(data3);
    setAutoWriteCharacterSecret(data4);
  }, []);

  const handleGetCustomModules = async () => {
    const response = await sendGetCustomModules();
    if (response.data) {
      const prompts = response.data?.prompts;
      const lorebooks = response.data?.lorebooks;
      setPromptItems(prompts.map(prompt => ({label: prompt.title, value: prompt.promptId})));
      setLorebookItems(lorebooks.map(lorebook => ({label: lorebook.title, value: lorebook.lorebookId})));
    }
  };

  useEffect(() => {
    handleGetCustomModules();
  }, []);
  //#endregion

  //#region  함수

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

  //#region  Handler

  const handleSelectLang = (value: number) => {
    onLangChange(value);
  };

  const handleSelectPrompt = (value: number) => {
    onSelectedPromptChange(value);
  };

  const handleSelectLoreBook = (value: number) => {
    onSelectedLorebookChange(value);
  };
  const handleAutoWriteText = (ref: React.RefObject<HTMLDivElement>, textArray: string[]) => {
    if (!ref.current || textArray.length === 0) return;

    const randomIndex = Math.floor(Math.random() * textArray.length);
    const newValue = textArray[randomIndex];

    ref.current.focus();

    ref.current.innerHTML = convertTextToHTML(newValue);

    // 커서를 마지막으로 이동
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(ref.current);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);

    // `handleInput`을 수동으로 호출하여 상태 업데이트
    const event = new Event('input', {bubbles: true});
    ref.current.dispatchEvent(event);
  };

  const handleAutoWriteCharacterDesc = () => handleAutoWriteText(promptRefs.desc, autoWriteCharacterDesc);
  const handleAutoWriteCharacterWorldScenario = () =>
    handleAutoWriteText(promptRefs.worldScenario, autoWriteCharacterWorldScenario);
  const handleAutoWriteCharacterGreeting = () => handleAutoWriteText(promptRefs.greeting, autoWriteCharacterGreeting);
  const handleAutoWriteCharacterSecret = () => handleAutoWriteText(promptRefs.secret, autoWriteCharacterSecret);

  //#endregion

  //#region  Render

  const renderTitle = (title: string, desc: string) => {
    const highlightText = (text: string) => {
      return text.split(/(<br>|\*|{{.*?}})/g).map((part, index) => {
        if (part === '*') {
          return (
            <span key={index} style={{color: 'var(--Secondary-Red-1, #F75555)'}}>
              {part}
            </span>
          );
        }
        if (part === '{{User}}') {
          return (
            <span key={index} style={{color: 'var(--Primary-1, #FD55D3)'}}>
              {part}
            </span>
          );
        }
        if (part === '{{char}}') {
          return (
            <span key={index} style={{color: 'var(--Colors-Orange, #FF9500)'}}>
              {part}
            </span>
          );
        }
        if (part === '<br>') {
          return <br />;
        }
        return part;
      });
    };
    return (
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{highlightText(title)}</h2>
        {desc !== '' && <div className={styles.desc}>{highlightText(desc)}</div>}
      </div>
    );
  };

  const renderMaxTextInput = (
    key: keyof typeof promptRefs,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    onClickAI: () => void,
    placeholder?: string,
    essential?: boolean,
  ) => {
    const handleButtonClick = (key: keyof typeof promptRefs, text: string) => {
      const div = promptRefs[key].current;
      if (!div) return;

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      div.focus();

      // 새로운 칩을 변환된 HTML로 생성
      const chipHTML = convertTextToHTML(`{{${text}}}`);

      if (range && div.contains(range.commonAncestorContainer)) {
        // 현재 선택한 위치에 HTML 삽입
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = chipHTML;
        const chipElement = tempDiv.firstChild;

        range.deleteContents();
        range.insertNode(chipElement as Node);

        // 칩 뒤에 공백 추가
        const space = document.createTextNode(' ');
        chipElement?.after(space);

        // 커서를 space 뒤로 이동
        range.setStartAfter(space);
        range.collapse(true);
      } else {
        // 기존 HTML 유지 + 칩 추가
        div.insertAdjacentHTML('beforeend', ` ${chipHTML}`);

        // 커서를 마지막으로 이동
        const newRange = document.createRange();
        newRange.selectNodeContents(div);
        newRange.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }

      // `handleInput`을 수동으로 호출하여 상태 업데이트
      const event = new Event('input', {bubbles: true});
      div.dispatchEvent(event);
    };

    return (
      <div className={`${styles.maxTextInputArea} `}>
        {renderPromptInput(key, value, setValue, placeholder)}
        <div className={styles.maxTextButtonArea}>
          <button className={`${styles.maxTextButton} ${styles.aiButton}`}>
            <img className={styles.maxTextButtonIcon} src={BoldAI.src} onClick={onClickAI} />
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick(key, 'user')}>
            {getLocalizedText(Common, 'common_button_usercommand')}
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick(key, 'char')}>
            {getLocalizedText(Common, 'common_button_charcommand')}
          </button>
        </div>
      </div>
    );
  };

  const renderPromptInput = (
    key: keyof typeof promptRefs,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder?: string,
  ) => {
    return (
      <div className={styles.promptInputContainer}>
        <div className={styles.promptInputArea}>
          <PromptInput
            prefix={''}
            suffix={''}
            promptRef={promptRefs[key]}
            showAutoComplete={showAutoCompleteState[key]}
            Keywords={KEYWORDS}
            dropdownPos={dropdownPositionState[key]}
            setDropdownPosition={pos => setDropdownPositionState(prev => ({...prev, [key]: pos}))}
            setShowAutoComplete={show => setShowAutoCompleteState(prev => ({...prev, [key]: show}))}
            setState={setValue}
            dropdownOffset={{top: 0, left: 0}}
          />
        </div>
        <div className={styles.hintTextArea}>
          {formatText(getLocalizedText(Header, 'createcharacter001_label_013'), [value.length.toString()])}
        </div>
      </div>
    );
  };

  //#endregion

  return (
    <div className={styles.llmContainer}>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          getLocalizedText(Header, 'createcharacter001_label_014'),
          getLocalizedText(Header, 'createcharacter001_desc_015'),
        )}
        <CustomDropDown
          items={langItems}
          displayType="Text"
          initialValue={selectedLang}
          onSelect={(value: string | number) => handleSelectLang(Number(value))}
        />
      </div>
      <div className={`${styles.inputDataBoxArea} `}>
        {renderTitle(
          `${getLocalizedText(Header, 'createcharacter001_label_016')}*`,
          `${getLocalizedText(Header, 'createcharacter001_desc_017')}`,
        )}
        {renderMaxTextInput(
          'desc',
          replaceChipsWithKeywords(characterDesc, KEYWORDS),
          setCharacterDesc,
          handleAutoWriteCharacterDesc,
          getLocalizedText(Common, 'common_sample_082'),
          essentialWarning,
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_018'), '')}
        {renderMaxTextInput(
          'worldScenario',
          replaceChipsWithKeywords(worldScenario, KEYWORDS),
          setWorldScenario,
          handleAutoWriteCharacterWorldScenario,
          getLocalizedText(Common, 'common_sample_058'),
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_019'), '')}
        {renderMaxTextInput(
          'greeting',
          replaceChipsWithKeywords(greeting, KEYWORDS),
          setGreeting,
          handleAutoWriteCharacterGreeting,
          getLocalizedText(Common, 'common_sample_083'),
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_021'), '')}
        {renderMaxTextInput(
          'secret',
          replaceChipsWithKeywords(secret, KEYWORDS),
          setSecret,
          handleAutoWriteCharacterSecret,
          getLocalizedText(Common, 'common_sample_081'),
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          getLocalizedText(Header, 'createcharacter001_label_022'),
          getLocalizedText(Header, 'createcharacter001_label_023'),
        )}
        <CustomDropDown
          items={promptItems}
          displayType="Text"
          initialValue={selectedPromptId}
          onSelect={(value: string | number) => handleSelectPrompt(Number(value))}
          placeholder={getLocalizedText(Common, 'common_sample_076')}
        />
        <CustomDropDown
          items={lorebookItems}
          displayType="Text"
          initialValue={selectedLorebookId}
          onSelect={(value: string | number) => handleSelectLoreBook(Number(value))}
          placeholder={getLocalizedText(Common, 'common_sample_068')}
        />
      </div>

      {renderTitle(
        getLocalizedText(Header, 'createcharacter001_desc_024'),
        getLocalizedText(Header, 'createcharacter001_desc_025'),
      )}
    </div>
  );
};

export default CharacterCreateLLM;
