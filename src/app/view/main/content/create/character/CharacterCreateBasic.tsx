import CustomInput from '@/components/layout/shared/CustomInput';
import styles from './CharacterCreateBasic.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

interface CharacterCreateBasicProps {
  characterName: string;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  // characterDesc: string;
  // setCharacterDesc: React.Dispatch<React.SetStateAction<string>>;
  essentialWarning: boolean;
}

const Header = 'CreateCharacter';
const Common = 'Common';

const CharacterCreateBasic: React.FC<CharacterCreateBasicProps> = ({
  characterName,
  setCharacterName,
  // characterDesc,
  // setCharacterDesc,
  essentialWarning,
}) => {
  return (
    <div className={styles.basicContainer}>
      <div className={styles.basicGuide}>{formatText(getLocalizedText(Header, 'createcharacter001_desc_008'))}</div>
      <div className={styles.inputArea}>
        <div className={styles.inputTextArea}>
          <div className={styles.titleArea}>
            <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter001_label_009')}</h2>
            <h2 className={styles.titleAstric}>*</h2>
          </div>
          <div className={styles.descArea}>
            <div>{formatText(getLocalizedText(Header, 'createcharacter001_desc_010'))}</div>
            <div>{formatText(getLocalizedText(Header, 'createcharacter001_desc_011'))}</div>
          </div>
        </div>
        <CustomInput
          inputType="Basic"
          textType="InputOnly"
          state="Default"
          value={characterName}
          placeholder={getLocalizedText(Common, 'common_sample_084')}
          onChange={e => setCharacterName(e.target.value)}
          error={essentialWarning && characterName === ''}
          customClassName={[styles.inputBox]}
        />
      </div>
      {/* <div className={styles.descriptionInputArea}>
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
      </div> */}
    </div>
  );
};

export default CharacterCreateBasic;
