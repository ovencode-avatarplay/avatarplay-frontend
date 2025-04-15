interface Props {}

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './Workroom.module.css';
import Splitters from '@/components/layout/shared/CustomSplitter';
import getLocalizedText from '@/utils/getLocalizedText';
import {useState} from 'react';
import WorkroomTagList from './WorkroomTagList';
import WorkroomItem from './WorkroomItem';

const Workroom: React.FC<Props> = ({}) => {
  //#region PreDefine
  const workTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const favoriteTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const aiHistoryTags = ['All', 'Custom', 'Variation'];
  const galleryTags = ['All', 'MyCharacter', 'SharedCharacter'];
  const trashTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  //#endregion

  //#region State
  const [tagStates, setTagStates] = useState({
    work: 'All',
    favorite: 'All',
    aiHistory: 'All',
    gallery: 'All',
    trash: 'All',
  });

  const [detailView, setDetailView] = useState<boolean>(false);

  //#endregion

  //#region Renderer
  const renderMyWork = () => {
    return (
      <div className={styles.myWorkContainer}>
        <div className={styles.recentArea}>recent</div>
        {renderList()}
        <div className={styles.folderArea}>folder</div>
        <div className={styles.imageArea}>image</div>
        <div className={styles.videoArea}>video</div>
        <div className={styles.audioArea}>audio</div>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className={styles.listContainer}>
        <ul className={styles.listArea}>
          <WorkroomItem detailView={detailView} />
          <WorkroomItem detailView={detailView} />
          <WorkroomItem detailView={detailView} />
        </ul>
      </div>
    );
  };
  //#endregion

  const splitData = [
    {
      label: getLocalizedText('TODO : Mywork'),
      preContent: (
        <WorkroomTagList
          tags={workTags}
          currentTag={tagStates.work}
          onTagChange={tag => setTagStates(prev => ({...prev, work: tag}))}
        />
      ),
      content: <>{renderMyWork()}</>,
    },
    {
      label: getLocalizedText('TODO : Favorite'),
      preContent: (
        <WorkroomTagList
          tags={favoriteTags}
          currentTag={tagStates.favorite}
          onTagChange={tag => setTagStates(prev => ({...prev, favorite: tag}))}
        />
      ),
      content: <>{renderList()}</>,
    },
    {
      label: getLocalizedText('TODO : AI history'),
      preContent: (
        <WorkroomTagList
          tags={aiHistoryTags}
          currentTag={tagStates.aiHistory}
          onTagChange={tag => setTagStates(prev => ({...prev, aiHistory: tag}))}
        />
      ),
      content: <>{renderList()}</>,
    },
    {
      label: getLocalizedText('TODO : Gallery'),
      preContent: (
        <WorkroomTagList
          tags={galleryTags}
          currentTag={tagStates.gallery}
          onTagChange={tag => setTagStates(prev => ({...prev, gallery: tag}))}
        />
      ),
      content: <>{renderList()}</>,
    },
    {
      label: getLocalizedText('TODO : Trash'),
      preContent: (
        <WorkroomTagList
          tags={trashTags}
          currentTag={tagStates.trash}
          onTagChange={tag => setTagStates(prev => ({...prev, trash: tag}))}
        />
      ),
      content: <>{renderList()}</>,
    },
  ];

  return (
    <div className={styles.workroomContainer}>
      <CreateDrawerHeader title="WORKROOM" onClose={() => {}}>
        {
          <div className={styles.buttonArea}>
            <button>btnSearch</button>
            <button>btnAdd</button>
          </div>
        }
      </CreateDrawerHeader>
      <Splitters splitters={splitData} headerStyle={{padding: '0 16px'}} />
      WORKROOM
    </div>
  );
};

export default Workroom;
