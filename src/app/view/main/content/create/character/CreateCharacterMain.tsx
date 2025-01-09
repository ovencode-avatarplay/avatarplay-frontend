import CharacterCreate from './CreateCharacterSequence';
import styles from './CreateCharacterMain.module.css';
import CreateCharacterTopMenu from './CreateCharacterTopMenu';

interface CreateCharacterProps {}

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';

const CreateCharacterMain: React.FC<CreateCharacterProps> = () => {
  const router = useRouter();

  const handlerPublishFinish = () => {
    //router.push(`/:lang/studio/character`);
    pushLocalizedRoute('/studio/character', router);
  };

  return (
    <>
      <main className={styles.characterMain}>
        <CreateCharacterTopMenu contentTitle="Artist Creation" />
        <CharacterCreate closeAction={() => {}} isModify={false} publishFinishAction={handlerPublishFinish} />
      </main>
    </>
  );
};

export default CreateCharacterMain;
