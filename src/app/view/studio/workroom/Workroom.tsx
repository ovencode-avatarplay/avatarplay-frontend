interface Props {}

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './Workroom.module.css';
import Splitters from '@/components/layout/shared/CustomSplitter';
import getLocalizedText from '@/utils/getLocalizedText';
import {useState} from 'react';
import WorkroomTagList from './WorkroomTagList';
import {LineFolderPlus, LineSearch} from '@ui/Icons';
import {Swiper, SwiperSlide} from 'swiper/react';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';

const Workroom: React.FC<Props> = ({}) => {
  //#region PreDefine
  const workTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const favoriteTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const aiHistoryTags = ['All', 'Custom', 'Variation'];
  const galleryTags = ['All', 'MyCharacter', 'SharedCharacter'];
  const trashTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  //#endregion

  //#region TmpDefine
  // All 에서 보여지는 리스트는 20개 까지입니다.
  const recentData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'workroom0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'workroom1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'workroom2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'workroom3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'workroom4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'workroom5', detail: 'detail5'},
  ];

  const folderData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'folder0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'folder1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'folder2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'folder3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'folder4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'folder5', detail: 'detail5'},
    {imgUrl: '/images/001.png', name: 'folder6', detail: 'detail6'},
    {imgUrl: '/images/001.png', name: 'folder7', detail: 'detail7'},
    {imgUrl: '/images/001.png', name: 'folder8', detail: 'detail8'},
    {imgUrl: '/images/001.png', name: 'folder9', detail: 'detail9'},
    {imgUrl: '/images/001.png', name: 'folder10', detail: 'detail10'},
    {imgUrl: '/images/001.png', name: 'folder11', detail: 'detail11'},
    {imgUrl: '/images/001.png', name: 'folder12', detail: 'detail12'},
    {imgUrl: '/images/001.png', name: 'folder13', detail: 'detail13'},
    {imgUrl: '/images/001.png', name: 'folder14', detail: 'detail14'},
    {imgUrl: '/images/001.png', name: 'folder15', detail: 'detail15'},
    {imgUrl: '/images/001.png', name: 'folder16', detail: 'detail16'},
    {imgUrl: '/images/001.png', name: 'folder17', detail: 'detail17'},
    {imgUrl: '/images/001.png', name: 'folder18', detail: 'detail18'},
    {imgUrl: '/images/001.png', name: 'folder19', detail: 'detail19'},
    {imgUrl: '/images/001.png', name: 'folder20', detail: 'detail20'},
  ];

  const imageData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'image0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'image1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'image2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'image3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'image4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'image5', detail: 'detail5'},
  ];

  const videoData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'video0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'video1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'video2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'video3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'video4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'video5', detail: 'detail5'},
  ];

  const audioData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'audio0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'audio1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'audio2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'audio3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'audio4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'audio5', detail: 'detail5'},
  ];
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
        {tagStates.work === 'All' && (
          <>
            <div className={styles.listArea}>
              <div className={styles.listTitleArea}>
                <div className={styles.listTitle}>{getLocalizedText('TODO : Recent')}</div>
              </div>
              {renderSwiper(recentData)}
            </div>
            <div className={styles.listArea}>
              <div className={styles.listTitleArea}>
                <div className={styles.listTitle}>{getLocalizedText('TODO : Folder')}</div>
                <div className={styles.listShowMore}>{getLocalizedText('TODO : Show more')}</div>
              </div>
              {renderSwiper(folderData)}
            </div>
            <div className={styles.listArea}>
              <div className={styles.listTitleArea}>
                <div className={styles.listTitle}>{getLocalizedText('TODO : Image')}</div>
                <div className={styles.listShowMore}>{getLocalizedText('TODO : Show more')}</div>
              </div>
              {renderSwiper(imageData)}
            </div>{' '}
            <div className={styles.listArea}>
              <div className={styles.listTitleArea}>
                <div className={styles.listTitle}>{getLocalizedText('TODO : Video')}</div>
                <div className={styles.listShowMore}>{getLocalizedText('TODO : Show more')}</div>
              </div>
              {renderSwiper(videoData)}
            </div>{' '}
            <div className={styles.listArea}>
              <div className={styles.listTitleArea}>
                <div className={styles.listTitle}>{getLocalizedText('TODO : Audio')}</div>
                <div className={styles.listShowMore}>{getLocalizedText('TODO : Show more')}</div>
              </div>
              {renderSwiper(audioData)}
            </div>
          </>
        )}

        {tagStates.work === 'Folders' && renderGrid(folderData)}

        {tagStates.work === 'Image' && renderGrid(imageData)}

        {tagStates.work === 'Video' && renderGrid(videoData)}

        {tagStates.work === 'Audio' && renderGrid(audioData)}
      </div>
    );
  };

  const renderSwiper = (data: WorkroomItemInfo[]) => {
    return (
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={5}
        className={styles.workroomSwiper}
        grabCursor={true}
        // onSlideChange={handleSlideChange}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <WorkroomItem detailView={detailView} item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderGrid = (data: WorkroomItemInfo[]) => {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.filterArea}>FILTER</div>
        <ul className={styles.gridArea}>
          {data.map((item, index) => (
            <div key={index}>
              <WorkroomItem detailView={detailView} item={item} />
            </div>
          ))}
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
      content: <>{}</>,
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
      content: <>{}</>,
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
      content: <>{}</>,
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
      content: <>{}</>,
    },
  ];

  return (
    <div className={styles.workroomContainer}>
      <CreateDrawerHeader title={getLocalizedText('TODO : Workroom')} onClose={() => {}}>
        {
          <div className={styles.buttonArea}>
            <button className={styles.topButton}>
              <img className={styles.buttonIcon} src={LineSearch.src} />
            </button>
            <button className={styles.topButton}>
              <img className={styles.buttonIcon} src={LineFolderPlus.src} />
            </button>
          </div>
        }
      </CreateDrawerHeader>
      <Splitters splitters={splitData} headerStyle={{padding: '0 16px'}} />
    </div>
  );
};

export default Workroom;
