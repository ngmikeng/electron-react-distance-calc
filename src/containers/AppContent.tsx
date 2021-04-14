import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import Container from '@material-ui/core/Container';


// routes config
import routes from '../routes';

const loading = (
  <div className="center">
    Loading...
  </div>
)

const AppContent = () => {
  return (
    <main className="main">
      <Container maxWidth="sm">
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  render={props => (
                    <route.component {...props} />
                  )} />
              )
            })}
            <Redirect from="/" to="/main" />
          </Switch>
        </Suspense>
      </Container>
    </main>
  )
}

export default React.memo(AppContent)
