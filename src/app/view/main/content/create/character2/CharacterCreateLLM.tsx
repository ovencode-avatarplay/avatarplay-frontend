import styles from './CharacterCreateLLM.module.css';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import {BoldAI} from '@ui/Icons';

interface Props {}

const CharacterCreateLLM: React.FC<Props> = ({}) => {
  const items = [
    {label: 'Option 1', value: '1', icon: 'icon1.png'},
    {label: 'Option 2', value: '2', icon: 'icon2.png'},
    {label: 'Option 3', value: '3', icon: 'icon3.png'},
  ];

  const handleSelect = (value: string) => {
    console.log(`Selected value: ${value}`);
  };

  const renderTitle = (title: string, desc: string) => {
    return (
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.desc}>{desc}</div>
      </div>
    );
  };

  const renderMaxTextInput = () => {
    return (
      <div className={styles.maxTextInputArea}>
        <MaxTextInput
          inputDataType={inputType.None}
          stateDataType={inputState.Normal}
          displayDataType={displayType.Default}
          promptValue=""
          handlePromptChange={() => {}}
          inSideHint="About 18 tokens"
        />
        <div className={styles.maxTextButtonArea}>
          <button className={styles.maxTextButton}>
            <img className={styles.maxTextButtonIcon} src={BoldAI.src} />
          </button>
          <button className={styles.maxTextButton}>'User'</button>
          <button className={styles.maxTextButton}>'Char'</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.llmContainer}>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Reference Language`, `Please let me know which language you'd like to use`)}
        <div className={styles.dropBox}></div>
        <CustomDropDown items={items} displayType="Icon" onSelect={handleSelect} />
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(
          `Character Description *`,
          `Use{{User}}to replace with the name of the user in the conversation. Use{{char}}to replace with the charater’s name.`,
        )}
        {renderMaxTextInput()}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`World Scenario`, '')}
        {renderMaxTextInput()}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Greeting`, '')}
        <div className={styles.greetingDescArea}>
          <div className={styles.desc}>
            The total token count is calulated based on the introduction with the highest number of tokens
          </div>
          <button className={styles.addGreetingButton} onClick={() => {}}>
            Add
          </button>
        </div>
        {renderMaxTextInput()}
      </div>
      <div className={styles.inputDataBoxArea}>
        {renderTitle(`Screens`, '')}
        {renderMaxTextInput()}
      </div>
    </div>
  );
};

export default CharacterCreateLLM;
