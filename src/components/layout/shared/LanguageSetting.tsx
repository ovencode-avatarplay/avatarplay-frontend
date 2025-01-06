import {sendGetLanguage} from '@/app/NetWork/AuthNetwork';
import {refreshLanaguage} from '@/utils/UrlMove';
import {i18n} from 'next-i18next';
import {useRouter} from 'next/navigation';

export const fetchLanguage = async (router: ReturnType<typeof useRouter>) => {
  const response = await sendGetLanguage({});
  const language = response.data?.languageType;
  refreshLanaguage(language, router);
};
