import React, {useEffect, useState} from 'react';
import styles from './WebtoonContentUpload.module.css';
import {
  BoldAltArrowDown,
  BoldAltArrowDownTwo,
  BoldAltArrowUp as BoldAltArrowUpTwo,
  BoldAltArrowUpTwo as BoldAltArrowUp,
  LineArrowDown,
  BoldCirclePlus,
  BoldFolderPlus,
  BoldQuestion,
  CircleClose,
  LineClose,
  LineDashboard,
  LineDelete,
  LineUpload,
} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {
  ContentCategoryType,
  ContentEpisodeWebtoonInfo,
  ContentLanguageType,
  WebtoonSourceUrl,
} from '@/app/NetWork/ContentNetwork';
import PreviewViewer from './PreviewViewer';
import getLocalizedText from '@/utils/getLocalizedText';

export interface WebtoonUploadField {
  id: number;
  selectedCountry: ContentLanguageType;
  fileUrl: string[]; // 업로드된 파일의 URL 저장
  fileName: string[];
}

interface WebtoonContentUploadProps {
  setEpisodeWebtoonInfo: (value: ContentEpisodeWebtoonInfo) => void;
  defaultEpisodeWebtoonInfo?: ContentEpisodeWebtoonInfo; // 기존 데이터가 있으면 전달받음
  hasError?: boolean;
}

const WebtoonContentUpload: React.FC<WebtoonContentUploadProps> = ({
  setEpisodeWebtoonInfo,
  defaultEpisodeWebtoonInfo,
  hasError,
}) => {
  const [CountryDrawerOpen, setCountryDrawerOpen] = useState<{type: 'subtitle'; index: number} | null>(null);
  const [onPreview, setOnPreview] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 선택된 파일의 인덱스
  console.log(defaultEpisodeWebtoonInfo);
  const [subtitleFields, setSubtitleFields] = useState<WebtoonUploadField[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  // ✅ 기존 데이터가 있으면 초기값 설정
  useEffect(() => {
    console.log('asdasd');
    if (defaultEpisodeWebtoonInfo) {
      const webtoonSource = defaultEpisodeWebtoonInfo.webtoonSourceUrlList.find(
        info => info.webtoonLanguageType === ContentLanguageType.Source,
      );

      if (webtoonSource) {
        setImageFiles(webtoonSource.webtoonSourceUrls);
        setImageNames(webtoonSource.webtoonSourceNames);
      }

      setSubtitleFields(
        defaultEpisodeWebtoonInfo.webtoonSourceUrlList
          .filter(info => info.webtoonLanguageType !== ContentLanguageType.Source)
          .map((info, index) => ({
            id: index,
            selectedCountry: info.webtoonLanguageType,
            fileUrl: info.webtoonSourceUrls,
            fileName: info.webtoonSourceNames,
          })),
      );
    }
  }, [defaultEpisodeWebtoonInfo]);
  useEffect(() => {
    // 📌 웹툰 원본 이미지 리스트 업데이트
    const webtoonSourceUrls: WebtoonSourceUrl[] = [];

    // ✅ 웹툰 원본 이미지 추가 (webtoonLanguageType = WebtoonSource)
    if (imageFiles.length > 0) {
      webtoonSourceUrls.push({
        webtoonLanguageType: ContentLanguageType.Source,
        webtoonSourceUrls: imageFiles,
        webtoonSourceNames: imageNames,
      });
    }

    // ✅ 자막 파일 추가 (Korean, Japanese 등)
    subtitleFields.forEach(field => {
      if (field.fileUrl.length > 0) {
        webtoonSourceUrls.push({
          webtoonLanguageType: Number(field.selectedCountry) as ContentLanguageType, // ✅ number로 변환하여 할당
          webtoonSourceUrls: field.fileUrl,
          webtoonSourceNames: field.fileName,
        });
      }
    });

    // 📌 최종 업데이트 적용
    setEpisodeWebtoonInfo({
      likeCount: 0, // 기본값 (필요하면 수정)
      webtoonSourceUrlList: webtoonSourceUrls,
    });
  }, [imageFiles, imageNames, subtitleFields, setEpisodeWebtoonInfo]);
  // ✅ `setEpisodeWebtoonInfo`도 의존성 배열에 포함 (최신 상태 유지)

  const CountryItems = (type: 'subtitle', index: number): SelectDrawerItem[] => [
    {name: 'Korean', onClick: () => handleCountryChange(type, index, ContentLanguageType.Korean)},
    {name: 'English', onClick: () => handleCountryChange(type, index, ContentLanguageType.English)},
    {name: 'Japanese', onClick: () => handleCountryChange(type, index, ContentLanguageType.Japanese)},
    {name: 'French', onClick: () => handleCountryChange(type, index, ContentLanguageType.French)},
    {name: 'Spanish', onClick: () => handleCountryChange(type, index, ContentLanguageType.Spanish)},
    {
      name: 'Chinese (Simplified)',
      onClick: () => handleCountryChange(type, index, ContentLanguageType.ChineseSimplified),
    },
    {
      name: 'Chinese (Traditional)',
      onClick: () => handleCountryChange(type, index, ContentLanguageType.ChineseTraditional),
    },
    {name: 'Portuguese', onClick: () => handleCountryChange(type, index, ContentLanguageType.Portuguese)},
    {name: 'German', onClick: () => handleCountryChange(type, index, ContentLanguageType.German)},
  ];

  const handleCountryChange = (type: 'subtitle', index: number, country: ContentLanguageType) => {
    if (type === 'subtitle') {
      setSubtitleFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)),
      );
    } else setCountryDrawerOpen(null);
  };

  const handleFileUpload = async (files: FileList) => {
    try {
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.ContentEpisodeWebtoonImage,
        imageList: Array.from(files), // ✅ 여러 개의 파일을 imageList로 보냄
      };

      const response = await sendUpload(req);
      if (!response.data) return;

      const validImages = response.data.imageUrlList.filter((url): url is string => !!url);
      const validImageNames = response.data.imageNameList.filter((name): name is string => !!name);

      setImageFiles(prev => [...prev, ...validImages]);
      setImageNames(prev => [...prev, ...validImageNames]);
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  // 파일 삭제 처리 (개별 삭제)
  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageNames(prev => prev.filter((_, i) => i !== index)); // 이 줄 추가
    setSelectedIndex(null);
  };

  const handleClearAllImages = () => {
    setImageFiles([]);
    setImageNames([]);
    setSelectedIndex(null);
  };

  useEffect(() => {
    console.log('imageFiles', imageFiles);
  }, [imageFiles]);
  const handleMoveImage = (direction: 'top' | 'up' | 'down' | 'bottom') => {
    if (selectedIndex === null) return;

    setImageFiles(prev => {
      const newImages = [...prev];
      const newNames = [...imageNames]; // ✅ imageNames도 복사해서 조작
      const targetImage = newImages[selectedIndex];
      const targetName = newNames[selectedIndex]; // ✅ 선택된 파일 이름도 가져오기

      newImages.splice(selectedIndex, 1);
      newNames.splice(selectedIndex, 1); // ✅ 이름도 같이 삭제

      let newIndex = selectedIndex;
      if (direction === 'top') newIndex = 0;
      else if (direction === 'bottom') newIndex = newImages.length;
      else if (direction === 'up' && selectedIndex > 0) newIndex = selectedIndex - 1;
      else if (direction === 'down' && selectedIndex < newImages.length) newIndex = selectedIndex + 1;

      newImages.splice(newIndex, 0, targetImage);
      newNames.splice(newIndex, 0, targetName); // ✅ 새로운 위치에 파일 이름도 같이 추가

      setImageNames(newNames); // ✅ imageNames도 상태 업데이트
      return newImages;
    });

    setSelectedIndex(prevIndex => {
      if (prevIndex === null) return null;
      if (direction === 'top') return 0;
      if (direction === 'bottom') return imageFiles.length - 1;
      if (direction === 'up') return Math.max(0, prevIndex - 1);
      if (direction === 'down') return Math.min(imageFiles.length - 1, prevIndex + 1);
      return prevIndex;
    });
  };

  // 새 필드 추가
  const handleAddField = () => {
    setSubtitleFields(prevFields => [
      ...prevFields,
      {id: Date.now(), selectedCountry: ContentLanguageType.Korean, fileUrl: [], fileName: []}, // 새 필드 추가
    ]);
  };

  // 필드 삭제
  const handleRemoveField = (index: number) => {
    setSubtitleFields(prevFields => prevFields.filter((_, i) => i !== index));
  };
  // 필드별 파일 업로드 처리
  const handleFileUploadForField = async (files: FileList, fieldIndex: number) => {
    try {
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.ContentEpisodeWebtoonSubtitle,
        imageList: Array.from(files), // ✅ 여러 개의 파일을 imageList로 보냄
      };

      const response = await sendUpload(req);
      if (!response.data) return;

      const validUrls = response.data.imageUrlList.filter((url): url is string => !!url);
      const validFileNames = response.data.imageNameList.filter((name): name is string => !!name);

      setSubtitleFields(prevFields =>
        prevFields.map((field, i) =>
          i === fieldIndex
            ? {
                ...field,
                fileUrl: [...field.fileUrl, ...validUrls],
                fileName: [...field.fileName, ...validFileNames],
              }
            : field,
        ),
      );
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  // 필드 내 이미지 삭제
  const handleRemoveImageFromField = (fieldIndex: number, imageIndex: number) => {
    setSubtitleFields(prevFields =>
      prevFields.map((field, i) =>
        i === fieldIndex ? {...field, fileUrl: field.fileUrl.filter((_, j) => j !== imageIndex)} : field,
      ),
    );
  };

  const [selectedIndexes, setSelectedIndexes] = useState<{[key: number]: number | null}>({});

  const handleSelectImage = (fieldIndex: number, imageIndex: number) => {
    setSelectedIndexes(prev => ({...prev, [fieldIndex]: imageIndex}));
  };

  const handleMoveImageInField = (fieldIndex: number, direction: 'top' | 'up' | 'down' | 'bottom') => {
    setSubtitleFields(prevFields =>
      prevFields.map((field, i) => {
        if (i !== fieldIndex) return field;

        const selectedIndex = selectedIndexes[fieldIndex];
        if (selectedIndex === undefined || selectedIndex === null) return field;

        const newArr = [...field.fileUrl];
        const newNames = [...field.fileName]; // ✅ fileName도 복사해서 조작

        const targetUrl = newArr[selectedIndex];
        const targetName = newNames[selectedIndex]; // ✅ 선택된 파일 이름도 가져오기

        // 기존 위치에서 제거
        newArr.splice(selectedIndex, 1);
        newNames.splice(selectedIndex, 1); // ✅ fileName도 함께 제거

        // 이동할 위치 계산
        let newIndex = selectedIndex;
        if (direction === 'top') newIndex = 0;
        else if (direction === 'bottom') newIndex = newArr.length;
        else if (direction === 'up' && selectedIndex > 0) newIndex = selectedIndex - 1;
        else if (direction === 'down' && selectedIndex < newArr.length) newIndex = selectedIndex + 1;

        // 새로운 위치에 삽입
        newArr.splice(newIndex, 0, targetUrl);
        newNames.splice(newIndex, 0, targetName); // ✅ 새로운 위치에 fileName도 추가

        // 선택한 이미지 인덱스 업데이트
        setSelectedIndexes(prev => ({...prev, [fieldIndex]: newIndex}));

        return {...field, fileUrl: newArr, fileName: newNames}; // ✅ fileName까지 반영
      }),
    );
  };

  const renderUploader = (type: 'subtitle', field: WebtoonUploadField, fieldIndex: number) => {
    return (
      <div className={styles.uploadGroup}>
        {/* 국가 선택 드롭다운 버튼 */}
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index: fieldIndex})}>
          {ContentLanguageType[field.selectedCountry]}
          <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>

        {/* 이미지 업로드 리스트 */}
        <div className={styles.videoUploadBox}>
          {field.fileUrl.length > 0 ? (
            <ul className={styles.fileList}>
              {field.fileUrl.map((image, imageIndex) => (
                <li
                  key={imageIndex}
                  className={`${styles.fileItem} ${selectedIndexes[fieldIndex] === imageIndex ? styles.selected : ''}`}
                  onClick={() => handleSelectImage(fieldIndex, imageIndex)}
                >
                  <span className={styles.fileName}>{field.fileName[imageIndex]}</span>
                  <img
                    src={CircleClose.src}
                    className={styles.circleClose}
                    onClick={() => handleRemoveImageFromField(fieldIndex, imageIndex)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <span>No Images uploaded</span>
          )}
        </div>

        {/* 공통 이동 버튼 */}
        <div className={styles.videoButtonContainer}>
          <img
            src={BoldAltArrowUpTwo.src}
            className={styles.arrowButton}
            onClick={() => selectedIndexes[fieldIndex] !== null && handleMoveImageInField(fieldIndex, 'top')}
          />
          <img
            src={BoldAltArrowUp.src}
            className={styles.arrowButton}
            onClick={() => selectedIndexes[fieldIndex] !== null && handleMoveImageInField(fieldIndex, 'up')}
          />
          <img
            src={BoldAltArrowDown.src}
            className={styles.arrowButton}
            onClick={() => selectedIndexes[fieldIndex] !== null && handleMoveImageInField(fieldIndex, 'down')}
          />
          <img
            src={BoldAltArrowDownTwo.src}
            className={styles.arrowButton}
            onClick={() => selectedIndexes[fieldIndex] !== null && handleMoveImageInField(fieldIndex, 'bottom')}
          />

          <button
            className={styles.uploadButton}
            style={{width: '100%'}}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = e => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  handleFileUploadForField(files, fieldIndex);
                }
              };
              input.click();
            }}
          >
            <img src={LineUpload.src} alt="Upload" className={styles.icon} />
            {getLocalizedText('common_button_upload')}
          </button>

          <button className={styles.uploadButton} style={{width: '100%'}} onClick={() => handleRemoveField(fieldIndex)}>
            <img src={LineDelete.src} alt="Delete" className={styles.icon} />
            {getLocalizedText('common_button_delete')}
          </button>
        </div>

        {/* 국가 선택 드롭다운 */}
        {CountryDrawerOpen?.type === type && CountryDrawerOpen.index === fieldIndex && (
          <SelectDrawer
            name="Filter"
            items={CountryItems(type, fieldIndex)}
            isOpen={true}
            onClose={() => setCountryDrawerOpen(null)}
            selectedIndex={field.selectedCountry}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={styles.previewLabel}
        onClick={() => {
          if (imageFiles.length > 0) setOnPreview(true);
        }}
      >
        {getLocalizedText('common_button_preview')}
      </div>
      <div className={styles.videoUploadContainer}>
        <span className={styles.label}>{getLocalizedText('common_filter_webtoon')}</span>
        <div className={styles.uploadGroup}>
          <div
            className={`${styles.videoUploadBox} ${
              hasError && imageFiles.length == 0 ? styles.videoUploadBoxError : ''
            }`}
          >
            {imageFiles.length > 0 ? (
              <ul className={styles.fileList}>
                {imageNames.map((name, index) => (
                  <li
                    key={index}
                    className={`${styles.fileItem} ${selectedIndex === index ? styles.selected : ''}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className={styles.fileName}>{name}</span> {/* 파일명 */}
                    <img
                      src={CircleClose.src}
                      className={styles.circleClose}
                      onClick={e => {
                        e.stopPropagation(); // 부모 클릭 방지
                        handleRemoveImage(index);
                      }}
                    ></img>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No Images uploaded</span>
            )}
          </div>

          <div className={styles.videoButtonContainer}>
            <img src={BoldAltArrowUpTwo.src} className={styles.arrowButton} onClick={() => handleMoveImage('top')} />
            <img src={BoldAltArrowUp.src} className={styles.arrowButton} onClick={() => handleMoveImage('up')} />
            <img src={BoldAltArrowDown.src} className={styles.arrowButton} onClick={() => handleMoveImage('down')} />
            <img
              src={BoldAltArrowDownTwo.src}
              className={styles.arrowButton}
              onClick={() => handleMoveImage('bottom')}
            />
            <button
              className={styles.uploadButton}
              style={{width: '100%'}}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = e => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    handleFileUpload(files);
                  }
                };
                input.click();
              }}
            >
              <img src={LineUpload.src} alt="Upload" className={styles.icon} />
              {getLocalizedText('common_button_upload')}
            </button>
            <button className={styles.uploadButton} style={{width: '100%'}} onClick={() => handleClearAllImages()}>
              <img src={LineDelete.src} alt="Clear" className={styles.icon} />
              {getLocalizedText('createcontent008_button_002')}
            </button>
          </div>
        </div>
        <div className={styles.subtitleContainer}>
          <span className={styles.label}>{getLocalizedText('createcontent008_label_001')}</span>
          <button className={styles.addButton} onClick={() => handleAddField()}>
            + {getLocalizedText('common_button_add')}
          </button>
        </div>{' '}
        {subtitleFields.map((field, index) => renderUploader('subtitle', field, index))}
      </div>
      <span className={styles.grayLabel}>{getLocalizedText('createcontent007_desc_007')}</span>
      <PreviewViewer
        open={onPreview}
        onClose={() => {
          setOnPreview(false);
        }}
        mediaUrls={imageFiles ? imageFiles : []}
        type={ContentCategoryType.Webtoon}
      ></PreviewViewer>
    </>
  );
};

export default WebtoonContentUpload;
