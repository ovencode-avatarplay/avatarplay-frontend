'use client';
import {LineArrowLeft, BoldMenuDots, LineArrowDown, LineClose, LineUpload} from '@ui/Icons';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import styles from './ProfileUpdate.module.scss';
import {useFieldArray, useForm} from 'react-hook-form';
import {COMMON_TAG_HEAD_INTEREST, SelectBox} from '@/app/view/profile/ProfileBase';
import {Dialog, Drawer} from '@mui/material';
import cx from 'classnames';

import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {getBackUrl} from '@/utils/util-1';
import {getPdInfo, MediaState, PdPortfolioInfo, updatePdInfo, UpdatePdInfoReq} from '@/app/NetWork/ProfileNetwork';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // 필요시 다른 모듈도 가져오기
import {DataUsageSharp} from '@mui/icons-material';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {getAuth} from '@/app/NetWork/AuthNetwork';
import {updateProfile} from '@/redux-store/slices/Profile';
import {useDispatch} from 'react-redux';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomChipSelector from '@/components/layout/shared/CustomChipSelector';
type Props = {
  profileId: number;
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
    langKey?: string;
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

const ProfileUpdate = ({profileId = 0}: Props) => {
  const {back} = useCustomRouter();
  const dispatch = useDispatch();
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
    setFocus,
    clearErrors,
    formState: {errors, isSubmitted},
  } = useForm<UpdatePdInfoReq>({
    defaultValues: {
      interests: [],
      skills: [],
      pdPortfolioInfoList: [],
    },
  });

  const [data, setData] = useState<DataProfileUpdateType>({
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    dataInterests: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Dating', langKey: 'common_filterinterest_dating'},
        {isActive: false, value: 'Love', langKey: 'common_filterinterest_love'},
        {isActive: false, value: 'Man', langKey: 'common_filterinterest_man'},
        {isActive: false, value: 'Friends', langKey: 'common_filterinterest_friends'},
        {isActive: false, value: 'Relationships', langKey: 'common_filterinterest_relationships'},
        {isActive: false, value: 'Adults', langKey: 'common_filterinterest_adults'},
      ],
      drawerTitle: getLocalizedText('profile007_label_002'),
      drawerDescription: getLocalizedText('common_alert_050'),
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
      drawerTitle: getLocalizedText('common_alert_056'),
      drawerDescription: getLocalizedText('common_alert_049'),
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
    };
    console.log('dataUpdatePdInfo : ', dataUpdatePdInfo);
    await updatePdInfo(dataUpdatePdInfo);
    await refreshProfileInfo();
    routerBack();
  };

  const refreshProfileInfo = async () => {
    const res = await getAuth();
    console.log('auth res :', res);
    if (res?.resultCode != 0) {
      pushLocalizedRoute('/auth', router);
      return;
    } else {
      if (!res?.data?.profileSimpleInfo) {
        console.error('/auth에서 profileSimpleInfo 못받음');
        return;
      }

      const profile = res?.data?.profileSimpleInfo;

      dispatch(updateProfile(profile));
    }
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
        const tag = data.dataInterests.tagList[i];
        const index = res?.data?.interests.findIndex(v => v == tag.value || v == tag.langKey);
        if (index >= 0) {
          data.dataInterests.tagList[index].value = res?.data?.interests[i];
          data.dataInterests.tagList[index].isActive = true;
        }
      }
    }
    const interests = data.dataInterests.tagList.filter(v => v.isActive).map(v => v?.langKey || '');
    setValue('interests', interests);

    setValue(`skills`, []);
    if (res?.data?.skills) {
      for (let i = 0; i < data.dataSkills.tagList.length; i++) {
        // const interest = res?.data?.interests[i]
        const tag = data.dataSkills.tagList[i].value;
        const index = res?.data?.skills.findIndex(v => v == tag);
        if (index >= 0) {
          data.dataSkills.tagList[index].isActive = true;
        }
      }
    }
    const skills = data.dataSkills.tagList.filter(v => v.isActive).map(v => v.value);
    setValue('skills', skills);

    const portfolioInfoList = res?.data?.pdPortfolioInfoList || [];
    setValue(`pdPortfolioInfoList`, portfolioInfoList, {
      shouldValidate: false,
    });
    data.dataPortfolio.dataList = portfolioInfoList;

    setValue('name', res?.data?.name || '', {shouldValidate: false}); // API 데이터로 값 설정
    setValue('introduce', res?.data?.introduce || '', {shouldValidate: false}); // API 데이터로 값 설정

    setValue('personalHistory', res?.data?.personalHistory || '', {shouldValidate: false}); // API 데이터로 값 설정

    setValue('honorAwards', res?.data?.honorAwards || '', {shouldValidate: false}); // API 데이터로 값 설정

    setValue('url', res?.data?.url || '', {shouldValidate: false}); // API 데이터로 값 설정
    data.triggerError = true;
    setData({...data});
    console.log('1 update ');
  };

  useEffect(() => {
    checkValid();
  }, [errors, data.triggerError]);

  const routerBack = () => {
    back('/main/homefeed');
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
            setValue('iconUrl', data.thumbnail.file);
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
    const list = getValues('pdPortfolioInfoList');
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
      <main className={cx(styles.main)}>
        <form className={styles.container} onSubmit={onSubmit}>
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
                  <div className={styles.text}>{getLocalizedText('common_button_upload')}</div>
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
            <h2 className={styles.label}>{getLocalizedText('common_alert_043')}</h2>
            <input
              className={cx(errors.name && isSubmitted && styles.error)}
              {...register('name', {required: true})}
              type="text"
              placeholder={getLocalizedText('common_sample_072')}
              maxLength={30}
              onChange={async e => {
                setValue('name', e.target.value);
                clearErrors('name');
                checkValid();
              }}
            />
          </section>
          <section className={styles.introductionSection}>
            <h2 className={styles.label}>{getLocalizedText('profile007_label_001')}</h2>
            <div className={cx(styles.textAreaWrap, errors.introduce && isSubmitted && styles.error)}>
              <textarea
                {...register('introduce', {required: true})}
                placeholder={getLocalizedText('common_sample_047')}
                maxLength={500}
                rows={1}
                value={watch('introduce')}
                onChange={async e => {
                  const target = e.target as HTMLTextAreaElement;
                  // target.style.height = 'auto';
                  // target.style.height = `${target.scrollHeight - 10}px`;
                  setValue('introduce', target.value, {shouldValidate: false}); // 강제 업데이트
                  clearErrors('introduce');
                  checkValid();
                }}
              />
              <div className={styles.textCount}>{`${watch('introduce', '').length}/500`}</div>
            </div>
          </section>
          <section className={styles.interestSection}>
            {/* <h2 className={styles.label}>{getLocalizedText('profile007_label_002')}</h2> */}
            {/* <div
              className={cx(styles.selectWrap, errors.interests && isSubmitted && styles.error)}
              onClick={() => {
                data.dataInterests.isOpenTagsDrawer = true;
                setData({...data});
              }}
            >
              <div className={styles.placeholder}>{getLocalizedText('common_sample_079')}</div>
              <img src={'/ui/profile/update/icon_select.svg'} alt="" />
            </div> */}
            <CustomChipSelector
              containerStyle={{width: '100%'}}
              label={getLocalizedText('profile007_label_002')}
              onClick={() => {
                data.dataInterests.isOpenTagsDrawer = true;
                setData({...data});
              }}
              tagType="tags"
            />
            <div className={styles.tagWrap}>
              <input
                type="hidden"
                {...register(`interests`, {
                  required: true,
                  validate: {
                    array: value => (value?.length || 0) > 0,
                  },
                })}
              />

              {data.dataInterests.tagList.map((one, index) => {
                if (!one.isActive) return;
                console.log('one?.value : ', one?.value);
                const value = one?.value?.includes(COMMON_TAG_HEAD_INTEREST)
                  ? getLocalizedText(one?.value)
                  : one?.value;
                return (
                  <div className={styles.tag} key={index}>
                    <div className={styles.value}>
                      {/* <input value={one.value} type="hidden" {...register(`interests.${index}`, {required: true})} /> */}
                      {value}
                    </div>
                    <div
                      className={styles.btnRemoveWrap}
                      onClick={e => {
                        data.dataInterests.tagList[index].isActive = false;

                        const interests = data.dataInterests.tagList.filter(v => v.isActive).map(v => v.value);
                        setValue('interests', interests);
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
            {/* <h2 className={styles.label}>{getLocalizedText('common_alert_056')}</h2>
            <div
              className={cx(styles.selectWrap, errors.skills && isSubmitted && styles.error)}
              onClick={() => {
                data.dataSkills.isOpenTagsDrawer = true;
                setData({...data});
              }}
            >
              <div className={styles.placeholder}>{getLocalizedText('common_sample_079')}</div>
              <img src={'/ui/profile/update/icon_select.svg'} alt="" />
            </div> */}
            <CustomChipSelector
              containerStyle={{width: '100%'}}
              label={getLocalizedText('common_alert_056')}
              onClick={() => {
                data.dataSkills.isOpenTagsDrawer = true;
                setData({...data});
              }}
              tagType="tags"
            />
            <div className={cx(styles.tagWrap)}>
              <input
                type="hidden"
                {...register(`skills`, {
                  required: true,
                  validate: {
                    array: value => (value?.length || 0) > 0,
                  },
                })}
              />
              {data.dataSkills.tagList.map((one, index) => {
                if (!one.isActive) return;

                return (
                  <div className={styles.tag} key={index}>
                    <div className={styles.value}>
                      {/* <input value={one.value} type="hidden" {...register(`skills.${index}`, {required: true})} /> */}
                      {one.value}
                    </div>
                    <div
                      className={styles.btnRemoveWrap}
                      onClick={e => {
                        data.dataSkills.tagList[index].isActive = false;
                        const skills = data.dataSkills.tagList.filter(v => v.isActive).map(v => v.value);
                        setValue('skills', skills);
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

          <section className={styles.personalHistorySection}>
            <h2 className={styles.label}>{getLocalizedText('profile007_label_003')}</h2>

            <div className={cx(styles.textAreaWrap, errors.personalHistory && isSubmitted && styles.error)}>
              <textarea
                {...register('personalHistory', {required: true})}
                placeholder={getLocalizedText('common_sample_063')}
                maxLength={500}
                rows={1}
                value={watch('personalHistory')}
                onChange={e => {
                  const target = e.target as HTMLTextAreaElement;
                  // target.style.height = 'auto';
                  // target.style.height = `${target.scrollHeight - 20}px`;

                  clearErrors('personalHistory');
                  setValue('personalHistory', e.target.value);
                  checkValid();
                }}
              />
              <div className={styles.textCount}>{`${watch('personalHistory', '').length}/500`}</div>
            </div>

            {/* <textarea
              {...register('personalHistory', {required: true})}
              className={cx(styles.inputPersonalHistory, errors.personalHistory && isSubmitted && styles.error)}
              placeholder="Ex) 2024. 10~2025.01 Design (Zero to One CB)"
              rows={1}
              onChange={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight - 20}px`;

                clearErrors('personalHistory');
                setValue('personalHistory', e.target.value);
                checkValid();
              }}
            /> */}
          </section>

          <section className={styles.honorAwardsSection}>
            <h2 className={styles.label}>{getLocalizedText('profile007_label_004')}</h2>

            <div className={cx(styles.textAreaWrap, errors.honorAwards && isSubmitted && styles.error)}>
              <textarea
                {...register('honorAwards', {required: true})}
                placeholder={getLocalizedText('common_sample_064')}
                maxLength={500}
                rows={1}
                value={watch('honorAwards')}
                onChange={e => {
                  const target = e.target as HTMLTextAreaElement;
                  // target.style.height = 'auto';
                  // target.style.height = `${target.scrollHeight - 20}px`;

                  clearErrors('honorAwards');
                  setValue('honorAwards', e.target.value);
                  checkValid();
                }}
              />
              <div className={styles.textCount}>{`${watch('honorAwards', '').length}/500`}</div>
            </div>
            {/* <textarea
              {...register('honorAwards', {required: true})}
              className={cx(styles.inputHonorawards, errors.honorAwards && isSubmitted && styles.error)}
              placeholder="Ex) 2024.10.00Advertisement contest winner(korea)"
              rows={1}
              onChange={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight - 20}px`;

                clearErrors('honorAwards');
                setValue('honorAwards', e.target.value);
                checkValid();
              }}
            /> */}
          </section>

          <section className={styles.portfolioSection}>
            <div className={styles.labelWrap}>
              <h2 className={styles.label}>{getLocalizedText('profile007_label_005')}</h2>
              <div
                className={styles.btnPreview}
                onClick={() => {
                  data.dataPortfolio.isOpenPreview = true;
                  setData({...data});
                }}
              >
                {getLocalizedText('common_button_preview')}
              </div>
            </div>
            <input
              {...register('pdPortfolioInfoList', {
                required: true,
                validate: {
                  array: value => (value?.length || 0) > 0,
                },
              })}
              type="hidden"
            />
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
                  <div className={styles.text}>{getLocalizedText('common_button_upload')}</div>
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
                      <img src={one.imageUrl} alt="" />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            {/* </div> */}
          </section>

          <section className={styles.urlSection}>
            <h2 className={styles.label}>{getLocalizedText('profile007_label_006')}</h2>
            <input
              {...register('url', {required: true})}
              className={cx(errors.url && isSubmitted && styles.error)}
              type="text"
              placeholder={getLocalizedText('common_sample_065')}
              onChange={e => {
                clearErrors('url');
                setValue('url', e.target.value);
                checkValid();
              }}
            />
          </section>

          <div className={styles.submitBtnArea}>
            <CustomButton
              size="Medium"
              type="Primary"
              state="Normal"
              //  type="submit"
              customClassName={[styles.submitBtn]}
            >
              {getLocalizedText('common_button_submit')}
            </CustomButton>
            <div className={styles.submitButtonBack}></div>
          </div>
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

            const interests = data.dataInterests.tagList.filter(v => v.isActive).map(v => v?.langKey || '');
            setValue('interests', interests);
            checkValid();
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

            const skills = data.dataSkills.tagList.filter(v => v.isActive).map(v => v.value);
            setValue('skills', skills);

            checkValid();
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

            const portfolioList = data.dataPortfolio.dataList;
            setValue('pdPortfolioInfoList', portfolioList);
            checkValid();
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
            const portfolioList = data.dataPortfolio.dataList;
            setValue('pdPortfolioInfoList', portfolioList);
            checkValid();
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
    refresh();
  }, [dataList, id]);

  useEffect(() => {
    if (!open) return;

    clearErrors();
    refresh();
  }, [open]);

  const refresh = () => {
    let iconUrl = '';
    let description = '';
    console.log('id : ', id);
    if (id != -1) {
      iconUrl = dataList[id]?.imageUrl || '';
      description = dataList[id]?.description || '';
    }
    setValue('imageUrl', iconUrl);
    setValue('description', description);
    data.iconUrl = iconUrl;
    setData({...data});
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
            const dataUpload: MediaUploadReq = {
              mediaState: MediaState.Image,
              file: file,
              imageList: [],
            };
            const resUpload = await sendUpload(dataUpload);
            const iconUrl = resUpload.data?.url || '';
            data.iconUrl = iconUrl;
            setValue('imageUrl', iconUrl);
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
        setValue('imageUrl', iconUrl);
        setData({...data});
      }
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
    // e.preventDefault(); // 기본 제출 방지
    // const data = getValues(); // 현재 입력값 가져오기 (검증 없음)

    // if (id == -1) {
    //   data.id = 0;
    //   dataList.push(data);
    // } else {
    //   dataList[id] = data;
    // }
    // onChange(dataList);
    // onClose();
    if (isCreate) {
      dataList.push(data);
      onChange(dataList);
      onClose();
    } else {
      dataList.splice(id, 1);
      setData({...data});
      onChange(dataList);
      onClose();
    }
  };

  const isCreate = id == -1;

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.uploadThumbnailSection}>
            <label className={styles.uploadBtn} htmlFor="file-upload2">
              <input {...register('imageUrl', {required: true})} type="hidden" />
              <input
                className={styles.hidden}
                id="file-upload2"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onUploadClicked}
              />
              {!data.iconUrl && (
                <div
                  className={cx(styles.uploadWrap, errors.imageUrl && styles.error)}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragStart={onDragStartInner}
                >
                  <img src={LineUpload.src} alt="" />
                  <div className={styles.text}>{getLocalizedText('common_button_upload')}</div>
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
            {getLocalizedText('createcontent007_label_004')}
            <span className={styles.highlight}> *</span>
          </div>
          <div className={cx(styles.textAreaWrap, errors.description && isSubmitted && styles.error)}>
            <textarea
              {...register('description', {required: true})}
              placeholder="Add a description or hashtag"
              maxLength={500}
              onChange={async e => {
                const target = e.target as HTMLTextAreaElement;
                // target.style.height = 'auto';
                // target.style.height = `${target.scrollHeight}px`;
                setValue('description', target.value, {shouldValidate: false}); // 강제 업데이트
                clearErrors('description');
              }}
            />
            <div className={styles.textCount}>{`${watch('description', '').length}/500`}</div>
          </div>
          <div className={styles.buttonWrap}>
            <CustomButton
              size="Medium"
              state="Normal"
              type="Tertiary"
              //  type="submit"
              customClassName={[styles.cancelBtn]}
            >
              {isCreate ? getLocalizedText('common_button_cancel') : 'Delete'}
            </CustomButton>
            <CustomButton
              size="Medium"
              state="Normal"
              type="Primary"
              // type="submit"
              customClassName={[styles.saveBtn]}
            >
              {getLocalizedText('common_button_submit')}
            </CustomButton>
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
            const value = tag?.value?.includes(COMMON_TAG_HEAD_INTEREST) ? getLocalizedText(tag?.value) : tag?.value;

            return (
              <div key={tag.value} className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <CustomButton
        size="Medium"
        type="Primary"
        state="Normal"
        customClassName={[styles.submitBtn]}
        onClick={() => {
          onChange(data.tagList);
          onClose();
        }}
      >
        {getLocalizedText('common_button_submit')}
      </CustomButton>
    </Drawer>
  );
};

export default ProfileUpdate;

export type PortfolioListPopupType = {
  dataList: PdPortfolioInfo[];
  onClose: () => void;
  onChange: (data: PdPortfolioInfo[]) => void;
};

export const PortfolioListPopup = ({dataList, onChange, onClose}: PortfolioListPopupType) => {
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
      <Dialog open={true} onClose={onClose} fullScreen>
        <section className={styles.portfolioPreviewSection}>
          <header>
            <img
              src={LineArrowLeft.src}
              alt="back"
              className={styles.back}
              onClick={() => {
                onChange;
                onClose();
              }}
            />
            <div className={styles.title}>{getLocalizedText('profile045_title_001')}</div>
          </header>
          <main>
            <div className={styles.countPortfolio}>
              {getLocalizedText('profile045_label_002')} {data.portfolioList.length}
            </div>
            <ul className={styles.itemList}>
              {data.portfolioList.map((one, index) => {
                const date = one?.createAt ? new Date(one?.createAt) : new Date();
                const formattedDate = date.toLocaleDateString('ko-KR').replace(/-/g, '.');
                return (
                  <li className={styles.item} key={index}>
                    <img className={styles.thumbnail} src={one.imageUrl} alt="" />
                    <div className={styles.description}>{one.description}</div>
                    <div className={styles.dateRegistration}>
                      {getLocalizedText('profile034_label_003')} {formattedDate}
                    </div>
                    {/* <div className={styles.settingWrap}>
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
                    </div> */}
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
      </Dialog>
    </>
  );
};
