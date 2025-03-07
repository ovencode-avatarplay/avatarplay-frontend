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
  // id가 배열인지 확인하고 변환
  const numericParams = Array.isArray(params?.id) ? params.id.map(Number) : [];
  const [contentId, curSeason, curEpisodeCount, episodeId] = [
    numericParams[0] ?? undefined,
    numericParams[1] ?? 1, // 기본값 1
    numericParams[2] ?? 0, // 기본값 0
    numericParams[3] ?? undefined,
  ];

  const props: CreateContentEpisodeProps = {
    contentId,
    curSeason,
    curEpisodeCount,
    episodeId,
  };

  return <CreateContentEpisode {...props} />;
};

export default Page;
