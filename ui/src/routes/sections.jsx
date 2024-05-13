import { lazy, Suspense, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const HomePage = lazy(() => import('src/pages/home'));
export const HostsPage = lazy(() => import('src/pages/hosts'));
export const PlaybooksPage = lazy(() => import('src/pages/playbooks'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const routes = useRoutes([
    {
      element: isLoggedIn ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'hosts', element: <HostsPage /> },
        { path: 'playbooks', element: <PlaybooksPage /> },
        { path: 'user', element: <UserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage onLogin={handleLogin} />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
