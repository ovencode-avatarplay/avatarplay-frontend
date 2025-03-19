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
import {debounce, Dialog, Drawer} from '@mui/material';
import DrawerPostCountry from '@/app/view/main/content/create/common/DrawerPostCountry';
import {LanguageType, MembershipSetting} from '@/app/NetWork/network-interface/CommonEnums';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import OperatorInviteDrawer from '@/app/view/main/content/create/common/DrawerOperatorInvite';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
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

import {on} from 'events';
import DrawerMembershipSetting from '@/app/view/main/content/create/common/DrawerMembershipSetting';
import CustomSelector from '@/components/layout/shared/CustomSelector';
import {PaymentType, Subscription, VisibilityType} from '@/app/NetWork/network-interface/CommonEnums';
import useCustomRouter from '@/utils/useCustomRouter';
import parse from 'html-react-parser';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import getLocalizedText from '@/utils/getLocalizedText';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';

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

  dataPopupRemove: {
    isOpen: boolean;
    title: React.ReactNode;
    description: string;
    idProfile: number;
  };

  dataPopupComplete: {
    isOpen: boolean;
    title: string;
  };
};

interface ChannelInfoForm extends Omit<ChannelInfo, 'id' | 'isMonetization' | 'nsfw'> {
  isMonetization: number;
  nsfw: number;
}

const CreateChannel = ({id, isUpdate}: Props) => {
  const {back} = useCustomRouter();
  const router = useRouter();
  const [data, setData] = useState<DataProfileUpdateType>({
    idChannel: 0,
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    indexTab: 0,
    dataVisibility: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: true, value: 'Private'},
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

    dataPopupRemove: {
      isOpen: false,
      title: parse('Remove from<br/>“Channel name”'),
      description: 'Once removed, this character will no longer be affiliated with the channel. Do you want to Remove?',
      idProfile: 0,
    },

    dataPopupComplete: {
      isOpen: false,
      title: '채널 생성 완료',
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
      characterIP: CharacterIP.Original,
      isMonetization: 0,
      mediaUrl: '',
      membershipSetting: {
        benefits: '',
        paymentAmount: 0,
        paymentType: PaymentType.Korea,
        subscription: Subscription.Contents,
      },
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

    const membershipSetting: MembershipSetting = {
      benefits: channelInfo.membershipSetting?.benefits || '',
      paymentAmount: channelInfo.membershipSetting?.paymentAmount || 50000,
      paymentType: channelInfo.membershipSetting?.paymentType || PaymentType.Korea,
      subscription: channelInfo.membershipSetting?.subscription || Subscription.Contents,
    };
    const channelInfoForm: ChannelInfoForm = {...channelInfo, tags: tag, isMonetization, nsfw, membershipSetting};

    data.thumbnail = {file: channelInfo.mediaUrl || ''};

    setValue('tags', []);
    for (let i = 0; i < data.dataTag.tagList.length; i++) {
      // const interest = res?.data?.interests[i]
      const tagValue = data.dataTag.tagList[i].value;
      const index = tag.findIndex(v => v == tagValue);
      if (index >= 0) {
        data.dataTag.tagList[index].isActive = true;
      }
    }
    const tags = data.dataTag.tagList.filter(v => v.isActive).map(v => v.value);
    setValue('tags', tags);

    setValue('postCountry', []);
    data.dataCountry.tagList = [];
    for (let i = 0; i < channelInfo.postCountry.length; i++) {
      // const interest = res?.data?.interests[i]
      const value = channelInfo.postCountry[i];
      data.dataCountry.tagList.push(value);
      setValue(`postCountry.${i}`, value, {shouldValidate: false});
    }
    setValue(`postCountry`, data.dataCountry.tagList, {shouldValidate: false});

    const memberList: {isActive: boolean; isOriginal: boolean; profileSimpleInfo: ProfileSimpleInfo}[] =
      res.data?.channelInfo.memberProfileIdList?.map(v => ({
        isActive: true,
        isOriginal: true,
        profileSimpleInfo: v,
      })) || [];
    data.dataCharacterSearch.profileList = memberList;

    data.dataOperatorInvitation.operatorProfileIdList = channelInfo.operatorInvitationProfileIdList;

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
    back('/main/homefeed');
  };
  const onSubmit = async (dataForm: ChannelInfoForm) => {
    console.log('dataForm : ', dataForm);
    // e.preventDefault(); // 기본 제출 방지
    // const data = getValues(); // 현재 입력값 가져오기 (검증 없음)
    let tag = dataForm?.tags;

    const idChannel = isUpdate ? data.idChannel : 0;
    const visibilityType = Number(dataForm.visibilityType);
    let isMonetization = Boolean(Number(dataForm.isMonetization));
    let nsfw = Boolean(Number(dataForm.nsfw));
    let characterIP = Number(dataForm.characterIP);
    const membershipSetting = isMonetization ? dataForm.membershipSetting : undefined;
    const dataUpdatePdInfo: CreateChannelReq = {
      languageType: getCurrentLanguage(),
      channelInfo: {
        ...dataForm,
        id: idChannel,
        tags: tag,
        isMonetization,
        nsfw,
        characterIP,
        membershipSetting,
        visibilityType,
      },
    };
    const res = await createUpdateChannel(dataUpdatePdInfo);
    if (res?.resultCode == 0) {
      data.dataPopupComplete.isOpen = true;
      data.dataPopupComplete.title = isUpdate ? '채널 수정 완료' : '채널 생성 완료';
      setData({...data});
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

    if (errors.mediaUrl) {
      setFocus('mediaUrl');
      return;
    }

    if (errors.name || errors.description) {
      data.indexTab = 0;
      setData({...data});
    } else if (errors.visibilityType || errors.tags || errors.postCountry) {
      data.indexTab = 2;
      setData({...data});
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
              <input className={styles.hide} autoComplete="off" {...register('mediaUrl', {required: true})} />
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
                <div className={styles.label}>
                  Channel name <span className={styles.highlight}>*</span>
                </div>
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

                <div className={styles.label}>
                  Channel description <span className={styles.highlight}>*</span>
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
                              <div className={styles.description}>{one.profileSimpleInfo.description}</div>
                            </div>
                            {one.profileSimpleInfo.nsfw && (
                              <div className={styles.nsfwWrap}>
                                <div className={styles.nsfw}>18</div>
                              </div>
                            )}
                          </div>
                          <div
                            className={styles.right}
                            onClick={() => {
                              data.dataPopupRemove.idProfile = one.profileSimpleInfo.profileId;
                              data.dataPopupRemove.isOpen = true;
                              data.dataPopupRemove.title = parse(`Remove from<br/>“${watch('name')}”`);
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
                <div className={styles.label}>
                  Visibility <span className={styles.highlight}>*</span>
                </div>
                <input
                  defaultValue={VisibilityType.Private}
                  {...register('visibilityType', {required: true})}
                  className={styles.hide}
                  autoComplete="off"
                />
                <CustomSelector
                  value={visibilityTypeStr}
                  error={errors.visibilityType && isSubmitted}
                  onClick={() => {
                    data.dataVisibility.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                />
                <div className={styles.label}>
                  Tag <span className={styles.highlight}>*</span>
                </div>
                <input
                  className={styles.hide}
                  autoComplete="off"
                  {...register(`tags`, {
                    required: true,
                    validate: {
                      array: value => (value?.length || 0) > 0,
                    },
                  })}
                />
                <CustomSelector
                  value={''}
                  error={errors.tags && isSubmitted}
                  onClick={() => {
                    data.dataTag.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                />
                <div className={styles.tagWrap}>
                  {data.dataTag.tagList.map((one, index) => {
                    if (!one.isActive) return;

                    return (
                      <div className={styles.tag} key={index}>
                        <div className={styles.value}>
                          {/* <input
                            value={one.value}
                            className={styles.hide}
                            autoComplete="off"
                            {...register(`tags.${index}`, {required: true})}
                          /> */}
                          {one.value}
                        </div>
                        <div
                          className={styles.btnRemoveWrap}
                          onClick={e => {
                            data.dataTag.tagList[index].isActive = false;
                            const tags = data.dataTag.tagList.filter(v => v.isActive).map(v => v.value);
                            setValue('tags', tags);
                            setData({...data});
                          }}
                        >
                          <img src={'/ui/profile/update/icon_remove.svg'} alt="" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.label}>
                  Post country <span className={styles.highlight}>*</span>
                </div>
                <CustomSelector
                  value={''}
                  error={errors.postCountry && isSubmitted}
                  onClick={() => {
                    data.dataCountry.isOpenDrawer = true;
                    setData({...data});
                  }}
                />
                <div className={styles.tagWrap}>
                  <input
                    className={styles.hide}
                    autoComplete="off"
                    {...register(`postCountry`, {
                      required: true,
                      validate: {
                        array: value => (value?.length || 0) > 0,
                      },
                    })}
                  />

                  {data.dataCountry.tagList.map((one, index) => {
                    const keys = Object.keys(LanguageType).filter(key => isNaN(Number(key)));
                    const countryStr = keys[Number(one)];

                    return (
                      <div className={styles.tag} key={index}>
                        <div className={styles.value}>
                          {/* <input
                            value={one}
                            className={styles.hide}
                            autoComplete="off"
                            {...register(`postCountry.${index}`, {required: true})}
                          /> */}
                          {countryStr}
                        </div>
                        <div
                          className={styles.btnRemoveWrap}
                          onClick={e => {
                            const postCountryList = data.dataCountry.tagList.filter(v => v != one);
                            data.dataCountry.tagList = postCountryList;
                            setValue('postCountry', postCountryList);
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
                        value={1}
                        defaultChecked
                        checked={watch('characterIP', 0) == 1}
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
                        value={2}
                        checked={watch('characterIP', 0) == 2}
                        {...register('characterIP')}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Fan</div>
                      </div>
                    </label>
                    {/* <div className={styles.right}>Monetization possible</div> */}
                  </div>
                </div>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>Monetization</div>
                  <CustomToolTip tooltipText="Channel IP" />
                </div>
                <div className={cx(styles.monetization, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={watch('isMonetization', 0) == 1}
                        {...register('isMonetization')}
                        onChange={e => {
                          // alert('ㅇㅎㅇㅎㅇ');
                          setValue('isMonetization', 1);
                        }}
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
                        onChange={e => {
                          // alert('ㅇㅎㅇㅎㅇ2');
                          setValue('isMonetization', 0);
                        }}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Off</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={styles.membershipPlan}>
                  <input
                    className={styles.hide}
                    autoComplete="off"
                    {...register('membershipSetting', {required: false})}
                  />

                  {watch('isMonetization') == 1 && (
                    <DrawerMembershipSetting
                      membershipSetting={{
                        benefits: watch('membershipSetting.benefits', ''),
                        paymentAmount: watch('membershipSetting.paymentAmount', 0),
                        paymentType: watch('membershipSetting.paymentType', PaymentType.USA),
                        subscription: watch('membershipSetting.subscription', Subscription.Contents),
                      }}
                      onClose={() => {}}
                      onMembershipSettingChange={dataChanged => {
                        console.log('dataChanged : ', dataChanged);
                        setValue('membershipSetting.benefits', dataChanged.benefits);
                        setValue('membershipSetting.paymentAmount', dataChanged.paymentAmount);
                        setValue('membershipSetting.paymentType', dataChanged.paymentType);
                        setValue('membershipSetting.subscription', dataChanged.subscription);
                      }}
                    />
                  )}
                  {/* <div className={styles.labelSuper}>Membership Plan</div>
                  <div
                    className={styles.right}
                    onClick={() => {
                      // data.dataMembershipPlan.isOpenDrawer = true;
                      // setData({...data});
                    }}
                  >
                    Setting
                  </div> */}
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

          const tags = data.dataTag.tagList.filter(v => v.isActive).map(v => v.value);
          console.log('tags : ', tags);
          setValue('tags', tags);
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

          setValue(
            'postCountry',
            updatedList.map(v => v.toString()),
          );
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
            setValue(`operatorInvitationProfileIdList`, []);
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
          data.dataCharacterSearch.profileList = [...dataChanged];
          const profileList = data.dataCharacterSearch.profileList.map(v => v.profileSimpleInfo);
          setValue('memberProfileIdList', profileList);
          setData({...data});
        }}
      />

      {data.dataPopupRemove.isOpen && (
        <PopupConfirm
          title={data.dataPopupRemove.title}
          description={data.dataPopupRemove.description}
          onClose={() => {
            data.dataPopupRemove.isOpen = false;
            setData({...data});
          }}
          onConfirm={() => {
            const profileList = data.dataCharacterSearch.profileList.filter(
              v => v.profileSimpleInfo.profileId != data.dataPopupRemove.idProfile,
            );
            data.dataCharacterSearch.profileList = profileList;
            data.dataPopupRemove.isOpen = false;
            setData({...data});
          }}
        />
      )}

      {data.dataPopupComplete.isOpen && (
        <CustomPopup
          type="alert"
          title={data.dataPopupComplete.title}
          buttons={[
            {
              label: getLocalizedText('Common', 'common_button_confirm'),
              onClick: () => {
                routerBack();
              },
              isPrimary: true,
            },
          ]}
        />
      )}
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
  console.log('data profileListSaved : ', data.profileListSaved);
  console.log('data profileList : ', data.profileList);
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
    {id: ExploreSortType.Popular, value: 'Popular'},
    {id: ExploreSortType.Name, value: 'Name'},
  ];

  const SelectBoxArrowComponent = useCallback(
    (isOpen?: boolean) => (
      <img
        className={styles.icon}
        src={BoldAltArrowDown.src}
        alt="altArrowDown"
        style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
      />
    ),
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
    // console.log('data.profileListSaved : ', data.profileListSaved);
    const searchProfileListActived = data.profileList.filter(v => v.isActive && !v.isOriginal);
    const profileListSaved = data.profileListSaved.filter(v => v.isActive);
    const mergedList = [...searchProfileListActived, ...profileListSaved];

    // console.log('mergedList : ', mergedList);
    let uniqueList = Array.from(new Map(mergedList.map(item => [item.profileSimpleInfo.profileId, item])).values());
    uniqueList = uniqueList.map(v => ({...v, isActive: true}));
    // console.log('uniqueList : ', uniqueList);
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

      // console.log('data.profileListSaved : ', JSON.stringify(data.profileListSaved));
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

        // console.log('data.profileListSaved : ', data.profileListSaved);
        // console.log('data.profileList : ', data.profileList);
        const searchProfileListModified = searchProfileList.map(searchProfile => {
          const matchedProfile = data.profileListSaved.find(
            profile => profile.profileSimpleInfo.profileId === searchProfile.profileSimpleInfo.profileId,
          );
          // console.log('matchedProfile ', matchedProfile);
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
    [data],
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
                  if (e.target.checked) {
                    profileList = data.profileList.map(v => (v.isOriginal ? v : {...v, isActive: true}));
                  } else {
                    profileList = data.profileList.map(v => (v.isOriginal ? v : {...v, isActive: false}));
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
              value={sortOptionList?.find(v => v.id == data.indexSort) || sortOptionList[0]}
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
                        checked={profile.isActive}
                        onClick={e => {
                          const target = e.target as HTMLInputElement;
                          if (profile.isOriginal) {
                            e.preventDefault();
                            return;
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
                      <div className={styles.description}>{profile.profileSimpleInfo.description}</div>
                    </div>
                  </div>
                  <div className={styles.right}>
                    {profile.profileSimpleInfo.nsfw && <div className={styles.nsfw}>18</div>}
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

type PopupConfirmType = {
  title: React.ReactNode;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};
const PopupConfirm = ({title, description, onClose, onConfirm}: PopupConfirmType) => {
  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <div className={styles.popupConfirm}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
          <div className={styles.buttonWrap}>
            <div className={styles.cancel} onClick={onClose}>
              Cancel
            </div>
            <div className={styles.confirm} onClick={onConfirm}>
              Confirm
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
