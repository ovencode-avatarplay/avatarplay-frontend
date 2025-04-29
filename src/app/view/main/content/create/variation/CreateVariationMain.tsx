interface Props {}

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './CreateVariationMain.module.css';
import SwipeTagList from '@/app/view/studio/workroom/SwipeTagList';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {useState} from 'react';

const CreateVariationMain: React.FC<Props> = ({}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);

  return (
    <div className={styles.variationMainContainer}>
      <CreateDrawerHeader title="Create Variation" onClose={() => {}}></CreateDrawerHeader>

      {selectedCharacter && (
        <SwipeTagList tags={['portrait', 'landscape']} currentTag={'portrait'} onTagChange={() => {}} />
      )}
    </div>
  );
};

export default CreateVariationMain;
