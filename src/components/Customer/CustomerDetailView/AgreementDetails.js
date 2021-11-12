/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import Modal from 'react-modal';
import DatePicker from 'react-date-picker';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { func, string, bool, shape, oneOfType } from 'prop-types';

import Theme from '../../../theme/Theme';
import PastAgreement from './PastAgreement';
import OneTimeAgreement from './OneTimeAgreement';
import { getAccountDetails } from '../../../store/actions/accountState';
import { AddNewContractModal } from './Modals';
import {
  PageLoader,
  WhiteCard,
  Tabs,
  Status,
  ActionDropDown,
  ModalBox,
  Button,
  InputFormField,
  DropDownUncontained,
} from '../../../common';
import {
  ClockIcon,
  FileContract,
  RecurringIcon,
  DspOnlyIcon,
  ArrowIcons,
  CloseIcon,
  CaretUp,
  DisabledRecurring,
} from '../../../theme/images';
import {
  PATH_AGREEMENT,
  contractOptions,
  draftContractOptions,
  agreementOptions,
  pauseAgreementOptions,
  newAgreementTypes,
} from '../../../constants';
import {
  createTransactionData,
  createContract,
  deleteContract,
  getBGSManagers,
  savePauseAgreement,
  getPauseAgreement,
} from '../../../api';

export default function AgreementDetails({
  id,
  userId,
  setShowMemberList,
  showModal,
  setShowModal,
  userRole,
  customerStatus,
  getActivityLogInfo,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [viewComponent, setViewComponent] = useState('current');
  const multipleAgreement = useSelector(
    (state) => state.accountState.multipleAgreement,
  );
  const loader = useSelector((state) => state.accountState.isLoading);
  const [showPastAgreements, setShowPastAgreements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pauseDateDetails, setPauseDateDetails] = useState({
    start_date: null,
    end_date: null,
  });
  const [bgsManagerEmail, setBgsManagerEmail] = useState(null);
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [typeOfNewAgreement, setTypeOfNewAgreement] = useState({});
  const [existingContracts, setExistingContracts] = useState([]);
  const [replaceExisting, setReplaceExisting] = useState('alongside');
  const [replacedContract, setReplacedContract] = useState('');
  const [contractLoader, setContractLoader] = useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const { Option } = components;
  const DropdownIndicator = (dataProps) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...dataProps}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: dataProps.selectProps.menuIsOpen
                ? 'rotate(180deg)'
                : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      <img
        className="drop-down-user"
        src={dataProps.data.icon}
        alt="user"
        style={{
          marginRight: '9px',
          height: '20px',
          verticalAlign: 'middle',
          width: '18px',
          float: 'left',
        }}
      />
      {dataProps.data.label}
    </Option>
  );

  useEffect(() => {
    dispatch(getAccountDetails(id));
    getBGSManagers(id).then((res) => {
      setBgsManagerEmail(res && res.data && res.data.email);
    });
    getActivityLogInfo();
  }, [dispatch, id]);

  const countDays = (value) => {
    const date1 = new Date();
    const date2 = new Date(value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const createNewContract = (params) => {
    // Check if the agreemnt is draft or not & send API params accordingly

    createContract(params).then((res) => {
      setContractLoader(false);
      setIsLoading(false);
      history.push({
        pathname: PATH_AGREEMENT.replace(':id', id).replace(
          ':contract_id',
          res && res.data && res.data.id,
        ),
        state: history && history.location && history.location.pathname,
        showEditView: true,
      });
    });
  };

  const addBGSMangerEmail = () => {
    const firstModal = showModal;
    setShowModal(false);
    setShowMemberList({
      show: true,
      add: true,
      modal: true,
      agreement: firstModal,
    });
  };

  const getPauseHTML = (agreement) => {
    return (
      <>
        <li>
          <p className="basic-text ">
            {agreement && agreement.pause_length} Days
          </p>
        </li>
        <li>
          <span className="dot" />
          <p className="basic-text ">
            Paused &nbsp;
            {dayjs(agreement && agreement.start_date).format('MMM DD, YYYY')}
          </p>
        </li>
        <li>
          <span className="dot" />
          <p className="basic-text ">
            Expires:{' '}
            {dayjs(agreement && agreement.end_date).format('MMM DD, YYYY')}
          </p>
        </li>
      </>
    );
  };

  const handleContractOptions = (event, agreementId) => {
    switch (event.value) {
      case 'view':
        history.push({
          pathname: PATH_AGREEMENT.replace(':id', id).replace(
            ':contract_id',
            agreementId,
          ),
          state: history && history.location && history.location.pathname,
        });
        break;
      case 'draft':
        createNewContract({
          customer_id: id,
          draft_from: agreementId,
        });
        break;
      case 'pause':
        setShowModal({ pause: true, agreementId });
        break;
      case 'cancel':
        setShowModal({ cancel: true, agreementId });
        break;
      case 'edit':
        history.push({
          pathname: PATH_AGREEMENT.replace(':id', id).replace(
            ':contract_id',
            agreementId,
          ),
          state: history && history.location && history.location.pathname,
          showEditView: true,
        });
        break;
      case 'delete':
        setShowModal({ delete: true, agreementId });
        break;
      case 'unpause':
        getPauseAgreement(agreementId).then((res) => {
          if (res && res.status === 200) {
            const detail =
              res && res.data && res.data.results && res.data.results[0];
            savePauseAgreement(detail.id, {
              is_approved: false,
              rejected_by: userId,
            }).then((r) => {
              if (r && r.status === 200)
                toast.success('Your Agreement has been unpaused successfully.');
              dispatch(getAccountDetails(id));
              setPauseDateDetails({ start_date: null, end_date: null });
              getActivityLogInfo();
            });
          }
        });
        break;
      default:
        break;
    }
  };

  const isDraftContract = (agreement) => {
    if (
      agreement &&
      agreement.draft_from &&
      agreement.contract_status &&
      (agreement.contract_status.value === 'pending contract' ||
        agreement.contract_status.value === 'pending contract approval' ||
        agreement.contract_status.value === 'pending contract signature')
    ) {
      return true;
    }
    return false;
  };

  const generateHTML = () => {
    const fields = [];
    for (const agreement of multipleAgreement) {
      if (
        agreement &&
        agreement.contract_status &&
        agreement.contract_status.value !== 'inactive' &&
        agreement.contract_status.value !== 'cancel' &&
        !agreement.contract_type.toLowerCase().includes('one')
      )
        fields.push(
          <WhiteCard
            className={
              agreement && agreement.draft_from
                ? 'mt-3 mb-3 selected-card'
                : 'mt-3 mb-3'
            }
            key={agreement.id}>
            <div className="row">
              <div className="col-lg-9 col-md-9 col-12">
                <div className="solid-icon">
                  <img
                    width="48px"
                    className=" mb-2"
                    src={
                      agreement &&
                      agreement.contract_status &&
                      (agreement.contract_status.value === 'pause' ||
                        agreement.contract_status.value === 'draft')
                        ? DisabledRecurring
                        : agreement &&
                          agreement.contract_type &&
                          agreement.contract_type.toLowerCase().includes('dsp')
                        ? DspOnlyIcon
                        : RecurringIcon
                    }
                    alt=""
                  />
                </div>
                <div
                  className="contract-status mb-2"
                  role="presentation"
                  onClick={() => {
                    setShowModal(true);
                  }}>
                  <div style={{ display: 'flow-root' }} className="">
                    {agreement &&
                    agreement.contract_status &&
                    agreement.contract_status.value === 'active' ? (
                      ''
                    ) : (
                      <Status
                        className="mr-2 mb-1"
                        label={
                          isDraftContract(agreement)
                            ? 'Draft'
                            : agreement &&
                              agreement.contract_status &&
                              agreement.contract_status.label
                        }
                        backgroundColor={Theme.gray8}
                      />
                    )}
                    {/* <div className="clear-fix" /> */}
                    <p className="black-heading-title mt-0 mb-0">
                      {agreement &&
                      agreement.contract_type &&
                      agreement.contract_type.toLowerCase().includes('notice')
                        ? 'Recurring (90 day notice) Service Agreement'
                        : agreement &&
                          agreement.contract_type &&
                          agreement.contract_type.toLowerCase().includes('dsp')
                        ? 'DSP Service Agreement'
                        : 'Recurring Service Agreement'}
                    </p>
                  </div>

                  {agreement && agreement.contract_type !== 'one time' ? (
                    <ul className="recurring-contact">
                      {agreement &&
                      agreement.contract_status &&
                      agreement.contract_status.value !== 'pause' ? (
                        <>
                          <li>
                            <p className="basic-text ">
                              {agreement &&
                                agreement.length &&
                                agreement.length.label &&
                                agreement.length.label.slice(0, -1)}{' '}
                            </p>
                          </li>
                          {agreement && agreement.start_date ? (
                            <li>
                              <span className="dot" />
                              <p className="basic-text ">
                                {agreement.contract_status &&
                                agreement.contract_status.value === 'renewed'
                                  ? 'Renewed'
                                  : 'Started'}
                                &nbsp;
                                {dayjs(agreement.start_date).format(
                                  'MMM DD, YYYY',
                                )}
                              </p>
                            </li>
                          ) : (
                            ''
                          )}
                          {agreement && agreement.end_date ? (
                            <li>
                              <span className="dot" />
                              <p className="basic-text ">
                                Expires:{' '}
                                {dayjs(agreement.end_date).format(
                                  'MMM DD, YYYY',
                                )}
                              </p>
                            </li>
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        <>
                          {getPauseHTML(agreement && agreement.pause_contract)}
                        </>
                      )}

                      {agreement &&
                      agreement.end_date &&
                      countDays(agreement && agreement.end_date) <= 90 ? (
                        <li>
                          <div className="days-block">
                            {' '}
                            <img
                              className="clock-icon"
                              src={ClockIcon}
                              alt="clock"
                            />{' '}
                            {countDays(agreement && agreement.end_date)} days
                          </div>
                        </li>
                      ) : (
                        ''
                      )}
                    </ul>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <div className="clear-fix" />
              {agreement &&
              agreement.contract_status &&
              (agreement.contract_status.value === 'pending account setup' ||
                agreement.contract_status.value === 'active') &&
              agreement.contract_url === null ? null : (
                <div
                  className="col-lg-3 pl-lg-0   col-md-3 col-12 text-right"
                  role="presentation"
                  onClick={() =>
                    localStorage.setItem('agreementID', agreement.id)
                  }>
                  {agreement.draft_from && userRole !== 'Customer' ? (
                    <ActionDropDown>
                      {' '}
                      <Select
                        classNamePrefix="react-select"
                        placeholder="View Actions"
                        className="active"
                        options={
                          isDraftContract(agreement)
                            ? draftContractOptions
                            : (agreement &&
                                agreement.pause_contract &&
                                agreement.pause_contract.end_date >
                                  dayjs(new Date()).format('YYYY-MM-DD') &&
                                agreement.pause_contract &&
                                agreement.pause_contract.is_approved) ||
                              agreement.contract_status.value === 'pause' ||
                              agreement.contract_status.value ===
                                'active pending for pause'
                            ? pauseAgreementOptions
                            : contractOptions
                        }
                        onChange={(event) =>
                          handleContractOptions(event, agreement.id)
                        }
                        components={{
                          DropdownIndicator,
                          Option: IconOption,
                        }}
                        value=""
                      />
                    </ActionDropDown>
                  ) : userRole === 'Customer' ||
                    agreement.contract_status.value === 'pending contract' ||
                    agreement.contract_status.value ===
                      'pending contract approval' ||
                    agreement.contract_status.value ===
                      'pending contract signature' ||
                    customerStatus === 'pending account setup' ? (
                    <Link
                      to={{
                        pathname: PATH_AGREEMENT.replace(':id', id).replace(
                          ':contract_id',
                          agreement.id,
                        ),
                        state:
                          history &&
                          history.location &&
                          history.location.pathname,
                      }}>
                      <Button className="btn-transparent w-100 view-contract">
                        {' '}
                        <img
                          className="file-contract-icon"
                          src={FileContract}
                          alt=""
                        />
                        View Agreement
                      </Button>
                    </Link>
                  ) : (
                    <ActionDropDown>
                      {' '}
                      <Select
                        classNamePrefix="react-select"
                        placeholder="View Actions"
                        className="active"
                        options={
                          (agreement &&
                            agreement.pause_contract &&
                            agreement.pause_contract.end_date >
                              dayjs(new Date()).format('YYYY-MM-DD') &&
                            agreement.pause_contract &&
                            agreement.pause_contract.is_approved) ||
                          agreement.contract_status.value === 'pause' ||
                          agreement.contract_status.value ===
                            'active pending for pause'
                            ? pauseAgreementOptions
                            : contractOptions
                        }
                        onChange={(event) =>
                          handleContractOptions(event, agreement.id)
                        }
                        components={{
                          DropdownIndicator,
                          Option: IconOption,
                        }}
                        value=""
                      />
                    </ActionDropDown>
                  )}
                </div>
              )}
              <div className="straight-line horizontal-line pt-3 mb-3" />
            </div>
            {/* className="disabled" */}
            <CustomerDetailCoppase
              className={
                agreement.contract_status.value === 'pause' ? 'disabled' : ''
              }>
              <div className="DSP-contract-retainer">
                <div className="row ">
                  {agreement && agreement.contract_type === 'recurring' ? (
                    <>
                      {agreementOptions.map((item) => (
                        <div
                          className=" col-lg-3 col-md-3 mb-3 col-6 "
                          key={item.key}>
                          <div className="label">{item.label}</div>
                          {agreement && agreement[item.key] ? (
                            <NumberFormat
                              displayType="text"
                              value={
                                agreement[item.key].label || agreement[item.key]
                              }
                              thousandSeparator
                              prefix={
                                item.key === 'rev_share' ||
                                item.key === 'content_optimization' ||
                                item.key === 'design_optimization'
                                  ? ''
                                  : '$'
                              }
                              suffix={item.key === 'rev_share' ? '%' : ''}
                            />
                          ) : (
                            '0'
                          )}
                        </div>
                      ))}
                    </>
                  ) : agreement && agreement.contract_type === 'dsp only' ? (
                    <div className=" col-lg-3 col-md-3 col-6">
                      <div className="label">Monthly Ad Budget</div>
                      <NumberFormat
                        displayType="text"
                        value={agreement.dsp_fee || 0}
                        thousandSeparator
                        prefix="$"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {agreement && agreement.contract_type === 'recurring' ? (
                <>
                  <div className="straight-line horizontal-line pt-1 mb-3" />
                  <div className="label">Marketplaces</div>
                  <ul className="selected-list">
                    {agreement &&
                    agreement.primary_marketplace === null &&
                    agreement.additional_marketplaces === null
                      ? 'No Marketplaces added.'
                      : ''}
                    {agreement && agreement.primary_marketplace ? (
                      <li>{agreement.primary_marketplace.name} (Primary)</li>
                    ) : (
                      ''
                    )}
                    {agreement && agreement.additional_marketplaces
                      ? agreement.additional_marketplaces.map((item) => (
                          <li key={item.id}>
                            {item.name || ''}{' '}
                            {item.is_primary ? '(Primary)' : ''}
                          </li>
                        ))
                      : ''}
                  </ul>
                  <div className="label mt-3">Additional Monthly Services</div>
                  <ul className="selected-list">
                    {agreement && agreement.additional_monthly_services
                      ? agreement.additional_monthly_services.map((item) => (
                          <li key={item.id}>
                            {(item && item.service && item.service.name) || ''}
                          </li>
                        ))
                      : 'No Additional Monthly services added.'}
                  </ul>
                  <div className="straight-line horizontal-line pt-3 mb-3" />
                </>
              ) : (
                ''
              )}

              {agreement && agreement.contract_type !== 'dsp only' ? (
                <>
                  <div className="label">One Time Services</div>
                  <ul className="selected-list">
                    {agreement && agreement.additional_one_time_services
                      ? agreement.additional_one_time_services.map((item) => (
                          <li key={item.id}>
                            {(item && item.service && item.service.name) || ''}{' '}
                            ({(item && item.quantity) || ''})
                          </li>
                        ))
                      : 'No One Time services added.'}
                  </ul>
                </>
              ) : (
                ''
              )}
            </CustomerDetailCoppase>
          </WhiteCard>,
        );
    }

    return fields && fields.length === 0 ? (
      <WhiteCard className="text-center mt-2">No Agreements Found.</WhiteCard>
    ) : (
      fields
    );
  };

  const handleChange = (date, type) => {
    setPauseDateDetails({ ...pauseDateDetails, [type]: date });
  };

  const generateModals = () => {
    if (showModal.cancel || showModal.pauseApproval) {
      return (
        <>
          <p className="black-heading-title text-center mt-3">
            {showModal.pauseApproval ? 'Pause Agreement' : 'Cancel Agreement'}
          </p>
          {!bgsManagerEmail ? (
            <p className="long-text mb-2 text-center ">
              For approval please add the{' '}
              <span
                className="cursor"
                style={{ color: Theme.orange }}
                onClick={() => addBGSMangerEmail()}
                role="presentation">
                BGS Manager
              </span>{' '}
              first.
            </p>
          ) : (
            ''
          )}
          <p className="long-text mb-2 text-center ">
            {' '}
            Are you sure you would like to request approval to{' '}
            {showModal.pauseApproval ? 'pause' : 'cancel'} this agreement?
          </p>
        </>
      );
    }
    if (showModal.pause) {
      return (
        <>
          <h4 className="on-boarding mb-3 pb-2">Pause Agreement</h4>
          {!bgsManagerEmail ? (
            <p className="long-text mb-2 pb-1">
              For approval please add the{' '}
              <span
                className="cursor"
                style={{ color: Theme.orange }}
                onClick={() => addBGSMangerEmail()}
                role="presentation">
                BGS Manager
              </span>{' '}
              first.
            </p>
          ) : (
            ''
          )}
          <p className="long-text mb-2 pb-1">
            {' '}
            Before you proceed, please enter the duration to pause this
            agreement.
          </p>
          <div className="row">
            <div className="col-6">
              <InputFormField>
                <DatePicker
                  minDate={new Date()}
                  className="form-control"
                  id="date"
                  placeholder="Start Date"
                  value={pauseDateDetails.start_date}
                  onChange={(date) => handleChange(date, 'start_date')}
                  format="MM-dd-yyyy"
                  clearIcon={null}
                />
              </InputFormField>
            </div>
            <div className="col-6">
              <InputFormField>
                <DatePicker
                  minDate={
                    pauseDateDetails.start_date &&
                    dayjs(pauseDateDetails.start_date).add(1, 'day') &&
                    dayjs(pauseDateDetails.start_date).add(1, 'day').$d
                  }
                  className="form-control"
                  id="date"
                  placeholder="End Date"
                  value={pauseDateDetails.end_date}
                  onChange={(date) => handleChange(date, 'end_date')}
                  format="MM-dd-yyyy"
                  clearIcon={null}
                  disabled={!pauseDateDetails.start_date}
                />
              </InputFormField>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <p className="black-heading-title text-center  mt-2">
          Delete Agreement
        </p>
        <div className="alert-msg pb-3 ">
          Are you sure you would like to delete this agreement?
          <div className="sure-to-proceed">This action cannot be undone.</div>
        </div>
      </>
    );
  };

  const transactionalAPI = (type) => {
    const data = {
      contract: showModal.agreementId,
      primary_email: bgsManagerEmail,
      contract_status: type,
      user: userId,
    };

    createTransactionData(data).then((response) => {
      if (response.status === 200 || response.status === 201) {
        setShowModal(false);
        setIsLoading(false);
        const statusName = showModal.pause ? 'Pausing' : 'Cancelling';
        toast.success(
          `We have emailed the BGS manager for ${statusName} your agreement.`,
        );
        dispatch(getAccountDetails(id));
        getActivityLogInfo();
      }
    });
  };

  const saveDetails = () => {
    setIsLoading(true);
    if (showModal.cancel) {
      transactionalAPI('pending for cancellation');
    } else if (showModal.pauseApproval) {
      setIsLoading(true);
      const detail = {
        contract: showModal.agreementId,
        start_date: dayjs(pauseDateDetails.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(pauseDateDetails.end_date).format('YYYY-MM-DD'),
      };
      savePauseAgreement(null, detail).then((res) => {
        if ((res && res.status === 201) || (res && res.status === 200)) {
          transactionalAPI('active pending for pause');
        }
      });
    } else if (showModal.pause) {
      setShowModal({ ...showModal, pauseApproval: true });
      setIsLoading(false);
    } else {
      deleteContract(showModal.agreementId).then(() => {
        setShowModal(false);
        setIsLoading(false);
        dispatch(getAccountDetails(id));
        toast.success('Your Agreement is deleted successfully.');
      });
    }
  };

  const checkExistingAgreements = (agreementType) => {
    // Filter active & renewed agreements of selected type
    const filteredContracts = multipleAgreement.filter(
      (agreement) =>
        agreement.contract_type === agreementType.value &&
        (agreement.contract_status.value === 'active' ||
          agreement.contract_status.value === 'renewed'),
    );
    setExistingContracts([...filteredContracts]);

    // if there are any filterd agreements present then show modal, else create new agreement
    if (filteredContracts.length > 0) {
      setShowAddContractModal(true);
      setReplacedContract(filteredContracts[0].id);
    } else {
      setIsLoading(true);
      createNewContract({
        customer_id: id,
        contract_type: agreementType.value,
        start_date: dayjs(new Date()).format('YYYY-MM-DD'),
      });
    }
  };

  const confirmContract = () => {
    // if agreement will run alongside current agreement, else replace existing agreement

    if (replaceExisting === 'alongside') {
      createNewContract({
        customer_id: id,
        contract_type: typeOfNewAgreement.value,
        start_date: dayjs(new Date()).format('YYYY-MM-DD'),
      });
    } else {
      createNewContract({
        customer_id: id,
        draft_from: replacedContract,
      });
    }
  };

  return (
    <>
      <div className="col-lg-6 col-12 cutomer-middle-panel">
        <Tabs>
          <ul className="tabs">
            <li
              className={viewComponent === 'current' ? 'active' : ''}
              onClick={() => setViewComponent('current')}
              role="presentation">
              Recurring Agreements
            </li>
            <li
              className={viewComponent === 'past' ? 'active' : ''}
              onClick={() => setViewComponent('past')}
              role="presentation">
              One Time Agreements
            </li>
          </ul>
        </Tabs>
        <>
          {loader ? (
            <PageLoader
              component="agrement-details"
              color="#FF5933"
              type="detail"
              width={40}
              height={40}
            />
          ) : (
            <>
              {viewComponent === 'current' ? (
                <>
                  <DropDownUncontained
                    options={newAgreementTypes}
                    setSelectedOption={setTypeOfNewAgreement}
                    extraAction={checkExistingAgreements}
                    DropdownIndicator={DropdownIndicator}
                  />
                  {generateHTML()}
                  <div
                    className="looking-past-agre"
                    onClick={() => setShowPastAgreements(true)}
                    role="presentation">
                    <p className="gray-normal-text">
                      <img
                        width="16px;"
                        style={{ verticalAlign: 'text-top', marginLeft: '5px' }}
                        src={FileContract}
                        alt="file"
                      />{' '}
                      Looking for Past Agreements?
                      <span
                        className="cursor"
                        role="presentation"
                        onClick={() => setShowPastAgreements(true)}
                        style={{
                          fontWeight: '600',
                          marginLeft: '7px',
                          position: 'relative',
                        }}>
                        {' '}
                        View here
                        <img
                          style={{
                            transform: 'rotate(180deg)',
                            width: '13px',
                            top: '2px',
                            right: '-16px',
                            position: 'absolute',
                          }}
                          src={ArrowIcons}
                          alt="arrow"
                        />
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <OneTimeAgreement
                  agreements={multipleAgreement.filter((op) =>
                    op.contract_type.toLowerCase().includes('one'),
                  )}
                  id={id}
                  history={history}
                  setViewComponent={setViewComponent}
                />
              )}
            </>
          )}
        </>
        {showPastAgreements ? (
          <PastAgreement
            showPastAgreements={showPastAgreements}
            setShowPastAgreements={setShowPastAgreements}
            history={history}
            id={id}
            agreements={multipleAgreement.filter(
              (op) =>
                (op.contract_status &&
                  op.contract_status.value === 'inactive') ||
                (op.contract_status && op.contract_status.value === 'cancel'),
            )}
          />
        ) : (
          ''
        )}
        <Modal
          isOpen={showModal[Object.keys(showModal)[0]]}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Edit modal">
          {showModal.pause ? (
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => {
                setShowModal(false);
                setPauseDateDetails({ start_date: null, end_date: null });
              }}
              role="presentation"
            />
          ) : (
            ''
          )}

          <ModalBox>
            <div className="modal-body">
              {generateModals()}
              <div className="row mt-1">
                <div className="col-6 mt-4">
                  <Button
                    className="btn-primary w-100"
                    onClick={() => saveDetails()}
                    disabled={
                      showModal.pause
                        ? !pauseDateDetails.start_date ||
                          !pauseDateDetails.end_date
                        : !bgsManagerEmail && !showModal.delete
                    }>
                    {isLoading ? (
                      <PageLoader color="#fff" type="button" />
                    ) : showModal.cancel || showModal.pauseApproval ? (
                      'Request Approval'
                    ) : showModal.pause ? (
                      'Confirm Duration'
                    ) : (
                      'Confirm Delete'
                    )}
                  </Button>
                </div>
                <div className="col-6 mt-4">
                  <Button
                    className="btn-transparent w-100"
                    onClick={() => {
                      if (showModal.pause)
                        setPauseDateDetails({
                          start_date: null,
                          end_date: null,
                        });

                      if (showModal.pauseApproval) {
                        setPauseDateDetails({
                          ...pauseDateDetails,
                        });
                        setShowModal({
                          ...showModal,
                          pause: true,
                          pauseApproval: false,
                          cancel: false,
                          delete: false,
                        });
                      } else
                        setShowModal({
                          ...showModal,
                          pause: false,
                          pauseApproval: false,
                          cancel: false,
                          delete: false,
                        });
                    }}>
                    {showModal.cancel || showModal.pauseApproval
                      ? "Don't Request"
                      : showModal.pause
                      ? 'Cancel'
                      : "Don't Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </ModalBox>
        </Modal>
        {showAddContractModal ? (
          <AddNewContractModal
            customStyles={customStyles}
            showAddContractModal={showAddContractModal}
            setShowAddContractModal={setShowAddContractModal}
            typeOfNewAgreement={typeOfNewAgreement}
            existingContracts={existingContracts}
            replaceExisting={replaceExisting}
            setReplaceExisting={setReplaceExisting}
            replacedContract={replacedContract}
            setReplacedContract={setReplacedContract}
            confirmContract={confirmContract}
            contractLoader={contractLoader}
            setContractLoader={setContractLoader}
          />
        ) : null}
      </div>
    </>
  );
}

AgreementDetails.propTypes = {
  id: string.isRequired,
  userId: string.isRequired,
  setShowMemberList: func.isRequired,
  setShowModal: func.isRequired,
  showModal: oneOfType([bool, shape({})]).isRequired,
  userRole: string.isRequired,
  customerStatus: string.isRequired,
  getActivityLogInfo: func.isRequired,
};

const CustomerDetailCoppase = styled.div`
  .ReactCollapse--content {
    width: 100%;
  }
`;
