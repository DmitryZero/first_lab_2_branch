import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';

import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import '~/styles/globals.css';
import { User } from '@prisma/client';
import UserContext from '~/Context/UserContext';
import Spinner from '~/components/Spinner';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();

  const [userState, setUser] = useState<User | null>(null);
  const [redirected, setRedirected] = useState(false); // Флаг для контроля перенаправления

  const { data: user_data, isLoading } =
    trpc.userRouter.getClientByCookie.useQuery(undefined, {
      enabled: !userState,
      retry: false, // Отключаем повторные попытки
    });

  useEffect(() => {
    if (!isLoading && !user_data && !redirected) {
      // Перенаправляем, если пользователь отсутствует и мы ещё не переходили
      setRedirected(true);
      router
        .push('/authorizationPage')
        .catch((e) => console.error('Router push failed:', e));
    } else if (user_data) {
      setUser(user_data.user);

      if (router.pathname === '/authorizationPage') {
        router.push('/').catch((e) => console.error('Router push failed:', e));
      }
    }
  }, [user_data, isLoading, redirected, router]);

  if (isLoading || (!user_data && !redirected)) {
    // Показываем спиннер, пока данные загружаются или мы ожидаем завершения редиректа
    return <Spinner />;
  }

  return (
    <UserContext.Provider value={{ user: userState, userSetter: setUser }}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserContext.Provider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
