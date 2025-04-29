import Dialog from '@mui/material/Dialog';
import styles from './WorkroomGalleryModal.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {LineFolderPlus, LineSearch} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import CustomButton from '@/components/layout/shared/CustomButton';

interface Props {
  open: boolean;
  onClose: () => void;
  characterInfo: CharacterInfo | null;
  children: React.ReactNode;
  onClickUpload: () => void;
}

const WorkroomGalleryModal: React.FC<Props> = ({open, onClose, characterInfo, children, onClickUpload}) => {
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
        {/* <div className={styles.buttonArea}>
          <button className={styles.topButton}>
            <img className={styles.buttonIcon} src={LineSearch.src} onClick={() => {}} />
          </button>
          <button className={styles.topButton} onClick={() => {}}>
            <img src={LineFolderPlus.src} />
          </button>
        </div> */}
      </CreateDrawerHeader>
      <div className={styles.contentArea}>
        {children}

        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          onClick={() => {
            onClickUpload();
          }}
          customClassName={[styles.uploadButton]}
        >
          {getLocalizedText('TODO : Upload ')}
        </CustomButton>
      </div>
    </Dialog>
  );
};

export default WorkroomGalleryModal;
