import React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PageLoader, Button } from '../../common';
import Theme from '../../theme/Theme';
import { InfoIcon } from '../../theme/images';
import { updateAccountDetails } from '../../api';

export default function ContractFooter({
  details,
  setParams,
  setShowModal,
  isEditContract,
  onEditcontract,
  isLoading,
  isFooter,
  formData,
  newAddendumData,
  updatedFormData,
  showEditor,
  nextStep,
  setShowDiscardModal,
  checkApprovalCondition,
  showRightTick,
  setIsEditContract,
  renderEditContractBtn,
  showDiscardModal,
  createAgreementDoc,
  // setIsLoading,
  getContractDetails,
}) {
  const userInfo = useSelector((state) => state.userState.userInfo);

  const checkAmazonStorePriceExists = () => {
    const service =
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find((item) =>
        item && item.name
          ? item.name === 'Amazon Store Package'
          : item &&
            item.service &&
            item.service.name === 'Amazon Store Package',
      );

    if (service) {
      return true;
    }
    const customService =
      formData &&
      formData.additional_one_time_services &&
      formData.additional_one_time_services.length &&
      formData.additional_one_time_services.find((item) =>
        item && item.name
          ? item.name === 'Amazon Store Package Custom'
          : item &&
            item.service &&
            item.service.name === 'Amazon Store Package Custom',
      );

    if (
      (customService && !customService.custom_amazon_store_price) ||
      (customService && customService.custom_amazon_store_price === '')
    ) {
      return true;
    }
    return false;
  };

  const updateContractData = (data) => {
    // setIsLoading({ loader: true, type: 'page' });

    updateAccountDetails(details.id, data).then(() => {
      getContractDetails();
      // setIsLoading({ loader: false, type: 'page' });
    });
  };

  return (
    <>
      {details &&
      details.contract_status &&
      details.contract_status.value === 'pending contract signature' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              <Button
                className={`btn-primary sticky-btn-primary sidepanel mt-3  ${
                  isEditContract ? 'w-sm-100 ml-0 mr-0' : 'w-sm-50 ml-0'
                }`}
                onClick={() => onEditcontract()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Edit Contract'
                )}
              </Button>
              {details &&
              details.contract_status &&
              details.contract_status.value &&
              details.contract_status.value === 'pending contract signature' ? (
                <Button
                  className="light-orange sticky-btn   mt-3 mr-0 ml-5  on-boarding w-sm-50"
                  onClick={() => {
                    setParams('send-remainder');
                    setShowModal(true);
                  }}>
                  Send Reminder
                </Button>
              ) : (
                ''
              )}
            </div>
          </Footer>
        </div>
      ) : isFooter ||
        (newAddendumData &&
          newAddendumData.id &&
          showEditor &&
          updatedFormData &&
          updatedFormData.addendum) ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5">
            <div className="container-fluid">
              <Button
                className="light-orange  on-boarding  mt-3  mr-0 ml-0 w-sm-50"
                disabled={
                  // formData &&
                  // formData.additional_one_time_services &&
                  // formData.additional_one_time_services.length &&
                  // formData.additional_one_time_services.find(
                  //   (item) => item.name === 'Amazon Store Package',
                  // )
                  //    ||
                  checkAmazonStorePriceExists()
                }
                onClick={() => nextStep()}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  <>Save Changes</>
                )}
              </Button>

              <Button
                className="btn-borderless contract-btn on-boarding  mt-3  w-sm-50 ml-5"
                onClick={() =>
                  setShowDiscardModal({
                    ...showDiscardModal,
                    show: true,
                    clickedBtn: 'discard',
                  })
                }>
                Discard Changes
              </Button>
              {updatedFormData && Object.keys(updatedFormData).length ? (
                <span className="unsave-changes">
                  {Object.keys(updatedFormData).length} unsaved changes.
                </span>
              ) : (
                ''
              )}
            </div>
          </Footer>
        </div>
      ) : (
        <div className="mt-4 pt-5">
          <Footer>
            <div className="container-fluid">
              {checkApprovalCondition() ? (
                (userInfo && userInfo.role === 'Team Manager - TAM') ||
                (userInfo && userInfo.role === 'Sales Manager') ? (
                  showRightTick('service_agreement') &&
                  showRightTick('statement') &&
                  showRightTick('dspAddendum') ? (
                    <>
                      <Button
                        className={`btn-primary on-boarding  w-320 mt-3 ml-0 ${
                          isEditContract ? 'w-sm-100' : 'w-sm-50'
                        }`}
                        disabled={
                          !(
                            showRightTick('service_agreement') &&
                            showRightTick('statement') &&
                            showRightTick('dspAddendum')
                          )
                        }
                        onClick={() => {
                          createAgreementDoc();
                          setParams('select-contact');
                          setShowModal(true);
                          setIsEditContract(false);
                        }}>
                        Approve and Request Signature
                      </Button>
                      {!isEditContract
                        ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                        : null}
                      <span className="last-update ">
                        Last updated by You on{' '}
                        {dayjs(details && details.updated_at).format(
                          'MMM D, h:mm A',
                        )}
                      </span>
                    </>
                  ) : !isEditContract ? (
                    <>
                      {renderEditContractBtn('btn-primary')}

                      <span className="last-update">
                        <img src={InfoIcon} alt="info" className="info-icon" />
                        This contract is missing mandatory information.
                      </span>
                    </>
                  ) : (
                    <Button
                      className={`btn-primary on-boarding  w-320 mt-3 ml-0 ${
                        isEditContract ? 'w-sm-100' : 'w-sm-50'
                      }`}
                      disabled>
                      Approve and Request Signature
                    </Button>
                  )
                ) : showRightTick('service_agreement') &&
                  showRightTick('statement') &&
                  showRightTick('dspAddendum') ? (
                  <>
                    <Button
                      className={`btn-primary on-boarding mt-3  ${
                        isEditContract ? 'w-sm-100' : 'w-sm-50 ml-0'
                      }`}
                      disabled={
                        !(
                          showRightTick('service_agreement') &&
                          showRightTick('statement') &&
                          showRightTick('dspAddendum')
                        ) || Object.keys(updatedFormData).includes('addendum')
                      }
                      onClick={() => {
                        createAgreementDoc();
                        setParams('request-approve');
                        setShowModal(true);
                      }}>
                      Request Approval
                    </Button>
                    {!isEditContract
                      ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                      : null}
                    <span className="last-update  ">
                      Last updated by You on{' '}
                      {dayjs(details && details.updated_at).format(
                        'MMM D, h:mm A',
                      )}
                    </span>
                  </>
                ) : !isEditContract ? (
                  <>
                    {renderEditContractBtn('btn-primary')}

                    <span className="last-update">
                      <img src={InfoIcon} alt="info" className="info-icon" />
                      This contract is missing mandatory information.
                    </span>
                  </>
                ) : (
                  <Button
                    className="btn-primary on-boarding  mt-3 mr-4 w-sm-100"
                    disabled>
                    Request Approval
                  </Button>
                )
              ) : showRightTick('service_agreement') &&
                showRightTick('statement') &&
                showRightTick('dspAddendum') ? (
                <>
                  <Button
                    className={`btn-primary on-boarding mt-3 ml-0 ${
                      isEditContract ? 'w-sm-100 ' : 'w-sm-50 '
                    }`}
                    onClick={() => {
                      createAgreementDoc();

                      setParams('select-contact');
                      setShowModal(true);
                      setIsEditContract(false);
                    }}>
                    Request Signature
                  </Button>
                  {!isEditContract
                    ? renderEditContractBtn('light-orange w-sm-50 ml-5')
                    : null}
                  <span className="last-update">
                    Last updated by You on{' '}
                    {dayjs(details && details.updated_at).format(
                      'MMM D, h:mm A',
                    )}
                  </span>
                </>
              ) : !isEditContract ? (
                <>
                  {renderEditContractBtn('btn-primary w-sm-100')}

                  <span className="last-update">
                    <img src={InfoIcon} alt="info" className="info-icon" />
                    This contract is missing mandatory information.
                  </span>
                </>
              ) : (
                <Button
                  className="btn-primary on-boarding  mt-3 mr-5 w-sm-100"
                  disabled>
                  Request Signature
                </Button>
              )}
            </div>
          </Footer>
        </div>
      )}
      ;
      {details &&
      details.contract_status &&
      details.contract_status.value === 'pending for cancellation' &&
      userInfo &&
      userInfo.role === 'BGS Manager' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              <Button
                className={`btn-primary sticky-btn-primary sidepanel mt-3  ${
                  isEditContract ? 'w-sm-100 ml-0 mr-0' : 'w-sm-50 ml-0'
                }`}
                onClick={() => {
                  updateContractData({ contract_status: 'cancel' });
                }}>
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  'Approval for Cancellation'
                )}
              </Button>
            </div>
          </Footer>
        </div>
      ) : (
        ''
      )}
      ;
    </>
  );
}

const Footer = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 0;
  width: 100%;
  background: ${Theme.white};
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 80px;
  padding-left: 15px;
  z-index: 2;
  .w-320 {
    width: 320px;
    // width: 100%;
  }

  .last-update {
    margin-top: 30px;
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    margin-left: 40px;

    &:first-child {
      margin-left: 20px;
    }

    .info-icon {
      vertical-align: text-bottom;
      width: 16px;
      margin-right: 8px;
    }
  }
  .unsave-changes {
    margin-left: 40px;
  }
  @media only screen and (max-width: 991px) {
    padding-left: 0px;
    // padding-right: 17px;
    .w-sm-100 {
      width: 100%;
      margin-bottom: 10px;
    }
    .w-sm-50 {
      width: 47% !important;
      margin-bottom: 10px;
    }
    .last-update {
      margin-top: 20px;
      margin: 0 auto;
      display: table;
    }
    .unsave-changes {
      margin-top: 20px;
      margin: 0 auto;
      display: table;
    }
  }
  @media only screen and (max-width: 831px) {
    .w-sm-50 {
      width: 46% !important;
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 632px) {
    .w-sm-50 {
      width: 47.5% !important;
      margin-left: 25px !important;
      margin-bottom: 10px;
    }
    .ml-0 {
      margin-left: 0 !important;
    }
  }
  @media only screen and (max-width: 530px) {
    .w-sm-50 {
      width: 47.3% !important;
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 491px) {
    .w-sm-50 {
      width: 45.7% !important;
      margin-bottom: 10px;
    }
  }

  // @media only screen and (max-width: 767px) {
  //   padding: 0 10px;
  // }
`;

ContractFooter.defaultProps = {
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
};

ContractFooter.propTypes = {
  id: PropTypes.string.isRequired,
  details: PropTypes.shape({
    contract_status: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    id: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  setParams: PropTypes.func,
  setShowModal: PropTypes.func,
  isEditContract: PropTypes.bool,
  onEditcontract: PropTypes.func,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }),
  isFooter: PropTypes.bool,
  formData: PropTypes.shape({
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
  }),
  newAddendumData: PropTypes.string,
  updatedFormData: PropTypes.shape({
    addendum: PropTypes.string,
  }),
  showEditor: PropTypes.func,
  nextStep: PropTypes.func,
  setShowDiscardModal: PropTypes.func,
  checkApprovalCondition: PropTypes.func,
  showRightTick: PropTypes.func,
  setIsEditContract: PropTypes.func,
  renderEditContractBtn: PropTypes.func,
  showDiscardModal: PropTypes.func,
  createAgreementDoc: PropTypes.func,
  getContractDetails: PropTypes.func,
};
