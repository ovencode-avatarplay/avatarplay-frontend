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
  mapOperatorAuthorityType,
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
import {
  getLangKey,
  LanguageType,
  mapVisibilityType,
  MembershipSetting,
} from '@/app/NetWork/network-interface/CommonEnums';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import OperatorInviteDrawer from '@/app/view/main/content/create/common/DrawerOperatorInvite';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {
  ChannelInfo,
  CreateChannelReq,
  createUpdateChannel,
  getChannelInfo,
  SearchChannelMemberReq,
  sendSearchChannel,
} from '@/app/NetWork/ChannelNetwork';
import {profile} from 'console';
import {COMMON_TAG_HEAD_TAG, SelectBox} from '@/app/view/profile/ProfileBase';

import {on} from 'events';
import DrawerMembershipSetting from '@/app/view/main/content/create/common/DrawerMembershipSetting';
import CustomSelector from '@/components/layout/shared/CustomSelector';
import {PaymentType, Subscription, VisibilityType} from '@/app/NetWork/network-interface/CommonEnums';
import useCustomRouter from '@/utils/useCustomRouter';
import parse from 'html-react-parser';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import getLocalizedText from '@/utils/getLocalizedText';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';
import formatText from '@/utils/formatText';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
import CustomChipSelector from '@/components/layout/shared/CustomChipSelector';

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
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
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
        {isActive: true, value: getLocalizedText('common_filter_private')},
        {isActive: false, value: getLocalizedText('common_filter_unlisted')},
        {isActive: false, value: getLocalizedText('common_filter_public')},
      ],
      drawerTitle: getLocalizedText('common_label_001'),
      drawerDescription: '',
    },
    dataTag: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Male', langKey: 'common_tag_male'},
        {isActive: false, value: 'Female', langKey: 'common_tag_female'},
        {isActive: false, value: 'Boyfriend', langKey: 'common_tag_boyfriend'},
        {isActive: false, value: 'Girlfriend', langKey: 'common_tag_girlfriend'},
        {isActive: false, value: 'Hero', langKey: 'common_tag_hero'},
        {isActive: false, value: 'Elf', langKey: 'common_tag_elf'},
        {isActive: false, value: 'Romance', langKey: 'common_tag_romance'},
        {isActive: false, value: 'Vanilla', langKey: 'common_tag_vanilla'},
        {isActive: false, value: 'Contemporary Fantasy', langKey: 'common_tag_contemporaryFantasy'},
        {isActive: false, value: 'Isekai', langKey: 'common_tag_Isekai'},
        {isActive: false, value: 'Flirting', langKey: 'common_tag_Flirting'},
        {isActive: false, value: 'Dislike', langKey: 'common_tag_Dislike'},
        {isActive: false, value: 'Comedy', langKey: 'common_tag_Comedy'},
        {isActive: false, value: 'Noir', langKey: 'common_tag_Noir'},
        {isActive: false, value: 'Horror', langKey: 'common_tag_Horror'},
        {isActive: false, value: 'Demon', langKey: 'common_tag_Demon'},
        {isActive: false, value: 'SF', langKey: 'common_tag_SF'},
        {isActive: false, value: 'Vampire', langKey: 'common_tag_Vampire'},
        {isActive: false, value: 'Office', langKey: 'common_tag_Office'},
        {isActive: false, value: 'Monster', langKey: 'common_tag_Monster'},
        {isActive: false, value: 'Anime', langKey: 'common_tag_Anime'},
        {isActive: false, value: 'Books', langKey: 'common_tag_Books'},
        {isActive: false, value: 'Aliens', langKey: 'common_tag_Aliens'},
      ],

      drawerTitle: getLocalizedText('common_label_002'),
      drawerDescription: '',
    },
    dataCountry: {
      isOpenDrawer: false,
      tagList: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
      isAll: true,
    },
    dataOperatorInvitation: {
      isOpenDrawer: false,
      inviteSearchValue: '',
      operatorProfileIdList: [],
    },
    dataCharacterSearch: {
      open: false,
      title: getLocalizedText('common_alert_013'),
      description: '',
      profileList: [],
      onClose: () => {},
      onChange: (profileList: {isActive: boolean; profileSimpleInfo: ProfileSimpleInfo}[]) => {},
    },

    dataPopupRemove: {
      isOpen: false,
      title: parse(getLocalizedText('common_alert_052')),
      description: getLocalizedText('common_alert_084'),
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
        paymentType: PaymentType.KRW,
        subscription: Subscription.Contents,
      },
      postCountry: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
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

    let tags = channelInfo?.tags || [];
    tags = tags.filter(v => !!v && v != '');
    let isMonetization = 0;
    let nsfw = 0;

    const membershipSetting: MembershipSetting = {
      benefits: channelInfo.membershipSetting?.benefits || '',
      paymentAmount: channelInfo.membershipSetting?.paymentAmount || 0,
      paymentType: channelInfo.membershipSetting?.paymentType || PaymentType.KRW,
      subscription: channelInfo.membershipSetting?.subscription || Subscription.Contents,
    };
    const channelInfoForm: ChannelInfoForm = {...channelInfo, tags: tags, isMonetization, nsfw, membershipSetting};

    data.thumbnail = {file: channelInfo.mediaUrl || ''};

    setValue('tags', []);
    for (let i = 0; i < data.dataTag.tagList.length; i++) {
      // const interest = res?.data?.interests[i]
      const tag = data.dataTag.tagList[i];
      // const index = tag.findIndex(v => v == tagValue);
      const index = tags.findIndex(v => v == tag.value || v == tag.langKey);
      if (index >= 0) {
        data.dataTag.tagList[index].isActive = true;
      }
    }
    const tagsActive = data.dataTag.tagList.filter(v => v.isActive).map(v => v?.langKey || '');
    setValue('tags', tagsActive);

    setValue('postCountry', []);
    data.dataCountry.tagList = [];
    for (let i = 0; i < channelInfo.postCountry.length; i++) {
      // const interest = res?.data?.interests[i]
      const value = channelInfo.postCountry[i];
      data.dataCountry.tagList.push(value);
      setValue(`postCountry.${i}`, value, {shouldValidate: false});
    }
    setValue(`postCountry`, data.dataCountry.tagList, {shouldValidate: false});
    const NUMBER_COUNTRY = 9; //TODO 국가 변경시 갯수 변경 필요, oh
    data.dataCountry.isAll = data.dataCountry.tagList.length == NUMBER_COUNTRY; // 9개국어 선택시 isAll;

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
      dataToast.open(
        getLocalizedText(isUpdate ? getLocalizedText('common_alert_099') : getLocalizedText('common_alert_098')),
      );
      routerBack();
    }
  };

  const forceTypeBoolean = (value: string | null | boolean): boolean | null => {
    return typeof value === 'boolean' ? value : value === 'true' ? true : value === 'false' ? false : null;
  };

  const keys = Object.keys(VisibilityType).filter(key => isNaN(Number(key)));
  const visibilityType = getValues('visibilityType');
  const visibilityTypeStr = VisibilityType[visibilityType] as keyof typeof mapVisibilityType;
  const visibilityTypeMapStr = mapVisibilityType[visibilityTypeStr];
  const countMembers = data.dataCharacterSearch.profileList.length;

  const onError = (errors: FieldErrors<ChannelInfoForm>) => {
    if (!errors) {
      return;
    }

    dataToast.open(getLocalizedText('common_alert_093'), ToastType.Error);

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

  console.log('errros : ', errors);

  return (
    <>
      <header className={styles.header}>
        <img className={styles.btnBack} src={BoldArrowLeft.src} alt="" onClick={routerBack} />
        <div className={styles.title}>
          {isUpdate ? getLocalizedText('common_title_Edit') : getLocalizedText('CreateChannel001_title_001')}
        </div>
      </header>
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className={styles.label}>{getLocalizedText('common_label_Thumbnail')}</div>
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
                    <div className={cx(styles.labelTab, data.indexTab == 0 && styles.active)}>
                      {getLocalizedText('createchannel001_label_003')}
                    </div>
                  </div>
                  <div className={styles.tabItem} data-tab={1}>
                    <div className={cx(styles.labelTab, data.indexTab == 1 && styles.active)}>
                      {getLocalizedText('createchannel001_label_004')}
                    </div>
                  </div>
                  <div className={styles.tabItem} data-tab={2}>
                    <div className={cx(styles.labelTab, data.indexTab == 2 && styles.active)}>
                      {getLocalizedText('createchannel001_label_005')}
                    </div>
                  </div>
                </div>
                <div className={styles.line}></div>
              </div>
            </div>

            <div className={styles.tabContent}>
              <section className={cx(styles.channelSection, data.indexTab == 0 && styles.active)}>
                <div className={styles.label}>
                  {getLocalizedText('createchannel001_label_006')} <span className={styles.highlight}>*</span>
                </div>
                <input
                  {...register('name', {required: true})}
                  className={cx(errors.name && isSubmitted && styles.error)}
                  type="text"
                  placeholder={getLocalizedText('common_sample_086')}
                  onChange={e => {
                    clearErrors('name');
                    setValue('name', e.target.value);
                  }}
                />

                <div className={styles.label}>
                  {getLocalizedText('createchannel001_label_007')} <span className={styles.highlight}>*</span>
                </div>
                <div className={cx(styles.textAreaWrap, errors.description && isSubmitted && styles.error)}>
                  <textarea
                    {...register('description', {required: true})}
                    placeholder={getLocalizedText('common_sample_047')}
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
                  <div className={styles.labelAdd}>{getLocalizedText('common_label_addmembers')}</div>
                </div>
                <div className={styles.label}>
                  {countMembers} {getLocalizedText('createchannel002_label_001')}
                </div>

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
                              data.dataPopupRemove.title = formatText(getLocalizedText('common_alert_052'), [
                                watch('name'),
                              ]);
                              // data.dataPopupRemove.title = parse(`Remove from<br/>“${watch('name')}”`);
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
                  {getLocalizedText('common_label_001')} <span className={styles.highlight}>*</span>
                </div>
                <input
                  defaultValue={VisibilityType.Private}
                  {...register('visibilityType', {required: true})}
                  className={styles.hide}
                  autoComplete="off"
                />
                <CustomSelector
                  value={getLocalizedText(visibilityTypeMapStr)}
                  error={errors.visibilityType && isSubmitted}
                  onClick={() => {
                    data.dataVisibility.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                />
                <div className={styles.label}>
                  <CustomChipSelector
                    label={
                      <>
                        {getLocalizedText('common_label_002')} <span className={styles.highlight}>*</span>
                      </>
                    }
                    tagType="node"
                    error={errors.tags && isSubmitted}
                    onClick={() => {
                      data.dataTag.isOpenTagsDrawer = true;
                      setData({...data});
                    }}
                    reactNode={
                      <div className={styles.tagWrap}>
                        {data.dataTag.tagList.map((one, index) => {
                          if (!one.isActive) return;
                          const value = one?.value?.includes(COMMON_TAG_HEAD_TAG)
                            ? getLocalizedText(one?.value || '')
                            : one?.value;

                          return (
                            <div className={styles.tag} key={index}>
                              <div className={styles.value}>
                                {/* <input
                              value={one.value}
                              className={styles.hide}
                              autoComplete="off"
                              {...register(`tags.${index}`, {required: true})}
                            /> */}
                                {value}
                              </div>
                              <div
                                className={styles.btnRemoveWrap}
                                onClick={e => {
                                  data.dataTag.tagList[index].isActive = false;
                                  const tags = data.dataTag.tagList.filter(v => v.isActive).map(v => v?.langKey || '');
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
                    }
                    containerStyle={{width: '100%'}}
                  />
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

                <div className={styles.label}>
                  <CustomChipSelector
                    label={
                      <>
                        {getLocalizedText('common_label_003')} <span className={styles.highlight}>*</span>
                      </>
                    }
                    tagType="node"
                    onClick={() => {
                      data.dataCountry.isOpenDrawer = true;
                      setData({...data});
                    }}
                    reactNode={
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
                          // const countryStr = keys[Number(one)];
                          const countryStr = getLangKey(Number(one));

                          return (
                            <div className={styles.tag} key={index}>
                              <div className={styles.value}>
                                {/* <input
                            value={one}
                            className={styles.hide}
                            autoComplete="off"
                            {...register(`postCountry.${index}`, {required: true})}
                          /> */}
                                {getLocalizedText(countryStr)}
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
                    }
                    containerStyle={{width: '100%'}}
                    error={errors.postCountry && isSubmitted}
                  />
                </div>

                <div className={styles.operatorInvitationHeader}>
                  <div className={styles.left}>
                    <div className={styles.label}>{getLocalizedText('common_label_005')}</div>
                    <CustomToolTip tooltipText={getLocalizedText('TODO : Operator Invitation Tool Tip')} />
                  </div>
                  <div
                    className={styles.right}
                    onClick={() => {
                      data.dataOperatorInvitation.isOpenDrawer = true;
                      setData({...data});
                    }}
                  >
                    {getLocalizedText('common_button_invite')}
                  </div>
                </div>
                <ul className={styles.operatorInvitationList}>
                  {data.dataOperatorInvitation.operatorProfileIdList.map((one, index) => {
                    const keys = Object.keys(OperatorAuthorityType).filter(key => isNaN(Number(key)));
                    const operatorAuthorityTypeStr = keys[
                      one.operatorAuthorityType
                    ] as keyof typeof mapOperatorAuthorityType;
                    const operatorAuthorityTypeStrMapping = mapOperatorAuthorityType[operatorAuthorityTypeStr];
                    return (
                      <li key={one.profileId} className={styles.operatorInviation}>
                        <div className={styles.left}>
                          <img src={one.iconImageUrl} alt="" />
                          <div className={styles.name}>{one.name}</div>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.authority}>{getLocalizedText(operatorAuthorityTypeStrMapping)}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>{getLocalizedText('CreateChannel003_label_001')}</div>
                  <CustomToolTip tooltipText={getLocalizedText('TODO : Channel IP')} />
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
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_Original')}</div>
                      </div>
                    </label>
                    <div className={styles.right}>{getLocalizedText('common_label_004')}</div>
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
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_Fan')}</div>
                      </div>
                    </label>
                    {/* <div className={styles.right}>Monetization possible</div> */}
                  </div>
                </div>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>{getLocalizedText('common_label_006')}</div>
                  <CustomToolTip tooltipText={getLocalizedText('TODO : hannel IP')} />
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
                          setValue('isMonetization', 1);
                        }}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_on')}</div>
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
                          setValue('isMonetization', 0);
                        }}
                      />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_off')}</div>
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
                        paymentType: watch('membershipSetting.paymentType', PaymentType.USD),
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
                    {getLocalizedText('common_label_008')} <span className={styles.highlight}>*</span>
                  </div>
                  <CustomToolTip tooltipText={getLocalizedText('TODO : NSFW Tool Tip')} />
                </div>
                <div className={cx(styles.monetization, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" value={1} checked={watch('nsfw', 0) == 1} {...register('nsfw')} />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_on')}</div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" value={0} checked={watch('nsfw', 0) == 0} {...register('nsfw')} />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>{getLocalizedText('common_button_off')}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <button type="submit" className={styles.submitBtn}>
            {getLocalizedText('common_button_submit')}
            {/* {isUpdate ? 'Submit' : 'Publish'} */}
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

          const tags = data.dataTag.tagList.filter(v => v.isActive).map(v => v?.langKey || '');
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
                <div className={styles.value}>{tag?.value}</div>
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
          <div className={styles.btnWrap}>
            <div className={styles.labelRefresh}>{getLocalizedText('common_button_refresh')}</div>
            <img src={LineRegenerate.src} alt="" />
          </div>
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
            const value = tag?.value?.includes(COMMON_TAG_HEAD_TAG) ? getLocalizedText(tag?.value) : tag?.value;

            return (
              <div className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{value}</div>
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
    //profileList : 보이는 부분, 검색시 리스트 없어지는영역
    //profileListSaved : 검색전 가지고 있는 부분
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
    profileListAll: {
      isActive: boolean;
      isOriginal: boolean;
      profileSimpleInfo: ProfileSimpleInfo;
    }[];
    indexSort: number;
  }>({
    profileListSaved: [],
    profileList: [],
    profileListAll: [],
    indexSort: 0,
  });

  useEffect(() => {
    if (!open) return;

    refresh();
  }, [open]);

  const refresh = async () => {
    const searchProfileList = await searchMember('', data.indexSort);
    data.profileListAll = searchProfileList;
    data.profileList = searchProfileList;

    for (let j = 0; j < profileList.length; j++) {
      const id = profileList[j].profileSimpleInfo.profileId;
      for (let i = 0; i < data.profileList.length; i++) {
        if (data.profileList[i].profileSimpleInfo.profileId == id) {
          data.profileList[i].isOriginal = true;
          data.profileList[i].isActive = true;
          break;
        }
      }
    }

    data.profileListSaved = JSON.parse(JSON.stringify(data.profileList));

    setData({...data});
  };

  const sortOptionList = [
    {id: ExploreSortType.Newest, value: getLocalizedText('common_sort_newest')},
    {id: ExploreSortType.Popular, value: getLocalizedText('common_sort_popular')},
    {id: ExploreSortType.Name, value: getLocalizedText('common_sort_Name')},
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

  const searchMember = async (search: string = '', sortType: ExploreSortType = ExploreSortType.Newest) => {
    const payload: SearchChannelMemberReq = {
      sortType: sortType,
      search: search,
    };

    try {
      const response = await sendSearchChannel(payload);
      const searchProfileList =
        response?.data?.memberProfileList?.map(v => ({
          isActive: false,
          isOriginal: false,
          profileSimpleInfo: v,
        })) || [];
      return searchProfileList;
    } catch {
      return [];
    }
  };

  const saveProfileAfterSearch = () => {
    const searchProfileListActived = data.profileList.filter(v => v.isActive && !v.isOriginal);
    const profileListSaved = data.profileListSaved;
    const mergedList = [...searchProfileListActived, ...profileListSaved];

    // console.log('mergedList : ', mergedList);
    let uniqueList = Array.from(new Map(mergedList.map(item => [item.profileSimpleInfo.profileId, item])).values());
    // uniqueList = uniqueList.map(v => ({...v, isActive: true}));

    console.log('uniqueList : ', uniqueList);
    data.profileList = uniqueList;
    data.profileListSaved = uniqueList;
    setData({...data});
  };

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
        saveProfileAfterSearch();
        return;
      }

      // console.log('data.profileListSaved : ', JSON.stringify(data.profileListSaved));
      // data.profileListSaved = data.profileListSaved.filter(v => v.isActive);
      console.log('data.profileListSaved : ', data.profileListSaved);

      try {
        const searchProfileList = await searchMember(searchValue, data.indexSort);

        // console.log('data.profileListSaved : ', data.profileListSaved);
        // console.log('data.profileList : ', data.profileList);
        const searchProfileListModified = searchProfileList.map(searchProfile => {
          const matchedProfile = data.profileListSaved.find(
            profile => profile.profileSimpleInfo.profileId === searchProfile.profileSimpleInfo.profileId,
          );
          console.log('matchedProfile ', matchedProfile);
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

  const updateProfileSaved = (
    profileList: {
      isActive: boolean;
      isOriginal: boolean;
      profileSimpleInfo: ProfileSimpleInfo;
    }[],
  ) => {
    for (let j = 0; j < profileList.length; j++) {
      const profile = profileList[j];
      for (let i = 0; i < data.profileListSaved.length; i++) {
        const profileSaved = data.profileListSaved[i];
        if (profile.profileSimpleInfo.profileId == profileSaved.profileSimpleInfo.profileId) {
          profileSaved.isActive = profile.isActive;
          break;
        }
      }
    }
    console.log('profileListSaved : ', data.profileListSaved);
    setData({...data});
  };

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
          <input ref={inputRef} placeholder={getLocalizedText('common_sample_078')} onChange={handleChange} />
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
                  updateProfileSaved(data.profileList);
                  setData({...data});
                }}
              />
              <img src={BoldRadioButtonSquareSelected.src} alt="" className={styles.iconOn} />
              <img src={BoldRadioButtonSquare.src} alt="" className={styles.iconOff} />
              <div className={styles.labelAll}>{getLocalizedText('common_filter_all')}</div>
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
                refresh();
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
        <div className={styles.countSelected}>
          {getLocalizedText('common_filter_all')} {countSelected}
        </div>
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
                          updateProfileSaved(data.profileList);
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
          {getLocalizedText('common_button_Cancel')}
        </button>
        <button
          className={styles.confirmBtn}
          onClick={() => {
            saveProfileList();
            onChange(data.profileList);
            onClose();
          }}
        >
          {getLocalizedText('common_button_Confirm')}
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
              {getLocalizedText('common_button_Cancel')}
            </div>
            <div className={styles.confirm} onClick={onConfirm}>
              {getLocalizedText('common_button_Confirm')}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
