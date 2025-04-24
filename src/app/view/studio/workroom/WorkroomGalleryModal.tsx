import Dialog from '@mui/material/Dialog';
import styles from './WorkroomGalleryModal.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {LineFolderPlus, LineSearch} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import WorkroomTagList from './WorkroomTagList';
import {useState} from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  characterInfo: CharacterInfo | null;
}

const WorkroomGalleryModal: React.FC<Props> = ({open, onClose, characterInfo}) => {
  const galleryTags = ['Portrait', 'Pose', 'Expressions', 'Video'];
  const [tagStates, setTagStates] = useState({
    galleryTags: 'Portrait',
  });

  const handleTagClick = (type: keyof typeof tagStates, tag: string) => {
    setTagStates(prev => ({...prev, [type]: tag}));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEnforceFocus
      disableAutoFocus
      PaperProps={{
        sx: {
          width: 'calc(100%)',
          maxWidth: '1300px',

          height: '100%',
          maxHeight: '100%',

          margin: '0 auto',
          borderRadius: '0px',
        },
      }}
    >
      <CreateDrawerHeader
        title={getLocalizedText(`TODO : Gallery ${characterInfo?.name}`)}
        onClose={() => {
          onClose();
        }}
      >
        <div className={styles.buttonArea}>
          <button className={styles.topButton}>
            <img className={styles.buttonIcon} src={LineSearch.src} onClick={() => {}} />
          </button>
          <button
            className={styles.topButton}
            onClick={() => {
              //   addFolder();
            }}
          >
            <img src={LineFolderPlus.src} />
          </button>
        </div>
      </CreateDrawerHeader>

      <WorkroomTagList
        tags={galleryTags}
        currentTag={tagStates.galleryTags}
        onTagChange={tag => handleTagClick('galleryTags', tag)}
      />
    </Dialog>
  );
};

export default WorkroomGalleryModal;
