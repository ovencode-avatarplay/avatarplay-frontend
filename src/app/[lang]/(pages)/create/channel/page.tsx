'use client';

import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import styles from './CreateChannel.module.scss';
import {
  BoldAltArrowDown,
  BoldArrowLeft,
  BoldRadioButton,
  BoldRadioButtonSelected,
  BoldRadioButtonSquare,
  BoldRadioButtonSquareSelected,
  LineCheck,
  LineDelete,
  LineRegenerate,
  LineSearch,
  LineUpload,
} from '@ui/Icons';
import {FieldErrors, useForm} from 'react-hook-form';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {
  ExploreSortType,
  MediaState,
  OperatorAuthorityType,
  ProfileInfo,
  ProfileSimpleInfo,
  ProfileTabType,
  ProfileType,
  SearchProfileReq,
  SearchProfileType,
  sendSearchProfileReq,
} from '@/app/NetWork/ProfileNetwork';
import {DragStatusType, TagDrawerType} from '../../profile/update/[[...id]]/page';
import cx from 'classnames';
import {Swiper, SwiperSlide} from 'swiper/react';
import {debounce, Drawer} from '@mui/material';
import DrawerPostCountry from '@/app/view/main/content/create/common/DrawerPostCountry';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import OperatorInviteDrawer from '@/app/view/main/content/create/common/DrawerOperatorInvite';
import {getBackUrl, getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {
  ChannelInfo,
  CreateChannelReq,
  createUpdateChannel,
  getChannelInfo,
  sendSearchChannel,
} from '@/app/NetWork/ChannelNetwork';
import {profile} from 'console';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {PaymentType, Subscription, VisibilityType} from '@/redux-store/slices/StoryInfo';
import {on} from 'events';
import DrawerMembershipSetting from '@/app/view/main/content/create/common/DrawerMembershipSetting';
type Props = {
  id: number;
  isUpdate: boolean;
};

type FileType = {
  fileName?: string;
  index?: number;
  file: string;
  fileBlob?: Blob;
};

type DataProfileUpdateType = {
  idChannel: number;
  thumbnail: FileType | null;
  dragStatus: DragStatusType;
  indexTab: number;
  dataVisibility: TagDrawerType;
  dataTag: TagDrawerType;
  dataCharacterSearch: DrawerCharacterSearchType;
  dataCountry: {
    isOpenDrawer: boolean;
    tagList: string[];
    isAll: boolean;
  };
  dataOperatorInvitation: {
    isOpenDrawer: boolean;
    inviteSearchValue: string;
    operatorProfileIdList: ProfileSimpleInfo[];
  };
};

interface ChannelInfoForm extends Omit<ChannelInfo, 'id' | 'isMonetization' | 'nsfw'> {
  isMonetization: number;
  nsfw: number;
}

const CreateChannel = ({id, isUpdate}: Props) => {
  const router = useRouter();
  const [data, setData] = useState<DataProfileUpdateType>({
    idChannel: 0,
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    indexTab: 0,
    dataVisibility: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Private'},
        {isActive: false, value: 'Unlisted'},
        {isActive: false, value: 'Public'},
      ],
      drawerTitle: 'Visibility',
      drawerDescription: '',
    },
    dataTag: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Male'},
        {isActive: false, value: 'Female'},
        {isActive: false, value: 'Boyfriend'},
        {isActive: false, value: 'Girlfriend'},
        {isActive: false, value: 'Hero'},
        {isActive: false, value: 'Elf'},
        {isActive: false, value: 'Romance'},
        {isActive: false, value: 'Vanilla'},
        {isActive: false, value: 'Contemporary Fantasy'},
        {isActive: false, value: 'Isekai'},
        {isActive: false, value: 'Flirting'},
        {isActive: false, value: 'Dislike'},
        {isActive: false, value: 'Comedy'},
        {isActive: false, value: 'Noir'},
        {isActive: false, value: 'Horror'},
        {isActive: false, value: 'Demon'},
        {isActive: false, value: 'SF'},
        {isActive: false, value: 'Vampire'},
        {isActive: false, value: 'Office'},
        {isActive: false, value: 'Monster'},
        {isActive: false, value: 'Anime'},
        {isActive: false, value: 'Books'},
        {isActive: false, value: 'Aliens'},
      ],
      drawerTitle: 'Tag',
      drawerDescription: '',
    },
    dataCountry: {
      isOpenDrawer: false,
      tagList: [],
      isAll: false,
    },
    dataOperatorInvitation: {
      isOpenDrawer: false,
      inviteSearchValue: '',
      operatorProfileIdList: [],
    },
    dataCharacterSearch: {
      open: false,
      title: 'Character',
      description: '',
      profileList: [],
      onClose: () => {},
      onChange: (profileList: {isActive: boolean; profileSimpleInfo: ProfileSimpleInfo}[]) => {},
    },
  });

  const {
    control,
    setValue,
    register,
    handleSubmit,
    getValues,
    watch,
    unregister,
    trigger,
    reset,
    clearErrors,
    setFocus,
    formState: {errors, isSubmitted},
  } = useForm<ChannelInfoForm>({
    shouldFocusError: true,
    defaultValues: {
      isMonetization: 0,
      mediaUrl: '',
    },
  });

  useEffect(() => {
    if (!isUpdate) return;
    if (id <= 0) return;
    refreshChannelInfo(id);
  }, [isUpdate, id]);

  const refreshChannelInfo = async (id: number) => {
    const res = await getChannelInfo({channelProfileId: id});
    const channelInfo = res?.data?.channelInfo;
    if (!channelInfo) return;

    data.idChannel = res?.data?.channelInfo?.id || 0;

    let tag = channelInfo?.tags || [];
    tag = tag.filter(v => !!v && v != '');
    let isMonetization = 0;
    let nsfw = 0;
    const channelInfoForm: ChannelInfoForm = {...channelInfo, tags: tag, isMonetization, nsfw};

    data.thumbnail = {file: channelInfo.mediaUrl || ''};

    setValue('tags', []);
    for (let i = 0; i < data.dataTag.tagList.length; i++) {
      // const interest = res?.data?.interests[i]
      const tagValue = data.dataTag.tagList[i].value;
      const index = tag.findIndex(v => v == tagValue);
      if (index >= 0) {
        data.dataTag.tagList[index].isActive = true;
        setValue(`tags.${index}`, tagValue, {shouldValidate: false});
      }
    }

    setValue('postCountry', []);
    data.dataCountry.tagList = [];
    for (let i = 0; i < channelInfo.postCountry.length; i++) {
      // const interest = res?.data?.interests[i]
      const value = channelInfo.postCountry[i];
      data.dataCountry.tagList.push(value);
      setValue(`postCountry.${i}`, value, {shouldValidate: false});
    }

    const memberList: {isActive: boolean; isOriginal: boolean; profileSimpleInfo: ProfileSimpleInfo}[] =
      res.data?.channelInfo.memberProfileIdList?.map(v => ({
        isActive: true,
        isOriginal: true,
        profileSimpleInfo: v,
      })) || [];
    data.dataCharacterSearch.profileList = memberList;

    reset(channelInfoForm, {}); //한번에 form 값 초기화
    setTimeout(() => {
      setValue('isMonetization', Number(channelInfo.isMonetization));
      setValue('nsfw', Number(channelInfo.nsfw));
      setValue('characterIP', channelInfo.characterIP);
    }, 1);
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
        setValue('mediaUrl', data.thumbnail.file);
        setData({...data});
      }
    }
  };

  const routerBack = () => {
    // you can get the prevPath like this
    const prevPath = getBackUrl();
    if (!prevPath || prevPath == '') {
      router.replace(getLocalizedLink('/main/homefeed'));
    } else {
      router.replace(prevPath);
    }
  };
  const onSubmit = async (dataForm: ChannelInfoForm) => {
    console.log('data : ', data);
    // e.preventDefault(); // 기본 제출 방지
    // const data = getValues(); // 현재 입력값 가져오기 (검증 없음)
    let tag = dataForm?.tags;

    const idChannel = isUpdate ? data.idChannel : 0;
    let isMonetization = Boolean(Number(dataForm.isMonetization));
    let nsfw = Boolean(Number(dataForm.nsfw));
    let characterIP = Number(dataForm.characterIP);
    const dataUpdatePdInfo: CreateChannelReq = {
      languageType: getCurrentLanguage(),
      channelInfo: {...dataForm, id: idChannel, tags: tag, isMonetization, nsfw, characterIP},
    };
    const res = await createUpdateChannel(dataUpdatePdInfo);
    if (res?.resultCode == 0) {
      routerBack();
    }
  };

  const forceTypeBoolean = (value: string | null | boolean): boolean | null => {
    return typeof value === 'boolean' ? value : value === 'true' ? true : value === 'false' ? false : null;
  };

  const keys = Object.keys(VisibilityType).filter(key => isNaN(Number(key)));
  const visibilityType = getValues('visibilityType');
  const visibilityTypeStr = keys[visibilityType];

  const countMembers = data.dataCharacterSearch.profileList.length;

  const onError = (errors: FieldErrors<ChannelInfoForm>) => {
    console.log('errors : ', errors);
    if (!errors) {
      return;
    }

    if (errors.name || errors.description) {
      data.indexTab = 0;
      setData({...data});
    } else if (errors.visibilityType || errors.tags || errors.postCountry) {
      data.indexTab = 2;
      setData({...data});
    }

    if (errors.mediaUrl) {
      setFocus('mediaUrl');
      return;
    }
    if (errors.name) {
      setFocus('name');
      return;
    }
    if (errors.description) {
      setFocus('description');
      return;
    }
    if (errors.visibilityType) {
      setFocus('visibilityType');
      return;
    }
    if (errors.tags) {
      setFocus('tags');
      return;
    }
    if (errors.postCountry) {
      setFocus('postCountry');
      return;
    }
  };

  return (
    <>
      <header className={styles.header}>
        <img className={styles.btnBack} src={BoldArrowLeft.src} alt="" onClick={routerBack} />
        <div className={styles.title}>{isUpdate ? 'Edit' : 'Create Channel'}</div>
      </header>
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className={styles.label}>Thumbnail (Photo/Video)</div>
          <section className={styles.uploadThumbnailSection}>
            <label className={styles.uploadBtn} htmlFor="file-upload">
              <input type={'hidden'} {...register('mediaUrl', {required: true})} />
              <input
                className={styles.hidden}
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={onUploadClicked}
              />
              {!data.thumbnail?.file && (
                <div
                  className={cx(styles.uploadWrap, errors.mediaUrl && styles.error)}
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

          <section className={styles.tabSection}>
            <div className={styles.tabHeaderContainer}>
              <div className={styles.tabHeaderWrap}>
                <div
                  className={styles.tabHeader}
                  onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    const target = e.target as HTMLElement;
                    const category = target.closest('[data-tab]')?.getAttribute('data-tab');
                    if (category) {
                      data.indexTab = parseInt(category);
                    }
                    setData({...data});
                  }}
                >
                  <div className={styles.tabItem} data-tab={0}>
                    <div className={cx(styles.labelTab, data.indexTab == 0 && styles.active)}>Basic</div>
                  </div>
                  <div className={styles.tabItem} data-tab={1}>
                    <div className={cx(styles.labelTab, data.indexTab == 1 && styles.active)}>Members</div>
                  </div>
                  <div className={styles.tabItem} data-tab={2}>
                    <div className={cx(styles.labelTab, data.indexTab == 2 && styles.active)}>Policy</div>
                  </div>
                </div>
                <div className={styles.line}></div>
              </div>
            </div>

            <div className={styles.tabContent}>
              <section className={cx(styles.channelSection, data.indexTab == 0 && styles.active)}>
                <div className={styles.label}>Channel name</div>
                <input
                  {...register('name', {required: true})}
                  className={cx(errors.name && isSubmitted && styles.error)}
                  type="text"
                  placeholder="Please enter a title for your post"
                  onChange={e => {
                    clearErrors('name');
                    setValue('name', e.target.value);
                  }}
                />

                <div className={styles.label}>Channel description</div>
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
              </section>
              <section className={cx(styles.membersSection, data.indexTab == 1 && styles.active)}>
                <div
                  className={styles.addBtnWrap}
                  onClick={() => {
                    data.dataCharacterSearch.open = true;
                    setData({...data});
                  }}
                >
                  <div className={styles.circle}>
                    <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                  </div>
                  <div className={styles.labelAdd}>
                    Character
                    <br />
                    name
                  </div>
                </div>
                <div className={styles.label}>{countMembers} Members</div>

                <ul className={styles.memberList}>
                  {data.dataCharacterSearch.profileList.map((one, index) => {
                    return (
                      <>
                        <li key={one.profileSimpleInfo.profileId} className={styles.memberWrap}>
                          <div className={styles.left}>
                            <img className={styles.thumbnail} src={one.profileSimpleInfo.iconImageUrl} alt="" />
                            <div className={styles.info}>
                              <div className={styles.name}>{one.profileSimpleInfo.name}</div>
                              <div className={styles.description}>{one.profileSimpleInfo.name}</div>
                            </div>
                            <div className={styles.nsfwWrap}>
                              <div className={styles.nsfw}>18</div>
                            </div>
                          </div>
                          <div
                            className={styles.right}
                            onClick={() => {
                              const profileList = data.dataCharacterSearch.profileList.filter(
                                v => v.profileSimpleInfo.profileId != one.profileSimpleInfo.profileId,
                              );
                              data.dataCharacterSearch.profileList = profileList;
                              setData({...data});
                            }}
                          >
                            <img src={LineDelete.src} alt="" />
                          </div>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </section>
              <section className={cx(styles.policySection, data.indexTab == 2 && styles.active)}>
                <div className={styles.label}>Visibility</div>
                <div
                  className={cx(styles.selectWrap, errors.visibilityType && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataVisibility.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                >
                  <input {...register('visibilityType', {required: true})} type="hidden" />
                  {!visibilityTypeStr && <div className={styles.placeholder}>Select</div>}
                  {visibilityTypeStr && <div className={styles.value}>{visibilityTypeStr}</div>}
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
                </div>
                <div className={styles.label}>Tag</div>
                <div
                  className={cx(styles.selectWrap, errors.tags && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataTag.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                >
                  <input type="hidden" {...register('tags')} />
                  <div className={styles.placeholder}>Select</div>
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
                </div>
                <div className={styles.tagWrap}>
                  {!watch('tags') && <input type="hidden" {...register(`tags`, {required: true})} />}

                  {data.dataTag.tagList.map((one, index) => {
                    if (!one.isActive) return;

                    return (
                      <div className={styles.tag} key={index}>
                        <div className={styles.value}>
                          <input value={one.value} type="hidden" {...register(`tags.${index}`, {required: true})} />
                          {one.value}
                        </div>
                        <div
                          className={styles.btnRemoveWrap}
                          onClick={e => {
                            unregister(`tags.${index}`);
                            data.dataTag.tagList[index].isActive = false;
                            setData({...data});
                          }}
                        >
                          <img src={'/ui/profile/update/icon_remove.svg'} alt="" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.label}>Post country</div>
                <div
                  className={cx(styles.selectWrap, errors.postCountry && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataCountry.isOpenDrawer = true;
                    setData({...data});
                  }}
                >
                  <div className={styles.placeholder}>Select</div>
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
                </div>
                <div className={styles.tagWrap}>
                  {!watch('postCountry') && <input type="hidden" {...register(`postCountry`, {required: true})} />}

                  {data.dataCountry.tagList.map((one, index) => {
                    const keys = Object.keys(LanguageType).filter(key => isNaN(Number(key)));
                    const countryStr = keys[Number(one)];

                    return (
                      <div className={styles.tag} key={index}>
                        <div className={styles.value}>
                          <input value={one} type="hidden" {...register(`postCountry.${index}`, {required: true})} />
                          {countryStr}
                        </div>
                        <div
                          className={styles.btnRemoveWrap}
                          onClick={e => {
                            unregister(`postCountry.${index}`);
                            data.dataCountry.tagList = data.dataCountry.tagList.filter(v => v != one);
                            setData({...data});
                          }}
                        >
                          <img src={'/ui/profile/update/icon_remove.svg'} alt="" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.operatorInvitationHeader}>
                  <div className={styles.left}>
                    <div className={styles.label}>Operator Invitation</div>
                    <CustomToolTip tooltipText="NSFW Monetization" />
                  </div>
                  <div
                    className={styles.right}
                    onClick={() => {
                      data.dataOperatorInvitation.isOpenDrawer = true;
                      setData({...data});
                    }}
                  >
                    Invite
                  </div>
                </div>
                <ul className={styles.operatorInvitationList}>
                  {data.dataOperatorInvitation.operatorProfileIdList.map((one, index) => {
                    const keys = Object.keys(OperatorAuthorityType).filter(key => isNaN(Number(key)));
                    return (
                      <li key={one.profileId} className={styles.operatorInviation}>
                        <div className={styles.left}>
                          <img src={one.iconImageUrl} alt="" />
                          <div className={styles.name}>{one.name}</div>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.authority}>{keys[one.operatorAuthorityType]}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>Channel IP</div>
                  <CustomToolTip tooltipText="Channel IP" />
                </div>
                <div className={cx(styles.channelIP, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input
                        type="radio"
                        value={0}
                        checked={watch('characterIP', 0) == 0}
                        {...register('characterIP')}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Original</div>
                      </div>
                    </label>
                    <div className={styles.right}>Monetization possible</div>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={watch('characterIP', 0) == 1}
                        {...register('characterIP')}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Fan</div>
                      </div>
                    </label>
                    <div className={styles.right}>Monetization possible</div>
                  </div>
                </div>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>Monetization</div>
                  <CustomToolTip tooltipText="Channel IP" />
                </div>

                <div className={styles.membershipPlan}>
                  <div className={styles.labelSuper}>Membership Plan</div>
                  <div
                    className={styles.right}
                    onClick={() => {
                      // data.dataMembershipPlan.isOpenDrawer = true;
                      // setData({...data});
                    }}
                  >
                    Setting
                  </div>
                </div>
                <div className={cx(styles.monetization, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={watch('isMonetization', 0) == 1}
                        {...register('isMonetization')}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>On</div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input
                        type="radio"
                        value={0}
                        checked={watch('isMonetization', 0) == 0}
                        {...register('isMonetization')}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Off</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={cx(styles.labelWrap, styles.nsfw)}>
                  <div className={styles.label}>
                    NSFW <span className={styles.highlight}>*</span>
                  </div>
                  <CustomToolTip tooltipText="NSFW" />
                </div>
                <div className={cx(styles.monetization, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" value={1} checked={watch('nsfw', 0) == 1} {...register('nsfw')} />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>On</div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" value={0} checked={watch('nsfw', 0) == 0} {...register('nsfw')} />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Off</div>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <button type="submit" className={styles.submitBtn}>
            {isUpdate ? 'Submit' : 'Publish'}
          </button>
        </form>
      </main>
      <footer></footer>

      <DrawerSelect
        title={data.dataVisibility.drawerTitle}
        description={data.dataVisibility.drawerDescription}
        tags={JSON.parse(JSON.stringify(data.dataVisibility.tagList))}
        open={data.dataVisibility.isOpenTagsDrawer}
        onClose={() => {
          data.dataVisibility.isOpenTagsDrawer = false;
          setData({...data});
        }}
        onChange={(dataChanged: {isActive: boolean; value: string}[]) => {
          clearErrors('visibilityType');
          data.dataVisibility.isOpenTagsDrawer = false;
          data.dataVisibility.tagList = dataChanged;

          const index = dataChanged.findIndex(v => v.isActive);
          setValue('visibilityType', index);
          setData({...data});
        }}
      />

      <DrawerMultipleTags
        title={data.dataTag.drawerTitle}
        description={data.dataTag.drawerDescription}
        tags={JSON.parse(JSON.stringify(data.dataTag.tagList))}
        open={data.dataTag.isOpenTagsDrawer}
        onClose={() => {
          data.dataTag.isOpenTagsDrawer = false;
          setData({...data});
        }}
        onChange={(dataChanged: any) => {
          clearErrors('tags');
          data.dataTag.tagList = dataChanged;

          for (let i = 0; i < dataChanged.length; i++) {
            if (!dataChanged[i].isActive) {
              unregister(`tags.${i}`);
            } else {
              setValue(`tags.${i}`, dataChanged[i].value, {shouldValidate: false});
            }
          }
          setData({...data});
        }}
      />

      <DrawerPostCountry
        isOpen={data.dataCountry.isOpenDrawer}
        onClose={() => {
          data.dataCountry.isOpenDrawer = false;
          setData({...data});
        }}
        selectableCountryList={Object.values(LanguageType).filter(value => typeof value === 'number') as LanguageType[]}
        postCountryList={data.dataCountry.tagList.map(v => Number(v))}
        onUpdatePostCountry={(updatedList: LanguageType[]) => {
          clearErrors('postCountry');
          data.dataCountry.tagList = updatedList.map(v => v.toString());

          unregister(`postCountry`);
          for (let i = 0; i < updatedList.length; i++) {
            setValue(`postCountry.${i}`, updatedList[i].toString(), {shouldValidate: false});
          }
          setData({...data});
        }}
        isAll={data.dataCountry.isAll}
        setIsAll={(checked: boolean) => {
          data.dataCountry.isAll = checked;
          setData({...data});
        }}
      />
      <OperatorInviteDrawer
        isOpen={data.dataOperatorInvitation.isOpenDrawer}
        onClose={() => {
          data.dataOperatorInvitation.isOpenDrawer = false;
          setData({...data});
        }}
        inviteSearchValue={data.dataOperatorInvitation.inviteSearchValue}
        operatorList={data.dataOperatorInvitation.operatorProfileIdList}
        onUpdateOperatorList={(updatedList: ProfileSimpleInfo[]) => {
          data.dataOperatorInvitation.operatorProfileIdList = updatedList;
          if (updatedList.length == 0) {
            unregister(`operatorInvitationProfileIdList`);
          } else {
            setValue('operatorInvitationProfileIdList', updatedList);
          }
          setData({...data});
        }}
        setInviteSearchValue={searchValue => {
          data.dataOperatorInvitation.inviteSearchValue = searchValue;
          setData({...data});
        }}
      />

      <DrawerCharacterSearch
        title={data.dataCharacterSearch.title}
        description={data.dataCharacterSearch.description}
        profileList={JSON.parse(JSON.stringify(data.dataCharacterSearch.profileList))}
        open={data.dataCharacterSearch.open}
        onClose={() => {
          data.dataCharacterSearch.open = false;
          setData({...data});
        }}
        onChange={(dataChanged: {isActive: boolean; isOriginal: boolean; profileSimpleInfo: ProfileSimpleInfo}[]) => {
          clearErrors('memberProfileIdList');
          data.dataCharacterSearch.profileList = dataChanged;
          unregister(`memberProfileIdList`);

          for (let i = 0; i < dataChanged.length; i++) {
            setValue(`memberProfileIdList.${i}`, dataChanged[i].profileSimpleInfo, {shouldValidate: false});
          }
          setData({...data});
        }}
      />

      <DrawerMembershipSetting
        membershipSetting={{
          benefits: '123123123',
          paymentAmount: 50000,
          paymentType: PaymentType.Korea,
          subscription: Subscription.Contents,
        }}
        onClose={() => {}}
        onMembershipSettingChange={dataChanged => {
          console.log('dataChanged : ', dataChanged);
        }}
      />
    </>
  );
};

export default CreateChannel;

export type DrawerSelectType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerSelect = ({title, description, tags, open, onClose, onChange}: DrawerSelectType) => {
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
        className: `${styles.drawer} ${styles.drawerSelect}`,
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
      <div className={cx(styles.titleWrap, styles.drawalSelectHeader)}>
        <div className={styles.blank}></div>
        <div className={styles.title}>{title}</div>
        <CustomToolTip tooltipText="Channel IP" />
      </div>
      <div className={cx(styles.drawalSelectContent)}>
        <div
          className={styles.tagWrap}
          onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement;
            const index = parseInt(target.closest('[data-tag]')?.getAttribute('data-tag') || '-1');
            if (index >= 0) {
              for (let i = 0; i < data.tagList.length; i++) {
                data.tagList[i].isActive = false;
              }
              data.tagList[index].isActive = true;
              setData({...data});
              onChange(data.tagList);
            }
          }}
        >
          {data.tagList.map((tag, index) => {
            return (
              <div className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{tag.value}</div>
                <div className={styles.iconCheckWrap}>{tag.isActive && <img src={LineCheck.src} alt="" />}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};

export type DrawerMultipleTagsType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerMultipleTags = ({title, description, tags, open, onClose, onChange}: DrawerSelectType) => {
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
        className: cx(styles.drawer, styles.drawerMultipleTags),
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
      <div className={cx(styles.handleContent, styles.drawerMultipleTags)}>
        <div
          className={styles.refreshWrap}
          onClick={() => {
            const dataReset = tags.map(v => ({...v, isActive: false}));
            data.tagList = dataReset;
            setData({...data});
            // onChange(dataReset);
          }}
        >
          <div className={styles.labelRefresh}>Refresh</div>
          <img src={LineRegenerate.src} alt="" />
        </div>
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

export type DrawerCharacterSearchType = {
  title: string;
  description: string;
  profileList: {isActive: boolean; isOriginal: boolean; profileSimpleInfo: ProfileSimpleInfo}[];
  open: boolean;
  onClose: () => void;
  onChange: (profileList: {isActive: boolean; isOriginal: boolean; profileSimpleInfo: ProfileSimpleInfo}[]) => void;
};
export const DrawerCharacterSearch = ({
  title,
  description,
  profileList,
  open,
  onClose,
  onChange,
}: DrawerCharacterSearchType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<{
    profileListSaved: {
      isActive: boolean;
      isOriginal: boolean;
      profileSimpleInfo: ProfileSimpleInfo;
    }[];
    profileList: {
      isActive: boolean;
      isOriginal: boolean;
      profileSimpleInfo: ProfileSimpleInfo;
    }[];
    indexSort: number;
  }>({
    profileListSaved: [],
    profileList: [],
    indexSort: 0,
  });

  useEffect(() => {
    if (!open) return;

    data.profileList = profileList;
    for (let i = 0; i < data.profileList.length; i++) {
      data.profileList[i].isOriginal = true;
    }
    data.profileListSaved = JSON.parse(JSON.stringify(data.profileList));
    setData({...data});
  }, [open]);

  const sortOptionList = [
    {id: ExploreSortType.Newest, value: 'Newest'},
    {id: ExploreSortType.MostPopular, value: 'Most Popular'},
    {id: ExploreSortType.WeeklyPopular, value: 'Weekly Popular'},
    {id: ExploreSortType.MonthPopular, value: 'Monthly Popular'},
  ];

  const SelectBoxArrowComponent = useCallback(
    () => <img className={styles.icon} src={BoldAltArrowDown.src} alt="altArrowDown" />,
    [],
  );
  const SelectBoxValueComponent = useCallback((data: any) => {
    return (
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
    );
  }, []);
  const SelectBoxOptionComponent = useCallback(
    (data: any, isSelected: boolean) => (
      <>
        <div className={styles.optionWrap}>
          <div key={data.id} className={styles.labelOption}>
            {data.value}
          </div>
          {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
        </div>
      </>
    ),
    [],
  );
  const saveProfileList = () => {
    const searchProfileListActived = data.profileList.filter(v => v.isActive);

    const mergedList = [...searchProfileListActived, ...data.profileListSaved];
    const uniqueList = Array.from(new Map(mergedList.map(item => [item.profileSimpleInfo.profileId, item])).values());
    data.profileList = uniqueList;
    data.profileListSaved = uniqueList;
    setData({...data});
  };

  const fetchResults = useCallback(
    debounce(async searchValue => {
      if (searchValue == '') {
        saveProfileList();
        return;
      }

      data.profileListSaved = data.profileListSaved.filter(v => v.isActive);

      // 여기에서 API 호출하면 됨
      const payload: SearchProfileReq = {
        search: searchValue,
      };

      try {
        const response = await sendSearchChannel(payload);
        const searchProfileList =
          response?.data?.memberProfileList?.map(v => ({
            isActive: false,
            isOriginal: false,
            profileSimpleInfo: v,
          })) || [];

        const searchProfileListModified = searchProfileList.map(searchProfile => {
          const matchedProfile = data.profileListSaved.find(
            profile => profile.profileSimpleInfo.profileId === searchProfile.profileSimpleInfo.profileId,
          );

          return matchedProfile
            ? {...searchProfile, isActive: matchedProfile.isActive, isOriginal: matchedProfile.isOriginal}
            : searchProfile;
        });

        data.profileList = searchProfileListModified;
        setData({...data});
      } catch (err) {
        alert('error ' + 'sendSearchProfile 에러');
      }
    }, 400),
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setQuery(e.target.value);
    fetchResults(e.target.value);
  };

  const countSelected = data.profileList.filter(v => v.isActive).length;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => onClose()}
      PaperProps={{
        className: `${styles.drawer} ${styles.drawerSearchCharacter}`,
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
      <div className={cx(styles.content)}>
        <div className={styles.searchWrap}>
          <img className={styles.iconSearch} src={LineSearch.src} alt="" />
          <input ref={inputRef} placeholder="Search" onChange={handleChange} />
        </div>
        <div className={styles.filterWrap}>
          <div className={styles.left}>
            <label htmlFor="all">
              <input
                type="checkbox"
                name="all"
                id="all"
                onChange={e => {
                  let profileList = [];
                  if (e.target.value) {
                    profileList = data.profileList.map(v => (v.isOriginal ? v : {...v, isActive: true}));
                  } else {
                    profileList = data.profileList.map(v => (v.isOriginal ? v : {...v, isActive: true}));
                  }
                  data.profileList = profileList;
                  setData({...data});
                }}
              />
              <img src={BoldRadioButtonSquareSelected.src} alt="" className={styles.iconOn} />
              <img src={BoldRadioButtonSquare.src} alt="" className={styles.iconOff} />
              <div className={styles.labelAll}>All</div>
            </label>
          </div>
          <div className={styles.right}>
            <SelectBox
              value={sortOptionList[data.indexSort]}
              options={sortOptionList}
              ArrowComponent={SelectBoxArrowComponent}
              ValueComponent={SelectBoxValueComponent}
              OptionComponent={SelectBoxOptionComponent}
              onChange={async id => {
                data.indexSort = id;
                setData({...data});
              }}
              customStyles={{
                control: {
                  width: '184px',
                  display: 'flex',
                  gap: '10px',
                },
                menuList: {
                  borderRadius: '10px',
                  boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                },
                option: {
                  padding: '11px 14px',
                  boxSizing: 'border-box',
                  '&:first-of-type': {
                    borderTop: 'none', // 첫 번째 옵션에는 border 제거
                  },
                  borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                },
              }}
            />
          </div>
        </div>
        <div className={styles.countSelected}>Selected {countSelected}</div>
        <ul className={styles.memberList}>
          {data.profileList.map((profile, index) => {
            return (
              <li key={profile.profileSimpleInfo.profileId} className={styles.memberWrap}>
                <label htmlFor={`profile_${profile.profileSimpleInfo.profileId}`}>
                  <div className={styles.left}>
                    <div className={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        name={`profile_${profile.profileSimpleInfo.profileId}`}
                        id={`profile_${profile.profileSimpleInfo.profileId}`}
                        defaultChecked={profile.isActive}
                        onClick={e => {
                          const target = e.target as HTMLInputElement;
                          if (profile.isOriginal) {
                            e.preventDefault();
                          }
                          profile.isActive = target.checked;
                          setData({...data});
                        }}
                      />
                      <img src={BoldRadioButtonSquareSelected.src} alt="" className={styles.iconOn} />
                      <img src={BoldRadioButtonSquare.src} alt="" className={styles.iconOff} />
                    </div>

                    <img className={styles.thumbnail} src={profile.profileSimpleInfo.iconImageUrl} alt="" />
                    <div className={styles.info}>
                      <div className={styles.name}>{profile.profileSimpleInfo.name}</div>
                      <div className={styles.description}>{profile.profileSimpleInfo.name}</div>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.nsfw}>18</div>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.submitWrap}>
        <button
          className={styles.cancelBtn}
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
        <button
          className={styles.confirmBtn}
          onClick={() => {
            saveProfileList();
            onChange(data.profileList);
            onClose();
          }}
        >
          Confirm
        </button>
      </div>
    </Drawer>
  );
};
