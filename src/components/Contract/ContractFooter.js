import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { string, bool, func, arrayOf, shape } from 'prop-types';

import { Footer } from '../../theme/AgreementStyle';
import { InfoIcon } from '../../theme/images';
import { PageLoader, Button, ModalBox } from '../../common';
import {
  updateAccountDetails,
  updatePauseAgreement,
  getPauseAgreementDetails,
  getTransactionData,
} from '../../api';

const customStylesForAlert = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '474px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
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
  setIsLoading,
  getContractDetails,
}) {
  const userInfo = useSelector((state) => state.userState.userInfo);
  const { pauseId } = useParams();
  const [showPauseModal, setShowPauseModal] = useState({
    show: false,
    data: {},
  });
  const [pauseAgreementData, setPauseAgreementData] = useState({});
  const [transactionalData, setTransactionalData] = useState({});

  const getTransactionalDataDetails = useCallback(() => {
    getTransactionData({
      contract_status: 'pending contract approval',
      contract: details?.id,
    }).then((res) => {
      if (res?.data?.results?.length) {
        setTransactionalData(res.data.results[0]);
      }
    });
  }, [details]);

  useEffect(() => {
    getTransactionalDataDetails();
  }, [getTransactionalDataDetails]);
  const AdditionalOneTimeServices =
    formData?.additional_one_time_services?.length;
  const checkAmazonStorePriceExists = () => {
    const service =
      AdditionalOneTimeServices &&
      formData.additional_one_time_services.find((item) =>
        item && item.name
          ? item.name === 'Amazon Store Package'
          : item?.service?.name === 'Amazon Store Package',
      );
    if (service) {
      return true;
    }
    const customService =
      AdditionalOneTimeServices &&
      formData.additional_one_time_services.find((item) =>
        item && item.name
          ? item.name === 'Amazon Store Package Custom'
          : item?.service?.name === 'Amazon Store Package Custom',
      );
    if (
      (customService && !customService.custom_amazon_store_price) ||
      customService?.custom_amazon_store_price === ''
    ) {
      return true;
    }
    return false;
  };

  const updateContractData = (data) => {
    setIsLoading({ loader: true, type: 'button' });
    updateAccountDetails(details.id, data).then((res) => {
      if (res && res.status === 200) {
        if (data.contract_status === 'cancel') {
          toast.success('Cancel Contract Approved!');
        }
        getContractDetails();
        setShowPauseModal({ show: false, data: {} });
        setIsLoading({ loader: false, type: 'button' });
      } else {
        if (data.contract_status === 'cancel') {
          toast.error(res?.data?.detail);
        }
        setShowPauseModal({ show: false, data: {} });
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const updatePauseContract = (pauseAgreementPauseData) => {
    const TodaysDate = dayjs(new Date()).format('YYYY-MM-DD');

    updatePauseAgreement(pauseId, pauseAgreementPauseData).then((pauseRes) => {
      if (pauseRes && pauseRes.status === 200) {
        toast.success('Pause Contract Approved!');
        let contractStatusData = {};
        if (pauseRes?.data?.start_date === TodaysDate) {
          contractStatusData = {
            contract_status: 'pause',
          };
        } else if (details && details.is_renewed) {
          contractStatusData = {
            contract_status: 'renewed',
          };
        } else {
          contractStatusData = {
            contract_status: 'active',
          };
        }
        updateContractData(contractStatusData);
      } else {
        toast.error(pauseRes?.data?.detail);
        setShowPauseModal({ show: false, data: {} });
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const getDataToUpdatePauseAgreement = (
    pauseAgreement = pauseAgreementData,
  ) => {
    const TodaysDate = dayjs(new Date()).format('YYYY-MM-DD');
    let pauseAgreementPauseData = {};
    if (
      pauseAgreement?.start_date &&
      pauseAgreement.start_date === TodaysDate
    ) {
      pauseAgreementPauseData = {
        is_approved: true,
        is_extended: true,
        is_paused: true,
      };
    } else {
      pauseAgreementPauseData = { is_approved: true };
    }
    return pauseAgreementPauseData;
  };

  const onClickOfUpdatePauseContract = (flag) => {
    setIsLoading({ loader: true, type: 'button' });
    if (flag.getPauseAgreement) {
      getPauseAgreementDetails(pauseId).then((res) => {
        setIsLoading({ loader: false, type: 'button' });
        if (res && res.status === 200) {
          setPauseAgreementData(res && res.data);
          if (res?.data?.end_date && new Date(res.data.end_date) < new Date()) {
            setShowPauseModal({ show: true, data: res.data });
          } else {
            setIsLoading({ loader: true, type: 'button' });
            updatePauseContract(getDataToUpdatePauseAgreement(res && res.data));
          }
        }
      });
    } else {
      setIsLoading({ loader: true, type: 'button' });
      updatePauseContract(getDataToUpdatePauseAgreement());
    }
  };
  const rightTickCondition =
    showRightTick('service_agreement') &&
    showRightTick('statement') &&
    showRightTick('dspAddendum');
  const isAllMandetoryFieldsFilled = () => {
    if (rightTickCondition) {
      return true;
    }
    return false;
  };
  const getContractDetailValue = details?.contract_status?.value;
  const handleLastUpdateInfo = (date) => {
    if (date) {
      return (
        <span className="last-update ">
          Last updated by You on
          {dayjs(details?.updated_at).format('MMM D, h:mm A')}
        </span>
      );
    }
    return (
      <span className="last-update">
        <img src={InfoIcon} alt="info" className="info-icon" />
        This contract is missing mandatory information.
      </span>
    );
  };
  const renderContractButtonHtml = (onClickFunc, btnLabel) => {
    return (
      <>
        <Button
          className={`btn-primary sticky-btn-primary sidepanel mt-3  ${
            isEditContract ? 'w-sm-100 ml-0 mr-0' : 'w-sm-50 ml-0'
          }`}
          onClick={() => onClickFunc()}>
          {isLoading.loader && isLoading.type === 'button' ? (
            <PageLoader color="#fff" type="button" />
          ) : (
            btnLabel
          )}
        </Button>
      </>
    );
  };
  const renderRequestButtonHtml = (
    btnLabel,
    btnClassName,
    checkIsEditContract,
  ) => {
    return (
      <>
        <Button
          className={`btn-primary on-boarding mt-3 ${btnClassName}${
            checkIsEditContract === 'true'
              ? isEditContract
                ? 'w-sm-100'
                : 'w-sm-50'
              : ''
          }`}
          disabled>
          {btnLabel}
        </Button>
      </>
    );
  };
  return (
    <>
      {showPauseModal.show ? (
        <Modal
          isOpen={showPauseModal.show}
          style={customStylesForAlert}
          ariaHideApp={false}
          contentLabel="Edit modal">
          <ModalBox>
            <div className="modal-body">
              <div className="alert-msg ">
                <span>
                  Agreement pause duration was
                  {showPauseModal.data?.start_date} to
                  {showPauseModal.data?.end_date}.
                </span>
                <p>Are you sure you want to pause this Agreement?</p>
              </div>
              <div className="text-center ">
                <Button
                  onClick={() => {
                    onClickOfUpdatePauseContract({ getPauseAgreement: false });
                  }}
                  type="button"
                  className="btn-primary on-boarding  mr-2 pb-2 mb-1">
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Pause Agreement'
                  )}
                </Button>
                <Button
                  onClick={() => setShowPauseModal({ show: false, data: {} })}
                  type="button"
                  className=" btn-transparent w-50 on-boarding ">
                  Cancel
                </Button>
              </div>
            </div>
          </ModalBox>
        </Modal>
      ) : (
        ''
      )}
      {getContractDetailValue === 'pending contract signature' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              {renderContractButtonHtml(
                () => onEditcontract(),
                'Edit Contract',
              )}
              {getContractDetailValue === 'pending contract signature' ? (
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
        (newAddendumData?.id && showEditor && updatedFormData?.addendum) ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5">
            <div className="container-fluid">
              <Button
                className="light-orange  on-boarding  mt-3  mr-0 ml-0 w-sm-50"
                disabled={checkAmazonStorePriceExists()}
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
                (userInfo?.role === 'Team Manager - TAM' ||
                  userInfo?.role === 'Sales Manager' ||
                  userInfo?.role === 'BGS Manager') &&
                transactionalData?.can_approve ? (
                  rightTickCondition ? (
                    <>
                      <Button
                        className={`btn-primary on-boarding  w-320 mt-3 ml-0 ${
                          isEditContract ? 'w-sm-100' : 'w-sm-50'
                        }`}
                        disabled={!rightTickCondition}
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
                      {handleLastUpdateInfo('date')}
                    </>
                  ) : !isEditContract ? (
                    <>
                      {renderEditContractBtn('btn-primary')}
                      {handleLastUpdateInfo()}
                    </>
                  ) : (
                    renderRequestButtonHtml(
                      'Approve and Request Signature',
                      'w-320 ml-0',
                      'true',
                    )
                  )
                ) : rightTickCondition ? (
                  <>
                    <Button
                      className={`btn-primary on-boarding mt-3  ${
                        isEditContract ? 'w-sm-100' : 'w-sm-50 ml-0'
                      }`}
                      disabled={
                        !rightTickCondition ||
                        Object.keys(updatedFormData).includes('addendum')
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
                    {handleLastUpdateInfo('date')}
                  </>
                ) : !isEditContract ? (
                  <>
                    {renderEditContractBtn('btn-primary')}
                    {handleLastUpdateInfo()}
                  </>
                ) : (
                  renderRequestButtonHtml(
                    'Request Approval',
                    'mr-4 w-sm-100',
                    'false',
                  )
                )
              ) : details?.draft_from ? (
                isAllMandetoryFieldsFilled() ? (
                  <>
                    <Button
                      className={`btn-primary on-boarding mt-3  ${
                        isEditContract ? 'w-sm-100' : 'w-sm-50 ml-0'
                      }`}
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
                    {handleLastUpdateInfo('date')}
                  </>
                ) : !isEditContract ? (
                  <>
                    {renderEditContractBtn('btn-primary')}
                    {handleLastUpdateInfo()}
                  </>
                ) : (
                  renderRequestButtonHtml(
                    'Request Approval',
                    'w-320 ml-0',
                    'true',
                  )
                )
              ) : rightTickCondition ? (
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
                  {handleLastUpdateInfo('date')}
                </>
              ) : !isEditContract ? (
                <>
                  {renderEditContractBtn('btn-primary w-sm-100')}
                  {handleLastUpdateInfo()}
                </>
              ) : (
                renderRequestButtonHtml(
                  'Request Signature',
                  'mr-5 w-sm-100',
                  'false',
                )
              )}
            </div>
          </Footer>
        </div>
      )}
      {getContractDetailValue === 'pending for cancellation' &&
      userInfo &&
      userInfo.role === 'BGS Manager' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              {renderContractButtonHtml(
                () => updateContractData({ contract_status: 'cancel' }),
                'Approval for Cancellation',
              )}
            </div>
          </Footer>
        </div>
      ) : (
        ''
      )}
      {getContractDetailValue === 'active pending for pause' &&
      userInfo &&
      userInfo.role === 'BGS Manager' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              {renderContractButtonHtml(
                () => onClickOfUpdatePauseContract({ getPauseAgreement: true }),
                'Approval for Pause',
              )}
            </div>
          </Footer>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

ContractFooter.defaultProps = {
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
};
ContractFooter.propTypes = {
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
};
