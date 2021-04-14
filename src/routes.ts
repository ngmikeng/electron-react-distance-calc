import React from 'react';

const MainForm = React.lazy(() => import('./views/main/MainForm'));

interface IMainRoute {
  path: string;
  exact: boolean;
  name: string;
  component?: any
}

const routes: IMainRoute[] = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/main', exact: true,  name: 'Main', component: MainForm }
];

export default routes;
