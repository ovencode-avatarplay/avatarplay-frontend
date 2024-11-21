import ContentHeader from '../content-main/ContentHeader';
import CharacterCreate from './CreateCharacterSequence';
import styles from './CreateCharacterMain.module.css';
import CreateCharacterTopMenu from './CreateCharacterTopMenu';

interface CreateCharacterProps {}

const CreateCharacterMain: React.FC<CreateCharacterProps> = ({}) => {
  return (
    <>
      <main className={styles.characterMain}>
        <CreateCharacterTopMenu contentTitle="Artist Creation" />
        <CharacterCreate closeAction={() => {}} isModify={false} />
      </main>
    </>
  );
};

export default CreateCharacterMain;
