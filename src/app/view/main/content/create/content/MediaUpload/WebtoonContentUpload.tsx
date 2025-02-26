import React, {useEffect, useState} from 'react';
import styles from './WebtoonContentUpload.module.css';
import {
  BoldAltArrowDown,
  BoldAltArrowDownTwo,
  BoldAltArrowUp as BoldAltArrowUpTwo,
  BoldAltArrowUpTwo as BoldAltArrowUp,
  BoldArrowDown,
  BoldCirclePlus,
  BoldFolderPlus,
  BoldQuestion,
  CircleClose,
  LineArrowDown,
  LineClose,
  LineDashboard,
  LineDelete,
  LineUpload,
} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
enum CountryTypes {
  Korea = 0,
  Japan = 1,
}
interface UploadField {
  id: number;
  selectedCountry: CountryTypes;
  fileUrl: string[]; // 업로드된 파일의 URL 저장
}
interface WebtoonContentUploadProps {}

const WebtoonContentUpload: React.FC<WebtoonContentUploadProps> = ({}) => {
  const [subtitleFields, setSubtitleFields] = useState<UploadField[]>([]);
  const [CountryDrawerOpen, setCountryDrawerOpen] = useState<{type: 'subtitle'; index: number} | null>(null);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 선택된 파일의 인덱스

  const CountryItems = (type: 'subtitle', index: number): SelectDrawerItem[] => [
    {name: 'Korea', onClick: () => handleCountryChange(type, index, CountryTypes.Korea)},
    {name: 'Japan', onClick: () => handleCountryChange(type, index, CountryTypes.Japan)},
  ];

  const handleCountryChange = (type: 'subtitle', index: number, country: CountryTypes) => {
    if (type === 'subtitle') {
      setSubtitleFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)),
      );
    } else setCountryDrawerOpen(null);
  };

  const handleFileUpload = async (files: FileList) => {
    try {
      const newImages = await Promise.all(
        Array.from(files).map(async file => {
          const req: MediaUploadReq = {
            mediaState: UploadMediaState.BackgroundImage,
            file,
          };
          const response = await sendUpload(req);
          return response?.data?.url; // 업로드된 URL 반환 (undefined 가능성 있음)
        }),
      );

      // undefined 제거 후 string[] 타입으로 변환
      const validImages: string[] = newImages.filter((url): url is string => typeof url === 'string');

      setImageFiles(prev => [...prev, ...validImages]);
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  // 파일 삭제 처리 (개별 삭제)
  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setSelectedIndex(null);
  };

  // 파일 순서 변경
  const handleMoveImage = (direction: 'top' | 'up' | 'down' | 'bottom') => {
    if (selectedIndex === null) return;
    setImageFiles(prev => {
      const newArr = [...prev];
      const target = newArr[selectedIndex];

      newArr.splice(selectedIndex, 1); // 현재 위치에서 삭제

      let newIndex = selectedIndex;
      if (direction === 'top') newIndex = 0; // 최상단으로 이동
      else if (direction === 'bottom') newIndex = newArr.length; // 최하단으로 이동
      else if (direction === 'up' && selectedIndex > 0) newIndex = selectedIndex - 1; // 한 칸 위로
      else if (direction === 'down' && selectedIndex < newArr.length) newIndex = selectedIndex + 1; // 한 칸 아래로

      newArr.splice(newIndex, 0, target); // 새로운 위치에 삽입
      setSelectedIndex(newIndex); // 새로운 위치로 선택 업데이트
      return newArr;
    });
  };

  // 새 필드 추가
  const handleAddField = () => {
    setSubtitleFields(prevFields => [
      ...prevFields,
      {id: Date.now(), selectedCountry: CountryTypes.Korea, fileUrl: []}, // 새 필드 추가
    ]);
  };

  // 필드 삭제
  const handleRemoveField = (index: number) => {
    setSubtitleFields(prevFields => prevFields.filter((_, i) => i !== index));
  };

  // 필드별 파일 업로드 처리
  const handleFileUploadForField = async (files: FileList, fieldIndex: number) => {
    try {
      const newImages = await Promise.all(
        Array.from(files).map(async file => {
          const req: MediaUploadReq = {
            mediaState: UploadMediaState.BackgroundImage,
            file,
          };
          const response = await sendUpload(req);
          return response?.data?.url; // 업로드된 URL 반환
        }),
      );

      setSubtitleFields(prevFields =>
        prevFields.map((field, i) =>
          i === fieldIndex
            ? {...field, fileUrl: [...field.fileUrl, ...newImages.filter((url): url is string => !!url)]}
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
        const target = newArr[selectedIndex];

        // 기존 위치에서 제거
        newArr.splice(selectedIndex, 1);

        // 이동할 위치 계산
        let newIndex = selectedIndex;
        if (direction === 'top') newIndex = 0;
        else if (direction === 'bottom') newIndex = newArr.length;
        else if (direction === 'up' && selectedIndex > 0) newIndex = selectedIndex - 1;
        else if (direction === 'down' && selectedIndex < newArr.length) newIndex = selectedIndex + 1;

        // 새로운 위치에 삽입
        newArr.splice(newIndex, 0, target);

        // 선택한 이미지 인덱스 업데이트
        setSelectedIndexes(prev => ({...prev, [fieldIndex]: newIndex}));

        return {...field, fileUrl: newArr};
      }),
    );
  };
  console.log(selectedIndexes);
  const renderUploader = (type: 'subtitle', field: UploadField, fieldIndex: number) => {
    return (
      <div className={styles.uploadGroup}>
        {/* 국가 선택 드롭다운 버튼 */}
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index: fieldIndex})}>
          {field.selectedCountry === CountryTypes.Korea ? 'Korea' : 'Japan'}
          <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>

        {/* 이미지 업로드 리스트 */}
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
                  <span className={styles.fileName}>{image.split('/').pop()}</span>
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
            Upload
          </button>

          <button className={styles.uploadButton} style={{width: '100%'}} onClick={() => handleRemoveField(fieldIndex)}>
            <img src={LineDelete.src} alt="Delete" className={styles.icon} />
            Delete
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
      <span className={styles.previewLabel}>Preview</span>
      <div className={styles.videoUploadContainer}>
        <span className={styles.label}>Webottn</span>
        <div className={styles.uploadGroup}>
          <div className={styles.videoUploadBox}>
            {imageFiles.length > 0 ? (
              <ul className={styles.fileList}>
                {imageFiles.map((image, index) => (
                  <li
                    key={index}
                    className={`${styles.fileItem} ${selectedIndex === index ? styles.selected : ''}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <span className={styles.fileName}>{image.split('/').pop()}</span> {/* 파일명 */}
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
              Upload
            </button>
          </div>
        </div>
        <div className={styles.subtitleContainer}>
          <span className={styles.label}>Subtitle</span>
          <button className={styles.addButton} onClick={() => handleAddField()}>
            + Add
          </button>
        </div>{' '}
        {subtitleFields.map((field, index) => renderUploader('subtitle', field, index))}
      </div>
      <span className={styles.grayLabel}>write media file type</span>
    </>
  );
};

export default WebtoonContentUpload;
