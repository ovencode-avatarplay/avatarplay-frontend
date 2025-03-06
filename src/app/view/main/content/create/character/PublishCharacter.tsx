import styles from './PublishCharacter.module.css';

import {useEffect, useState} from 'react';
import {
  CreateCharacter2Req,
  CreateCharacterReq,
  sendCreateCharacter,
  sendCreateCharacter2,
} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

import emptyContentInfo from '@/data/create/empty-story-info-data.json';

import LoadingOverlay from '@/components/create/LoadingOverlay';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import {SelectDrawerItem} from '@/components/create/SelectDrawer';
import CustomSettingButton from '@/components/layout/shared/CustomSettingButton';
import {LineDelete} from '@ui/Icons';
import {getCurrentLanguage} from '@/utils/UrlMove';

interface PublishCharacterProps {
  characterInfo: Partial<CharacterInfo>;
  debugparam: string;
  publishRequested: boolean;
  publishRequestedAction: () => void;
  publishFinishAction: () => void;
  showDelete?: boolean;
  deleteAction?: () => void;
}

const PublishCharacter: React.FC<PublishCharacterProps> = ({
  characterInfo,
  debugparam,
  publishRequested,
  publishRequestedAction,
  publishFinishAction,
  showDelete = false,
  deleteAction,
}) => {
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isMonetizationOpen, setIsMonetizationOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultCharacterInfo: CharacterInfo =
    emptyContentInfo.data.storyInfo.chapterInfoList[0].episodeInfoList[0].characterInfo;

  const mergedCharacterInfo: CharacterInfo = {
    ...defaultCharacterInfo,
    ...characterInfo,
  };

  const [currentCharacter, setCurrentCharacter] = useState<CharacterInfo>(mergedCharacterInfo);

  const [characterName, setCharacterName] = useState<string>(currentCharacter.name || '');
  const [characterIntroduction, setCharacterIntroduction] = useState<string>(currentCharacter.introduction || '');
  const [characterDescription, setCharacterDescription] = useState<string>(currentCharacter.description || '');
  const [visibilityType, setVisibilityType] = useState(currentCharacter.visibilityType);
  const [monetization, setMonetization] = useState(currentCharacter.isMonetization);

  const [isPublishRequested, setIsPublishRequested] = useState<boolean>(false);

  const visibilityItems: SelectDrawerItem[] = [
    {
      name: 'Private',
      onClick: () => {
        setVisibilityType(0);
      },
    },
    {
      name: 'Unlisted',
      onClick: () => {
        setVisibilityType(1);
      },
    },
    {
      name: 'Public',
      onClick: () => {
        setVisibilityType(2);
      },
    },
  ];
  const monetizationItems: SelectDrawerItem[] = [
    {
      name: 'Fan',
      onClick: () => {
        setMonetization(false);
      },
    },
    {
      name: 'Original',
      onClick: () => {
        setMonetization(true);
      },
    },
  ];

  const handleCreateCharacter = async () => {
    setLoading(true);

    try {
      // 사용자의 입력 데이터를 수집하여 CreateCharacterReq로 구성
      const req: CreateCharacter2Req = {
        languageType: getCurrentLanguage(),
        characterInfo: {
          ...emptyContentInfo.data.storyInfo.chapterInfoList[0].episodeInfoList[0].characterInfo,

          id: currentCharacter.id ?? 0,
          name: characterName,
          introduction: characterIntroduction,
          description: characterDescription,

          worldScenario: currentCharacter.worldScenario,
          greeting: currentCharacter.greeting,
          secret: currentCharacter.secret,

          genderType: currentCharacter.genderType,
          mainImageUrl: currentCharacter.mainImageUrl,

          visibilityType: visibilityType,
          isMonetization: monetization,
          state: 1,

          characterIP: 0,
          createAt: '2025-02-06T06:22:46.701Z',
          nsfw: false,
        },
        debugParameter: debugparam,
      };

      // API 호출
      const response = await sendCreateCharacter2(req);

      if (response.data) {
        console.log('Character created successfully:', response.data);

        publishFinishAction();
      } else {
        throw new Error('Character creation failed.');
      }
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (characterInfo) setCurrentCharacter(mergedCharacterInfo);
  }, []);

  useEffect(() => {
    if (publishRequested) setIsPublishRequested(true);
  }, [publishRequested]);

  useEffect(() => {
    if (isPublishRequested) {
      handleCreateCharacter();
      publishRequestedAction();
      setIsPublishRequested(false);
    }
  }, [isPublishRequested]);

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className={styles.publishContainer}>
        <div className={styles.thumbnailArea}>
          <h2 className={styles.publishTitle}>Thumbnail</h2>
          <div
            className={styles.thumbnail}
            style={{
              backgroundImage: `url(${currentCharacter.mainImageUrl || ''})`,
            }}
          />
        </div>
        <div className={styles.dataArea}>
          <CustomInput
            inputType="Basic"
            textType="Label"
            label="Character Name"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            customClassName={[styles.nameInput]}
          />
          <MaxTextInput
            displayDataType={displayType.Label}
            labelText="Introduction"
            promptValue={characterIntroduction || ''}
            handlePromptChange={e => setCharacterIntroduction(e.target.value)}
            maxPromptLength={1000}
          />
          <MaxTextInput
            displayDataType={displayType.Label}
            labelText="Description"
            promptValue={characterDescription || ''}
            handlePromptChange={e => setCharacterDescription(e.target.value)}
            maxPromptLength={1000}
          />
          <MaxTextInput
            displayDataType={displayType.Label}
            labelText="World Scenario"
            promptValue={currentCharacter.worldScenario || ''}
            placeholder={'Describe the background of the character...'}
            handlePromptChange={e => {
              currentCharacter.worldScenario = e.target.value;
              setCurrentCharacter({...currentCharacter});
            }}
            maxPromptLength={1000}
          />
          <MaxTextInput
            displayDataType={displayType.Label}
            labelText="Greeting"
            promptValue={currentCharacter.greeting || ''}
            placeholder={'Describe the situation at the start of the conversation...'}
            handlePromptChange={e => {
              currentCharacter.greeting = e.target.value;
              setCurrentCharacter({...currentCharacter});
            }}
            maxPromptLength={1000}
          />
          <MaxTextInput
            displayDataType={displayType.Label}
            labelText="Secrets"
            promptValue={currentCharacter.secret || ''}
            placeholder={
              'This information will not be exposed to the user in conversation, and will be passed to the prompt generator....'
            }
            handlePromptChange={e => {
              currentCharacter.secret = e.target.value;
              setCurrentCharacter({...currentCharacter});
            }}
            maxPromptLength={1000}
          />
          <CustomSettingButton
            type="select"
            name="Visibility"
            selectedValue={visibilityItems[visibilityType].name}
            items={visibilityItems}
            onClick={() => {
              setIsVisibilityOpen(true);
            }}
            isOpen={isVisibilityOpen}
            onClose={() => {
              setIsVisibilityOpen(false);
            }}
            selectedIndex={visibilityType}
          />
          <CustomSettingButton
            type="select"
            name="Monetization"
            selectedValue={monetizationItems[monetization ? 1 : 0]?.name}
            items={monetizationItems}
            onClick={() => setIsMonetizationOpen(true)}
            isOpen={isMonetizationOpen}
            onClose={() => setIsMonetizationOpen(false)}
            selectedIndex={monetization ? 1 : 0}
          />
          {showDelete && (
            <CustomSettingButton
              type="popup"
              name="Delete"
              icon={LineDelete.src}
              selectedValue={''}
              textClick={true}
              items={null}
              onClick={() => setIsDeleteOpen(true)}
              isOpen={isDeleteOpen}
              onClose={() => {
                setIsDeleteOpen(false);
              }}
              onAction={() => {
                if (deleteAction) {
                  deleteAction();
                }
                setIsDeleteOpen(false);
              }}
              selectedIndex={null}
              iconStyle={{
                filter: 'invert(48%) sepia(100%) saturate(1249%) hue-rotate(285deg) brightness(97%) contrast(105%)',
              }}
              nameStyle={{
                color: '#FD55D3',
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PublishCharacter;
