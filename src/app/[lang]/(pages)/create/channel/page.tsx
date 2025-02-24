'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import styles from './CreateChannel.module.scss';
import {BoldArrowLeft, BoldRadioButton, BoldRadioButtonSelected, LineUpload} from '@ui/Icons';
import {useForm} from 'react-hook-form';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {MediaState, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';
import {DragStatusType, TagDrawerType} from '../../profile/update/[[...id]]/page';
import cx from 'classnames';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Drawer} from '@mui/material';
import DrawerPostCountry from '@/app/view/main/content/create/common/DrawerPostCountry';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import OperatorInviteDrawer from '@/app/view/main/content/create/common/DrawerOperatorInvite';
type Props = {};

type FileType = {
  fileName?: string;
  index?: number;
  file: string;
  fileBlob?: Blob;
};

type DataProfileUpdateType = {
  thumbnail: FileType | null;
  dragStatus: DragStatusType;
  indexTab: number;
  dataVisibility: TagDrawerType;
  dataTag: TagDrawerType;
  dataCountry: {
    isOpenDrawer: boolean;
    tagList: number[];
    isAll: boolean;
  };
  dataOperatorInvitation: {
    isOpenDrawer: boolean;
    inviteSearchValue: string;
    operatorProfileIdList: ProfileSimpleInfo[];
  };
};

const CreateChannel = (props: Props) => {
  const [data, setData] = useState<DataProfileUpdateType>({
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    indexTab: 2,
    dataVisibility: {
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
    dataTag: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: false, value: 'Private'},
        {isActive: false, value: 'Unlisted'},
        {isActive: false, value: 'Public'},
      ],
      drawerTitle: 'Visibility',
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
    clearErrors,
    formState: {errors, isSubmitted},
  } = useForm();

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

  return (
    <>
      <header className={styles.header}>
        <img className={styles.btnBack} src={BoldArrowLeft.src} alt="" />
        <div className={styles.title}>Create Channel</div>
      </header>
      <main className={styles.main}>
        <div className={styles.label}>Thumbnail (Photo/Video)</div>
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
              <div className={styles.uploadWrap} onDrop={onDrop} onDragOver={onDragOver} onDragStart={onDragStartInner}>
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
            {data.indexTab == 0 && (
              <section className={styles.channelSection}>
                <div className={styles.label}>Channel name</div>
                <input
                  {...register('channelName', {required: true})}
                  className={cx(errors.channelName && isSubmitted && styles.error)}
                  type="text"
                  placeholder="Please enter a title for your post"
                  onChange={e => {
                    clearErrors('channelName');
                    setValue('channelName', e.target.value);
                  }}
                />

                <div className={styles.label}>Channel description</div>
                <div className={cx(styles.textAreaWrap, errors.introduce && isSubmitted && styles.error)}>
                  <textarea
                    {...register('introduce', {required: true})}
                    placeholder="Add a description or hashtag"
                    maxLength={250}
                    onChange={async e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                      setValue('introduce', target.value, {shouldValidate: false}); // 강제 업데이트
                      clearErrors('introduce');
                    }}
                  />
                  <div className={styles.textCount}>{`${watch('introduce', '').length}/500`}</div>
                </div>
              </section>
            )}
            {data.indexTab == 1 && (
              <section className={styles.membersSection}>
                <div className={styles.label}>0 Members</div>
                <Swiper
                  className={styles.recruitList}
                  freeMode={true}
                  slidesPerView={'auto'}
                  onSlideChange={() => {}}
                  onSwiper={swiper => {}}
                  spaceBetween={8}
                  preventClicks={false}
                  simulateTouch={false}
                >
                  <SwiperSlide>
                    <li className={cx(styles.item, styles.addRecruit)}>
                      <div className={styles.circle}>
                        <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                      </div>
                      <div className={styles.label}>Add</div>
                    </li>
                  </SwiperSlide>
                  <SwiperSlide>
                    <li className={styles.item}>
                      <div className={styles.circle}>
                        <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                        <span className={cx(styles.grade, styles.original)}>Original</span>
                      </div>
                      <div className={styles.label}>Idol University</div>
                    </li>
                  </SwiperSlide>
                  <SwiperSlide>
                    <li className={styles.item}>
                      <div className={styles.circle}>
                        <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                        <span className={cx(styles.grade, styles.fan)}>Fan</span>
                      </div>
                      <div className={styles.label}>Idol University</div>
                    </li>
                  </SwiperSlide>
                  <SwiperSlide>
                    <li className={styles.item}>
                      <div className={styles.circle}>
                        <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                        <span className={cx(styles.grade, styles.fan)}>Fan</span>
                      </div>
                      <div className={styles.label}>Idol University</div>
                    </li>
                  </SwiperSlide>
                  <SwiperSlide>
                    <li className={styles.item}>
                      <div className={styles.circle}>
                        <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                        <span className={cx(styles.grade, styles.fan)}>Fan</span>
                      </div>
                      <div className={styles.label}>Idol University</div>
                    </li>
                  </SwiperSlide>
                </Swiper>
              </section>
            )}
            {data.indexTab == 2 && (
              <section className={styles.policySection}>
                <div className={styles.label}>Visibility</div>
                <div
                  className={cx(styles.selectWrap, errors.visibility && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataVisibility.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                >
                  <div className={styles.placeholder}>Select</div>
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
                </div>
                <div className={styles.label}>Tag</div>
                <div
                  className={cx(styles.selectWrap, errors.tag && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataTag.isOpenTagsDrawer = true;
                    setData({...data});
                  }}
                >
                  <div className={styles.placeholder}>Select</div>
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
                </div>

                <div className={styles.label}>Post country</div>
                <div
                  className={cx(styles.selectWrap, errors.country && isSubmitted && styles.error)}
                  onClick={() => {
                    data.dataCountry.isOpenDrawer = true;
                    setData({...data});
                  }}
                >
                  <div className={styles.placeholder}>Select</div>
                  <img src={'/ui/profile/update/icon_select.svg'} alt="" />
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
                <div className={styles.operatorInvitationContent}>
                  {data.dataOperatorInvitation.operatorProfileIdList.map(() => {
                    return (
                      <div className={styles.operatorProfileWrap}>
                        <div className={styles.left}>
                          <img src="" alt="" className={styles.profile} />
                          <div className={styles.name}>Angel_Sasha</div>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.authority}>Owner</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.labelWrap}>
                  <div className={styles.label}>Channel IP</div>
                  <CustomToolTip tooltipText="Channel IP" />
                </div>
                <div className={cx(styles.channelIP, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" name="channelIP" value="1" defaultChecked />
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
                      <input type="radio" name="channelIP" value="2" />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Fan</div>
                      </div>
                    </label>
                    <div className={styles.right}>Monetization possible</div>
                  </div>
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

                <div className={styles.labelWrap}>
                  <div className={styles.label}>Monetization</div>
                  <CustomToolTip tooltipText="Channel IP" />
                </div>
                <div className={cx(styles.monetization, styles.radioContainer)}>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" name="monetization" value="1" defaultChecked />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>On</div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" name="monetization" value="2" />
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
                      <input type="radio" name="nsfw" value="1" defaultChecked />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>On</div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.item}>
                    <label>
                      <input type="radio" name="nsfw" value="2" />
                      <div className={styles.radioWrap}>
                        <img src={BoldRadioButtonSelected.src} alt="" className={styles.iconOn} />
                        <img src={BoldRadioButton.src} alt="" className={styles.iconOff} />
                        <div className={styles.labelRadio}>Off</div>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>

        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </main>
      <footer></footer>

      <DrawerSelectTags
        title={data.dataVisibility.drawerTitle}
        description={data.dataVisibility.drawerDescription}
        tags={JSON.parse(JSON.stringify(data.dataVisibility.tagList))}
        open={data.dataVisibility.isOpenTagsDrawer}
        onClose={() => {
          data.dataVisibility.isOpenTagsDrawer = false;
          setData({...data});
        }}
        onChange={(dataChanged: any) => {
          clearErrors('visibility');
          data.dataVisibility.tagList = dataChanged;

          for (let i = 0; i < dataChanged.length; i++) {
            if (!dataChanged[i].isActive) {
              unregister(`visibility.${i}`);
            } else {
              setValue(`visibility.${i}`, dataChanged[i].value, {shouldValidate: false});
            }
          }
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
          clearErrors('tag');
          data.dataTag.tagList = dataChanged;

          for (let i = 0; i < dataChanged.length; i++) {
            if (!dataChanged[i].isActive) {
              unregister(`tag.${i}`);
            } else {
              setValue(`tag.${i}`, dataChanged[i].value, {shouldValidate: false});
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
        postCountryList={data.dataCountry.tagList}
        onUpdatePostCountry={(updatedList: LanguageType[]) => {
          data.dataCountry.tagList = updatedList;
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
          console.log('updatedList : ', updatedList);
        }}
        setInviteSearchValue={searchValue => {
          data.dataOperatorInvitation.inviteSearchValue = searchValue;
          setData({...data});
        }}
      />
    </>
  );
};

export default CreateChannel;

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

export type DrawerMultipleTagsType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerMultipleTags = ({title, description, tags, open, onClose, onChange}: DrawerSelectTagsType) => {
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
