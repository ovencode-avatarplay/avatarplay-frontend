import styles from './CharacterCreateLLM.module.css';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import {LanguageType} from '@/redux-store/slices/StoryInfo';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAI, BoldArrowDown, LineDelete} from '@ui/Icons';
import {useEffect, useState} from 'react';

interface Props {
  selectedLang: number;
  characterDesc: string;
  worldScenario: string;
  greeting: string;
  secret: string;
  selectedPromptIdx: number;
  selectedLorebookIdx: number;
  onLangChange: (lang: number) => void;
  onCharacterDescChange: (desc: string) => void;
  onWorldScenarioChange: (scenario: string) => void;
  onGreetingChange: (greeting: string) => void;
  onSecretChange: (secret: string) => void;
  onSelectedPromptChange: (prompt: number) => void;
  onSelectedLorebookChange: (lorebook: number) => void;
}

const CharacterCreateLLM: React.FC<Props> = ({
  selectedLang,
  characterDesc,
  worldScenario,
  greeting,
  secret,
  selectedPromptIdx,
  selectedLorebookIdx,
  onLangChange,
  onCharacterDescChange,
  onWorldScenarioChange,
  onGreetingChange,
  onSecretChange,
  onSelectedPromptChange,
  onSelectedLorebookChange,
}) => {
  const [autoWriteCharacterDesc, setAutoWriteCharacterDesc] = useState<string[]>([]);
  const [autoWriteCharacterWorldScenario, setAutoWriteCharacterWorldScenario] = useState<string[]>([]);
  const [autoWriteCharacterGreeting, setAutoWriteCharacterGreeting] = useState<string[]>([]);
  const [autoWriteCharacterSecret, setAutoWriteCharacterSecret] = useState<string[]>([]);

  const langItems = [
    {label: 'Korean', value: '0'},
    {label: 'English', value: '1'},
    {label: 'Japan', value: '2'},
  ];

  const promptItems = [
    {label: 'prompt 1', value: '1'},
    {label: 'prompt 2', value: '2'},
    {label: 'prompt 3', value: '3'},
  ];

  const lorebookItems = [
    {label: 'lorebook 1', value: '1'},
    {label: 'lorebook 2', value: '2'},
    {label: 'lorebook 3', value: '3'},
  ];

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

  const handleSelectLang = (value: number) => {
    onLangChange(value);
  };

  const handleSelectPrompt = (value: number) => {
    onSelectedPromptChange(value);
  };

  const handleSelectLoreBook = (value: number) => {
    onSelectedLorebookChange(value);
  };

  const handleAutoWriteCharacterDesc = () => {
    const randomIndex = Math.floor(Math.random() * autoWriteCharacterDesc.length);
    onCharacterDescChange(autoWriteCharacterDesc[randomIndex]);
  };

  const handleAutoWriteCharacterWorldScenario = () => {
    const randomIndex = Math.floor(Math.random() * autoWriteCharacterWorldScenario.length);
    onWorldScenarioChange(autoWriteCharacterWorldScenario[randomIndex]);
  };

  const handleAutoWriteCharacterGreeting = () => {
    const randomIndex = Math.floor(Math.random() * autoWriteCharacterGreeting.length);
    onGreetingChange(autoWriteCharacterGreeting[randomIndex]);
  };

  const handleAutoWriteCharacterSecret = () => {
    const randomIndex = Math.floor(Math.random() * autoWriteCharacterSecret.length);
    onSecretChange(autoWriteCharacterSecret[randomIndex]);
  };

  const renderTitle = (title: string, desc: string) => {
    const highlightText = (text: string) => {
      return text.split(/(\*|{{.*?}})/g).map((part, index) => {
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
        if (part === '{{Char}}') {
          return (
            <span key={index} style={{color: 'var(--Colors-Orange, #FF9500)'}}>
              {part}
            </span>
          );
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

  const renderMaxTextInput = (value: string, handlePromptChange: (newValue: string) => void, onClickAI: () => void) => {
    const handleButtonClick = (text: string) => {
      // 버튼 클릭 시 기존 텍스트에 {{User}} 또는 {{Char}} 추가
      handlePromptChange(value + `{{${text}}}`);
    };

    return (
      <div className={styles.maxTextInputArea}>
        <MaxTextInput
          inputDataType={inputType.None}
          stateDataType={inputState.Normal}
          displayDataType={displayType.Default}
          promptValue={value}
          handlePromptChange={event => handlePromptChange(event.target.value)}
          inSideHint={`About ${value.length} tokens (임시처리 텍스트 길이)`}
        />
        <div className={styles.maxTextButtonArea}>
          <button className={`${styles.maxTextButton} ${styles.aiButton}`}>
            <img className={styles.maxTextButtonIcon} src={BoldAI.src} onClick={onClickAI} />
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick('User')}>
            {'{{User}}'}
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick('Char')}>
            {'{{Char}}'}
          </button>
        </div>
      </div>
    );
  };

  /* 내부 회의 결과 케이브덕 카피를 하다가 기획 충돌 난 케이스. 사용하지 않음 */
  const renderGreetingList = () => {
    return (
      <>
        <div className={styles.greetingDescArea}>
          <div className={styles.desc}>
            The total token count is calulated based on the introduction with the highest number of tokens
          </div>
          <button className={styles.addGreetingButton} onClick={() => {}}>
            Add
          </button>
        </div>
        <ul className={styles.greetingListArea}>
          <div className={styles.greetingItem}>
            <div className={styles.greetingTitleArea}>
              <CustomInput inputType="Basic" textType="InputOnly" value={''} onChange={() => {}} />
              <div className={styles.greetingButtonArea}>
                <button className={styles.greetingButton}>
                  <img
                    className={styles.greetingButtonIcon}
                    src={BoldArrowDown.src}
                    style={{transform: 'rotate(180deg)'}}
                    onClick={() => {}}
                  />
                </button>
                <button className={styles.greetingButton}>
                  <img className={styles.greetingButtonIcon} src={BoldArrowDown.src} onClick={() => {}} />
                </button>

                <button className={styles.greetingButton}>
                  <img className={styles.greetingButtonIcon} src={LineDelete.src} onClick={() => {}} />
                </button>
              </div>
            </div>
            {renderMaxTextInput(greeting, onGreetingChange, handleAutoWriteCharacterGreeting)}
          </div>
        </ul>
      </>
    );
  };

  return (
    <div className={styles.llmContainer}>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Reference Language`, `Please let me know which language you'd like to use`)}
        <CustomDropDown
          items={langItems}
          displayType="Text"
          initialValue={selectedLang}
          onSelect={(value: string | number) => handleSelectLang(Number(value))}
        />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          `Character Description *`,
          `Use{{User}}to replace with the name of the user in the conversation. Use{{Char}}to replace with the charater’s name.`,
        )}
        {renderMaxTextInput(characterDesc, onCharacterDescChange, handleAutoWriteCharacterDesc)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`World Scenario`, '')}
        {renderMaxTextInput(worldScenario, onWorldScenarioChange, handleAutoWriteCharacterWorldScenario)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Greeting`, '')}
        {renderMaxTextInput(greeting, onGreetingChange, handleAutoWriteCharacterGreeting)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Secrets`, '')}
        {renderMaxTextInput(secret, onSecretChange, handleAutoWriteCharacterSecret)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Custom Modules`, 'text description')}
        <CustomDropDown
          items={promptItems}
          displayType="Text"
          initialValue={selectedPromptIdx}
          onSelect={(value: string | number) => handleSelectPrompt(Number(value))}
        />
        <CustomDropDown
          items={lorebookItems}
          displayType="Text"
          initialValue={selectedLorebookIdx}
          onSelect={(value: string | number) => handleSelectLoreBook(Number(value))}
        />
      </div>

      {renderTitle(
        `Use translated version when constructing prompts`,
        'Selects the translated version to write prompts based on the language of the user in conversation. if this option is turned off, the original text will always be used to create the prompt instead of the translation.',
      )}
    </div>
  );
};

export default CharacterCreateLLM;
