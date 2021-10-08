import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import dotenv from 'dotenv';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import * as serviceWorker from './serviceWorker';

// Thrird Party css
import './theme/css/bootstrap-grid.min.css';
import 'react-toastify/dist/ReactToastify.css';

// import './index.css';
import App from './App';
import PageLoader from './common/PageLoader';

import {
  userStateReducer,
  customerStateReducer,
  accountStateReducer,
} from './store/reducers';

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

serviceWorker.unregister();
