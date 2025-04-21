interface Props {}

import ReactDOM from 'react-dom';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './Workroom.module.css';
import Splitters from '@/components/layout/shared/CustomSplitter';
import getLocalizedText from '@/utils/getLocalizedText';
import {useLayoutEffect, useRef, useState} from 'react';
import WorkroomTagList from './WorkroomTagList';
import {BoldAltArrowDown, BoldViewGallery, LineEdit, LineFolderPlus, LineList, LineSearch} from '@ui/Icons';
import {Swiper, SwiperSlide} from 'swiper/react';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';
import WorkroomSelectingMenu from './WorkroomSelectingMenu';
import SelectDrawer from '@/components/create/SelectDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import WorkroomEditDrawer from './WorkroomEditDrawer';
import ImagePreViewer from '@/components/layout/shared/ImagePreViewer';
import GeneratedImagePreViewer from '@/components/layout/shared/GeneratedImagePreViewer';
import WorkroomFileMoveModal from './WorkroomFileMoveModal';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {GetCharacterListReq, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {GetCharacterInfoReq, sendGetCharacterProfileInfo} from '@/app/NetWork/CharacterNetwork';
import {getCurrentLanguage} from '@/utils/UrlMove';

type BaseNode = {
  id: number; // 고유 ID
  name: string; // 파일 또는 폴더 이름
  path: string; // 전체 경로 (예: Folder/FeedImage/20250421)
  parentId: number | null; // 상위 폴더 ID (root는 null)
  isOpen?: boolean; // (트리뷰 확장 대비) 열림/닫힘 여부
};

export type FolderNode = BaseNode & {
  type: 'folder';
  children: (FolderNode | FileNode)[];
};

export type FileNode = BaseNode & {
  type: 'file';
  extension?: string;
};

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
    {id: 1000, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom0', detail: 'detail0'},
    {id: 1001, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom1', detail: 'detail1'},
    {id: 2002, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom2', detail: 'detail2'},
    {id: 2003, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom3', detail: 'detail3'},
    {id: 3004, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom4', detail: 'detail4'},
    {id: 3005, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'workroom5', detail: 'detail5'},
  ];

  // All 에서 보여지는 folder 리스트는 4개입니다. (기획)
  const [folderData, setFolderData] = useState<WorkroomItemInfo[]>([
    {id: 1000, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder0', detail: 'detail0'},
    {id: 1001, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder1', detail: 'detail1'},
    {
      id: 1002,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder2',
      detail: 'detail2',
      favorite: true,
    },
    {
      id: 1003,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder3',
      detail: 'detail3',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 1004, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder4', detail: 'detail4'},
    {id: 1005, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder5', detail: 'detail5'},
    {id: 1006, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder6', detail: 'detail6'},
    {id: 1007, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder7', detail: 'detail7'},
  ]);

  const rootFolder: FolderNode = {
    id: 100,
    name: 'Folder',
    type: 'folder',
    path: 'Folder',
    parentId: null,
    isOpen: true,
    children: [
      {
        id: 200,
        name: 'FeedImage',
        type: 'folder',
        path: 'Folder/FeedImage',
        parentId: 100,
        isOpen: false,
        children: [
          {
            id: 300,
            name: '20250421',
            type: 'folder',
            path: 'Folder/FeedImage/20250421',
            parentId: 200,
            isOpen: false,
            children: [],
          },
        ],
      },
      {
        id: 201,
        name: 'ContentImage',
        type: 'folder',
        path: 'Folder/ContentImage',
        parentId: 100,
        isOpen: false,
        children: [
          {
            id: 310,
            name: '20250421',
            type: 'folder',
            path: 'Folder/ContentImage/20250421',
            parentId: 201,
            isOpen: false,
            children: [],
          },
          {
            id: 311,
            name: '20250422',
            type: 'folder',
            path: 'Folder/ContentImage/20250422',
            parentId: 201,
            isOpen: false,
            children: [],
          },
        ],
      },
    ],
  };

  // All 에서 보여지는 image 그리드는 4개 입니다. (기획)
  const [imageData, setImageData] = useState<WorkroomItemInfo[]>([
    {id: 2000, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image0', detail: 'detail0'},
    {id: 2001, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image1', detail: 'detail1'},
    {id: 2002, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image2', detail: 'detail2'},
    {
      id: 2003,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'image3',
      detail: 'detail3',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 2004, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image4', detail: 'detail4'},
    {id: 2005, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image5', detail: 'detail5'},
    {
      id: 2006,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'image6',
      detail: 'detail6',
      favorite: true,
    },
    {id: 2007, mediaState: MediaState.Image, imgUrl: '/images/001.png', name: 'image7', detail: 'detail7'},
  ]);

  // All 에서 보여지는 video 그리드는 4개 입니다. (기획)
  const [videoData, setVideoData] = useState<WorkroomItemInfo[]>([
    {id: 3000, mediaState: MediaState.Video, imgUrl: '/images/001.png', name: 'video0', detail: 'detail0'},
    {
      id: 3001,
      mediaState: MediaState.Video,
      imgUrl: '/images/001.png',
      name: 'video1',
      detail: 'detail1',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 3002, mediaState: MediaState.Video, imgUrl: '/images/001.png', name: 'video2', detail: 'detail2'},
    {id: 3003, mediaState: MediaState.Video, imgUrl: '/images/001.png', name: 'video3', detail: 'detail3'},
    {
      id: 3004,
      mediaState: MediaState.Video,
      imgUrl: '/images/001.png',
      name: 'video4',
      detail: 'detail4',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {
      id: 3005,
      mediaState: MediaState.Video,
      imgUrl: '/images/001.png',
      name: 'video5',
      detail: 'detail5',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 3006, mediaState: MediaState.Video, imgUrl: '/images/001.png', name: 'video6', detail: 'detail6'},
    {
      id: 3007,
      mediaState: MediaState.Video,
      imgUrl: '/images/001.png',
      name: 'video7',
      detail: 'detail7',
      favorite: true,
    },
  ]);

  // All 에서 보여지는 audio 그리드는 4개 입니다. (기획)
  const [audioData, setAudioData] = useState<WorkroomItemInfo[]>([
    {id: 4000, mediaState: MediaState.Audio, imgUrl: '/images/001.png', name: 'audio0', detail: 'detail0'},
    {id: 4001, mediaState: MediaState.Audio, imgUrl: '/images/001.png', name: 'audio1', detail: 'detail1'},
    {
      id: 4002,
      mediaState: MediaState.Audio,
      imgUrl: '/images/001.png',
      name: 'audio2',
      detail: 'detail2',
      favorite: true,
    },
    {id: 4003, mediaState: MediaState.Audio, imgUrl: '/images/001.png', name: 'audio3', detail: 'detail3'},
    {
      id: 4004,
      mediaState: MediaState.Audio,
      imgUrl: '/images/001.png',
      name: 'audio4',
      detail: 'detail4',
      favorite: true,
    },
    {id: 4005, mediaState: MediaState.Audio, imgUrl: '/images/001.png', name: 'audio5', detail: 'detail5'},
    {
      id: 4006,
      mediaState: MediaState.Audio,
      imgUrl: '/images/001.png',
      name: 'audio6',
      detail: 'detail6',
      favorite: true,
    },
    {id: 4007, mediaState: MediaState.Audio, imgUrl: '/images/001.png', name: 'audio7', detail: 'detail7'},
  ]);

  const [aiHistoryData, setAiHistoryData] = useState<WorkroomItemInfo[]>([
    {
      id: 5000,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen0',
      detail: 'detail0',
      generatedInfo: {
        generatedType: 2,
        generateModel: 'model',
        imageSize: '64x64',
        positivePrompt: 'positive',
        negativePrompt: 'negative',
        seed: 12345,
      },
    },
    {
      id: 5001,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen1',
      detail: 'detail1',
      generatedInfo: {
        generatedType: 2,
        generateModel: 'model1',
        imageSize: '128x128',
        positivePrompt: 'positive, 1',
        negativePrompt: 'negative, 1',
        seed: 11111,
      },
    },
    {
      id: 5002,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen2',
      detail: 'detail2',
      generatedInfo: {
        generatedType: 1,
        generateModel: 'model2',
        imageSize: '128x128',
        positivePrompt: 'positive, 2',
        negativePrompt: 'negative, 2',
        seed: 22222,
      },
    },
    {
      id: 5003,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen3',
      detail: 'detail3',
      generatedInfo: {
        generatedType: 2,
        generateModel: 'model3',
        imageSize: '120x120',
        positivePrompt: 'positive, 3',
        negativePrompt: 'negative, 3',
        seed: 33333,
      },
    },
    {
      id: 5004,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen4',
      detail: 'detail4',
      generatedInfo: {
        generatedType: 1,
        generateModel: 'model4',
        imageSize: '128x128',
        positivePrompt: 'positive, 4',
        negativePrompt: 'negative, 4',
        seed: 4444,
      },
    },
    {
      id: 5005,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen5',
      detail: 'detail5',
      generatedInfo: {
        generatedType: 2,
        generateModel: 'model5',
        imageSize: '128x128',
        positivePrompt: 'positive, 5',
        negativePrompt: 'negative, 5',
        seed: 55555,
      },
    },
  ]);

  const [galleryData, setGalleryData] = useState<WorkroomItemInfo[]>([]);

  //#endregion

  //#region State
  const [tagStates, setTagStates] = useState({
    work: 'All',
    favorite: 'All',
    aiHistory: 'All',
    gallery: 'All',
    trash: 'All',
  });

  type RenderDataItemsOptions = {
    filterArea?: boolean;
    limit?: number;
    favorite?: boolean;
    trash?: boolean;
    generatedType?: number;
  };

  const [detailView, setDetailView] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const holdTime = 1000;
  const [isHolding, setIsHolding] = useState(false);

  const [isSelectCreateOpen, setIsSelectCreateOpen] = useState<boolean>(false);
  const [isFolderNamePopupOpen, setIsFolderNamePopupOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');

  const [isFileEditDrawerOpen, setIsFileEditDrawerOpen] = useState<boolean>(false);
  const [isFileMoveModalOpen, setIsFileMoveModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkroomItemInfo | null>(null);
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);

  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | null>(null);
  //#endregion

  //#region Container에서 길게 입력으로 선택활성화 시키기
  const handleStart = () => {
    holdTimer.current = setTimeout(() => {
      setIsHolding(true);
      setIsSelecting(true);
    }, holdTime);
  };

  const handleEnd = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsHolding(false); // holding 상태 초기화
  };

  const handleDeselectIfOutside = (event: React.MouseEvent | React.TouchEvent) => {
    const target = event.target as HTMLElement;
    const container = event.currentTarget as HTMLElement;

    const isInsideItem = target.closest('[data-item]');
    const isInsideContainer = container.contains(target);

    // 조건: holding이 아니라면 해제 처리 (holding 중이면 setIsSelecting을 해제하지 않음)
    if (!isInsideItem && isSelecting && !isHolding && isInsideContainer) {
      setIsSelecting(false);
    }
  };

  //#endregion

  //#region  Handler
  const handleTagClick = (type: keyof typeof tagStates, tag: string) => {
    setTagStates(prev => ({...prev, [type]: tag}));
    // 태그는
    // setIsSelecting(false);
    // setSelectedItems([]);
  };

  const toggleSelectItem = (id: number, checked: boolean) => {
    if (!isSelecting) return;

    setSelectedItems(prev => (checked ? [...prev, id] : prev.filter(itemId => itemId !== id)));
  };

  const toggleFavorite = (id: number) => {
    const updateDataFavorite = (data: WorkroomItemInfo[]) =>
      data.map(item => (item.id === id ? {...item, favorite: !item.favorite} : item));

    // 모든 데이터 세트에 대해 업데이트 (임시 구조이므로 모두 수정)
    setFolderData(prev => updateDataFavorite(prev));
    setImageData(prev => updateDataFavorite(prev));
    setVideoData(prev => updateDataFavorite(prev));
    setAudioData(prev => updateDataFavorite(prev));
  };

  const handleMenuClick = (item: WorkroomItemInfo) => {
    setIsFileEditDrawerOpen(true);
    setSelectedItem(item);
  };

  const handleItemImageClick = (item: WorkroomItemInfo) => {
    if (!isSelecting) {
      setSelectedItem(item);
      setImageViewOpen(true);
    }
  };

  //#endregion

  //#region function

  // 현재 유저가 가진 캐릭터를 모두 가져옴
  const getCharacterList = async () => {
    try {
      const characterListreq: GetCharacterListReq = {
        languageType: getCurrentLanguage(),
      };
      const response = await sendGetCharacterList(characterListreq);

      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacters(characterInfoList);
        setGalleryData([]);
        characterInfoList.map(character => {
          setGalleryData(prev => [
            ...prev,
            {
              id: character.id,
              mediaState: MediaState.Image,
              imgUrl: character.mainImageUrl,
              name: character.name,
              detail: character.createAt,
              favorite: false,
              trash: false,
            },
          ]);
        });
      } else {
        throw new Error(`No contentInfo in response for ID: `);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
    }
  };

  // Id로 캐릭터 정보를 가져옴
  const getCharacterInfo = async (id: number) => {
    try {
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), characterId: id};
      const response = await sendGetCharacterProfileInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data?.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response : ${id}`);
      }
    } catch (error) {
      console.error('Error get Character Info by Id :', error);
    } finally {
    }
  };

  //#endregion

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getCharacterList();
  }

  //#region Renderer
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
            <div className={styles.dataItem} key={index} data-item>
              <WorkroomItem
                detailView={detailView}
                item={item}
                isSelecting={isSelecting}
                isSelected={selectedItems.includes(item.id)}
                onSelect={checked => toggleSelectItem(item.id, checked)}
                onClickFavorite={() => toggleFavorite(item.id)}
                onClickMenu={() => handleMenuClick(item)}
                onClickPreview={() => handleItemImageClick(item)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderDataItems = (
    data: WorkroomItemInfo[],
    detailView: boolean,
    option: RenderDataItemsOptions,
    detailViewButton?: boolean,
  ) => {
    const trashFilteredData = option.trash ? data.filter(item => item.trash) : data.filter(item => !item.trash);
    const favoriteFilteredData = option.favorite ? trashFilteredData.filter(item => item.favorite) : trashFilteredData;
    const generatedTypeFilterData =
      option.generatedType && option.generatedType > 0
        ? favoriteFilteredData.filter(item => item.generatedInfo?.generatedType === option.generatedType)
        : favoriteFilteredData;
    const limitedData = option.limit ? favoriteFilteredData.slice(0, option.limit) : generatedTypeFilterData;

    return (
      <div className={`${styles.itemContainer}`}>
        {option.filterArea && (
          <div className={styles.filterArea}>{renderFilter(detailViewButton || false, detailView)}</div>
        )}
        <ul className={`${detailView ? styles.listArea : styles.gridArea}`}>
          {limitedData.map((item, index) => (
            <div className={styles.dataItem} key={index} data-item>
              <WorkroomItem
                detailView={detailView}
                item={item}
                isSelecting={isSelecting}
                isSelected={selectedItems.includes(item.id)}
                onSelect={checked => toggleSelectItem(item.id, checked)}
                onClickFavorite={() => toggleFavorite(item.id)}
                onClickMenu={() => handleMenuClick(item)}
                onClickPreview={() => handleItemImageClick(item)}
              />
            </div>
          ))}
        </ul>
      </div>
    );
  };

  const renderFilter = (detailViewButton: boolean, detailView: boolean) => {
    return (
      <>
        <div className={styles.filterLeft}>
          {detailViewButton && (
            <button
              className={styles.detailViewButton}
              onClick={() => {
                setDetailView(prev => !prev);
              }}
            >
              <img src={!detailView ? BoldViewGallery.src : LineList.src} alt="detailView" />
            </button>
          )}
        </div>
        <div className={styles.filterRight}>
          <div className={styles.filterText}>{getLocalizedText('TODO : Filter')}</div>
          <img src={BoldAltArrowDown.src} alt="filter" />
        </div>
      </>
    );
  };

  const renderMyWork = () => {
    return (
      <div
        className={styles.myWorkContainer}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchCancel={handleEnd}
        onTouchEnd={e => {
          handleEnd();
          handleDeselectIfOutside(e);
        }}
        onClick={e => handleDeselectIfOutside(e)}
      >
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
                    handleTagClick('work', 'Folders');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(folderData, true, {filterArea: false, limit: 4, trash: false})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Image')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('work', 'Image');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(imageData, detailView, {filterArea: false, limit: 4})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Video')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('work', 'Video');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(videoData, detailView, {filterArea: false, limit: 4})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Audio')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('work', 'Audio');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(audioData, true, {filterArea: false, limit: 4})}
            </div>
          </>
        )}

        {tagStates.work === 'Folders' && renderDataItems(folderData, true, {filterArea: true})}

        {tagStates.work === 'Image' && renderDataItems(imageData, detailView, {filterArea: true}, true)}

        {tagStates.work === 'Video' && renderDataItems(videoData, detailView, {filterArea: true}, true)}

        {tagStates.work === 'Audio' && renderDataItems(audioData, true, {filterArea: true})}
      </div>
    );
  };

  const renderFavorite = () => {
    return (
      <div className={styles.favoriteContainer}>
        {tagStates.favorite === 'All' && (
          <>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Folder')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('favorite', 'Folders');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(folderData, true, {filterArea: false, limit: 4, favorite: true})}
            </div>

            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Image')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('favorite', 'Image');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(imageData, detailView, {filterArea: false, limit: 4, favorite: true})}
            </div>

            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Video')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('favorite', 'Video');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(videoData, detailView, {filterArea: false, limit: 4, favorite: true})}
            </div>

            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Audio')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('favorite', 'Audio');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(audioData, true, {filterArea: false, limit: 4, favorite: true})}
            </div>
          </>
        )}

        {tagStates.favorite === 'Folders' &&
          renderDataItems(folderData, true, {filterArea: true, limit: 4, favorite: true})}
        {tagStates.favorite === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, favorite: true}, true)}
        {tagStates.favorite === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, favorite: true}, true)}
        {tagStates.favorite === 'Audio' &&
          renderDataItems(audioData, true, {filterArea: true, limit: 4, favorite: true})}
      </div>
    );
  };

  const renderAiHistory = () => {
    return (
      <div
        className={styles.aiHistoryContainer}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchCancel={handleEnd}
        onTouchEnd={e => {
          handleEnd();
          handleDeselectIfOutside(e);
        }}
        onClick={e => handleDeselectIfOutside(e)}
      >
        <>
          <div className={styles.categoryArea}>
            <div className={styles.categoryTitleArea}></div>
            {renderDataItems(aiHistoryData, false, {
              filterArea: false,
              generatedType:
                tagStates.aiHistory === 'All'
                  ? 0
                  : tagStates.aiHistory === 'Custom'
                  ? 1
                  : tagStates.aiHistory === 'Variation'
                  ? 2
                  : 0,
            })}
          </div>
        </>
      </div>
    );
  };

  const renderGallery = () => {
    return (
      <div className={styles.galleryContainer}>
        {tagStates.gallery === 'All' && (
          <>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : MyCharacter')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('gallery', 'MyCharacter');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(galleryData, detailView, {filterArea: true, limit: 4}, true)}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : SharedCharacter')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('gallery', 'SharedCharacter');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {/* {renderDataItems(galleryData, detailView, {filterArea: true, limit : 4}, true)} */}
            </div>
          </>
        )}
        {tagStates.gallery === 'MyCharacter' && (
          <>{renderDataItems(galleryData, detailView, {filterArea: true}, true)}</>
        )}

        {tagStates.gallery === 'SharedCharacter' && (
          <>{/* {renderDataItems(galleryData, true, {filterArea: true})} */}</>
        )}
      </div>
    );
  };

  const renderTrash = () => {
    return (
      <div
        className={styles.trashContainer}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchCancel={handleEnd}
        onTouchEnd={e => {
          handleEnd();
          handleDeselectIfOutside(e);
        }}
        onClick={e => handleDeselectIfOutside(e)}
      >
        {tagStates.trash === 'All' && (
          <>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Folder')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('trash', 'Folders');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(folderData, true, {filterArea: false, limit: 4, trash: true})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Image')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('trash', 'Image');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(imageData, detailView, {filterArea: false, limit: 4, trash: true})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Video')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('trash', 'Video');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(videoData, detailView, {filterArea: false, limit: 4, trash: true})}
            </div>
            <div className={styles.categoryArea}>
              <div className={styles.categoryTitleArea}>
                <div className={styles.categoryTitle}>{getLocalizedText('TODO : Audio')}</div>
                <button
                  className={styles.categoryShowMore}
                  onClick={() => {
                    handleTagClick('trash', 'Audio');
                  }}
                >
                  {getLocalizedText('TODO : Show more')}
                </button>
              </div>
              {renderDataItems(audioData, true, {filterArea: false, limit: 4, trash: true})}
            </div>
          </>
        )}

        {tagStates.trash === 'Folders' && renderDataItems(folderData, true, {filterArea: true, limit: 4, trash: true})}

        {tagStates.trash === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, trash: true}, true)}

        {tagStates.trash === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, trash: true}, true)}

        {tagStates.trash === 'Audio' && renderDataItems(audioData, true, {filterArea: true, limit: 4, trash: true})}
      </div>
    );
  };

  //#endregion

  const splitData = [
    {
      label: getLocalizedText('TODO : Mywork'),
      preContent: (
        <WorkroomTagList tags={workTags} currentTag={tagStates.work} onTagChange={tag => handleTagClick('work', tag)} />
      ),
      content: <>{renderMyWork()}</>,
    },
    {
      label: getLocalizedText('TODO : Favorite'),
      preContent: (
        <WorkroomTagList
          tags={favoriteTags}
          currentTag={tagStates.favorite}
          onTagChange={tag => handleTagClick('favorite', tag)}
        />
      ),
      content: <>{renderFavorite()}</>,
    },
    {
      label: getLocalizedText('TODO : AI history'),
      preContent: (
        <WorkroomTagList
          tags={aiHistoryTags}
          currentTag={tagStates.aiHistory}
          onTagChange={tag => handleTagClick('aiHistory', tag)}
        />
      ),
      content: <>{renderAiHistory()}</>,
    },
    {
      label: getLocalizedText('TODO : Gallery'),
      preContent: (
        <WorkroomTagList
          tags={galleryTags}
          currentTag={tagStates.gallery}
          onTagChange={tag => handleTagClick('gallery', tag)}
        />
      ),
      content: <>{renderGallery()}</>,
    },
    {
      label: getLocalizedText('TODO : Trash'),
      preContent: (
        <WorkroomTagList
          tags={trashTags}
          currentTag={tagStates.trash}
          onTagChange={tag => handleTagClick('trash', tag)}
        />
      ),
      content: <>{renderTrash()}</>,
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
            <button
              className={styles.topButton}
              onClick={() => {
                setIsSelectCreateOpen(true);
              }}
            >
              <img className={styles.buttonIcon} src={LineFolderPlus.src} />
            </button>
          </div>
        }
      </CreateDrawerHeader>
      <Splitters
        splitters={splitData}
        headerStyle={{padding: '0 16px'}}
        onSelectSplitButton={() => {
          setIsSelecting(false);
        }}
      />
      {isSelecting && selectedItems.length > 0 && (
        <div className={styles.selectingMenuContainer}>
          <WorkroomSelectingMenu
            selectedCount={selectedItems.length}
            onExitSelecting={() => {
              setIsSelecting(false);
            }}
            onShare={() => {}}
            onDownload={() => {}}
            onMoveToFolder={() => {}}
            onMoveToTrash={() => {}}
          />
        </div>
      )}

      {isSelectCreateOpen &&
        ReactDOM.createPortal(
          <SelectDrawer
            isOpen={isSelectCreateOpen}
            items={[
              {
                name: getLocalizedText('TODO: Create folder'),
                onClick: () => {
                  setIsFolderNamePopupOpen(true);
                },
              },
              {name: getLocalizedText('TODO: Upload folder'), onClick: () => {}},
              {name: getLocalizedText('TODO: Upload files'), onClick: () => {}},
            ]}
            onClose={() => {
              setIsSelectCreateOpen(false);
            }}
            selectedIndex={-1}
          />,
          document.body,
        )}
      {ReactDOM.createPortal(
        <>
          {isFolderNamePopupOpen && (
            <CustomPopup
              title={getLocalizedText('TODO : Create a folder')}
              type="input"
              buttons={[
                {
                  label: getLocalizedText('TODO : Confirm'),
                  onClick: () => {
                    if (newFolderName !== '') {
                      //TODO Handler Add FolderItem
                      setIsFolderNamePopupOpen(false);
                      setNewFolderName('');
                    }
                  },
                },
              ]}
              inputField={{
                value: newFolderName,
                onChange: e => setNewFolderName(e.target.value),
                placeholder: getLocalizedText('TODO : Please enter the folder name'),
                textType: 'Label',
                label: getLocalizedText('TODO : Folder name'),
              }}
            />
          )}
          {isFileEditDrawerOpen && selectedItem !== null && (
            <WorkroomEditDrawer
              open={isFileEditDrawerOpen}
              onClose={() => setIsFileEditDrawerOpen(false)}
              name={selectedItem.name}
              info={selectedItem.detail}
              onCopy={() => console.log('Copy')}
              onMove={() => {
                setIsFileMoveModalOpen(true);
                setIsFileEditDrawerOpen(false);
              }}
              onShare={() => console.log('Share')}
              onDownload={() => console.log('Download')}
              onDelete={() => console.log('Delete')}
            />
          )}
          {isFileMoveModalOpen && selectedItem !== null && (
            <WorkroomFileMoveModal
              open={isFileMoveModalOpen}
              onClose={() => setIsFileMoveModalOpen(false)}
              folders={folderData}
            />
          )}
          {imageViewOpen &&
            selectedItem &&
            (selectedItem.generatedInfo ? (
              <GeneratedImagePreViewer workroomItemInfo={selectedItem} onClose={() => setImageViewOpen(false)} />
            ) : (
              <ImagePreViewer imageUrl={selectedItem?.imgUrl || ''} onClose={() => setImageViewOpen(false)} />
            ))}
        </>,
        document.body,
      )}
    </div>
  );
};

export default Workroom;
