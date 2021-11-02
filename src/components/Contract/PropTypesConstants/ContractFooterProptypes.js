import { string, bool, func, arrayOf, shape } from 'prop-types';

export const ContractFooterDefaultProptypes = {
  id: '',
  details: {},
  setParams: () => {},
  setShowModal: () => {},
  isEditContract: false,
  onEditcontract: () => {},
  isLoading: {},
  isFooter: false,
  formData: {},
  newAddendumData: {},
  updatedFormData: {},
  showEditor: false,
  nextStep: () => {},
  setShowDiscardModal: () => {},
  checkApprovalCondition: () => {},
  showRightTick: () => {},
  setIsEditContract: () => {},
  renderEditContractBtn: () => {},
  showDiscardModal: () => {},
  createAgreementDoc: () => {},
  getContractDetails: () => {},
  setIsLoading: () => {},
  amendmentData: {},
};

export const ContractFooterProptypes = {
  id: string,
  details: shape({
    contract_status: shape({
      value: string,
      label: string,
    }),
    id: string,
    updated_at: string,
    draft_from: string,
    is_renewed: string,
  }),
  setParams: func,
  setShowModal: func,
  isEditContract: bool,
  onEditcontract: func,
  isLoading: shape({
    loader: bool,
    type: string,
  }),
  isFooter: bool,
  formData: shape({
    additional_one_time_services: arrayOf(shape({})),
  }),
  newAddendumData: shape({
    id: string,
    addendum: string,
  }),
  updatedFormData: shape({
    addendum: string,
  }),
  showEditor: bool,
  nextStep: func,
  setShowDiscardModal: func,
  checkApprovalCondition: func,
  showRightTick: func,
  setIsEditContract: func,
  renderEditContractBtn: func,
  showDiscardModal: shape({
    clickedBtn: string,
  }),
  createAgreementDoc: func,
  getContractDetails: func,
  setIsLoading: func,
  amendmentData: shape({}),
};
