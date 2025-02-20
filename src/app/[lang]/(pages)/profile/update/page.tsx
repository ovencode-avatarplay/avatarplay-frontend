'use client';
import {LineArrowDown, LineArrowLeft, LineClose, LineUpload} from '@ui/Icons';
import React, {useEffect, useRef, useState} from 'react';
import styles from './ProfileUpdate.module.scss';
import {useForm} from 'react-hook-form';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {Drawer} from '@mui/material';
import cx from 'classnames';
type Props = {};

const PageProfileUpdate = (props: Props) => {
  const {
    setValue,
    register,
    handleSubmit,
    watch,
    unregister,
    formState: {errors, isSubmitted},
  } = useForm();
  const [data, setData] = useState({
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
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    setValue('introduction', '초기값 introduction'); // API 데이터로 값 설정
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.backBtnWrap}>
          <img src={LineArrowLeft.src} className={styles.backBtn}></img>
        </div>
        <div className={styles.progressBar}>
          <div style={{width: '50%'}} className={styles.progressInner}></div>
        </div>
        <div className={styles.progressNumber}>1/9</div>
      </header>
      <main className={styles.main}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.uploadThumbnailSection}>
            <div className={styles.uploadWrap}>
              <img src={LineUpload.src} alt="" />
              <div className={styles.text}>Upload</div>
            </div>
          </section>
          <section className={styles.nicknameSection}>
            <h2 className={styles.label}>NickName</h2>
            <input
              className={cx(errors.nickname && isSubmitted && styles.error)}
              {...register('nickname', {required: true})}
              type="text"
              placeholder="Please enter a nickname"
              maxLength={30}
            />
          </section>
          <section className={styles.introductionSection}>
            <h2 className={styles.label}>Introduction</h2>
            <div className={cx(styles.textAreaWrap, errors.introduction && isSubmitted && styles.error)}>
              <textarea
                {...register('introduction', {required: true})}
                placeholder="Add a description or hashtag"
                maxLength={500}
                onChange={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                  setValue('introduction', target.value, {shouldValidate: true}); // 강제 업데이트
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
                      onClick={() => {
                        unregister(`interests.${index}`);
                        data.dataInterests.tagList[index].isActive = false;
                        setData({...data});
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
                      onClick={() => {
                        unregister(`skills.${index}`);
                        data.dataSkills.tagList[index].isActive = false;
                        setData({...data});
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
              type="text"
              placeholder="Ex) 2024. 10~2025.01 Design (Zero to One CB)"
              maxLength={30}
            />
          </section>

          <section className={styles.honorAwardsSection}>
            <h2 className={styles.label}>Honor & Awards</h2>
            <input
              {...register('honorawards', {required: true})}
              type="text"
              placeholder="Ex) 2024.10.00Advertisement contest winner(korea)"
              maxLength={30}
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
            <input {...register('url', {required: true})} type="text" placeholder="https://" maxLength={30} />
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
            data.dataInterests.tagList = dataChanged;

            for (let i = 0; i < dataChanged.length; i++) {
              if (!dataChanged[i].isActive) {
                unregister(`interests.${i}`);
              } else {
                setValue(`interests.${i}`, dataChanged[i].value, {shouldValidate: true});
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
            data.dataSkills.tagList = dataChanged;

            for (let i = 0; i < dataChanged.length; i++) {
              if (!dataChanged[i].isActive) {
                unregister(`skills.${i}`);
              } else {
                setValue(`skills.${i}`, dataChanged[i].value, {shouldValidate: true});
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
