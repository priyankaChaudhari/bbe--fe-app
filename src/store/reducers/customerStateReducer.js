import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  data: {},
  error: null,
  contactData: [],
  customerSelectedTab: '',
  showBrandAssetMsg: false,
};

const customerStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CUSTOMER_REQUEST_INITIATED:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case actionTypes.CUSTOMER_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null,
      };
    case actionTypes.CUSTOMER_REQUEST_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error.response,
      };

    case actionTypes.CONTACT_REQUEST_INITIATED:
      return {
        ...state,
        isLoading: true,
        //        error: null,
      };
    case actionTypes.CONTACT_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        contactData: action.contact,
        //    error: null,
      };
    case actionTypes.CUSTOMER_SELECTED_TAB:
      // console.log('reducer', action);
      return {
        ...state,
        isLoading: false,
        customerSelectedTab: action.tab,
        //    error: null,
      };
    case actionTypes.CONTACT_REQUEST_FAIL:
      return {
        ...state,
        isLoading: false,
        contactData: [],
        error: action.error.response,
      };
    case actionTypes.SHOW_BRAND_ASSET_MSG:
      return {
        ...state,

        showBrandAssetMsg: action.showBrandAssetMsg,
      };
    default:
      return state;
  }
};

export default customerStateReducer;
