import CharacterCreateSequence from './CreateCharacterSequence';
import styles from './CreateCharacterMain.module.css';
import CreateCharacterTopMenu from './CreateCharacterTopMenu';

interface CreateCharacterProps {}

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentHeader from '../content-main/ContentHeader';
import {LineDashboard} from '@ui/Icons';

const CreateCharacterMain: React.FC<CreateCharacterProps> = () => {
  const router = useRouter();

  const handlerPublishFinish = () => {
    //router.push(`/:lang/studio/character`);
    pushLocalizedRoute('/studio/character', router);
  };

  const handleOnClose = () => {
    router.back();
  };

  return (
    <>
      <div className={styles.characterMain}>
        <CreateDrawerHeader title="Create a Character" onClose={handleOnClose}>
          <button className={styles.dashboardButton} onClick={() => {}}>
            <img className={`${styles.dashboardIcon} `} src={LineDashboard.src} />
          </button>
        </CreateDrawerHeader>
        <CharacterCreateSequence closeAction={() => {}} isModify={false} publishFinishAction={handlerPublishFinish} />
      </div>
    </>
  );
};

export default CreateCharacterMain;
