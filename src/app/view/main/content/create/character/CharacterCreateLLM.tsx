import {sendGetCustomModules} from '@/app/NetWork/CustomModulesNetwork';
import styles from './CharacterCreateLLM.module.css';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAI, BoldArrowDown, LineDelete} from '@ui/Icons';
import {ReactNode, useEffect, useState} from 'react';
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import formatText from '@/utils/formatText';

interface Props {
  selectedLang: number;
  characterDesc: string;
  worldScenario: string;
  greeting: string;
  secret: string;
  selectedPromptId: number;
  selectedLorebookId: number;
  onLangChange: (lang: number) => void;
  onCharacterDescChange: (desc: string) => void;
  onWorldScenarioChange: (scenario: string) => void;
  onGreetingChange: (greeting: string) => void;
  onSecretChange: (secret: string) => void;
  onSelectedPromptChange: (prompt: number) => void;
  onSelectedLorebookChange: (lorebook: number) => void;
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
  onCharacterDescChange,
  onWorldScenarioChange,
  onGreetingChange,
  onSecretChange,
  onSelectedPromptChange,
  onSelectedLorebookChange,
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
    value: string,
    handlePromptChange: (newValue: string) => void,
    onClickAI: () => void,
    placeholder?: string,
    essential?: boolean,
  ) => {
    const handleButtonClick = (text: string) => {
      // 버튼 클릭 시 기존 텍스트에 {{User}} 또는 {{Char}} 추가
      handlePromptChange(value + `{{${text}}}`);
    };

    return (
      <div className={`${styles.maxTextInputArea} `}>
        <MaxTextInput
          inputDataType={inputType.None}
          stateDataType={inputState.Normal}
          displayDataType={displayType.Default}
          promptValue={value}
          placeholder={placeholder}
          handlePromptChange={event => handlePromptChange(event.target.value)}
          inSideHint={formatText(getLocalizedText(Header, 'createcharacter001_label_013'), [value.length.toString()])}
          style={essential && value === '' ? {borderStyle: 'solid', borderWidth: '2px', borderColor: 'red'} : {}}
        />
        <div className={styles.maxTextButtonArea}>
          <button className={`${styles.maxTextButton} ${styles.aiButton}`}>
            <img className={styles.maxTextButtonIcon} src={BoldAI.src} onClick={onClickAI} />
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick('User')}>
            {getLocalizedText(Common, 'common_button_usercommand')}
          </button>
          <button className={styles.maxTextButton} onClick={() => handleButtonClick('Char')}>
            {getLocalizedText(Common, 'common_button_charcommand')}
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
          <div className={styles.desc}>{getLocalizedText(Header, 'createcharacter001_desc_020')}</div>
          <button className={styles.addGreetingButton} onClick={() => {}}>
            {getLocalizedText(Common, 'cummon_button_add')}
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
          characterDesc,
          onCharacterDescChange,
          handleAutoWriteCharacterDesc,
          getLocalizedText(Common, 'common_sample_082'),
          essentialWarning,
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_018'), '')}
        {renderMaxTextInput(
          worldScenario,
          onWorldScenarioChange,
          handleAutoWriteCharacterWorldScenario,
          getLocalizedText(Common, 'common_sample_058'),
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_019'), '')}
        {renderMaxTextInput(
          greeting,
          onGreetingChange,
          handleAutoWriteCharacterGreeting,
          getLocalizedText(Common, 'common_sample_083'),
        )}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(getLocalizedText(Header, 'createcharacter001_label_021'), '')}
        {renderMaxTextInput(
          secret,
          onSecretChange,
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
