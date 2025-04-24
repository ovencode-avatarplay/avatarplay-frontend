import Dialog from '@mui/material/Dialog';
import styles from './WorkroomGalleryModal.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {LineFolderPlus, LineSearch} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

interface Props {
  open: boolean;
  onClose: () => void;
  characterInfo: CharacterInfo | null;
  children: React.ReactNode;
}

const WorkroomGalleryModal: React.FC<Props> = ({open, onClose, characterInfo, children}) => {
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

      {children}
    </Dialog>
  );
};

export default WorkroomGalleryModal;
