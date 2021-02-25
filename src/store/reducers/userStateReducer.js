import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  data: {},
  error: null,
  isAuthenticated: false,
  userInfo: {},
  showForgotMsg: false,
  showResetMsg: false,
};

const userStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_REQUEST_INITIATED:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actionTypes.USER_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null,
        isAuthenticated: true,
        userInfo: action.payload.user,
      };
    case actionTypes.USER_ME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        userInfo: action.payload.data,
      };
    case actionTypes.USER_REQUEST_FAIL:
      return {
        ...state,
        isLoading: false,
        data: {},
        error: action.error.response,
      };
    case actionTypes.CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case actionTypes.SHOW_FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: null,
        showForgotMsg: action.showForgotMsg,
      };
    case actionTypes.SHOW_RESET_PASSWORD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: null,
        showResetMsg: action.showResetMsg,
      };
    case actionTypes.SHOW_PROFILE_LOADER:
      return {
        ...state,
        isLoading: action.isLoading,
        error: null,
      };
    default:
      return state;
  }
};

export default userStateReducer;
