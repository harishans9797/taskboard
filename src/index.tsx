import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Switch, Route, HashRouter, Link } from 'react-router-dom';
import Home from './views/home';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { appReducer, appInitialState } from './store';
import Routes from './utils/routes';
import BoardDetails from './views/board-details';


const store = createStore(appReducer, appInitialState, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <div>
          <div>
            <Link to={Routes.home.getPath()}>
              <button className={"home"}>Home</button>
            </Link>
          </div>
          <Switch>
            <Route path={Routes.details.pattern}>
              <BoardDetails />
            </Route>
            <Route path={Routes.home.pattern}>
              <Home />
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);