import React, { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { AuthContext } from 'src/components/oauth';

const HomePage = lazy(() => import('src/pages/home'));
const HostsPage = lazy(() => import('src/pages/hosts'));
const PlaybooksPage = lazy(() => import('src/pages/playbooks'));
const LoginPage = lazy(() => import('src/pages/login'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

export default function Router() {
  const { user } = useContext(AuthContext);

  const routes = useRoutes([
    {
      element: user ? (
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
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
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
