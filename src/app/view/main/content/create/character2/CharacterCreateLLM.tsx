import styles from './CharacterCreateLLM.module.css';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import {BoldAI, BoldArrowDown, LineDelete} from '@ui/Icons';
import {useState} from 'react';

interface Props {}

const CharacterCreateLLM: React.FC<Props> = ({}) => {
  const langItems = [
    {label: 'Lang 1', value: '1'},
    {label: 'Lang 2', value: '2'},
    {label: 'Lang 3', value: '3'},
  ];

  const llmItems = [
    {label: 'Llm 1', value: '1'},
    {label: 'Llm 2', value: '2'},
    {label: 'Llm 3', value: '3'},
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

  const [selectedLang, setSelectedLang] = useState('');

  const [characterDesc, setCharacterDesc] = useState<string>('');
  const [worldScenario, setWorldScenario] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [secret, setSecret] = useState<string>('');

  const [selectedLLM, setSelectedLLm] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedLorebook, setSelectedLorebook] = useState('');

  const handleSelectLang = (value: string) => {
    setSelectedLang(value);
  };

  const handleSelectLLM = (value: string) => {
    setSelectedLLm(value);
  };

  const handleSelectPrompt = (value: string) => {
    setSelectedPrompt(value);
  };

  const handleSelectLoreBook = (value: string) => {
    setSelectedLorebook(value);
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
        <div className={styles.desc}>{highlightText(desc)}</div>
      </div>
    );
  };

  const renderMaxTextInput = (value: string, handlePromptChange: (newValue: string) => void) => {
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
          <button className={styles.maxTextButton}>
            <img className={styles.maxTextButtonIcon} src={BoldAI.src} />
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
            {renderMaxTextInput(greeting, setGreeting)}
          </div>
        </ul>
      </>
    );
  };

  return (
    <div className={styles.llmContainer}>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Reference Language *`, `Please let me know which language you'd like to use`)}
        <div className={styles.dropBox}></div>
        <CustomDropDown items={langItems} displayType="Icon" onSelect={handleSelectLang} />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          `Character Description *`,
          `Use{{User}}to replace with the name of the user in the conversation. Use{{Char}}to replace with the charater’s name.`,
        )}
        {renderMaxTextInput(characterDesc, setCharacterDesc)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`World Scenario`, '')}
        {renderMaxTextInput(worldScenario, setWorldScenario)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Greeting`, '')}
        {renderMaxTextInput(greeting, setGreeting)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Secrets`, '')}
        {renderMaxTextInput(secret, setSecret)}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`LLM`, '')}
        <CustomDropDown items={llmItems} displayType="Text" onSelect={handleSelectLLM} />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Custom Modules`, 'text description')}
        <CustomDropDown items={promptItems} displayType="Text" onSelect={handleSelectPrompt} />
        <CustomDropDown items={lorebookItems} displayType="Text" onSelect={handleSelectLoreBook} />
      </div>

      {renderTitle(
        `Use translated version when constructing prompts`,
        'Selects the translated version to write prompts based on the language of the user in conversation. if this option is turned off, the original text will always be used to create the prompt instead of the translation.',
      )}
    </div>
  );
};

export default CharacterCreateLLM;
