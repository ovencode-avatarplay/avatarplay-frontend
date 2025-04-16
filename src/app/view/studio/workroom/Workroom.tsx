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
  // All 에서 보여지는 Recent 리스트는 20개 까지입니다. (기획)
  const recentData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'workroom0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'workroom1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'workroom2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'workroom3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'workroom4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'workroom5', detail: 'detail5'},
  ];

  // All 에서 보여지는 folder 리스트는 4개입니다. (기획)
  const folderData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'folder0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'folder1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'folder2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'folder3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'folder4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'folder5', detail: 'detail5'},
    {imgUrl: '/images/001.png', name: 'folder6', detail: 'detail6'},
    {imgUrl: '/images/001.png', name: 'folder7', detail: 'detail7'},
  ];

  // All 에서 보여지는 image 그리드는 4개 입니다. (기획)
  const imageData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'image0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'image1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'image2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'image3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'image4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'image5', detail: 'detail5'},
    {imgUrl: '/images/001.png', name: 'image6', detail: 'detail6'},
    {imgUrl: '/images/001.png', name: 'image7', detail: 'detail7'},
  ];

  // All 에서 보여지는 video 그리드는 4개 입니다. (기획)
  const videoData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'video0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'video1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'video2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'video3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'video4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'video5', detail: 'detail5'},
    {imgUrl: '/images/001.png', name: 'video6', detail: 'detail6'},
    {imgUrl: '/images/001.png', name: 'video7', detail: 'detail7'},
  ];

  // All 에서 보여지는 audio 그리드는 4개 입니다. (기획)
  const audioData: WorkroomItemInfo[] = [
    {imgUrl: '/images/001.png', name: 'audio0', detail: 'detail0'},
    {imgUrl: '/images/001.png', name: 'audio1', detail: 'detail1'},
    {imgUrl: '/images/001.png', name: 'audio2', detail: 'detail2'},
    {imgUrl: '/images/001.png', name: 'audio3', detail: 'detail3'},
    {imgUrl: '/images/001.png', name: 'audio4', detail: 'detail4'},
    {imgUrl: '/images/001.png', name: 'audio5', detail: 'detail5'},
    {imgUrl: '/images/001.png', name: 'audio6', detail: 'detail6'},
    {imgUrl: '/images/001.png', name: 'audio7', detail: 'detail7'},
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
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Recent')}</div>
              </div>
              {renderSwiper(recentData)}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Folder')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    setTagStates(prev => ({...prev, work: 'Folders'}));
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(folderData, true, false, 4)}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Image')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    setTagStates(prev => ({...prev, work: 'Image'}));
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(imageData, detailView, false, 4)}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Video')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    setTagStates(prev => ({...prev, work: 'Video'}));
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(videoData, detailView, false, 4)}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Audio')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    setTagStates(prev => ({...prev, work: 'Audio'}));
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(audioData, true, false, 4)}
            </div>
          </>
        )}

        {tagStates.work === 'Folders' && renderDataItems(folderData, true, true)}

        {tagStates.work === 'Image' && renderDataItems(imageData, detailView, true)}

        {tagStates.work === 'Video' && renderDataItems(videoData, detailView, true)}

        {tagStates.work === 'Audio' && renderDataItems(audioData, detailView, true)}
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

  const renderDataItems = (data: WorkroomItemInfo[], detailView: boolean, filterArea?: boolean, limit?: number) => {
    const limitedData = limit ? data.slice(0, limit) : data;
    return (
      <div className={`${styles.itemContainer}`}>
        {filterArea && <div className={styles.filterArea}>{getLocalizedText('TODO: FILTER')}</div>}
        <ul className={`${detailView ? styles.listArea : styles.gridArea}`}>
          {limitedData.map((item, index) => (
            <div className={styles.dataItem} key={index}>
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
