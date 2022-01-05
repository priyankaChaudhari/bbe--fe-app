import React, { useState, useEffect, useCallback } from 'react';

import dayjs from 'dayjs';
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Footer } from '../../theme/AgreementStyle';
import { InfoIcon } from '../../theme/images';
import { PauseAgreementConfirmation } from './ContractModals';
import { PageLoader, Button } from '../../common';
import {
  ContractFooterDefaultProptypes,
  ContractFooterProptypes,
} from './PropTypesConstants/ContractFooterProptypes';
import {
  updateAccountDetails,
  updatePauseAgreement,
  getPauseAgreementDetails,
  getTransactionData,
} from '../../api';

export default function ContractFooter({
  details,
  setParams,
  setShowModal,
  isEditContract,
  onEditcontract,
  isLoading,
  isFooter,
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
  amendmentData,
}) {
  const userInfo = useSelector((state) => state.userState.userInfo);
  const { pauseId } = useParams();
  const [showPauseModal, setShowPauseModal] = useState({
    show: false,
    data: {},
  });
  const [pauseAgreementData, setPauseAgreementData] = useState({});
  const [transactionalData, setTransactionalData] = useState({});
  const contractStatus = details?.contract_status?.value;

  const rightTickCondition =
    showRightTick('service_agreement') &&
    showRightTick('feeStructure') &&
    showRightTick('statement') &&
    showRightTick('dspAddendum');

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

  const handleLastUpdateInfo = (date) => {
    if (date) {
      return (
        <span className="last-update ">
          Last updated by You on{' '}
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

  const displayFooterForManagers = () => {
    return rightTickCondition ? (
      <>
        {!isEditContract ? (
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
        ) : (
          renderRequestButtonHtml(
            'Approve and Request Signature',
            'w-320 ml-0',
            'true',
          )
        )}
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
    );
  };

  const isDraftContractUpdated = () => {
    if (
      amendmentData &&
      Object.keys(amendmentData)?.length &&
      (Object.keys(amendmentData.addendum)?.length ||
        amendmentData?.additional_marketplaces?.length ||
        amendmentData?.monthly_services?.length ||
        amendmentData?.updated?.length)
    ) {
      return true;
    }

    return false;
  };

  const displayApprovalBtn = () => {
    return !isEditContract ? (
      <Button
        className={`btn-primary on-boarding mt-3  ${
          isEditContract ? 'w-sm-100' : 'w-sm-50 ml-0'
        }`}
        disabled={
          !rightTickCondition ||
          Object.keys(updatedFormData).includes('addendum') ||
          (details?.draft_from && !isDraftContractUpdated())
        }
        onClick={() => {
          createAgreementDoc();
          setParams('request-approve');
          setShowModal(true);
        }}>
        Request Approval
      </Button>
    ) : (
      renderRequestButtonHtml('Request Approval', 'mr-4 w-sm-100', 'false')
    );
  };
  const displayApprovalFooterForInternalUsers = () => {
    return rightTickCondition ? (
      <>
        {' '}
        {details?.draft_from && !isDraftContractUpdated() ? (
          <span
            data-tip="Approval can only be requested if changes have been made."
            data-for="infoo">
            {displayApprovalBtn()}
          </span>
        ) : (
          displayApprovalBtn()
        )}
        {details?.draft_from && !isDraftContractUpdated() ? (
          <ReactTooltip id="infoo" aria-haspopup="true" place="bottom" />
        ) : (
          ''
        )}
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
      renderRequestButtonHtml('Request Approval', 'mr-4 w-sm-100', 'false')
    );
  };

  const displayApprovalFooter = () => {
    return (userInfo?.role?.includes('Team Manager - TAM') ||
      userInfo?.role?.includes('Sales Manager') ||
      userInfo?.role?.includes('BGS Manager')) &&
      transactionalData?.can_approve
      ? displayFooterForManagers()
      : displayApprovalFooterForInternalUsers();
  };

  const displayRequestSignatureFooter = () => {
    return rightTickCondition ? (
      <>
        {!isEditContract ? (
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
        ) : (
          renderRequestButtonHtml('Request Signature', 'mr-5 w-sm-100', 'false')
        )}
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
      renderRequestButtonHtml('Request Signature', 'mr-5 w-sm-100', 'false')
    );
  };

  const displayUnsavedChangesCount = () => {
    if (
      Object.keys(updatedFormData)?.length &&
      Object.keys(updatedFormData)?.includes('fee_structure')
    ) {
      if (
        Object.keys(updatedFormData?.fee_structure)?.includes('vendor') &&
        Object.keys(updatedFormData?.fee_structure)?.includes('seller')
      ) {
        return (
          Object.keys(updatedFormData)?.length +
          Object.keys(updatedFormData?.fee_structure?.vendor)?.length +
          Object.keys(updatedFormData?.fee_structure?.seller)?.length -
          1
        );
      }
      if (
        Object.keys(updatedFormData?.fee_structure)?.includes('vendor') &&
        updatedFormData?.fee_structure?.vendor !== undefined
      ) {
        return (
          Object.keys(updatedFormData)?.length +
          Object.keys(updatedFormData?.fee_structure?.vendor)?.length -
          1
        );
      }
      if (Object.keys(updatedFormData?.fee_structure)?.includes('seller')) {
        return (
          Object.keys(updatedFormData)?.length +
          Object.keys(updatedFormData?.fee_structure?.seller)?.length -
          1
        );
      }
    }
    return Object.keys(updatedFormData).length;
  };

  const displayFooterForSaveChanges = () => {
    return (
      <div className="mt-4 pt-5">
        <Footer className=" mt-5">
          <div className="container-fluid">
            <Button
              className="light-orange  on-boarding  mt-3  mr-0 ml-0 w-sm-50"
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
                {displayUnsavedChangesCount()} unsaved changes.
              </span>
            ) : (
              ''
            )}
          </div>
        </Footer>
      </div>
    );
  };

  return (
    <>
      {showPauseModal.show ? (
        <PauseAgreementConfirmation
          showPauseModal={showPauseModal}
          onClickOfUpdatePauseContract={onClickOfUpdatePauseContract}
          isLoading={isLoading}
          setShowPauseModal={setShowPauseModal}
        />
      ) : (
        ''
      )}

      {contractStatus === 'pending contract signature' ? (
        <div className="mt-4 pt-5">
          <Footer className=" mt-5 ">
            <div className="container-fluid ">
              {renderContractButtonHtml(
                () => onEditcontract(),
                'Edit Contract',
              )}
              {contractStatus === 'pending contract signature' ? (
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
        displayFooterForSaveChanges()
      ) : (
        <div className="mt-4 pt-5">
          <Footer>
            <div className="container-fluid">
              {checkApprovalCondition()
                ? displayApprovalFooter()
                : displayRequestSignatureFooter()}
            </div>
          </Footer>
        </div>
      )}

      {contractStatus === 'pending for cancellation' &&
      userInfo &&
      userInfo.role?.includes('BGS Manager') ? (
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

      {contractStatus === 'active pending for pause' &&
      userInfo &&
      userInfo.role?.includes('BGS Manager') ? (
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

ContractFooter.defaultProps = ContractFooterDefaultProptypes;
ContractFooter.propTypes = ContractFooterProptypes;
