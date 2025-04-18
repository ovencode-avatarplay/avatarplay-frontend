interface Props {}

import ReactDOM from 'react-dom';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './Workroom.module.css';
import Splitters from '@/components/layout/shared/CustomSplitter';
import getLocalizedText from '@/utils/getLocalizedText';
import {useRef, useState} from 'react';
import WorkroomTagList from './WorkroomTagList';
import {LineEdit, LineFolderPlus, LineSearch} from '@ui/Icons';
import {Swiper, SwiperSlide} from 'swiper/react';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';
import WorkroomSelectingMenu from './WorkroomSelectingMenu';
import SelectDrawer from '@/components/create/SelectDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import WorkroomEditDrawer from './WorkroomEditDrawer';
import ImagePreViewer from '@/components/layout/shared/ImagePreViewer';
import GeneratedImagePreViewer from '@/components/layout/shared/GeneratedImagePreViewer';

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
    {id: 1000, imgUrl: '/images/001.png', name: 'workroom0', detail: 'detail0'},
    {id: 1001, imgUrl: '/images/001.png', name: 'workroom1', detail: 'detail1'},
    {id: 2002, imgUrl: '/images/001.png', name: 'workroom2', detail: 'detail2'},
    {id: 2003, imgUrl: '/images/001.png', name: 'workroom3', detail: 'detail3'},
    {id: 3004, imgUrl: '/images/001.png', name: 'workroom4', detail: 'detail4'},
    {id: 3005, imgUrl: '/images/001.png', name: 'workroom5', detail: 'detail5'},
  ];

  // All 에서 보여지는 folder 리스트는 4개입니다. (기획)
  const [folderData, setFolderData] = useState<WorkroomItemInfo[]>([
    {id: 1000, imgUrl: '/images/001.png', name: 'folder0', detail: 'detail0'},
    {id: 1001, imgUrl: '/images/001.png', name: 'folder1', detail: 'detail1'},
    {id: 1002, imgUrl: '/images/001.png', name: 'folder2', detail: 'detail2', favorite: true},
    {
      id: 1003,
      imgUrl: '/images/001.png',
      name: 'folder3',
      detail: 'detail3',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 1004, imgUrl: '/images/001.png', name: 'folder4', detail: 'detail4'},
    {id: 1005, imgUrl: '/images/001.png', name: 'folder5', detail: 'detail5'},
    {id: 1006, imgUrl: '/images/001.png', name: 'folder6', detail: 'detail6'},
    {id: 1007, imgUrl: '/images/001.png', name: 'folder7', detail: 'detail7'},
  ]);

  // All 에서 보여지는 image 그리드는 4개 입니다. (기획)
  const [imageData, setImageData] = useState<WorkroomItemInfo[]>([
    {id: 2000, imgUrl: '/images/001.png', name: 'image0', detail: 'detail0'},
    {id: 2001, imgUrl: '/images/001.png', name: 'image1', detail: 'detail1'},
    {id: 2002, imgUrl: '/images/001.png', name: 'image2', detail: 'detail2'},
    {
      id: 2003,
      imgUrl: '/images/001.png',
      name: 'image3',
      detail: 'detail3',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 2004, imgUrl: '/images/001.png', name: 'image4', detail: 'detail4'},
    {id: 2005, imgUrl: '/images/001.png', name: 'image5', detail: 'detail5'},
    {id: 2006, imgUrl: '/images/001.png', name: 'image6', detail: 'detail6', favorite: true},
    {id: 2007, imgUrl: '/images/001.png', name: 'image7', detail: 'detail7'},
  ]);

  // All 에서 보여지는 video 그리드는 4개 입니다. (기획)
  const [videoData, setVideoData] = useState<WorkroomItemInfo[]>([
    {id: 3000, imgUrl: '/images/001.png', name: 'video0', detail: 'detail0'},
    {
      id: 3001,
      imgUrl: '/images/001.png',
      name: 'video1',
      detail: 'detail1',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 3002, imgUrl: '/images/001.png', name: 'video2', detail: 'detail2'},
    {id: 3003, imgUrl: '/images/001.png', name: 'video3', detail: 'detail3'},
    {
      id: 3004,
      imgUrl: '/images/001.png',
      name: 'video4',
      detail: 'detail4',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {
      id: 3005,
      imgUrl: '/images/001.png',
      name: 'video5',
      detail: 'detail5',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {id: 3006, imgUrl: '/images/001.png', name: 'video6', detail: 'detail6'},
    {id: 3007, imgUrl: '/images/001.png', name: 'video7', detail: 'detail7', favorite: true},
  ]);

  // All 에서 보여지는 audio 그리드는 4개 입니다. (기획)
  const [audioData, setAudioData] = useState<WorkroomItemInfo[]>([
    {id: 4000, imgUrl: '/images/001.png', name: 'audio0', detail: 'detail0'},
    {id: 4001, imgUrl: '/images/001.png', name: 'audio1', detail: 'detail1'},
    {id: 4002, imgUrl: '/images/001.png', name: 'audio2', detail: 'detail2', favorite: true},
    {id: 4003, imgUrl: '/images/001.png', name: 'audio3', detail: 'detail3'},
    {id: 4004, imgUrl: '/images/001.png', name: 'audio4', detail: 'detail4', favorite: true},
    {id: 4005, imgUrl: '/images/001.png', name: 'audio5', detail: 'detail5'},
    {id: 4006, imgUrl: '/images/001.png', name: 'audio6', detail: 'detail6', favorite: true},
    {id: 4007, imgUrl: '/images/001.png', name: 'audio7', detail: 'detail7'},
  ]);

  const [aiHistoryData, setAiHistoryData] = useState<WorkroomItemInfo[]>([
    {id: 5000, imgUrl: '/images/001.png', name: 'aiGen0', detail: 'detail0'},
    {id: 5001, imgUrl: '/images/001.png', name: 'aiGen1', detail: 'detail1'},
    {id: 5002, imgUrl: '/images/001.png', name: 'aiGen2', detail: 'detail2'},
    {id: 5003, imgUrl: '/images/001.png', name: 'aiGen3', detail: 'detail3'},
    {id: 5004, imgUrl: '/images/001.png', name: 'aiGen4', detail: 'detail4'},
    {id: 5005, imgUrl: '/images/001.png', name: 'aiGen5', detail: 'detail5'},
  ]);

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

  const [isfileEditDrawerOpen, setIsFileEditDrawerOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkroomItemInfo | null>(null);
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);

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

  const renderDataItems = (data: WorkroomItemInfo[], detailView: boolean, option: RenderDataItemsOptions) => {
    const trashFilteredData = option.trash ? data.filter(item => item.trash) : data.filter(item => !item.trash);
    const favoriteFilteredData = option.favorite ? trashFilteredData.filter(item => item.favorite) : trashFilteredData;
    const limitedData = option.limit ? favoriteFilteredData.slice(0, option.limit) : favoriteFilteredData;

    return (
      <div className={`${styles.itemContainer}`}>
        {option.filterArea && <div className={styles.filterArea}>{getLocalizedText('TODO: FILTER')}</div>}
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

        {tagStates.work === 'Image' && renderDataItems(imageData, detailView, {filterArea: true})}

        {tagStates.work === 'Video' && renderDataItems(videoData, detailView, {filterArea: true})}

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
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, favorite: true})}
        {tagStates.favorite === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, favorite: true})}
        {tagStates.favorite === 'Audio' &&
          renderDataItems(audioData, true, {filterArea: true, limit: 4, favorite: true})}
      </div>
    );
  };

  const renderAiHistory = () => {
    return <div className={styles.aiHistoryContainer}></div>;
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
        {tagStates.work === 'All' && (
          <>
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
              {renderDataItems(folderData, true, {filterArea: true, limit: 4, trash: true})}
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
              {renderDataItems(imageData, detailView, {filterArea: false, limit: 4, trash: true})}
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
              {renderDataItems(videoData, detailView, {filterArea: false, limit: 4, trash: true})}
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
              {renderDataItems(audioData, true, {filterArea: false, limit: 4, trash: true})}
            </div>
          </>
        )}

        {tagStates.work === 'Folders' && renderDataItems(folderData, true, {filterArea: true, limit: 4, trash: true})}

        {tagStates.work === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, trash: true})}

        {tagStates.work === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, trash: true})}

        {tagStates.work === 'Audio' && renderDataItems(audioData, true, {filterArea: true, limit: 4, trash: true})}
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
      content: <>{}</>,
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
      {isFolderNamePopupOpen &&
        ReactDOM.createPortal(
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
          />,
          document.body,
        )}
      {isfileEditDrawerOpen &&
        selectedItem !== null &&
        ReactDOM.createPortal(
          <WorkroomEditDrawer
            open={isfileEditDrawerOpen}
            onClose={() => setIsFileEditDrawerOpen(false)}
            name={selectedItem.name}
            info={selectedItem.detail}
            onCopy={() => console.log('Copy')}
            onMove={() => console.log('Move')}
            onShare={() => console.log('Share')}
            onDownload={() => console.log('Download')}
            onDelete={() => console.log('Delete')}
          />,
          document.body,
        )}

      {imageViewOpen && (
        // <ImagePreViewer imageUrl={selectedItem?.imgUrl || ''} onClose={() => setImageViewOpen(false)} />

        <GeneratedImagePreViewer
          generatedInfo={{
            imgUrl: selectedItem?.imgUrl || '',
            id: 0,
            generateModel: 'model',
            imageSize: '64x64',
            positivePrompt: 'posi',
            negativePrompt: 'nega',
            seed: 1111,
          }}
          onClose={() => setImageViewOpen(false)}
        />
      )}
    </div>
  );
};

export default Workroom;
