'use client';
import {LineArrowDown, LineArrowLeft, LineClose, LineUpload} from '@ui/Icons';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import styles from './ProfileUpdate.module.scss';
import {useForm} from 'react-hook-form';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {Drawer} from '@mui/material';
import cx from 'classnames';

import {getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {getBackUrl} from '@/utils/util-1';
type Props = {};

export enum DragStatusType {
  OuterClick,
  InnerClick = 1,
  PictureClick = 2,
}

type FileType = {
  fileName: string;
  index: number;
  file: string;
  fileBlob: Blob;
};

type TagDrawerType = {
  isOpenTagsDrawer: boolean;
  tagList: {
    isActive: boolean;
    value: string;
  }[];
  drawerTitle: string;
  drawerDescription: string;
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
};

const PageProfileUpdate = (props: Props) => {
  const router = useRouter();
  const {
    control,
    setValue,
    register,
    handleSubmit,
    watch,
    unregister,
    trigger,
    clearErrors,
    formState: {errors, isSubmitted},
  } = useForm();
  const [data, setData] = useState<DataProfileUpdateType>({
    thumbnail: null,
    dragStatus: DragStatusType.OuterClick,
    dataInterests: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: true, value: 'Dating'},
        {isActive: false, value: 'Love'},
        {isActive: true, value: 'Man'},
        {isActive: true, value: 'Friends'},
        {isActive: true, value: 'Relationships'},
        {isActive: true, value: 'Adults'},
      ],
      drawerTitle: 'Interests',
      drawerDescription: 'Please select your area of interests',
    },
    dataSkills: {
      isOpenTagsDrawer: false,
      tagList: [
        {isActive: true, value: 'Create Image'},
        {isActive: false, value: 'Create LLM'},
        {isActive: true, value: 'Create Video Edit'},
        {isActive: true, value: 'Persona'},
        {isActive: true, value: 'Create Music'},
        {isActive: true, value: 'Create Webtoon'},
      ],
      drawerTitle: 'Skills',
      drawerDescription: 'Please add the skills you have',
    },

    countValid: {
      total: 7,
      valid: 0,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    setValue('introduction', '초기값 introduction'); // API 데이터로 값 설정
  }, []);

  useEffect(() => {
    checkValid();
  }, [errors]);

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
        setData({...data});
      }
    }
  };

  const checkValid = async () => {
    const isValid = await trigger(undefined, {shouldFocus: false});
    const countValidTotal = Object.keys(control._fields || {}).length;
    console.log('errors : ', errors);
    const countValidError = Object.keys(errors).length;
    const countValidCorrect = countValidTotal - countValidError;
    console.log(countValidTotal, countValidError, countValidCorrect);

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
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.uploadThumbnailSection}>
            <label className={styles.uploadBtn} htmlFor="file-upload">
              {/* UPLOAD */}
              <img src="/editor/images/icon_upload.svg" alt="" />
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
              className={cx(errors.nickname && isSubmitted && styles.error)}
              {...register('nickname', {required: true})}
              type="text"
              placeholder="Please enter a nickname"
              maxLength={30}
              onChange={async e => {
                setValue('nickname', e.target.value);
                clearErrors('nickname');
                checkValid();
              }}
            />
          </section>
          <section className={styles.introductionSection}>
            <h2 className={styles.label}>Introduction</h2>
            <div className={cx(styles.textAreaWrap, errors.introduction && isSubmitted && styles.error)}>
              <textarea
                {...register('introduction', {required: true})}
                placeholder="Add a description or hashtag"
                maxLength={500}
                onChange={async e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                  setValue('introduction', target.value, {shouldValidate: false}); // 강제 업데이트
                  clearErrors('introduction');
                  checkValid();
                }}
              />
              <div className={styles.textCount}>{`${watch('introduction', '').length}/500`}</div>
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
                        setValue(`interests.${index}`, one.value);
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
            <input
              {...register('personalHistory', {required: true})}
              className={cx(styles.inputPersonalHistory, errors.personalHistory && isSubmitted && styles.error)}
              type="text"
              placeholder="Ex) 2024. 10~2025.01 Design (Zero to One CB)"
              maxLength={30}
              onChange={e => {
                clearErrors('personalHistory');
                setValue('personalHistory', e.target.value);
                checkValid();
              }}
            />
          </section>

          <section className={styles.honorAwardsSection}>
            <h2 className={styles.label}>Honor & Awards</h2>
            <input
              {...register('honorawards', {required: true})}
              type="text"
              className={cx(styles.inputHonorawards, errors.honorawards && isSubmitted && styles.error)}
              placeholder="Ex) 2024.10.00Advertisement contest winner(korea)"
              maxLength={30}
              onChange={e => {
                clearErrors('honorawards');
                setValue('honorawards', e.target.value);
                checkValid();
              }}
            />
          </section>

          <section className={styles.portfolioSection}>
            <h2 className={styles.label}>Portfolio</h2>
            <div className={styles.uploadArea}>
              <div className={styles.uploadWrap}>
                <img src={LineUpload.src} alt="" />
                <div className={styles.text}>Upload</div>
              </div>
            </div>
          </section>

          <section className={styles.urlSection}>
            <h2 className={styles.label}>URL</h2>
            <input
              {...register('url', {required: true})}
              className={cx(errors.url && isSubmitted && styles.error)}
              type="text"
              placeholder="https://"
              maxLength={30}
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
          tags={data.dataInterests.tagList}
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
          tags={data.dataSkills.tagList}
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
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
};

type DrawerSelectTagsType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
const DrawerSelectTags = ({title, description, tags, open, onClose, onChange}: DrawerSelectTagsType) => {
  const [data, setData] = useState({
    tagList: tags,
  });

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
