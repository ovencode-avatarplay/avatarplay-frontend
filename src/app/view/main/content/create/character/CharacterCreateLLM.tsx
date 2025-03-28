import {sendGetCustomModules} from '@/app/NetWork/CustomModulesNetwork';
import styles from './CharacterCreateLLM.module.css';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAI} from '@ui/Icons';
import {useEffect, useRef, useState} from 'react';
import {getLangKey, LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import formatText from '@/utils/formatText';
import PromptInput from '@/app/view/studio/promptDashboard/PromptInput';
import {replaceChipsWithKeywords} from '@/app/view/studio/promptDashboard/FuncPrompt';
import ButtonPromptInput from '@/app/view/studio/promptDashboard/ButtonPromptInput';

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
    .filter(value => typeof value === 'number')
    .map(value => ({
      label: getLocalizedText(Common, getLangKey(value)),
      value: value,
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
      getLocalizedText('EpisodeDescription', 'common_sample_023'),
      getLocalizedText('EpisodeDescription', 'common_sample_024'),
      getLocalizedText('EpisodeDescription', 'common_sample_025'),
      getLocalizedText('EpisodeDescription', 'common_sample_026'),
    ];
    const data2: string[] = [
      getLocalizedText('EpisodeDescription', 'common_sample_043'),
      getLocalizedText('EpisodeDescription', 'common_sample_044'),
      getLocalizedText('EpisodeDescription', 'common_sample_045'),
      getLocalizedText('EpisodeDescription', 'common_sample_046'),
    ];
    const data3: string[] = [
      getLocalizedText('EpisodeDescription', 'common_sample_031'),
      getLocalizedText('EpisodeDescription', 'common_sample_032'),
      getLocalizedText('EpisodeDescription', 'common_sample_033'),
      getLocalizedText('EpisodeDescription', 'common_sample_034'),
    ];
    const data4: string[] = [
      getLocalizedText('EpisodeDescription', 'common_sample_039'),
      getLocalizedText('EpisodeDescription', 'common_sample_040'),
      getLocalizedText('EpisodeDescription', 'common_sample_041'),
      getLocalizedText('EpisodeDescription', 'common_sample_042'),
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
          `${getLocalizedText(Header, 'createcharacter001_label_012')}*`,
          `${getLocalizedText(Header, 'createcharacter001_desc_016')}`,
        )}
        <ButtonPromptInput
          promptRef={promptRefs.desc}
          value={replaceChipsWithKeywords(characterDesc, KEYWORDS)}
          setValue={setCharacterDesc}
          onClickAI={handleAutoWriteCharacterDesc}
          placeholder={getLocalizedText(Common, 'common_sample_082')}
          essential={essentialWarning}
          Keywords={KEYWORDS}
          showAutoComplete={showAutoCompleteState.desc}
          dropdownPos={dropdownPositionState.desc}
          setDropdownPosition={pos => setDropdownPositionState(prev => ({...prev, desc: pos}))}
        />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_017'), '')}
        <ButtonPromptInput
          promptRef={promptRefs.worldScenario}
          value={replaceChipsWithKeywords(worldScenario, KEYWORDS)}
          setValue={setWorldScenario}
          onClickAI={handleAutoWriteCharacterWorldScenario}
          placeholder={getLocalizedText(Common, 'common_sample_058')}
          Keywords={KEYWORDS}
          showAutoComplete={showAutoCompleteState.worldScenario}
          dropdownPos={dropdownPositionState.worldScenario}
          setDropdownPosition={pos => setDropdownPositionState(prev => ({...prev, worldScenario: pos}))}
        />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_018'), '')}
        <ButtonPromptInput
          promptRef={promptRefs.greeting}
          value={replaceChipsWithKeywords(greeting, KEYWORDS)}
          setValue={setGreeting}
          onClickAI={handleAutoWriteCharacterGreeting}
          placeholder={getLocalizedText(Common, 'common_sample_083')}
          Keywords={KEYWORDS}
          showAutoComplete={showAutoCompleteState.greeting}
          dropdownPos={dropdownPositionState.greeting}
          setDropdownPosition={pos => setDropdownPositionState(prev => ({...prev, greeting: pos}))}
        />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_020'), '')}
        <ButtonPromptInput
          promptRef={promptRefs.secret}
          value={replaceChipsWithKeywords(secret, KEYWORDS)}
          setValue={setSecret}
          onClickAI={handleAutoWriteCharacterSecret}
          placeholder={getLocalizedText(Common, 'common_sample_081')}
          Keywords={KEYWORDS}
          showAutoComplete={showAutoCompleteState.secret}
          dropdownPos={dropdownPositionState.secret}
          setDropdownPosition={pos => setDropdownPositionState(prev => ({...prev, secret: pos}))}
        />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          getLocalizedText(Header, 'createcharacter001_label_021'),
          getLocalizedText(Header, 'createcharacter001_label_022'),
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
        getLocalizedText(Header, 'createcharacter001_desc_023'),
        getLocalizedText(Header, 'createcharacter001_desc_024'),
      )}
    </div>
  );
};

export default CharacterCreateLLM;
