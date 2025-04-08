import {ExploreSortType, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';
import styles from './CreateChannel.module.scss';
import cx from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'react';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAltArrowDown, BoldRadioButtonSquare, BoldRadioButtonSquareSelected, LineCheck, LineSearch} from '@ui/Icons';
import {SearchChannelMemberReq, sendSearchChannel} from '@/app/NetWork/ChannelNetwork';
import {debounce, Drawer} from '@mui/material';
import {SelectBox} from '@/app/view/profile/ProfileBase';

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
