import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  data: {},
  error: null,
  accountData: {},
};

const accountStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CUSTOMER_ACCOUNT_REQUEST_INITIATED:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actionTypes.CUSTOMER_ACCOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null,
      };
    case actionTypes.CUSTOMER_ACCOUNT_REQUEST_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error.response,
      };
    default:
      return state;
  }
};

export default accountStateReducer;
