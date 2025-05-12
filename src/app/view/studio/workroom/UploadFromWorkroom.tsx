import React, {useState} from 'react';
import styles from './UploadFromWorkroom.module.css';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import {WorkroomItemInfo} from './WorkroomItem';
import WorkroomItem from './WorkroomItem';
import Dialog from '@mui/material/Dialog';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import getLocalizedText from '@/utils/getLocalizedText';
import {LineSearch} from '@ui/Icons';
interface UploadFromWorkroomProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  mediaStateFilter?: MediaState;
}

const UploadFromWorkroom: React.FC<UploadFromWorkroomProps> = ({open, onClose, onSelect, mediaStateFilter}) => {
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
    },
    {
      id: 3002,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video2',
      detail: 'detail2',
    },
    {
      id: 3003,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video3',
      detail: 'detail3',
    },
    {
      id: 3004,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video4',
      detail: 'detail4',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {
      id: 3005,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video5',
      detail: 'detail5',
      trash: true,
      trashedTime: '2025-04-18 09:44:53',
    },
    {
      id: 3006,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video6',
      detail: 'detail6',
    },
    {
      id: 3007,
      mediaState: MediaState.Video,
      imgUrl: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/video/943243a9-d787-4cae-a090-cf559a4c5339.mp4',
      name: 'video7',
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
        generatedType: 1,
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
        generatedType: 2,
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
        generatedType: 1,
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
        generatedType: 2,
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
        generatedType: 1,
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
        generatedType: 2,
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
  const [selectedFolder, setSelectedFolder] = useState<WorkroomItemInfo | null>(null);
  const [folderHistory, setFolderHistory] = useState<WorkroomItemInfo[]>([]);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const [curStep, setCurStep] = useState<number>(0);

  const tagStates: string[] = ['MyWork', 'Favorite', 'AIHistory', 'Gallery'];
  const [currentTag, setCurrentTag] = useState<string>('MyWork');

  //#region Handle
  const handleGoBackFolder = () => {
    setFolderHistory(prev => {
      const history = [...prev];
      const last = history.pop();
      setSelectedFolder(last ?? null);
      return history;
    });
  };

  const handleItemClick = (item: WorkroomItemInfo) => {
    if (item.mediaState === MediaState.None) {
      // 폴더라면 진입
      if (selectedFolder) {
        setFolderHistory([...folderHistory, selectedFolder]);
        setSelectedFolder(item);
      } else {
        setSelectedFolder(item);
      }
    } else if (item.imgUrl) {
      onSelect(item.imgUrl);
    }
  };
  //#endregion

  //#region Render
  const filteredItems = workroomData.filter(item => {
    if (item.trash) return false;

    const filteredMediaState = mediaStateFilter
      ? item.mediaState === mediaStateFilter || item.mediaState === MediaState.None
      : true;

    const inCurrentTag =
      currentTag === 'MyWork'
        ? true
        : currentTag === 'Favorite'
        ? item.favorite
        : currentTag === 'AIHistory'
        ? item.generatedInfo?.generatedType === 1
        : currentTag === 'Gallery'
        ? item.profileId
        : false;

    const inCurrentFolder =
      !selectedFolder && (!item.folderLocation || item.folderLocation.length === 0)
        ? true
        : item.folderLocation?.[item.folderLocation.length - 1] === selectedFolder?.id;

    const matchesKeyword =
      keyword.trim() === '' ||
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.detail.toLowerCase().includes(keyword.toLowerCase());

    return filteredMediaState && inCurrentFolder && matchesKeyword && inCurrentTag;
  });

  const currentPath =
    folderHistory.length > 0 || selectedFolder
      ? currentTag + ' > ' + [...folderHistory.map(f => f.name), selectedFolder?.name].filter(Boolean).join(' > ')
      : currentTag;
  //#endregion

  //#region Render
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
  //#endregion

  return (
    <Dialog
      open={open}
      onClose={onClose}
      style={{zIndex: '1500'}}
      PaperProps={{
        sx: {
          width: 'calc(100%)',
          maxWidth: '1300px',

          height: '100%',
          maxHeight: '100%',

          margin: '0 auto',
          borderRadius: '0px',

          zIndex: '1500',
        },
      }}
    >
      <CreateDrawerHeader
        title={searchOpen ? '' : getLocalizedText('TODO : Workroom')}
        onClose={() => {
          if (selectedFolder) {
            handleGoBackFolder();
          } else if (searchOpen) {
            setSearchOpen(false);
            setKeyword('');
          } else if (curStep === 1) {
            setCurStep(0);
          } else {
            onClose();
          }
        }}
        childrenAreaStyle={searchOpen ? {flex: 1, marginLeft: '10px'} : {}}
      >
        {
          <>
            {searchOpen && renderSearchBar()}

            <div className={styles.buttonArea}>
              {!searchOpen && (
                <button className={styles.topButton}>
                  <img
                    className={styles.buttonIcon}
                    src={LineSearch.src}
                    onClick={() => {
                      setSearchOpen(true);
                    }}
                  />
                </button>
              )}
            </div>
          </>
        }
      </CreateDrawerHeader>

      {!searchOpen && curStep === 0 ? (
        <div className={styles.categoryArea}>
          {tagStates.map(item => (
            <button
              className={styles.tagButton}
              onClick={() => {
                setCurrentTag(item);
                setCurStep(1);
              }}
            >
              <div className={styles.tagName}>{item}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.fileArea}>
          <div className={styles.rootArea}>{currentPath}</div>
          <div className={styles.gridArea}>
            {filteredItems
              .filter(item => item.mediaState === MediaState.None)
              .map(item => (
                <div className={styles.gridItem} key={item.id}>
                  <WorkroomItem
                    uploadItem={true}
                    item={item}
                    detailView={true}
                    isSelecting={false}
                    isSelected={false}
                    onClickItem={() => handleItemClick(item)}
                    onSelect={() => handleItemClick(item)}
                    onClickPreview={() => handleItemClick(item)}
                  />
                </div>
              ))}
          </div>
          <div className={`${styles.gridArea}`}>
            {filteredItems
              .filter(item => item.mediaState !== MediaState.None)
              .map(item => (
                <div className={styles.gridItem} key={item.id}>
                  <WorkroomItem
                    uploadItem={true}
                    item={item}
                    detailView={false}
                    isSelecting={false}
                    isSelected={false}
                    onClickItem={() => handleItemClick(item)}
                    onSelect={() => handleItemClick(item)}
                    onClickPreview={() => handleItemClick(item)}
                    blockDefaultPreview={true}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default UploadFromWorkroom;
