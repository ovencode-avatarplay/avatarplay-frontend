interface Props {}

//#region Import
// 1. React 및 주요 라이브러리
import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

// 2. 타사 라이브러리
import {Swiper, SwiperSlide} from 'swiper/react';
import {useAtom} from 'jotai';

// 3. 디자인 관련 아이콘, 스타일
import {LineFolderPlus, LineSearch} from '@ui/Icons';
import styles from './Workroom.module.css';

// 4. 앱 내 유틸, 상태, 네트워크
import getLocalizedText from '@/utils/getLocalizedText';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {ToastMessageAtom} from '@/app/Root';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {GetCharacterInfoReq, sendGetCharacterProfileInfo} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

// 5. 앱 내 컴포넌트 - 공통 UI
import Splitters from '@/components/layout/shared/CustomSplitter';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import EmptyState from '@/components/search/EmptyState';
import {DropDownMenuItem} from '@/components/create/DropDownMenu';
import SelectDrawer from '@/components/create/SelectDrawer';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import SharePopup from '@/components/layout/shared/SharePopup';

// 6. 앱 내 컴포넌트 - 워크룸 관련
import WorkroomMyWork from './WorkroomMyWork';
import WorkroomFavorite from './WorkroomFavorite';
import WorkroomAiHistory from './WorkroomAiHistory';
import WorkroomGallery from './WorkroomGallery';
import WorkroomTrash from './WorkroomTrash';
import WorkroomFolderData from './WorkroomFolderData';
import WorkroomDataItems from './WorkroomDataItems';
import WorkroomCategorySection from './WorkroomCategorySection';
import WorkroomFilter from './WorkroomFilter';
import WorkroomItem, {WorkroomItemInfo} from './WorkroomItem';
import WorkroomItemSkeleton from './WorkroomItemSkeleton';
import WorkroomEditDrawer from './WorkroomEditDrawer';
import WorkroomFileMoveModal from './WorkroomFileMoveModal';
import WorkroomGalleryModal from './WorkroomGalleryModal';
import WorkroomSearchModal from './WorkroomSearchModal';
import WorkroomSelectingMenu from './WorkroomSelectingMenu';
import SwipeTagList from './SwipeTagList';
import UploadFromWorkroom from './UploadFromWorkroom';
import {GalleryCategory} from '../characterDashboard/CharacterGalleryData';
//#endregion

const Workroom: React.FC<Props> = ({}) => {
  //#region PreDefine
  const workTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const favoriteTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const aiHistoryTags = ['All', 'Custom', 'Variation'];
  const galleryTags = ['All', 'MyCharacter', 'SharedCharacter'];
  const trashTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const variationTags = ['Portrait', 'Pose', 'Expressions', 'Video'];
  const searchTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const folderTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];

  type RenderDataItemsOptions = {
    filterArea?: boolean;
    limit?: number;
    favorite?: boolean;
    trash?: boolean;
    generatedType?: GalleryCategory;
    parentFolderId?: number | null;
    renderEmpty?: boolean;
  };
  //#endregion

  //#region TmpDefine

  // All 에서 보여지는 folder 리스트는 4개입니다. (기획)
  const [workroomData, setWorkroomData] = useState<WorkroomItemInfo[]>([
    {id: 1000, mediaState: MediaState.None, imgUrl: '/images/001.png', name: 'folder0', detail: 'detail0'},
    {
      id: 1001,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder1',
      detail: 'detail1',
      profileId: 520,
    },
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
    {
      id: 1004,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder4',
      detail: 'detail4',
      folderLocation: [1000],
    },
    {
      id: 1005,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder5',
      detail: 'detail5',
      folderLocation: [1000, 1004],
    },
    {
      id: 1006,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder6',
      detail: 'detail6',
      folderLocation: [1000, 1004],
    },
    {
      id: 1007,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder7',
      detail: 'detail7',
      folderLocation: [1002],
    },
    {
      id: 2000,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'image0',
      detail: 'detail0',
      profileId: 520,
    },
    {
      id: 2001,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'image1',
      detail: 'detail1',
      folderLocation: [1001],
      generatedInfo: {
        generatedType: GalleryCategory.Portrait,
        generateModel: 'uploaded',
        imageSize: '64x64',
        positivePrompt: 'uploaded',
        negativePrompt: 'uploaded',
        seed: 0,
        isUploaded: true,
      },
      profileId: 520,
    },
    {
      id: 2002,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'image2',
      detail: 'detail2',
      folderLocation: [1001],
    },
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
    {
      id: 3000,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video0',
      detail: 'detail0',
    },
    {
      id: 3001,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video1',
      detail: 'detail1',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
      updateAt: '2025-04-18 09:44:53',
    },
    {
      id: 3002,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'aawefwaef',
      detail: 'detail2',
      updateAt: '2025-04-18 09:12:53',
    },
    {
      id: 3003,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video3',
      detail: 'detail3',
      updateAt: '2025-04-12 09:44:53',
    },
    {
      id: 3004,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'asdf',
      detail: 'detail4',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
      updateAt: '2025-02-18 09:44:53',
    },
    {
      id: 3005,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'qqqqz',
      detail: 'detail5',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
      updateAt: '2021-04-18 09:44:53',
    },
    {
      id: 3006,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: '111111',
      detail: 'detail6',
      updateAt: '2025-04-18 15:54:53',
    },
    {
      id: 3007,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'fbdfgafg',
      detail: 'detail7',
      favorite: true,
    },
    {
      id: 4000,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio0',
      detail: 'detail0',
    },
    {
      id: 4001,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio1',
      detail: 'detail1',
    },
    {
      id: 4002,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio2',
      detail: 'detail2',
      favorite: true,
    },
    {
      id: 4003,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio3',
      detail: 'detail3',
    },
    {
      id: 4004,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio4',
      detail: 'detail4',
      favorite: true,
    },
    {
      id: 4005,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio5',
      detail: 'detail5',
    },
    {
      id: 4006,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio6',
      detail: 'detail6',
      favorite: true,
    },
    {
      id: 4007,
      mediaState: MediaState.Audio,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/audio/5b6414dd-982e-43ba-aa6a-30301bbb7b4c.mp3',
      name: 'audio7',
      detail: 'detail7',
    },
    {
      id: 5000,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen0',
      detail: 'detail0',
      generatedInfo: {
        generatedType: GalleryCategory.Portrait,
        generateModel: 'model',
        imageSize: '64x64',
        positivePrompt: 'positive',
        negativePrompt: 'negative',
        seed: 12345,
        isUploaded: false,
      },
      profileId: 520,
    },
    {
      id: 5001,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen1',
      detail: 'detail1',
      generatedInfo: {
        generatedType: GalleryCategory.Pose,
        generateModel: 'model1',
        imageSize: '128x128',
        positivePrompt: 'positive, 1',
        negativePrompt: 'negative, 1',
        seed: 11111,
        isUploaded: false,
      },
      profileId: 520,
    },
    {
      id: 5002,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen2',
      detail: 'detail2',
      generatedInfo: {
        generatedType: GalleryCategory.Expression,
        generateModel: 'model2',
        imageSize: '128x128',
        positivePrompt: 'positive, 2',
        negativePrompt: 'negative, 2',
        seed: 22222,
        isUploaded: false,
      },
    },
    {
      id: 5003,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen3',
      detail: 'detail3',
      generatedInfo: {
        generatedType: GalleryCategory.Pose,
        generateModel: 'model3',
        imageSize: '120x120',
        positivePrompt: 'positive, 3',
        negativePrompt: 'negative, 3',
        seed: 33333,
        isUploaded: false,
      },
    },
    {
      id: 5004,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen4',
      detail: 'detail4',
      generatedInfo: {
        generatedType: GalleryCategory.Expression,
        generateModel: 'model4',
        imageSize: '128x128',
        positivePrompt: 'positive, 4',
        negativePrompt: 'negative, 4',
        seed: 4444,
        isUploaded: false,
      },
    },
    {
      id: 5005,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen5',
      detail: 'detail5',
      generatedInfo: {
        generatedType: GalleryCategory.Pose,
        generateModel: 'model5',
        imageSize: '128x128',
        positivePrompt: 'positive, 5',
        negativePrompt: 'negative, 5',
        seed: 55555,
        isUploaded: false,
      },
    },
  ]);

  //#endregion

  //#region State
  const [tagStates, setTagStates] = useState({
    work: 'All',
    favorite: 'All',
    aiHistory: 'All',
    gallery: 'All',
    trash: 'All',
    folder: 'All',
    variation: 'Portrait',
    search: 'All',
  });

  const [isTrash, setIsTrash] = useState<boolean>(false);

  const folderData = workroomData.filter(item => item.mediaState === MediaState.None);
  const imageData = workroomData.filter(
    item =>
      item.mediaState === MediaState.Image &&
      (!item.generatedInfo || (item.generatedInfo && item.generatedInfo.isUploaded === true)),
  );
  const videoData = workroomData.filter(item => item.mediaState === MediaState.Video);
  const audioData = workroomData.filter(item => item.mediaState === MediaState.Audio);
  const aiHistoryData = workroomData.filter(
    item => item.mediaState === MediaState.Image && item.generatedInfo && item.generatedInfo.isUploaded !== true,
  );
  const [searchResultData, setSearchResultData] = useState<WorkroomItemInfo[]>([]);

  const galleryData = workroomData.filter(item => item.mediaState === MediaState.None && item.profileId);
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | null>(null);

  const [detailView, setDetailView] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const holdTime = 1000;
  const [isHolding, setIsHolding] = useState(false);

  const [isSelectCreateOpen, setIsSelectCreateOpen] = useState<boolean>(false);
  const [isFolderNamePopupOpen, setIsFolderNamePopupOpen] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');

  const [selectedItem, setSelectedItem] = useState<WorkroomItemInfo | null>(null);

  const [isFileEditDrawerOpen, setIsFileEditDrawerOpen] = useState<boolean>(false);
  const [isFileMoveModalOpen, setIsFileMoveModalOpen] = useState<boolean>(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const [selectedCurrentFolder, setSelectedCurrentFolder] = useState<WorkroomItemInfo | null>(null);
  const [folderHistory, setFolderHistory] = useState<WorkroomItemInfo[]>([]);

  const [selectedTargetFolder, setSelectedTargetFolder] = useState<WorkroomItemInfo | null>(null);

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const LOADING_THRESHOLD = 10;
  const MIN_DISPLAY_TIME = 1000;

  const [isShare, setIsShare] = useState<boolean>(false);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [sortDropDownOpen, setSortDropDownOpen] = useState<boolean>(false);

  const [searchResultList, setSearchResultList] = useState<WorkroomItemInfo[] | null>(null);

  const [requestFetch, setRequestFetch] = useState<boolean>(false);

  const ref = useRef(null);
  const [isDelaying, setIsDelaying] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const showContent = !isLoading && !isDelaying && isMediaLoaded;

  //#endregion

  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: getLocalizedText('common_sort_newest'),
      onClick: () => {
        setSearchResultList(null);
        setSortDropDownOpen(false);
        setSelectedSort(0);
        setRequestFetch(true);
      },
    },
    {
      name: getLocalizedText('common_sort_Name'),
      onClick: () => {
        setSearchResultList(null);
        setSortDropDownOpen(false);
        setSelectedSort(1);
        setRequestFetch(true);
      },
    },
  ];

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

    setIsLoading(true);
    setIsSelecting(false);
    setSelectedItems([]);
  };

  const toggleSelectItem = (id: number, checked: boolean) => {
    if (!isSelecting) return;

    setSelectedItems(prev => (checked ? [...prev, id] : prev.filter(itemId => itemId !== id)));
  };

  const toggleFavorite = (id: number) => {
    const updateDataFavorite = (data: WorkroomItemInfo[]) =>
      data.map(item => (item.id === id ? {...item, favorite: !item.favorite} : item));

    // 모든 데이터 세트에 대해 업데이트 (임시 구조이므로 모두 수정)
    setWorkroomData(prev => updateDataFavorite(prev));
  };

  const handleMenuClick = (item: WorkroomItemInfo) => {
    setIsFileEditDrawerOpen(true);
    setSelectedItem(item);
  };

  const handleItemImageClick = (item: WorkroomItemInfo) => {
    if (!isSelecting) {
      setSelectedItem(item);
      if (item.mediaState === MediaState.None) {
        handleItemClick(item);
      }
    }
  };

  const handleItemClick = async (item: WorkroomItemInfo) => {
    if (!isSelecting) {
      setSelectedItem(item);
      if (item.mediaState === MediaState.None) {
        if (item.profileId) {
          await getCharacterInfo(item.profileId);
          setSelectedCurrentFolder(item);
          setIsGalleryModalOpen(true);
          setIsSearchModalOpen(false);
        } else {
          if (selectedCurrentFolder) {
            setFolderHistory(prev => [...prev, selectedCurrentFolder]); // 히스토리에 현재 폴더 저장
          }
          handleTagClick('folder', 'All');
          setSelectedCurrentFolder(item);
          setIsSearchModalOpen(false);
        }
      } else {
        handleItemImageClick(item);
      }
    }
  };

  const handleRename = (newName: string) => {
    if (!selectedItem) return;

    setWorkroomData(prev => prev.map(item => (item.id === selectedItem.id ? {...item, name: newName} : item)));
    setSelectedItem(prev => prev && {...prev, name: newName});
  };

  const handleCopy = () => {
    if (!selectedItem) return;

    const newItem = {
      ...selectedItem,
      id: getMinId(workroomData) - 1,
      name: `Copy of ${selectedItem.name}`,
      // 생성된 이미지가 복사될때 생성정보제거 (기획)
      generatedInfo: selectedItem.generatedInfo ? undefined : selectedItem.generatedInfo,
      profileId: null,
    };

    setWorkroomData(prev => [...prev, newItem]);
    setIsFileEditDrawerOpen(false);
    dataToast.open(getLocalizedText('common_alert_091'));
  };

  const handleMove = () => {
    console.log('handleMove');
    setIsFileMoveModalOpen(true);
    setIsFileEditDrawerOpen(false);
  };

  const handleShare = () => {
    console.log('handleShare');
    setIsShare(true);
    setIsFileEditDrawerOpen(false);
  };

  const handleDownload = () => {
    if (!selectedItem?.imgUrl) return;

    const link = document.createElement('a');
    link.href = selectedItem.imgUrl;
    link.download = selectedItem.name || 'download';
    link.click();

    setIsFileEditDrawerOpen(false);
    dataToast.open(getLocalizedText('TODO : Download successfull!'));
  };

  const handleDownloadSelectedItems = () => {
    if (selectedItems.length === 0) return;

    // 선택된 항목을 workroomData에서 찾음
    const itemsToDownload = workroomData.filter(item => selectedItems.includes(item.id) && item.imgUrl);

    itemsToDownload.forEach(item => {
      const link = document.createElement('a');
      link.href = item.imgUrl || '';
      link.download = item.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    setIsSelecting(false);
    setSelectedItems([]);

    dataToast.open(
      getLocalizedText(
        `TODO : Download ${itemsToDownload.length} item${itemsToDownload.length > 1 ? 's' : ''} successful!`,
      ),
    );
  };

  const handleRestore = () => {
    if (selectedItem && !isSelecting) {
      setWorkroomData(prev => prev.map(item => (item.id === selectedItem.id ? {...item, trash: false} : item)));
      setSelectedItem(null);
      setIsFileEditDrawerOpen(false);
    } else if (isSelecting && selectedItems.length > 0) {
      setWorkroomData(prev => prev.map(item => (selectedItems.includes(item.id) ? {...item, trash: false} : item)));
      setIsSelecting(false);
      setSelectedItems([]);
      setIsFileEditDrawerOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedItem && !isSelecting) {
      if (selectedItem.trash) {
        setWorkroomData(prev => prev.filter(item => item.id !== selectedItem.id));
      } else {
        setWorkroomData(prev =>
          prev.map(item =>
            item.id === selectedItem.id ? {...item, trash: true, trashedTime: new Date().toISOString()} : item,
          ),
        );
      }
      setSelectedItem(null);
      setIsDeletePopupOpen(false);
    } else if (isSelecting && selectedItems.length > 0) {
      const isPermanentDelete = workroomData.filter(item => selectedItems.includes(item.id)).every(item => item.trash);

      if (isPermanentDelete) {
        setWorkroomData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      } else {
        setWorkroomData(prev =>
          prev.map(item =>
            selectedItems.includes(item.id) ? {...item, trash: true, trashedTime: new Date().toISOString()} : item,
          ),
        );
      }

      setIsSelecting(false);
      setSelectedItems([]);
      setIsDeletePopupOpen(false);
      setIsFileEditDrawerOpen(false);
    }
  };

  const handleDeletePopupOpen = () => {
    if (selectedItem || (isSelecting && selectedItems.length > 0)) {
      setIsFileEditDrawerOpen(false);
      setIsDeletePopupOpen(true);
    }
  };

  const handleDeletePopupCancel = () => {
    setSelectedItem(null);
    setIsDeletePopupOpen(false);
    setIsSelecting(false);
    setSelectedItems([]);
  };

  const handleAddFolder = () => {
    if (newFolderName.trim() !== '') {
      const newFolder: WorkroomItemInfo = {
        id: getMinId(workroomData) - 1,
        mediaState: MediaState.None,
        imgUrl: '',
        name: newFolderName,
        detail: getLocalizedText('TODO : New folder'),
        favorite: false,
        trash: false,
        folderLocation: selectedCurrentFolder?.id ? [selectedCurrentFolder.id] : [],
      };

      setWorkroomData(prev => [...prev, newFolder]);
      setIsFolderNamePopupOpen(false);
      setNewFolderName('');
      dataToast.open(getLocalizedText('TODO : Folder created'));
    }
  };

  const handleSelectTargetFolder = (folder: WorkroomItemInfo | null) => {
    setSelectedTargetFolder(folder);
  };

  const handleMoveToFolder = (targetFolder: WorkroomItemInfo | null, variationType?: GalleryCategory | null) => {
    // targetFolder가 null이면 최상위, 아닐 때는 folderLocation 계산
    const targetFolderId = targetFolder
      ? targetFolder?.folderLocation
        ? [...targetFolder.folderLocation, targetFolder.id]
        : [targetFolder.id]
      : [];

    setWorkroomData(prev =>
      prev.map(item => {
        if (selectedItem && !isSelecting && item.id === selectedItem.id) {
          return {
            ...item,
            folderLocation: targetFolderId,
            generatedInfo: item.generatedInfo
              ? undefined // 생성된 이미지가 폴더로 이동할때 생성정보제거 (기획)
              : variationType
              ? {
                  generatedType: variationType, // 폴더에서 갤러리로 이동할때 생성정보 변경 (기획)
                  generateModel: 'uploaded',
                  positivePrompt: '',
                  negativePrompt: '',
                  seed: -1,
                  imageSize: '',
                  isUploaded: true,
                }
              : item.generatedInfo, // 이동할때 생성정보 유지 (원래가 undefined)
            profileId: variationType ? targetFolder?.profileId : null,
          };
        }

        if (isSelecting && selectedItems.includes(item.id)) {
          return {
            ...item,
            folderLocation: targetFolderId,
            generatedInfo: item.generatedInfo
              ? undefined // 생성된 이미지가 폴더로 이동할때 생성정보제거 (기획)
              : variationType
              ? {
                  generatedType: variationType, // 폴더에서 갤러리로 이동할때 생성정보 변경 (기획)
                  generateModel: 'uploaded',
                  positivePrompt: '',
                  negativePrompt: '',
                  seed: -1,
                  imageSize: '',
                  isUploaded: true,
                }
              : item.generatedInfo, // 이동할때 생성정보 유지 (원래가 undefined)
            profileId: variationType ? targetFolder?.profileId : null,
          };
        }

        return item;
      }),
    );

    if (!isSelecting) {
      setSelectedItem(null);
    } else {
      setSelectedItems([]);
      setIsSelecting(false);
    }

    setIsFileMoveModalOpen(false);
    setIsFileEditDrawerOpen(false);

    dataToast.open(getLocalizedText('TODO : Folder moved successfully!'));
  };

  const handleGoBackFolder = () => {
    setFolderHistory(prev => {
      const history = [...prev];
      const last = history.pop();
      setSelectedCurrentFolder(last ?? null);
      return history;
    });
  };

  // 파일 업로드 처리
  const handleFileUpload = (files: FileList) => {
    const uploadedItems: WorkroomItemInfo[] = Array.from(files).map(file => ({
      id: getMinId(workroomData) - 1,
      name: file.name,
      detail: 'Uploaded file',
      mediaState: getMediaStateByExtension(file.name),
      imgUrl: URL.createObjectURL(file), // 임시 URL
      folderLocation: selectedCurrentFolder?.id ? [selectedCurrentFolder.id] : [],
      /* 캐릭터 갤러리에서 업로드 하는 경우 */
      generatedInfo: selectedItem?.profileId
        ? {
            generatedType:
              tagStates.variation == 'Portrait'
                ? GalleryCategory.Portrait
                : tagStates.variation == 'Pose'
                ? GalleryCategory.Pose
                : tagStates.variation == 'Expression'
                ? GalleryCategory.Expression
                : tagStates.variation == 'Video'
                ? GalleryCategory.Video
                : GalleryCategory.All,
            generateModel: 'Uploaded file',
            positivePrompt: '',
            negativePrompt: '',
            seed: -1,
            imageSize: '',
            isUploaded: true,
          }
        : undefined,
      profileId: selectedItem?.profileId || undefined,
    }));

    setWorkroomData(prev => [...prev, ...uploadedItems]);
    setIsSelectCreateOpen(false);
  };

  // 폴더 업로드 처리
  const handleFolderUpload = (files: FileList) => {
    const newItems: WorkroomItemInfo[] = [];
    const folderMap = new Map<string, number>();
    let idCounter = getMinId(workroomData) - 1;

    const forbiddenExtensions = ['exe', 'bat', 'sh', 'com', 'msi', 'apk'];

    Array.from(files).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension && forbiddenExtensions.includes(extension)) {
        console.warn(`Blocked file: ${file.name}`);
        return; // 이 파일은 건너뜀
      }

      const fullPath = file.webkitRelativePath;
      const parts = fullPath.split('/');
      let currentPath = '';
      let folderLocation: number[] = [selectedCurrentFolder?.id ?? 0];

      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (i > 0 ? '/' : '') + parts[i];

        if (!folderMap.has(currentPath)) {
          const folderId = idCounter--;
          folderMap.set(currentPath, folderId);
          newItems.push({
            id: folderId,
            name: parts[i],
            detail: 'Uploaded folder',
            mediaState: MediaState.None,
            imgUrl: '/images/folder-icon.png',
            folderLocation: [...folderLocation],
          });
        }

        folderLocation.push(folderMap.get(currentPath)!);
      }

      const fileId = idCounter--;
      newItems.push({
        id: fileId,
        name: file.name,
        detail: 'Uploaded file',
        mediaState: getMediaStateByExtension(file.name),
        imgUrl: URL.createObjectURL(file),
        folderLocation: [...folderLocation],
      });
    });

    setWorkroomData(prev => [...prev, ...newItems]);
    setIsSelectCreateOpen(false);
  };

  //#endregion

  //#region function

  // 현재 유저가 가진 캐릭터를 모두 가져옴
  // Id로 캐릭터 정보를 가져옴
  const getCharacterInfo = async (id: number) => {
    try {
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), profileId: id};
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

  const filterWorkroomData = (data: WorkroomItemInfo[], option: RenderDataItemsOptions): WorkroomItemInfo[] => {
    let result = data;

    // 1. Trash 필터
    result = option.trash ? result.filter(item => item.trash) : result.filter(item => !item.trash);

    // 2. Favorite 필터
    if (option.favorite) {
      result = result.filter(item => item.favorite);
    }

    // 3. Generated Type 필터
    if (option.generatedType && option.generatedType > 0) {
      result = result.filter(item => item.generatedInfo?.generatedType === option.generatedType);
    }

    // 4. Parent Folder ID 필터
    if (option.parentFolderId && typeof option.parentFolderId === 'number') {
      result = result.filter(item => item.folderLocation?.[item.folderLocation.length - 1] === option.parentFolderId);
    }

    // 5. Sort
    if (selectedSort === 0) {
      // 최신순 (내림차순)
      result = result.sort((a, b) => {
        const aTime = new Date(a.updateAt || '').getTime();
        const bTime = new Date(b.updateAt || '').getTime();
        return bTime - aTime;
      });
    } else if (selectedSort === 1) {
      // 이름순 (오름차순)
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 6. Limit 적용
    if (option.limit) {
      result = result.slice(0, option.limit);
    }

    return result;
  };

  const getMediaStateByExtension = (filename: string): MediaState => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return MediaState.None;

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return MediaState.Image;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return MediaState.Video;
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return MediaState.Audio;

    return MediaState.None;
  };

  const getMinId = (list: WorkroomItemInfo[]): number => {
    const listId = list.flatMap(item => item.id);
    if (listId.length === 0) return 0;
    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId - 1;
  };

  const getFilteredVariationItems = (mediaState: MediaState): WorkroomItemInfo[] => {
    return workroomData.filter(
      item =>
        item.mediaState === mediaState &&
        item.profileId &&
        ((tagStates.variation === 'Portrait' && item.generatedInfo?.generatedType === GalleryCategory.Portrait) ||
          (tagStates.variation === 'Pose' && item.generatedInfo?.generatedType === GalleryCategory.Pose) ||
          (tagStates.variation === 'Expressions' && item.generatedInfo?.generatedType === GalleryCategory.Expression) ||
          (tagStates.variation === 'Video' && item.generatedInfo?.generatedType === GalleryCategory.Video)),
    );
  };

  useEffect(() => {
    let enterTime = Date.now();
    let delayTimer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = Date.now() - enterTime;

          if (duration <= LOADING_THRESHOLD) {
            setIsLoading(false);
            setIsDelaying(true);
          } else {
            setIsLoading(false);
            setIsDelaying(false);
            delayTimer = setTimeout(() => {
              setIsDelaying(true);
            }, MIN_DISPLAY_TIME);
          }
        }
      },
      {threshold: 0.1},
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [tagStates]);

  useEffect(() => {
    const images = Array.from(document.querySelectorAll('img'));
    const videos = Array.from(document.querySelectorAll('video'));

    const loadPromises = [
      ...images.map(img => {
        return new Promise(resolve => {
          if (img.complete) resolve(true);
          else img.onload = () => resolve(true);
        });
      }),
      ...videos.map(video => {
        return new Promise(resolve => {
          if (video.readyState >= 3) resolve(true);
          else video.onloadeddata = () => resolve(true);
        });
      }),
    ];

    Promise.all(loadPromises).then(() => {
      setIsMediaLoaded(true);
    });
  }, [tagStates]);

  useEffect(() => {
    setSelectedItems([]);
  }, [isSelecting]);
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
                onClickItem={() => handleItemClick(item)}
                onClickDelete={handleDeletePopupOpen}
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
    const filteredData = filterWorkroomData(data, option);

    return (
      <WorkroomDataItems
        data={filteredData}
        detailView={detailView}
        option={option}
        detailViewButton={detailViewButton || false}
        isSelecting={isSelecting}
        selectedItems={selectedItems}
        renderFilter={renderFilter}
        toggleSelectItem={toggleSelectItem}
        toggleFavorite={toggleFavorite}
        handleMenuClick={handleMenuClick}
        handleItemImageClick={handleItemImageClick}
        handleItemClick={handleItemClick}
        filterWorkroomData={filterWorkroomData}
        handleDeleteItem={handleDeletePopupOpen}
      />
    );
  };

  const renderCategorySection = (
    titleKey: string,
    tagKey: keyof typeof tagStates,
    tagValue: string,
    data: WorkroomItemInfo[],
    detailView: boolean,
    options: RenderDataItemsOptions,
    hideEmpty?: boolean,
  ) => {
    return (
      <WorkroomCategorySection
        titleKey={titleKey}
        tagKey={tagKey}
        tagValue={tagValue}
        dataLength={data.length}
        renderDataItems={() => renderDataItems(data, detailView, options)}
        onClickTag={tag => handleTagClick(tagKey, tag)}
        hideEmpty={hideEmpty}
      />
    );
  };

  const renderFilter = (detailViewButton: boolean, detailView: boolean) => {
    return (
      <WorkroomFilter
        detailViewButton={detailViewButton}
        detailView={detailView}
        setDetailView={setDetailView}
        sortDropDownOpen={sortDropDownOpen}
        setSortDropDownOpen={setSortDropDownOpen}
        selectedSort={selectedSort}
        dropDownMenuItems={dropDownMenuItems}
      />
    );
  };

  const renderMyWork = () => {
    return (
      <WorkroomMyWork
        tagStates={tagStates.work}
        folderData={folderData}
        imageData={imageData}
        videoData={videoData}
        audioData={audioData}
        detailView={detailView}
        filterWorkroomData={filterWorkroomData}
        renderSwiper={renderSwiper}
        renderCategorySection={renderCategorySection}
        renderDataItems={renderDataItems}
        handleStart={handleStart}
        handleEnd={handleEnd}
        handleDeselectIfOutside={handleDeselectIfOutside}
      />
    );
  };

  const renderFavorite = () => {
    return (
      <WorkroomFavorite
        tagState={tagStates.favorite}
        folderData={folderData}
        imageData={imageData}
        videoData={videoData}
        audioData={audioData}
        detailView={detailView}
        renderCategorySection={renderCategorySection}
        renderDataItems={renderDataItems}
        filterWorkroomData={filterWorkroomData}
      />
    );
  };

  const renderAiHistory = () => {
    return (
      <WorkroomAiHistory
        tagState={tagStates.aiHistory}
        aiHistoryData={aiHistoryData}
        renderDataItems={renderDataItems}
        handleStart={handleStart}
        handleEnd={handleEnd}
        handleDeselectIfOutside={handleDeselectIfOutside}
      />
    );
  };

  const renderGallery = () => {
    return (
      <WorkroomGallery
        tagState={tagStates.gallery}
        galleryData={galleryData}
        detailView={detailView}
        renderCategorySection={renderCategorySection}
        renderDataItems={renderDataItems}
        filterWorkroomData={filterWorkroomData}
      />
    );
  };

  const renderTrash = () => {
    return (
      <WorkroomTrash
        tagState={tagStates.trash}
        folderData={folderData}
        imageData={imageData}
        videoData={videoData}
        audioData={audioData}
        detailView={detailView}
        renderCategorySection={renderCategorySection}
        renderDataItems={renderDataItems}
        filterWorkroomData={filterWorkroomData}
        handleStart={handleStart}
        handleEnd={handleEnd}
        handleDeselectIfOutside={handleDeselectIfOutside}
      />
    );
  };

  const renderFolderData = (folderId: number) => {
    return (
      <WorkroomFolderData
        tagState={tagStates.folder}
        folderId={folderId}
        folderTags={folderTags}
        allData={workroomData}
        folderData={folderData}
        imageData={imageData}
        videoData={videoData}
        audioData={audioData}
        detailView={detailView}
        handleTagClick={tag => handleTagClick('folder', tag)}
        renderCategorySection={renderCategorySection}
        renderDataItems={renderDataItems}
        filterWorkroomData={filterWorkroomData}
        handleStart={handleStart}
        handleEnd={handleEnd}
        handleDeselectIfOutside={handleDeselectIfOutside}
      />
    );
  };

  const renderSharePopup = () => {
    if (selectedItems.length > 0) {
      const imgUrls = workroomData
        .filter(item => selectedItems.includes(item.id) && item.imgUrl)
        .map(item => item.imgUrl!);

      const urlString = imgUrls.join(',');
      return (
        <SharePopup
          open={isShare}
          title={getLocalizedText('TODO : Share Items')}
          url={urlString || ''}
          onClose={() => setIsShare(false)}
        />
      );
    } else {
      return (
        <SharePopup
          open={isShare}
          title={selectedItem?.name || ''}
          url={selectedItem?.imgUrl || ''}
          onClose={() => setIsShare(false)}
        />
      );
    }
  };

  const renderSkeleton = () => {
    return (
      <ul className={`${styles.skeletonContainer} ${detailView ? styles.listArea : styles.gridArea}`}>
        {Array.from({length: 8}).map((_, index) => (
          <div className={styles.dataItem} key={index} data-item>
            <WorkroomItemSkeleton detailView={detailView} />
          </div>
        ))}
      </ul>
    );
  };

  //#endregion

  const splitData = [
    {
      label: getLocalizedText('TODO : Mywork'),
      preContent: (
        <SwipeTagList tags={workTags} currentTag={tagStates.work} onTagChange={tag => handleTagClick('work', tag)} />
      ),
      content: <div ref={ref}>{showContent ? renderSkeleton() : renderMyWork()}</div>,
    },
    {
      label: getLocalizedText('TODO : Favorite'),
      preContent: (
        <SwipeTagList
          tags={favoriteTags}
          currentTag={tagStates.favorite}
          onTagChange={tag => handleTagClick('favorite', tag)}
        />
      ),
      content: <div ref={ref}>{showContent ? renderSkeleton() : renderFavorite()}</div>,
    },
    {
      label: getLocalizedText('TODO : AI history'),
      preContent: (
        <SwipeTagList
          tags={aiHistoryTags}
          currentTag={tagStates.aiHistory}
          onTagChange={tag => handleTagClick('aiHistory', tag)}
        />
      ),
      content: <div ref={ref}>{showContent ? renderSkeleton() : renderAiHistory()}</div>,
    },
    {
      label: getLocalizedText('TODO : Gallery'),
      preContent: (
        <SwipeTagList
          tags={galleryTags}
          currentTag={tagStates.gallery}
          onTagChange={tag => handleTagClick('gallery', tag)}
        />
      ),
      content: <div ref={ref}>{showContent ? renderSkeleton() : renderGallery()}</div>,
    },
    {
      label: getLocalizedText('TODO : Trash'),
      preContent: (
        <SwipeTagList tags={trashTags} currentTag={tagStates.trash} onTagChange={tag => handleTagClick('trash', tag)} />
      ),
      content: <div ref={ref}>{showContent ? renderSkeleton() : renderTrash()}</div>,
    },
  ];

  return (
    <div className={styles.workroomContainer}>
      <CreateDrawerHeader
        title={
          selectedCurrentFolder &&
          (selectedCurrentFolder?.profileId === undefined || selectedCurrentFolder?.profileId === null)
            ? selectedCurrentFolder.name
            : getLocalizedText('TODO : Workroom')
        }
        onClose={() => {
          if (selectedCurrentFolder) {
            handleGoBackFolder();
          }
        }}
      >
        {
          <div className={styles.buttonArea}>
            <button className={styles.topButton}>
              <img className={styles.buttonIcon} src={LineSearch.src} onClick={() => setIsSearchModalOpen(true)} />
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

      {selectedCurrentFolder &&
      (selectedCurrentFolder?.profileId === undefined || selectedCurrentFolder?.profileId === null) ? (
        renderFolderData(selectedCurrentFolder.id)
      ) : (
        <Splitters
          splitters={splitData}
          headerStyle={{padding: '0 16px'}}
          onSelectSplitButton={(index: number) => {
            setIsSelecting(false);
            if (index === 4) {
              setIsTrash(true);
            } else {
              setIsTrash(false);
            }
          }}
        />
      )}

      {isSelecting && selectedItems.length > 0 && (
        <div className={styles.selectingMenuContainer}>
          <WorkroomSelectingMenu
            selectedCount={selectedItems.length}
            onExitSelecting={() => {
              setSelectedItems([]);
              setIsSelecting(false);
            }}
            onShare={handleShare}
            onDownload={handleDownloadSelectedItems}
            onMoveToFolder={handleMove}
            onMoveToTrash={handleDeletePopupOpen}
            onRestore={handleRestore}
            isTrash={isTrash}
          />
        </div>
      )}

      {ReactDOM.createPortal(
        <>
          {isSelectCreateOpen && (
            <SelectDrawer
              isOpen={isSelectCreateOpen}
              items={[
                {
                  name: getLocalizedText('TODO: Create folder'),
                  onClick: () => {
                    setIsFolderNamePopupOpen(true);
                    console.log('create folder');
                  },
                },
                {
                  name: getLocalizedText('TODO: Upload folder'),
                  onClick: () => {
                    folderInputRef.current?.click();
                  },
                },
                {
                  name: getLocalizedText('TODO: Upload files'),
                  onClick: () => {
                    fileInputRef.current?.click();
                  },
                },
              ]}
              onClose={() => {
                setIsSelectCreateOpen(false);
              }}
              selectedIndex={0}
            />
          )}
          {isFolderNamePopupOpen && (
            <CustomPopup
              title={getLocalizedText('TODO : Create a folder')}
              type="input"
              buttons={[
                {
                  label: getLocalizedText('TODO : Confirm'),
                  onClick: handleAddFolder,
                },
              ]}
              inputField={{
                value: newFolderName,
                onChange: e => setNewFolderName(e.target.value),
                placeholder: getLocalizedText('TODO : Please enter the folder name'),
                textType: 'Label',
                label: getLocalizedText('TODO : Folder name'),
              }}
              onClose={() => {
                setIsFolderNamePopupOpen(false);
              }}
            />
          )}
          {isFileEditDrawerOpen &&
            selectedItem !== null &&
            (selectedItem.trash ? (
              <WorkroomEditDrawer
                open={isFileEditDrawerOpen}
                onClose={() => setIsFileEditDrawerOpen(false)}
                selectedItem={selectedItem}
                onRestore={handleRestore}
                onDelete={handleDeletePopupOpen}
              />
            ) : (
              <WorkroomEditDrawer
                open={isFileEditDrawerOpen}
                onClose={() => setIsFileEditDrawerOpen(false)}
                selectedItem={selectedItem}
                onRename={handleRename}
                onCopy={handleCopy}
                onMove={handleMove}
                onShare={handleShare}
                onDownload={handleDownload}
                onDelete={handleDeletePopupOpen}
              />
            ))}
          {isFileMoveModalOpen && (selectedItem !== null || (isSelecting && selectedItems.length > 0)) && (
            <WorkroomFileMoveModal
              open={isFileMoveModalOpen}
              onClose={() => setIsFileMoveModalOpen(false)}
              folders={folderData.filter(
                item => !item.trash && item.mediaState === MediaState.None && item.id !== selectedItem?.id,
              )}
              addFolder={() => {
                setIsSelectCreateOpen(true);
              }}
              onSelectTargetFolder={handleSelectTargetFolder}
              selectedTargetFolder={selectedTargetFolder}
              onMoveToFolder={handleMoveToFolder}
              selectedItem={selectedItem}
              selectingItems={workroomData.filter(item => selectedItems.includes(item.id))}
            />
          )}
          {isDeletePopupOpen && (
            <CustomPopup
              title={getLocalizedText(selectedItem?.trash ? 'TODO : Delete from Trash?' : 'TODO : Are you sure?')}
              type="alert"
              description={getLocalizedText(
                selectedItem?.trash
                  ? `TODO : You're about to delete "{name}" from the your Trash?
This cannot be undone.
Deleted items cannot be recovered.`
                  : `2 folders will be deleted, containing a total of 2 items.  
They'll be moved to the trash and will be permanently deleted after 30days.`,
              )}
              buttons={[
                {
                  label: getLocalizedText('TODO : Cancel'),
                  onClick: handleDeletePopupCancel,
                },
                {
                  label: getLocalizedText('TODO : Delete'),
                  isPrimary: true,
                  onClick: handleDeleteConfirm,
                },
              ]}
              onClose={() => {
                setIsDeletePopupOpen(false);
              }}
            />
          )}
          {isGalleryModalOpen && selectedItem?.profileId && (
            <WorkroomGalleryModal
              open={isGalleryModalOpen}
              onClose={() => {
                setIsGalleryModalOpen(false);
                setCurrentSelectedCharacter(null);
                setSelectedItem(null);
              }}
              characterInfo={currentSelectedCharacter || null}
              onClickUpload={() => {
                setIsSelectCreateOpen(true);
              }}
            >
              <>
                <SwipeTagList
                  tags={variationTags}
                  currentTag={tagStates.variation}
                  onTagChange={tag => handleTagClick('variation', tag)}
                />

                {renderDataItems(
                  getFilteredVariationItems(MediaState.Image),
                  detailView,
                  {filterArea: false, renderEmpty: true},
                  true,
                )}
              </>
            </WorkroomGalleryModal>
          )}
          {isSearchModalOpen && (
            <WorkroomSearchModal
              open={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
              workroomData={workroomData}
              setSearchResultData={setSearchResultData}
            >
              <SwipeTagList
                tags={searchTags}
                currentTag={tagStates.search}
                onTagChange={tag => handleTagClick('search', tag)}
              />
              {tagStates.search === 'All' &&
                (filterWorkroomData(
                  searchResultData.filter(item => item.mediaState === MediaState.Image),
                  {trash: false},
                ).length > 0 ||
                filterWorkroomData(
                  searchResultData.filter(item => item.mediaState === MediaState.Video),
                  {trash: false},
                ).length > 0 ||
                filterWorkroomData(
                  searchResultData.filter(item => item.mediaState === MediaState.Audio),
                  {trash: false},
                ).length > 0 ||
                filterWorkroomData(
                  searchResultData.filter(item => item.mediaState === MediaState.None),
                  {trash: false},
                ).length > 0 ? (
                  <>
                    {renderCategorySection(
                      'TODO : Folder',
                      'search',
                      'Folders',
                      searchResultData.filter(item => item.mediaState === MediaState.None),
                      true,
                      {filterArea: false, limit: 4, trash: false},
                      true,
                    )}
                    {renderCategorySection(
                      'TODO : Image',
                      'search',
                      'Image',
                      searchResultData.filter(item => item.mediaState === MediaState.Image),
                      detailView,
                      {filterArea: false, limit: 4},
                      true,
                    )}
                    {renderCategorySection(
                      'TODO : Video',
                      'search',
                      'Video',
                      searchResultData.filter(item => item.mediaState === MediaState.Video),
                      detailView,
                      {filterArea: false, limit: 4},
                      true,
                    )}
                    {renderCategorySection(
                      'TODO : Audio',
                      'search',
                      'Audio',
                      searchResultData.filter(item => item.mediaState === MediaState.Audio),
                      true,
                      {filterArea: false, limit: 4},
                      true,
                    )}
                  </>
                ) : (
                  <div className={styles.emptyStateContainer}>
                    <EmptyState stateText={getLocalizedText('TODO : No results found')} />
                  </div>
                ))}

              {tagStates.search === 'Folders' &&
                renderDataItems(
                  searchResultData.filter(item => item.mediaState === MediaState.None),
                  true,
                  {filterArea: true, renderEmpty: true},
                )}

              {tagStates.search === 'Image' &&
                renderDataItems(
                  searchResultData.filter(item => item.mediaState === MediaState.Image),
                  detailView,
                  {filterArea: true, renderEmpty: true},
                  true,
                )}

              {tagStates.search === 'Video' &&
                renderDataItems(
                  searchResultData.filter(item => item.mediaState === MediaState.Video),
                  detailView,
                  {filterArea: true, renderEmpty: true},
                  true,
                )}

              {tagStates.search === 'Audio' &&
                renderDataItems(
                  searchResultData.filter(item => item.mediaState === MediaState.Audio),
                  true,
                  {filterArea: true, renderEmpty: true},
                )}
            </WorkroomSearchModal>
          )}
          {renderSharePopup()}
        </>,
        document.body,
      )}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{display: 'none'}}
        onChange={e => e.target.files && handleFileUpload(e.target.files)}
      />
      {React.createElement('input', {
        type: 'file',
        ref: folderInputRef,
        style: {display: 'none'},
        onChange: e => e.target.files && handleFolderUpload(e.target.files),
        webkitdirectory: '',
        directory: '',
      })}
      {/* <UploadFromWorkroom
        open={true}
        onClose={() => {}}
        onSelect={(urllink: string) => {
          console.log('upload from workroom', urllink);
        }}
      /> */}
    </div>
  );
};

export default Workroom;
