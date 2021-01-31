import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import dotenv from 'dotenv';

// import './index.css';
import App from './App';
import PageLoader from './common/PageLoader';
import userStateReducer from './store/reducers/userStateReducer';
import customerStateReducer from './store/reducers/customerStateReducer';
import accountStateReducer from './store/reducers/accountStateReducer';

import * as serviceWorker from './serviceWorker';
import './theme/css/style.scss';
import './theme/css/bootstrap-grid.min.css';

dotenv.config();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  userState: userStateReducer,
  customerState: customerStateReducer,
  accountState: accountStateReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const app = (
  <Provider store={store}>
    <Suspense fallback={<PageLoader color="#FF5933" type="page" />}>
      <App />
    </Suspense>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
