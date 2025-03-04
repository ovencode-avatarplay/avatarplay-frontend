'use client';
import {BoldArrowLeft, BoldMenuDots, LineArrowDown, LineArrowLeft, LineClose, LineUpload} from '@ui/Icons';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import styles from './ProfileUpdate.module.scss';
import {useForm} from 'react-hook-form';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {Drawer} from '@mui/material';
import cx from 'classnames';

import {getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {getBackUrl} from '@/utils/util-1';
import {getPdInfo, MediaState, PdPortfolioInfo, updatePdInfo, UpdatePdInfoReq} from '@/app/NetWork/ProfileNetwork';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // 필요시 다른 모듈도 가져오기
import {DataUsageSharp} from '@mui/icons-material';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
type Props = {
  params: {
    id?: string[];
  };
};

export enum DragStatusType {
  OuterClick,
  InnerClick = 1,
  PictureClick = 2,
}

type FileType = {
  fileName?: string;
  index?: number;
  file: string;
  fileBlob?: Blob;
};

export type TagDrawerType = {
  isOpenTagsDrawer: boolean;
  tagList: {
    isActive: boolean;
    value: string;
  }[];
  drawerTitle: string;
  drawerDescription: string;
};

export type PortfolioType = {
  isOpenDrawer: boolean;
};

export type PortfolioDrawerType = {
  isOpenPreview: boolean;
  isOpenDrawer: boolean;
  dataList: PdPortfolioInfo[];
  idSelected: number;
};

type DataProfileUpdateType = {
  thumbnail: FileType | null;
  dragStatus: DragStatusType;
  dataInterests: TagDrawerType;
  dataSkills: TagDrawerType;
  countValid: {
    total: number;
    valid: number;
  };
  triggerError: boolean;

  dataPortfolio: PortfolioDrawerType;
};

const PageProfileUpdate = ({params: {id = ['0']}}: Props) => {
  const profileId = parseInt(id[0]);
  const router = useRouter();
  const {
    control,
    setValue,
    register,
    handleSubmit,
    getValues,
    watch,
    unregister,
    trigger,
    clearErrors,
    formState: {errors, isSubmitted},
  } = useForm<UpdatePdInfoReq>();
  const [data, setData] = useState<DataProfileUpdateType>({
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    dataInterests: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Dating'},
        {isActive: false, value: 'Love'},
        {isActive: false, value: 'Man'},
        {isActive: false, value: 'Friends'},
        {isActive: false, value: 'Relationships'},
        {isActive: false, value: 'Adults'},
      ],
      drawerTitle: 'Interests',
      drawerDescription: 'Please select your area of interests',
    },
    dataSkills: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Create Image'},
        {isActive: false, value: 'Create LLM'},
        {isActive: false, value: 'Create Video Edit'},
        {isActive: false, value: 'Persona'},
        {isActive: false, value: 'Create Music'},
        {isActive: false, value: 'Create Webtoon'},
      ],
      drawerTitle: 'Skills',
      drawerDescription: 'Please add the skills you have',
    },

    countValid: {
      total: 7,
      valid: 0,
    },
    triggerError: false,
    dataPortfolio: {
      isOpenPreview: false,
      isOpenDrawer: false,
      dataList: [],
      idSelected: -1,
    },
  });

  const onSubmit = async (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault(); // 기본 제출 방지
    const data = getValues(); // 현재 입력값 가져오기 (검증 없음)

    const dataUpdatePdInfo: UpdatePdInfoReq = {
      ...data,
      profileId: profileId,
      iconUrl: '',
      url: '',
    };
    await updatePdInfo(dataUpdatePdInfo);
    routerBack();
  };

  useEffect(() => {
    refrestPdInfo();
  }, []);

  const refrestPdInfo = async () => {
    const res = await getPdInfo({profileId: profileId});
    data.thumbnail = {file: res?.data?.iconUrl || ''};
    setValue('iconUrl', data.thumbnail.file);

    setValue(`interests`, []);
    if (res?.data?.interests) {
      for (let i = 0; i < data.dataInterests.tagList.length; i++) {
        // const interest = res?.data?.interests[i]
        const tag = data.dataInterests.tagList[i].value;
        const index = res?.data?.interests.findIndex(v => v == tag);
        if (index >= 0) {
          data.dataInterests.tagList[index].isActive = true;
          setValue(`interests.${index}`, tag, {shouldValidate: false});
        }
      }
    }

    setValue(`skills`, []);
    if (res?.data?.skills) {
      for (let i = 0; i < data.dataSkills.tagList.length; i++) {
        // const interest = res?.data?.interests[i]
        const tag = data.dataSkills.tagList[i].value;
        const index = res?.data?.skills.findIndex(v => v == tag);
        if (index >= 0) {
          data.dataSkills.tagList[index].isActive = true;
          setValue(`skills.${index}`, tag, {shouldValidate: false});
        }
      }
    }

    const portfolioInfoList = res?.data?.pdPortfolioInfoList || [];
    for (let i = 0; i < portfolioInfoList.length; i++) {
      const value = portfolioInfoList[i];
      setValue(`pdPortfolioInfoList.${i}`, value);
    }
    data.dataPortfolio.dataList = portfolioInfoList;

    setValue('name', res?.data?.name || '', {shouldValidate: false}); // API 데이터로 값 설정
    setValue('introduce', res?.data?.introduce || '', {shouldValidate: false}); // API 데이터로 값 설정
    setValue('personalHistory', res?.data?.personalHistory || '', {shouldValidate: false}); // API 데이터로 값 설정
    setValue('honorAwards', res?.data?.honorAwards || '', {shouldValidate: false}); // API 데이터로 값 설정
    setValue('url', res?.data?.url || '', {shouldValidate: false}); // API 데이터로 값 설정
    data.triggerError = true;
    setData({...data});
  };

  useEffect(() => {
    checkValid();
  }, [errors, data.triggerError]);

  const routerBack = () => {
    // you can get the prevPath like this
    const prevPath = getBackUrl();
    if (!prevPath || prevPath == '') {
      router.replace(getLocalizedLink('/main/homefeed'));
    } else {
      router.replace(prevPath);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (data.dragStatus >= DragStatusType.InnerClick) {
      data.dragStatus = DragStatusType.OuterClick;
      return;
    }

    DropOuter(e);
    data.dragStatus = DragStatusType.OuterClick;
    setData({...data});
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const extractFileExtension = (fileName: string) => {
    let fileLength = fileName.length;
    let fileDot = fileName.lastIndexOf('.');
    let fileExtension = fileName.substring(fileDot + 1, fileLength)?.toLowerCase();
    return fileExtension;
  };

  const DropOuter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      let index = 0;
      Array.from(e.dataTransfer.items).forEach(async (item, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file == null) return;
          const fileExtension = extractFileExtension(file.name);
          if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            data.thumbnail = {
              fileName: fileName,
              index: 0,
              fileBlob: file,
              file: URL.createObjectURL(file),
            };
            setData({...data});
          }
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      Array.from(e.dataTransfer.items).forEach((file, i) => {});
    }
  };

  const onDragStartInner = (e: React.DragEvent<HTMLDivElement>) => {
    data.dragStatus = DragStatusType.InnerClick;
    // e.preventDefault();
  };

  const onUploadClicked = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    let index = 0;
    if (!files?.length) {
      return;
    }

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const fileExtension = extractFileExtension(file.name);
      if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
        index++;
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        data.thumbnail = {
          fileName: fileName,
          index: 0,
          fileBlob: file,
          file: URL.createObjectURL(file),
        };

        const dataUpload: MediaUploadReq = {
          mediaState: MediaState.Image,
          file: file,
          imageList: [],
        };
        const resUpload = await sendUpload(dataUpload);

        data.thumbnail = {
          fileName: fileName,
          index: 0,
          fileBlob: file,
          file: resUpload.data?.url || '',
        };
        setValue('iconUrl', data.thumbnail.file);
        setData({...data});
      }
    }
  };

  const checkValid = async () => {
    const isValid = await trigger(undefined, {shouldFocus: false});
    const countValidTotal = Object.keys(control._fields || {}).length;
    const countValidError = Object.keys(errors).length;
    const countValidCorrect = countValidTotal - countValidError;

    data.countValid.total = countValidTotal;
    data.countValid.valid = countValidCorrect;
    setData({...data});
  };

  return (
    <>
      <header className={styles.header}>
        <div
          className={styles.backBtnWrap}
          onClick={() => {
            routerBack();
          }}
        >
          <img src={LineArrowLeft.src} className={styles.backBtn}></img>
        </div>
        <div className={styles.progressBar} onClick={async () => {}}>
          <div
            style={{width: `${(data.countValid.valid / data.countValid.total) * 100}%`}}
            className={styles.progressInner}
          ></div>
        </div>
        <div className={styles.progressNumber}>
          {data.countValid.valid}/{data.countValid.total}
        </div>
      </header>
      <main className={cx(styles.main, data.dataPortfolio.isOpenPreview && styles.hide)}>
        <form onSubmit={onSubmit}>
          <section className={styles.uploadThumbnailSection}>
            <label className={styles.uploadBtn} htmlFor="file-upload">
              <input {...register('iconUrl', {required: true})} type="hidden" />
              <input
                className={styles.hidden}
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onUploadClicked}
              />
              {!data.thumbnail?.file && (
                <div
                  className={styles.uploadWrap}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragStart={onDragStartInner}
                >
                  <img src={LineUpload.src} alt="" />
                  <div className={styles.text}>Upload</div>
                </div>
              )}

              {data.thumbnail?.file && (
                <div className={styles.thumbnailContainer}>
                  <div className={styles.thumbnailWrap}>
                    <img className={styles.thumbnail} src={data.thumbnail?.file} alt="" />
                    <div className={styles.iconEditWrap}>
                      <img src="/ui/profile/update/icon_thumbnail_edit.svg" alt="" className={styles.iconEdit} />
                    </div>
                  </div>
                </div>
              )}
            </label>
          </section>
          <section className={styles.nicknameSection}>
            <h2 className={styles.label}>Nickname</h2>
            <input
              className={cx(errors.name && isSubmitted && styles.error)}
              {...register('name', {required: true})}
              type="text"
              placeholder="Please enter a nickname"
              maxLength={30}
              onChange={async e => {
                setValue('name', e.target.value);
                clearErrors('name');
                checkValid();
              }}
            />
          </section>
          <section className={styles.introductionSection}>
            <h2 className={styles.label}>Introduction</h2>
            <div className={cx(styles.textAreaWrap, errors.introduce && isSubmitted && styles.error)}>
              <textarea
                {...register('introduce', {required: true})}
                placeholder="Add a description or hashtag"
                maxLength={500}
                onChange={async e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                  setValue('introduce', target.value, {shouldValidate: false}); // 강제 업데이트
                  clearErrors('introduce');
                  checkValid();
                }}
              />
              <div className={styles.textCount}>{`${watch('introduce', '').length}/500`}</div>
            </div>
          </section>
          <section className={styles.interestSection}>
            <h2 className={styles.label}>Interests</h2>
            <div
              className={cx(styles.selectWrap, errors.interests && isSubmitted && styles.error)}
              onClick={() => {
                data.dataInterests.isOpenTagsDrawer = true;
                setData({...data});
              }}
            >
              <div className={styles.placeholder}>Select</div>
              <img src={'/ui/profile/update/icon_select.svg'} alt="" />
            </div>
            <div className={styles.tagWrap}>
              {!watch('interests') && <input type="hidden" {...register(`interests`, {required: true})} />}

              {data.dataInterests.tagList.map((one, index) => {
                if (!one.isActive) return;

                return (
                  <div className={styles.tag} key={index}>
                    <div className={styles.value}>
                      <input value={one.value} type="hidden" {...register(`interests.${index}`, {required: true})} />
                      {one.value}
                    </div>
                    <div
                      className={styles.btnRemoveWrap}
                      onClick={e => {
                        unregister(`interests.${index}`);
                        data.dataInterests.tagList[index].isActive = false;
                        setData({...data});
                        checkValid();
                      }}
                    >
                      <img src={'/ui/profile/update/icon_remove.svg'} alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className={styles.skillSection}>
            <h2 className={styles.label}>Skill</h2>
            <div
              className={cx(styles.selectWrap, errors.skills && isSubmitted && styles.error)}
              onClick={() => {
                data.dataSkills.isOpenTagsDrawer = true;
                setData({...data});
              }}
            >
              <div className={styles.placeholder}>Select</div>
              <img src={'/ui/profile/update/icon_select.svg'} alt="" />
            </div>
            <div className={cx(styles.tagWrap)}>
              {!watch('skills') && <input type="hidden" {...register(`skills`, {required: true})} />}
              {data.dataSkills.tagList.map((one, index) => {
                if (!one.isActive) return;

                return (
                  <div className={styles.tag} key={index}>
                    <div className={styles.value}>
                      <input value={one.value} type="hidden" {...register(`skills.${index}`, {required: true})} />
                      {one.value}
                    </div>
                    <div
                      className={styles.btnRemoveWrap}
                      onClick={e => {
                        unregister(`skills.${index}`);
                        setValue(`skills.${index}`, one.value);
                        data.dataSkills.tagList[index].isActive = false;
                        setData({...data});
                        checkValid();
                      }}
                    >
                      <img src={'/ui/profile/update/icon_remove.svg'} alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className={styles.personalHistorySection}></section>
          <section className={styles.honorAwardsSection}></section>
          <section className={styles.portfolioSection}></section>
          <section className={styles.urlSection}></section>

          <section className={styles.personalHistorySection}>
            <h2 className={styles.label}>Personal History</h2>
            <textarea
              {...register('personalHistory', {required: true})}
              className={cx(styles.inputPersonalHistory, errors.personalHistory && isSubmitted && styles.error)}
              placeholder="Ex) 2024. 10~2025.01 Design (Zero to One CB)"
              onChange={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;

                clearErrors('personalHistory');
                setValue('personalHistory', e.target.value);
                checkValid();
              }}
            />
          </section>

          <section className={styles.honorAwardsSection}>
            <h2 className={styles.label}>Honor & Awards</h2>
            <textarea
              {...register('honorAwards', {required: true})}
              className={cx(styles.inputHonorawards, errors.honorAwards && isSubmitted && styles.error)}
              placeholder="Ex) 2024.10.00Advertisement contest winner(korea)"
              onChange={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;

                clearErrors('honorAwards');
                setValue('honorAwards', e.target.value);
                checkValid();
              }}
            />
          </section>

          <section className={styles.portfolioSection}>
            <div className={styles.labelWrap}>
              <h2 className={styles.label}>Portfolio</h2>
              <div
                className={styles.btnPreview}
                onClick={() => {
                  data.dataPortfolio.isOpenPreview = true;
                  setData({...data});
                }}
              >
                Preview
              </div>
            </div>
            <input {...register('pdPortfolioInfoList', {required: true})} type="hidden" />

            {/* <div className={styles.uploadArea}> */}
            <Swiper
              className={styles.uploadArea}
              freeMode={true}
              slidesPerView={'auto'}
              onSlideChange={() => {}}
              onSwiper={swiper => {}}
              spaceBetween={8}
            >
              <SwiperSlide>
                <div
                  className={styles.uploadWrap}
                  onClick={() => {
                    data.dataPortfolio.isOpenDrawer = true;
                    data.dataPortfolio.idSelected = -1;
                    setData({...data});
                  }}
                >
                  <img src={LineUpload.src} alt="" />
                  <div className={styles.text}>Upload</div>
                </div>
              </SwiperSlide>
              {data.dataPortfolio.dataList.map((one, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    onClick={() => {
                      data.dataPortfolio.isOpenDrawer = true;
                      data.dataPortfolio.idSelected = index;
                      setData({...data});
                    }}
                  >
                    <div className={styles.thumbnailWrap}>
                      <img src={one.image_url} alt="" />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* </div> */}
          </section>

          <section className={styles.urlSection}>
            <h2 className={styles.label}>URL</h2>
            <input
              {...register('url', {required: true})}
              className={cx(errors.url && isSubmitted && styles.error)}
              type="text"
              placeholder="https://"
              onChange={e => {
                clearErrors('url');
                setValue('url', e.target.value);
                checkValid();
              }}
            />
          </section>

          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </form>
        <DrawerSelectTags
          title={data.dataInterests.drawerTitle}
          description={data.dataInterests.drawerDescription}
          tags={JSON.parse(JSON.stringify(data.dataInterests.tagList))}
          open={data.dataInterests.isOpenTagsDrawer}
          onClose={() => {
            data.dataInterests.isOpenTagsDrawer = false;
            setData({...data});
          }}
          onChange={(dataChanged: any) => {
            clearErrors('interests');
            data.dataInterests.tagList = dataChanged;

            for (let i = 0; i < dataChanged.length; i++) {
              if (!dataChanged[i].isActive) {
                unregister(`interests.${i}`);
              } else {
                setValue(`interests.${i}`, dataChanged[i].value, {shouldValidate: false});
                checkValid();
              }
            }
            setData({...data});
          }}
        />
        <DrawerSelectTags
          title={data.dataSkills.drawerTitle}
          description={data.dataSkills.drawerDescription}
          tags={JSON.parse(JSON.stringify(data.dataSkills.tagList))}
          open={data.dataSkills.isOpenTagsDrawer}
          onClose={() => {
            data.dataSkills.isOpenTagsDrawer = false;
            setData({...data});
          }}
          onChange={(dataChanged: any) => {
            clearErrors('skills');
            data.dataSkills.tagList = dataChanged;

            for (let i = 0; i < dataChanged.length; i++) {
              if (!dataChanged[i].isActive) {
                unregister(`skills.${i}`);
              } else {
                setValue(`skills.${i}`, dataChanged[i].value, {shouldValidate: false});
                checkValid();
              }
            }
            setData({...data});
          }}
        />
        <DrawerCreatePortfolio
          dataList={data.dataPortfolio.dataList}
          id={data.dataPortfolio.idSelected}
          open={data.dataPortfolio.isOpenDrawer}
          onChange={dataList => {
            data.dataPortfolio.dataList = dataList;

            clearErrors('pdPortfolioInfoList');
            setValue('pdPortfolioInfoList', []);
            for (let i = 0; i < data.dataPortfolio.dataList.length; i++) {
              const value = data.dataPortfolio.dataList[i];
              setValue(`pdPortfolioInfoList.${i}`, value);
            }

            setData({...data});
          }}
          onClose={() => {
            data.dataPortfolio.isOpenDrawer = false;
            setData({...data});
          }}
        />
      </main>
      <footer className={styles.footer}></footer>
      {data.dataPortfolio.isOpenPreview && (
        <PortfolioListPopup
          dataList={JSON.parse(JSON.stringify(data.dataPortfolio.dataList))}
          onChange={dataList => {
            data.dataPortfolio.dataList = dataList;
            clearErrors('pdPortfolioInfoList');
            setValue('pdPortfolioInfoList', []);
            for (let i = 0; i < data.dataPortfolio.dataList.length; i++) {
              const value = data.dataPortfolio.dataList[i];
              setValue(`pdPortfolioInfoList.${i}`, value);
            }
            setData({...data});
          }}
          onClose={() => {
            data.dataPortfolio.isOpenPreview = false;
            setData({...data});
          }}
        />
      )}
    </>
  );
};

export type DrawerCreatePortfolioType = {
  dataList: PdPortfolioInfo[];
  id: number;
  open: boolean;
  onClose: () => void;
  onChange: (data: PdPortfolioInfo[]) => void;
};

export const DrawerCreatePortfolio = ({dataList, id, open, onClose, onChange}: DrawerCreatePortfolioType) => {
  const {
    control,
    setValue,
    register,
    handleSubmit,
    getValues,
    watch,
    unregister,
    trigger,
    clearErrors,
    formState: {errors, isSubmitted},
  } = useForm<PdPortfolioInfo>();
  const [data, setData] = useState<{
    iconUrl: string;
    dragStatus: DragStatusType;
  }>({
    iconUrl: '',
    dragStatus: DragStatusType.OuterClick,
  });

  useEffect(() => {
    let iconUrl = '';
    let description = '';
    if (id != -1) {
      iconUrl = dataList[id]?.image_url || '';
      description = dataList[id]?.description || '';
    }
    setValue('image_url', iconUrl);
    setValue('description', description);
    data.iconUrl = iconUrl;
    setData({...data});
  }, [dataList, id]);

  useEffect(() => {
    if (!open) return;

    setData({...data});
  }, [open]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (data.dragStatus >= DragStatusType.InnerClick) {
      data.dragStatus = DragStatusType.OuterClick;
      return;
    }

    DropOuter(e);
    data.dragStatus = DragStatusType.OuterClick;
    setData({...data});
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const extractFileExtension = (fileName: string) => {
    let fileLength = fileName.length;
    let fileDot = fileName.lastIndexOf('.');
    let fileExtension = fileName.substring(fileDot + 1, fileLength)?.toLowerCase();
    return fileExtension;
  };

  const DropOuter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      let index = 0;
      Array.from(e.dataTransfer.items).forEach(async (item, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file == null) return;
          const fileExtension = extractFileExtension(file.name);
          if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            const dataUpload: MediaUploadReq = {
              mediaState: MediaState.Image,
              file: file,
              imageList: [],
            };
            const resUpload = await sendUpload(dataUpload);
            const iconUrl = resUpload.data?.url || '';
            data.iconUrl = iconUrl;
            setValue('image_url', iconUrl);
            setData({...data});
          }
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      Array.from(e.dataTransfer.items).forEach((file, i) => {});
    }
  };

  const onDragStartInner = (e: React.DragEvent<HTMLDivElement>) => {
    data.dragStatus = DragStatusType.InnerClick;
    // e.preventDefault();
  };

  const onUploadClicked = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    let index = 0;
    if (!files?.length) {
      return;
    }

    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const fileExtension = extractFileExtension(file.name);
      if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
        index++;
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        const dataUpload: MediaUploadReq = {
          mediaState: MediaState.Image,
          file: file,
          imageList: [],
        };
        const resUpload = await sendUpload(dataUpload);
        const iconUrl = resUpload.data?.url || '';
        data.iconUrl = iconUrl;
        setValue('image_url', iconUrl);
        setData({...data});
      }
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault(); // 기본 제출 방지
    const data = getValues(); // 현재 입력값 가져오기 (검증 없음)

    if (id == -1) {
      data.id = 0;
      dataList.push(data);
    } else {
      dataList[id] = data;
    }
    onChange(dataList);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => onClose()}
      PaperProps={{
        className: cx(styles.drawer, styles.uploadPortfolio),
        sx: {
          overflow: 'hidden',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={styles.handleContent}>
        <form onSubmit={onSubmit}>
          <section className={styles.uploadThumbnailSection}>
            <label className={styles.uploadBtn} htmlFor="file-upload2">
              <input {...register('image_url', {required: true})} type="hidden" />
              <input
                className={styles.hidden}
                id="file-upload2"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onUploadClicked}
              />
              {!data.iconUrl && (
                <div
                  className={styles.uploadWrap}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragStart={onDragStartInner}
                >
                  <img src={LineUpload.src} alt="" />
                  <div className={styles.text}>Upload</div>
                </div>
              )}

              {data.iconUrl && (
                <div className={styles.thumbnailContainer}>
                  <div className={styles.thumbnailWrap}>
                    <img className={styles.thumbnail} src={data.iconUrl} alt="" />
                    <div className={styles.iconEditWrap}>
                      <img src="/ui/profile/update/icon_thumbnail_edit.svg" alt="" className={styles.iconEdit} />
                    </div>
                  </div>
                </div>
              )}
            </label>
          </section>
          <div className={styles.label}>
            Episode Description<span className={styles.highlight}> *</span>
          </div>
          <div className={cx(styles.textAreaWrap, errors.description && isSubmitted && styles.error)}>
            <textarea
              {...register('description', {required: true})}
              placeholder="Add a description or hashtag"
              maxLength={500}
              onChange={async e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
                setValue('description', target.value, {shouldValidate: false}); // 강제 업데이트
                clearErrors('description');
              }}
            />
            <div className={styles.textCount}>{`${watch('description', '').length}/500`}</div>
          </div>
          <div className={styles.buttonWrap}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export type DrawerSelectTagsType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerSelectTags = ({title, description, tags, open, onClose, onChange}: DrawerSelectTagsType) => {
  const [data, setData] = useState({
    tagList: tags,
  });

  useEffect(() => {
    if (!open) return;

    data.tagList = tags;
    setData({...data});
  }, [open]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => onClose()}
      PaperProps={{
        className: styles.drawer,
        sx: {
          overflow: 'hidden',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.handleContent}>
        <div className={styles.description}>{description}</div>
        <div
          className={styles.tagWrap}
          onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement;
            const index = parseInt(target.closest('[data-tag]')?.getAttribute('data-tag') || '-1');
            if (index >= 0) {
              data.tagList[index].isActive = !data.tagList[index].isActive;
              setData({...data});
            }
          }}
        >
          {data.tagList.map((tag, index) => {
            return (
              <div className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{tag.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className={styles.submitBtn}
        onClick={() => {
          onChange(data.tagList);
          onClose();
        }}
      >
        Submit
      </button>
    </Drawer>
  );
};

export default PageProfileUpdate;

export type PortfolioListPopupType = {
  dataList: PdPortfolioInfo[];
  onClose: () => void;
  onChange: (data: PdPortfolioInfo[]) => void;
};

const PortfolioListPopup = ({dataList, onChange, onClose}: PortfolioListPopupType) => {
  const [data, setData] = useState<{
    isSettingOpen: boolean;
    idSelected: number;
    portfolioList: PdPortfolioInfo[];
    isOpenEditDrawer: boolean;
  }>({
    isSettingOpen: false,
    idSelected: 0,
    portfolioList: [],
    isOpenEditDrawer: false,
  });
  useEffect(() => {
    data.portfolioList = dataList || [];
    setData({...data});
  }, [dataList]);

  let settingItems: SelectDrawerItem[] = [
    {
      name: 'Edit',
      onClick: () => {
        data.isOpenEditDrawer = true;
        setData({...data});
      },
    },
    {
      name: 'Share',
      onClick: () => {},
    },
    {
      name: 'Delete',
      onClick: () => {
        data.portfolioList.splice(data.idSelected, 1);
        setData({...data});
        onChange(data.portfolioList);
      },
    },
  ];
  return (
    <>
      <section className={styles.portfolioPreviewSection}>
        <header>
          <img
            src={BoldArrowLeft.src}
            alt="back"
            className={styles.back}
            onClick={() => {
              onChange;
              onClose();
            }}
          />
          <div className={styles.title}>Portfolio</div>
        </header>
        <main>
          <div className={styles.countPortfolio}>Portfolio {data.portfolioList.length}</div>
          <ul className={styles.itemList}>
            {data.portfolioList.map((one, index) => {
              return (
                <li className={styles.item} key={index}>
                  <img className={styles.thumbnail} src={one.image_url} alt="" />
                  <div className={styles.description}>{one.description}</div>
                  <div className={styles.dateRegistration}>Date Registration 2025.02.10</div>
                  <div className={styles.settingWrap}>
                    <img
                      src={BoldMenuDots.src}
                      alt=""
                      className={styles.setting}
                      onClick={() => {
                        data.isSettingOpen = true;
                        data.idSelected = index;
                        setData({...data});
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <SelectDrawer
            isOpen={data.isSettingOpen}
            onClose={() => {
              data.isSettingOpen = false;
              setData({...data});
            }}
            items={settingItems}
            selectedIndex={-1}
          />
          <DrawerCreatePortfolio
            dataList={data.portfolioList}
            id={data.idSelected}
            open={data.isOpenEditDrawer}
            onChange={dataList => {
              data.portfolioList = dataList;
              setData({...data});
              onChange(data.portfolioList);
            }}
            onClose={() => {
              data.isOpenEditDrawer = false;
              setData({...data});
            }}
          />
        </main>
        <footer></footer>
      </section>
    </>
  );
};
