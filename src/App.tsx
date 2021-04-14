import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';

import './App.global.css';

const AppLayout: any = React.lazy(() => import('./containers/AppLayout'));

const loading = (
  <div className="center">
    Loading...
  </div>
)

export default function App() {
  return (
    <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route path="/" render={props => <AppLayout {...props}/> } />
          </Switch>
        </React.Suspense>
    </HashRouter>
  );
}
