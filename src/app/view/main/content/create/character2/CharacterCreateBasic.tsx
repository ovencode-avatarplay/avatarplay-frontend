import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CharacterCreateBasic.module.css';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';

interface CharacterCreateBasicProps {
  characterName: string;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  characterDesc: string;
  setCharacterDesc: React.Dispatch<React.SetStateAction<string>>;
}

const CharacterCreateBasic: React.FC<CharacterCreateBasicProps> = ({
  characterName,
  setCharacterName,
  characterDesc,
  setCharacterDesc,
}) => {
  const characterNameDesc: string[] = [
    'Avoid ambiguous names like “Rose”, “Joy”, “Ivy” that can be interpreted in multiple ways.',
    'Use a name that is clearly recognized as a name. Use a short name. Long names are difficult to enter during the chat.',
  ];
  let characterDescPlaceholder = `This is the description of the character (Character description is also public to other users)`;

  return (
    <div className={styles.basicContainer}>
      <div className={styles.inputArea}>
        <div className={styles.inputTextArea}>
          <div className={styles.titleArea}>
            <h2 className={styles.title2}> Character name</h2>
            <h2 className={styles.titleAstric}>*</h2>
          </div>
          <div className={styles.descArea}>
            {characterNameDesc.map((sentence, index) => (
              <p key={index}>
                {index + 1}. {sentence}
              </p>
            ))}
          </div>
        </div>
        <CustomInput
          inputType="Basic"
          textType="InputOnly"
          state="Default"
          value={characterName}
          placeholder="Enter the character name "
          onChange={e => setCharacterName(e.target.value)}
          customClassName={[styles.inputBox]}
        />
      </div>
      <div className={styles.descriptionInputArea}>
        <div className={styles.titleArea}>
          <h2 className={styles.title2}> Character Description</h2>
          <h2 className={styles.titleAstric}>*</h2>
        </div>
        <MaxTextInput
          stateDataType={inputState.Normal}
          inputDataType={inputType.None}
          displayDataType={displayType.Default}
          promptValue={characterDesc}
          handlePromptChange={e => setCharacterDesc(e.target.value)}
          placeholder={characterDescPlaceholder}
          inSideHint={`About ${characterDesc?.length} tokens (임시처리 텍스트 길이)`}
        />
      </div>
    </div>
  );
};

export default CharacterCreateBasic;
