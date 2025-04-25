import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import Dialog from '@mui/material/Dialog';
import styles from './WorkroomSearchModal.module.css';
import {LineSearch} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import {WorkroomItemInfo} from './WorkroomItem';
import {useState} from 'react';
import {useEffect} from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  workroomData: WorkroomItemInfo[];
  setSearchResultData: (data: WorkroomItemInfo[]) => void;
  children: React.ReactNode;
}

const WorkroomSearchModal = ({open, onClose, workroomData, setSearchResultData, children}: Props) => {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (keyword.trim() === '') {
      setSearchResultData([]);
      return;
    }

    const lower = keyword.toLowerCase();

    const result = workroomData.filter(
      item => item.name.toLowerCase().includes(lower) || item.detail.toLowerCase().includes(lower),
    );

    setSearchResultData(result);
  }, [keyword, workroomData, setSearchResultData]);

  const renderSearchBar = () => {
    return (
      <div className={styles.searchBar}>
        <img className={styles.searchIcon} src={LineSearch.src} />
        <input
          type="text"
          placeholder={getLocalizedText('TODO : Search Folders')}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <CreateDrawerHeader title="" onClose={onClose} childrenAreaStyle={{width: '100%'}}>
        {renderSearchBar()}
      </CreateDrawerHeader>
      <div>{children}</div>
    </Dialog>
  );
};

export default WorkroomSearchModal;
