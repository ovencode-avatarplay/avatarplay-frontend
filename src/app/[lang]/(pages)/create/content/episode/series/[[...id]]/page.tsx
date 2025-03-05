'use client';

import CreateContentEpisode, {
  CreateContentEpisodeProps,
} from '@/app/view/main/content/create/content/CreateContentEpisode';

type Props = {
  params: {
    id?: string[];
  };
};

const Page = ({params}: Props) => {
  console.log('params.id', params?.id);

  // params.id가 존재할 경우 변환
  const [contentId, curSeason, curEpisodeCount] = params?.id?.map(Number) ?? [];

  const props: CreateContentEpisodeProps = {
    contentId: !isNaN(contentId) ? contentId : undefined,
    curSeason: !isNaN(curSeason) ? curSeason : 1, // 기본값 1
    curEpisodeCount: !isNaN(curEpisodeCount) ? curEpisodeCount : 0, // 기본값 0
  };

  return <CreateContentEpisode {...props} />;
};

export default Page;
