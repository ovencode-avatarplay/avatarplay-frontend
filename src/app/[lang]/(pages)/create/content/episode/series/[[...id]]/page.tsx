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
  const numericParams = Array.isArray(params?.id) ? params.id.map(String) : [];
  const [contentId, curSeason, curEpisodeCount] = [
    numericParams[0] ?? undefined,
    parseInt(numericParams[1]) ?? 1, // 기본값 1
    parseInt(numericParams[2]) ?? 0, // 기본값 0
  ];

  const props: CreateContentEpisodeProps = {
    contentId,
    curSeason,
    curEpisodeCount,
  };

  return <CreateContentEpisode {...props} />;
};

export default Page;
