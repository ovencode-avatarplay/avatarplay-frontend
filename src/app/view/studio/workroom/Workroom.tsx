interface Props {}

import ReactDOM from 'react-dom';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './Workroom.module.css';
import Splitters from '@/components/layout/shared/CustomSplitter';
import getLocalizedText from '@/utils/getLocalizedText';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
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
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {GetCharacterInfoReq, sendGetCharacterProfileInfo} from '@/app/NetWork/CharacterNetwork';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {ToastMessageAtom} from '@/app/Root';
import {useAtom} from 'jotai';
import EmptyState from '@/components/search/EmptyState';
import WorkroomGalleryModal from './WorkroomGalleryModal';
import WorkroomSearchModal from './WorkroomSearchModal';

const Workroom: React.FC<Props> = ({}) => {
  //#region PreDefine
  const workTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const favoriteTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const aiHistoryTags = ['All', 'Custom', 'Variation'];
  const galleryTags = ['All', 'MyCharacter', 'SharedCharacter'];
  const trashTags = ['All', 'Folders', 'Image', 'Video', 'Audio'];
  const variationTags = ['Portrait', 'Pose', 'Expressions', 'Video'];

  type RenderDataItemsOptions = {
    filterArea?: boolean;
    limit?: number;
    favorite?: boolean;
    trash?: boolean;
    generatedType?: number;
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
      folderLocation: [1001],
    },
    {
      id: 1005,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder5',
      detail: 'detail5',
      folderLocation: [1001, 1004],
    },
    {
      id: 1006,
      mediaState: MediaState.None,
      imgUrl: '/images/001.png',
      name: 'folder6',
      detail: 'detail6',
      folderLocation: [1001, 1004],
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
    {
      id: 5000,
      mediaState: MediaState.Image,
      imgUrl: '/images/001.png',
      name: 'aiGen0',
      detail: 'detail0',
      generatedInfo: {
        generatedType: 1,
        generateModel: 'model',
        imageSize: '64x64',
        positivePrompt: 'positive',
        negativePrompt: 'negative',
        seed: 12345,
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
        generatedType: 2,
        generateModel: 'model1',
        imageSize: '128x128',
        positivePrompt: 'positive, 1',
        negativePrompt: 'negative, 1',
        seed: 11111,
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
  });

  const [isTrash, setIsTrash] = useState<boolean>(false);

  const folderData = workroomData.filter(item => item.mediaState === MediaState.None);
  const imageData = workroomData.filter(item => item.mediaState === MediaState.Image && !item.generatedInfo);
  const videoData = workroomData.filter(item => item.mediaState === MediaState.Video);
  const audioData = workroomData.filter(item => item.mediaState === MediaState.Audio);
  const aiHistoryData = workroomData.filter(item => !!item.generatedInfo);

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
  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);

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
    setWorkroomData(prev => updateDataFavorite(prev));
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

  const handleItemClick = async (item: WorkroomItemInfo) => {
    if (item.mediaState === MediaState.None) {
      if (item.profileId) {
        setSelectedItem(item);
        await getCharacterInfo(item.profileId);
        setIsGalleryModalOpen(true);
      } else {
        setSelectedItem(item);

        if (selectedCurrentFolder) {
          setFolderHistory(prev => [...prev, selectedCurrentFolder]); // 히스토리에 현재 폴더 저장
        }
        setSelectedCurrentFolder(item);
      }
    }
    if (item.mediaState === MediaState.Image) {
      handleItemImageClick(item);
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
    if (selectedItem) {
      setWorkroomData(prev => prev.map(item => (item.id === selectedItem.id ? {...item, trash: false} : item)));
      setSelectedItem(null);
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

  const handleMoveToFolder = (targetFolderId: number | null) => {
    setWorkroomData(prev =>
      prev.map(item => {
        if (selectedItem && !isSelecting && item.id === selectedItem.id) {
          return {
            ...item,
            folderLocation: targetFolderId ? [targetFolderId] : [],
          };
        }

        if (isSelecting && selectedItems.includes(item.id)) {
          return {
            ...item,
            folderLocation: targetFolderId ? [targetFolderId] : [],
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
      folderLocation: [],
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

    // 5. Limit 적용
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

  //#endregion

  const recentData = filterWorkroomData(workroomData, {limit: 20, renderEmpty: false, trash: false});

  const getMinId = (list: WorkroomItemInfo[]): number => {
    const listId = list.flatMap(item => item.id);
    if (listId.length === 0) return 0;
    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId - 1;
  };

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
      <div className={`${styles.itemContainer}`}>
        {option.filterArea && (
          <div className={styles.filterArea}>{renderFilter(detailViewButton || false, detailView)}</div>
        )}
        {filteredData.length > 0 ? (
          <ul className={`${detailView ? styles.listArea : styles.gridArea}`}>
            {filteredData.map((item, index) => (
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
                />
              </div>
            ))}
          </ul>
        ) : option.renderEmpty ? (
          <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
        ) : (
          <></>
        )}
      </div>
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
    return filterWorkroomData(data, options).length > 0 ? (
      <div className={styles.categoryArea}>
        <div className={styles.categoryTitleArea}>
          <div className={styles.categoryTitle}>{getLocalizedText(titleKey)}</div>
          <button
            className={styles.categoryShowMore}
            onClick={() => {
              handleTagClick(tagKey, tagValue);
            }}
          >
            {getLocalizedText('TODO : Show more')}
          </button>
        </div>
        {renderDataItems(data, detailView, options)}
      </div>
    ) : hideEmpty ? (
      <></>
    ) : (
      <>
        <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
      </>
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
            {filterWorkroomData(folderData, {trash: false}).length > 0 ||
            filterWorkroomData(imageData, {trash: false}).length > 0 ||
            filterWorkroomData(videoData, {trash: false}).length > 0 ||
            filterWorkroomData(audioData, {trash: false}).length > 0 ? (
              <>
                <div className={styles.categoryArea}>
                  <div className={styles.categoryTitleArea}>
                    <div className={styles.categoryTitle}>{getLocalizedText('TODO : Recent')}</div>
                  </div>
                  {/* All 에서 보여지는 Recent 리스트는 20개 까지입니다. (기획)  */}
                  {renderSwiper(recentData)}
                </div>

                {renderCategorySection(
                  'TODO : Folder',
                  'work',
                  'Folders',
                  folderData,
                  true,
                  {filterArea: false, limit: 4, trash: false},
                  true,
                )}

                {renderCategorySection(
                  'TODO : Image',
                  'work',
                  'Image',
                  imageData,
                  detailView,
                  {filterArea: false, limit: 4},
                  true,
                )}

                {renderCategorySection(
                  'TODO : Video',
                  'work',
                  'Video',
                  videoData,
                  detailView,
                  {filterArea: false, limit: 4},
                  true,
                )}

                {renderCategorySection(
                  'TODO : Audio',
                  'work',
                  'Audio',
                  audioData,
                  true,
                  {filterArea: false, limit: 4},
                  true,
                )}
              </>
            ) : (
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            )}
          </>
        )}

        {tagStates.work === 'Folders' &&
          renderDataItems(
            folderData.filter(
              item =>
                item.folderLocation === null || item.folderLocation === undefined || item.folderLocation.length === 0,
            ),
            true,
            {filterArea: true, renderEmpty: true},
          )}

        {tagStates.work === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, renderEmpty: true}, true)}

        {tagStates.work === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, renderEmpty: true}, true)}

        {tagStates.work === 'Audio' && renderDataItems(audioData, true, {filterArea: true, renderEmpty: true})}
      </div>
    );
  };

  const renderFavorite = () => {
    return (
      <div className={styles.favoriteContainer}>
        {tagStates.favorite === 'All' && (
          <>
            {filterWorkroomData(folderData, {trash: false, favorite: true}).length > 0 ||
            filterWorkroomData(imageData, {trash: false, favorite: true}).length > 0 ||
            filterWorkroomData(videoData, {trash: false, favorite: true}).length > 0 ||
            filterWorkroomData(audioData, {trash: false, favorite: true}).length > 0 ? (
              <>
                {renderCategorySection(
                  'TODO : Folder',
                  'favorite',
                  'Folders',
                  folderData,
                  true,
                  {
                    filterArea: false,
                    limit: 4,
                    favorite: true,
                    trash: false,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Image',
                  'favorite',
                  'Image',
                  imageData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                    favorite: true,
                    trash: false,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Video',
                  'favorite',
                  'Video',
                  videoData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                    favorite: true,
                    trash: false,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Audio',
                  'favorite',
                  'Audio',
                  audioData,
                  true,
                  {
                    filterArea: false,
                    limit: 4,
                    favorite: true,
                    trash: false,
                  },
                  true,
                )}
              </>
            ) : (
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            )}
          </>
        )}

        {tagStates.favorite === 'Folders' &&
          renderDataItems(folderData, true, {filterArea: true, limit: 4, favorite: true, renderEmpty: true})}
        {tagStates.favorite === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, favorite: true, renderEmpty: true}, true)}
        {tagStates.favorite === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, favorite: true, renderEmpty: true}, true)}
        {tagStates.favorite === 'Audio' &&
          renderDataItems(audioData, true, {filterArea: true, limit: 4, favorite: true, renderEmpty: true})}
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
            {renderDataItems(
              aiHistoryData,
              false,
              {
                filterArea: false,
                generatedType:
                  tagStates.aiHistory === 'All'
                    ? 0
                    : tagStates.aiHistory === 'Custom'
                    ? 1
                    : tagStates.aiHistory === 'Variation'
                    ? 2
                    : 0,
                renderEmpty: true,
              },
              true,
            )}
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
            {filterWorkroomData(galleryData, {trash: false}).length > 0 ||
            filterWorkroomData(galleryData, {trash: false}).length > 0 ? (
              <>
                {renderCategorySection(
                  'TODO : MyCharacter',
                  'gallery',
                  'MyCharacter',
                  galleryData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : SharedCharacter',
                  'gallery',
                  'SharedCharacter',
                  galleryData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                  },
                  true,
                )}
              </>
            ) : (
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            )}
          </>
        )}
        {tagStates.gallery === 'MyCharacter' && (
          <>{renderDataItems(galleryData, detailView, {filterArea: true, renderEmpty: true}, true)}</>
        )}

        {tagStates.gallery === 'SharedCharacter' && (
          <>{/* {renderDataItems(galleryData, true, {filterArea: true, renderEmpty: true}, true)} */}</>
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
            {filterWorkroomData(folderData, {trash: true}).length > 0 ||
            filterWorkroomData(imageData, {trash: true}).length > 0 ||
            filterWorkroomData(videoData, {trash: true}).length > 0 ||
            filterWorkroomData(audioData, {trash: true}).length > 0 ? (
              <>
                {renderCategorySection(
                  'TODO : Folder',
                  'trash',
                  'Folders',
                  folderData,
                  true,
                  {
                    filterArea: false,
                    limit: 4,
                    trash: true,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Image',
                  'trash',
                  'Image',
                  imageData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                    trash: true,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Video',
                  'trash',
                  'Video',
                  videoData,
                  detailView,
                  {
                    filterArea: false,
                    limit: 4,
                    trash: true,
                  },
                  true,
                )}

                {renderCategorySection(
                  'TODO : Audio',
                  'trash',
                  'Audio',
                  audioData,
                  true,
                  {
                    filterArea: false,
                    limit: 4,
                    trash: true,
                  },
                  true,
                )}
              </>
            ) : (
              <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
            )}
          </>
        )}

        {tagStates.trash === 'Folders' &&
          renderDataItems(folderData, true, {filterArea: true, limit: 4, trash: true, renderEmpty: true})}

        {tagStates.trash === 'Image' &&
          renderDataItems(imageData, detailView, {filterArea: true, limit: 4, trash: true, renderEmpty: true}, true)}

        {tagStates.trash === 'Video' &&
          renderDataItems(videoData, detailView, {filterArea: true, limit: 4, trash: true, renderEmpty: true}, true)}

        {tagStates.trash === 'Audio' &&
          renderDataItems(audioData, true, {filterArea: true, limit: 4, trash: true, renderEmpty: true})}
      </div>
    );
  };

  const renderFolderData = (folderId: number) => {
    return (
      <>
        <WorkroomTagList
          tags={workTags}
          currentTag={tagStates.folder}
          onTagChange={tag => handleTagClick('folder', tag)}
        />
        <div
          className={styles.folderContainer}
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
          {tagStates.folder === 'All' && (
            <>
              {filterWorkroomData(folderData, {trash: false, parentFolderId: folderId}).length > 0 ||
              filterWorkroomData(imageData, {trash: false, parentFolderId: folderId}).length > 0 ||
              filterWorkroomData(videoData, {trash: false, parentFolderId: folderId}).length > 0 ||
              filterWorkroomData(audioData, {trash: false, parentFolderId: folderId}).length > 0 ? (
                <>
                  {renderCategorySection(
                    'TODO : Folder',
                    'folder',
                    'Folders',
                    folderData,
                    true,
                    {filterArea: false, limit: 4, trash: false, parentFolderId: folderId},
                    true,
                  )}

                  {renderCategorySection(
                    'TODO : Image',
                    'folder',
                    'Image',
                    imageData,
                    detailView,
                    {filterArea: false, limit: 4, parentFolderId: folderId},
                    true,
                  )}

                  {renderCategorySection(
                    'TODO : Video',
                    'folder',
                    'Video',
                    videoData,
                    detailView,
                    {filterArea: false, limit: 4, parentFolderId: folderId},
                    true,
                  )}

                  {renderCategorySection(
                    'TODO : Audio',
                    'folder',
                    'Audio',
                    audioData,
                    true,
                    {filterArea: false, limit: 4, parentFolderId: folderId},
                    true,
                  )}
                </>
              ) : (
                <EmptyState stateText={getLocalizedText('TODO : EMPTY')} />
              )}
            </>
          )}

          {tagStates.folder === 'Folders' &&
            renderDataItems(folderData, true, {filterArea: true, parentFolderId: folderId, renderEmpty: true})}

          {tagStates.folder === 'Image' &&
            renderDataItems(
              imageData,
              detailView,
              {filterArea: true, parentFolderId: folderId, renderEmpty: true},
              true,
            )}

          {tagStates.folder === 'Video' &&
            renderDataItems(
              videoData,
              detailView,
              {filterArea: true, parentFolderId: folderId, renderEmpty: true},
              true,
            )}

          {tagStates.folder === 'Audio' &&
            renderDataItems(audioData, true, {filterArea: true, parentFolderId: folderId, renderEmpty: true})}
        </div>
      </>
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
      <CreateDrawerHeader
        title={selectedCurrentFolder ? selectedCurrentFolder.name : getLocalizedText('TODO : Workroom')}
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

      {selectedCurrentFolder ? (
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
              setIsSelecting(false);
            }}
            onShare={() => {}}
            onDownload={handleDownloadSelectedItems}
            onMoveToFolder={handleMove}
            onMoveToTrash={handleDeletePopupOpen}
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
            />
          )}
          {isFileEditDrawerOpen &&
            selectedItem !== null &&
            (selectedItem.trash ? (
              <WorkroomEditDrawer
                open={isFileEditDrawerOpen}
                onClose={() => setIsFileEditDrawerOpen(false)}
                name={selectedItem.name}
                info={selectedItem.detail}
                onRestore={handleRestore}
                onDelete={handleDeletePopupOpen}
              />
            ) : (
              <WorkroomEditDrawer
                open={isFileEditDrawerOpen}
                onClose={() => setIsFileEditDrawerOpen(false)}
                name={selectedItem.name}
                info={selectedItem.detail}
                onRename={handleRename}
                onCopy={handleCopy}
                onMove={handleMove}
                onShare={() => console.log('Share')}
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
            />
          )}
          {imageViewOpen &&
            selectedItem &&
            (selectedItem.generatedInfo ? (
              <GeneratedImagePreViewer
                workroomItemInfo={selectedItem}
                onClose={() => setImageViewOpen(false)}
                onToggleFavorite={() => toggleFavorite(selectedItem.id)}
                onDelete={handleDeletePopupOpen}
                onDownload={handleDownload}
              />
            ) : (
              <ImagePreViewer imageUrl={selectedItem?.imgUrl || ''} onClose={() => setImageViewOpen(false)} />
            ))}
          {isDeletePopupOpen && (
            <CustomPopup
              title={getLocalizedText(selectedItem?.trash ? 'TODO : Delete from Trash?' : 'TODO : Are you sure?')}
              type="alert"
              description={getLocalizedText(
                selectedItem?.trash
                  ? `TODO : You’re about to delete "{name}" from the your Trash?
This cannot be undone.
Deleted items cannot be recovered.`
                  : `2 folders will be deleted, containing a total of 2 items.  
They’ll be moved to the trash and will be permanently deleted after 30days.`,
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
            />
          )}
          {isGalleryModalOpen && selectedItem?.profileId && (
            <WorkroomGalleryModal
              open={isGalleryModalOpen}
              onClose={() => setIsGalleryModalOpen(false)}
              characterInfo={currentSelectedCharacter || null}
            >
              <>
                <WorkroomTagList
                  tags={variationTags}
                  currentTag={tagStates.variation}
                  onTagChange={tag => handleTagClick('variation', tag)}
                />
                {renderDataItems(
                  workroomData.filter(
                    item =>
                      item.mediaState === MediaState.Image &&
                      item.profileId &&
                      (tagStates.variation === 'Portrait'
                        ? item.generatedInfo?.generatedType === 0
                        : tagStates.variation === 'Pose'
                        ? item.generatedInfo?.generatedType === 1
                        : tagStates.variation === 'Expressions'
                        ? item.generatedInfo?.generatedType === 2
                        : tagStates.variation === 'Video'
                        ? item.generatedInfo?.generatedType === 3
                        : false),
                  ),
                  detailView,
                  {filterArea: true, renderEmpty: true},
                  true,
                )}
              </>
            </WorkroomGalleryModal>
          )}
          {isSearchModalOpen && (
            <WorkroomSearchModal open={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
          )}
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
      {/* <input
        type="file"
  webkitdirectory=""
  directory=""
        ref={folderInputRef}
        style={{display: 'none'}}
        onChange={e => e.target.files && handleFolderUpload(e.target.files)}
      /> */}
      {React.createElement('input', {
        type: 'file',
        ref: folderInputRef,
        style: {display: 'none'},
        onChange: e => e.target.files && handleFolderUpload(e.target.files),
        webkitdirectory: '',
        directory: '',
      })}
    </div>
  );
};

export default Workroom;
