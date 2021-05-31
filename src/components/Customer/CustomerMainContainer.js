/* eslint-disable import/no-cycle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import styled from 'styled-components/macro';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';

import Theme from '../../theme/Theme';
import {
  EditOrangeIcon,
  FileContract,
  Organization,
  ExchangeIcon,
  AddIcons,
  DefaultUser,
  CloseIcon,
  CompanyDefaultUser,
  LeftArrowIcon,
  GreyBannerBg,
  BackArrowIcon,
  HeartMonitorIcon,
  WhiteCaretUp,
  CaretUp,
  AccountSetupIcon,
  BillingIcon,
  // TimesCircle,
} from '../../theme/images/index';
import { GroupUser } from '../../theme/Global';
import {
  ModalBox,
  PageLoader,
  GetInitialName,
  DropDownStatus,
  PageNotFound,
  BackToTop,
  Button,
  WhiteCard,
  // ContractFormField,
} from '../../common';
// import { getAccountDetails } from '../../store/actions/accountState';
import {
  getContactDetails,
  getCustomerDetails,
  setCustomerSelectedTab,
} from '../../store/actions/customerState';
import {
  AgreementDetails,
  CompanyDetail,
  CustomerStatus,
  EditAccountDetails,
} from './index';
import CompanyPerformance from './CompanyPerformance/CompanyPerformanceContainer';
import BillingDetails from './BillingDetails';
import Activity from './Activity';
import {
  getCustomerActivityLog,
  getAmazonDetails,
  getCustomerMembers,
  getDocumentList,
  getMarketPlaceList,
} from '../../api';
import { AddTeamMember, EditTeamMember } from '../Team/index';
import { PATH_CUSTOMER_LIST } from '../../constants';
import 'react-toastify/dist/ReactToastify.css';
import { showOnboardingMsg } from '../../store/actions/userState';

const AccountSetupcustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '480px ',
    width: '100% ',
    minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const alertCustomStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '474px ',
    width: '100% ',
    // minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function CustomerMainContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const agreement = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const customerLoader = useSelector((state) => state.customerState.isLoading);
  const customer = useSelector((state) => state.customerState.data);
  const customerSelectedTab = useSelector(
    (state) => state.customerState.customerSelectedTab,
  );
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [isSaveData, IsSaveDataClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewComponent, setViewComponent] = useState(
    customerSelectedTab || 'performance',
  );
  const [showMemberList, setShowMemberList] = useState({
    show: false,
    add: false,
    modal: false,
  });
  const [marketplaceChoices, setMarketplaceChoices] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [activityData, setActivityData] = useState(null);
  const [activityCount, setActivityCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [images, setImages] = useState([]);
  const [amazonDetails, setAmazonDetails] = useState([]);
  const [statusModal, setStatusModal] = useState({
    show: false,
    type: '',
  });
  const [memberCount, setMemberCount] = useState(null);
  const profileLoader = useSelector(
    (state) => state.userState.isActivityLoading,
  );
  const [teamDeleteModal, setTeamDeleteModal] = useState(false);
  const customerError = useSelector((state) => state.customerState.error);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const showOnBoardingSuccessMsg = useSelector(
    (state) => state.userState.showForgotMsg,
  );

  let statusActions = [
    { value: 'active', label: 'Activate' },
    { value: 'at risk', label: 'Place at risk' },
    { value: 'inactive', label: 'Inactivate' },
  ];

  let viewOptions = [
    { value: 'performance', label: 'Performance' },
    { value: 'agreement', label: 'Agreements' },
    { value: 'company', label: 'Company Details' },
    { value: 'activity', label: 'Activity' },
  ];

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      minHeight: userInfo && userInfo.role === 'Customer' ? '130px' : '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img
            src={
              customer &&
              customer.status &&
              customer.status.value === 'pending cancellation'
                ? CaretUp
                : WhiteCaretUp
            }
            alt="caret"
            style={{
              transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : '',
              width:
                customer &&
                customer.status &&
                customer.status.value === 'pending cancellation'
                  ? '15px'
                  : '11px',
              height:
                customer &&
                customer.status &&
                customer.status.value === 'pending cancellation'
                  ? '15px'
                  : '11px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const getActivityLogInfo = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'activityPage' });
      getCustomerActivityLog(currentPage, id).then((response) => {
        setActivityData(response && response.data && response.data.results);
        setActivityCount(response && response.data && response.data.count);
        setPageNumber(currentPage);
        getDocumentList().then((picResponse) => {
          setImages(picResponse);
        });
        setIsLoading({ loader: false, type: 'activityPage' });
      });
    },
    [id],
  );

  const getCustomerMemberList = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getCustomerMembers(id).then((member) => {
      getActivityLogInfo();
      setMemberData(member && member.data && member.data.results);
      setMemberCount(member && member.data && member.data.count);
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [id, getActivityLogInfo]);

  const getAmazon = useCallback(() => {
    getAmazonDetails(id).then((res) => {
      setAmazonDetails(
        res && res.data && res.data.results && res.data.results[0],
      );
    });
  }, [id]);

  const getMarketPlace = useCallback(() => {
    getMarketPlaceList(id).then((res) => {
      setMarketplaceChoices(res && res.data);
    });
  }, [id]);

  if (isSaveData && !loader && !customerLoader) {
    toast.success('Changes Saved!');
    IsSaveDataClicked(false);
  }

  useEffect(() => {
    if (userInfo && userInfo.role !== 'Customer') {
      getMarketPlace(id);
      getAmazon();
    }

    if (userInfo && userInfo.role === 'Customer') {
      setViewComponent('agreement');
      dispatch(setCustomerSelectedTab('agreement'));
    }
    if (profileLoader) {
      getActivityLogInfo();
    }
  }, [
    dispatch,
    id,
    getCustomerMemberList,
    getActivityLogInfo,
    getAmazon,
    getMarketPlace,
    profileLoader,
    userInfo,
  ]);

  useEffect(() => {
    dispatch(getCustomerDetails(id));
    dispatch(getContactDetails(id));
    getCustomerMemberList();
    getActivityLogInfo();
  }, [dispatch, id, getActivityLogInfo, getCustomerMemberList]);

  if (userInfo && userInfo.role === 'Customer') {
    viewOptions = [
      { value: 'agreement', label: 'Agreements' },
      { value: 'company', label: 'Company Details' },
      { value: 'billing', label: 'Billing' },
      { value: 'activity', label: 'Activity' },
    ];
  }

  const getActivityInitials = (user) => {
    const firstName =
      (user &&
        user.split(' ').slice(0, 2) &&
        user.split(' ').slice(0, 2)[0].charAt(0)) ||
      '';
    const lastName =
      (user &&
        user.split(' ').slice(0, 2) &&
        user.split(' ').slice(0, 2)[1].charAt(0)) ||
      '';

    return firstName + lastName;
  };

  const displayMixedLog = (logUser, msg) => {
    return msg.map((item, index) => {
      const field = item.split('from')[0];
      let oldValue = item.split('from')[1].split(' to ')[0];
      let newValue = item.split('from')[1].split(' to ')[1].split(', ,')[0];

      if (
        item.includes('annual revenue') ||
        item.includes('number of employees') ||
        item.includes('monthly retainer') ||
        item.includes('sales threshold') ||
        item.includes('fee') ||
        item.includes('discount amount')
        //  ||
        // item.includes('custom amazon store price')
      ) {
        oldValue = oldValue.replace('.00', '');
        newValue = newValue.replace('.00', '');
        oldValue = oldValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        newValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return (
        <>
          {index === 0 ? logUser : ''}
          <span>updated {field || ''} from </span> {oldValue || ''}
          <span> to </span> {newValue === '' ? 'None' : newValue}
        </>
      );
    });
  };

  const displayLog = (logUser, field, oldValue, newValue) => {
    return (
      <>
        {logUser || ''}
        <span>updated {field || ''} from </span> {oldValue || ''}
        <span> to </span> {newValue === '' ? 'None' : newValue}
      </>
    );
  };

  const activityDetail = (item) => {
    let activityMessage = '';
    let logUser;
    let field;
    let oldValue;
    let newValue = '';
    let mixedLog = false;
    if (
      item &&
      item.history_change_reason.includes('created new record by company name')
    ) {
      activityMessage = item.history_change_reason.split(
        'created new record by company name',
      );
      return (
        <>
          {activityMessage[0]}
          <span>created new record by company name</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item.history_change_reason.includes('deleted')) {
      activityMessage = item.history_change_reason.split('deleted');
      return (
        <>
          {activityMessage[0]}
          <span>deleted</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item && item.history_change_reason.includes('updated')) {
      activityMessage = item.history_change_reason.split('updated');
      logUser = activityMessage[0];
      field = activityMessage[1].split('from')[0];
      oldValue = activityMessage[1].split('from')[1].split(' to ')[0];
      newValue = activityMessage[1]
        .split('from')[1]
        .split(' to ')[1]
        .split(', ,')[0];

      if (activityMessage.length > 2) {
        mixedLog = true;
        activityMessage.shift();
      }
      if (
        !mixedLog &&
        ((item && item.history_change_reason.includes('annual revenue')) ||
          (item &&
            item.history_change_reason.includes('number of employees')) ||
          (item && item.history_change_reason.includes('monthly retainer')) ||
          (item && item.history_change_reason.includes('sales threshold')) ||
          (item && item.history_change_reason.includes('fee')) ||
          (item && item.history_change_reason.includes('discount amount')) ||
          (item &&
            item.history_change_reason.includes('custom amazon store price')))
      ) {
        let fromAmount = '';
        let toAmount = '';
        let rowAmount = [];
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[0] !== ''
        ) {
          rowAmount = activityMessage[1].split(' from ')[1].split(' to ')[0];
          if (rowAmount.split('.')[1] === '00') {
            fromAmount = rowAmount.split('.')[0];
          } else {
            fromAmount = rowAmount;
          }
        }
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[1] !== ''
        ) {
          rowAmount = activityMessage[1].split(' from ')[1].split(' to ')[1];
          if (rowAmount.split('.')[1] === '00') {
            toAmount = rowAmount.split('.')[0];
          } else {
            toAmount = rowAmount;
          }
        }
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>
              updated {activityMessage && activityMessage[1].split(' from ')[0]}{' '}
              from{' '}
            </span>{' '}
            {fromAmount === ''
              ? 'None'
              : fromAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span> to </span>{' '}
            {toAmount === ''
              ? 'None'
              : toAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }

      return activityMessage && activityMessage[1].includes('addendum')
        ? item.history_change_reason
        : mixedLog
        ? displayMixedLog(logUser, activityMessage)
        : displayLog(logUser, field, oldValue, newValue);
    }
    if (item && item.history_change_reason.includes('requested for')) {
      activityMessage = item.history_change_reason.split('requested for');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>requested for</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    if (item && item.history_change_reason.includes('added')) {
      activityMessage = item.history_change_reason.split('added');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>added</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    if (item && item.history_change_reason.includes('removed')) {
      activityMessage = item.history_change_reason.split('removed');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>removed</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    return item && item.history_change_reason ? item.history_change_reason : '';
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getActivityLogInfo(currentPage);
  };

  const checkStatus = () => {
    if (customer && customer.status) {
      statusActions = statusActions.filter(
        (op) => op.value !== customer.status.value,
      );
    }
  };

  const checkStatusColor = () => {
    if (customer && customer.status) {
      if (customer.status.value === 'inactive') {
        return '#69707f';
      }
      if (customer.status.value === 'pending cancellation') {
        return '#f7c137';
      }
      if (customer.status.value === 'at risk') {
        return '#d63649';
      }
      if (customer.status.value === 'pending account setup') {
        return '#69707f';
      }
      return '#74B035';
    }
    return '';
  };

  return (
    <>
      {(customerError &&
        customerError.status &&
        customerError.status === 404) ||
      (customerError &&
        customerError.status &&
        customerError.status === 403) ? (
        <PageNotFound />
      ) : (
        <>
          {profileLoader ||
          loader ||
          customerLoader ||
          (isLoading.loader && isLoading.type === 'page') ? (
            <PageLoader color="#FF5933" type="page" width={20} />
          ) : (
            <>
              {/* <AlertMsgUpdate className="account-verify">
                We’ve initiated a small charge to your bank account. We’ll email
                you within 3 days to verify the payment.
                Please verify your bank account
                <Button
                  className="btn-transparent verify-now-btn ml-3"
                  onClick={() => {
                    setShowModal(true);
                  }}>
                  Verify Now
                </Button>
              </AlertMsgUpdate> */}

              {userInfo && userInfo.role !== 'Customer' ? (
                <BackBtn className="d-lg-none d-block ">
                  <Link className="back-customer-list" to={PATH_CUSTOMER_LIST}>
                    {' '}
                    <img
                      className="left-arrow"
                      src={BackArrowIcon}
                      alt=""
                    />{' '}
                    Back to all customers
                  </Link>
                </BackBtn>
              ) : (
                ''
              )}
              <CustomerDetailBanner>
                <div className="banner">
                  <div className="inner" />
                </div>

                <CustomerBody>
                  {userInfo && userInfo.role !== 'Customer' ? (
                    <Link to={PATH_CUSTOMER_LIST}>
                      <div className="back-btn-link d-lg-block d-none">
                        {' '}
                        <img
                          className="left-arrow"
                          src={LeftArrowIcon}
                          alt=""
                        />
                        Back to all customers
                      </div>
                    </Link>
                  ) : (
                    ''
                  )}

                  <WhiteCard className="customer-brand-details mb-n2">
                    <div className="row">
                      <div className="col-lg-3 col-md-12 pr-0">
                        <div className="brand-logo">
                          {' '}
                          {customer &&
                          customer.documents &&
                          customer.documents[0] ? (
                            <img
                              src={Object.values(customer.documents[0])}
                              alt="company-logo"
                            />
                          ) : (
                            <img
                              className="brand-logo"
                              src={CompanyDefaultUser}
                              alt="company-logo"
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-lg-9 col-md-12 ">
                        <span className="brand-name ">
                          <span className="company-name">
                            {' '}
                            {customer.company_name}
                          </span>

                          {customer &&
                          customer.status &&
                          customer.status.value !== null ? (
                            customer &&
                            customer.status &&
                            customer.status.value ===
                              'pending account setup' ? (
                              <span className="company-status inactive">
                                {customer &&
                                  customer.status &&
                                  customer.status.label}
                              </span>
                            ) : userInfo && userInfo.role === 'Customer' ? (
                              <span
                                className="company-status"
                                style={{
                                  background: checkStatusColor(),
                                  color:
                                    customer.status.value ===
                                    'pending cancellation'
                                      ? 'black'
                                      : '',
                                }}>
                                {customer &&
                                  customer.status &&
                                  customer.status.label}
                              </span>
                            ) : (
                              <DropDownStatus>
                                {checkStatus()}
                                <Select
                                  isSearchable={false}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      background: checkStatusColor(),
                                      borderRadius: '50px',
                                      minHeight: '24px',
                                      outline: 'none !important',
                                      boxShadow: 'none  !important',
                                      outLine: 'none',
                                      cursor: 'pointer',
                                      width:
                                        (customer &&
                                          customer.status &&
                                          customer.status.value ===
                                            'pending cancellation') ||
                                        (customer &&
                                          customer.status &&
                                          customer.status.value ===
                                            'pending account setup')
                                          ? '176px !important'
                                          : customer &&
                                            customer.status &&
                                            customer.status.value === 'at risk'
                                          ? '120px'
                                          : '88px',
                                      '&:focus': {
                                        outline: 'none !important',
                                        boxShadow: 'none  !important',
                                      },
                                      '&:hover': {
                                        outline: 'none',
                                      },
                                    }),
                                    singleValue: (provided) => {
                                      const color =
                                        customer &&
                                        customer.status &&
                                        customer.status.value ===
                                          'pending cancellation'
                                          ? '#000'
                                          : '#fff';

                                      return { ...provided, color };
                                    },
                                  }}
                                  classNamePrefix="react-select"
                                  options={statusActions}
                                  onChange={(e) =>
                                    setStatusModal({
                                      show: true,
                                      type: e.value,
                                    })
                                  }
                                  value={customer && customer.status}
                                  components={{
                                    DropdownIndicator,
                                  }}
                                />
                              </DropDownStatus>
                            )
                          ) : (
                            <span className="company-status inactive capitalize">
                              {customer && customer.contract_status}
                            </span>
                          )}
                        </span>

                        <div
                          className=" edit-details edit-brand-details "
                          onClick={() => setShowModal(true)}
                          role="presentation">
                          <img src={EditOrangeIcon} alt="" />
                          Edit
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-4 col-12">
                            <div className="company-label-info text-left">
                              {customer && customer.address
                                ? `${customer.address}`
                                : ''}
                              {customer && customer.city
                                ? `, ${customer.city}`
                                : ''}
                              {customer &&
                              customer.state &&
                              customer.state.label
                                ? `, ${customer.state.label}`
                                : customer && customer.state
                                ? `, ${customer.state}`
                                : ''}
                              {customer && customer.zip_code
                                ? `, ${customer.zip_code}`
                                : ''}
                              {customer &&
                              customer.country &&
                              customer.country.label
                                ? `, ${customer.country.label}`
                                : `, ${customer.country}`
                                ? customer.country
                                : ''}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="company-label-info ">
                              {' '}
                              <div className="brand-label ">Category</div>
                              <span className="mid-width">
                                {customer &&
                                  customer.category &&
                                  customer.category.label}
                              </span>
                              <div className="clear-fix" />
                              <div className="brand-label ">Website</div>
                              <span className=" mid-width website">
                                <a
                                  css="text-transform: initial;"
                                  href={
                                    customer &&
                                    customer.website &&
                                    customer.website.includes('http')
                                      ? customer && customer.website
                                      : `http://www.${
                                          customer && customer.website
                                        }`
                                  }
                                  target="_blank"
                                  rel=" noopener noreferrer">
                                  {customer && customer.website}
                                </a>
                              </span>
                              <div className="clear-fix" />
                            </div>
                          </div>{' '}
                          <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="company-label-info">
                              <div className="brand-label">Annual Revenue</div>
                              <NumberFormat
                                displayType="text"
                                thousandSeparator
                                value={
                                  (customer && customer.annual_revenue) || null
                                }
                                prefix="$"
                              />
                              <div className="clear-fix" />

                              <div className="brand-label ">Company Size</div>
                              <span className="company-size">
                                {customer && customer.number_of_employees}
                              </span>
                              <div className="clear-fix" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </WhiteCard>

                  <div className="row">
                    <div className="col-lg-4 col-12">
                      <WhiteCard className="left-border  d-lg-block d-none mb-3">
                        <ul className="left-details-card">
                          {userInfo && userInfo.role !== 'Customer' ? (
                            <li
                              onClick={() => {
                                setViewComponent('performance');
                                dispatch(setCustomerSelectedTab('performance'));
                              }}
                              role="presentation">
                              <div
                                className={`left-details ${
                                  viewComponent === 'performance'
                                    ? 'active'
                                    : ''
                                }`}>
                                <img
                                  className="file-contract"
                                  src={HeartMonitorIcon}
                                  alt="monitor"
                                />
                                Performance
                              </div>
                            </li>
                          ) : (
                            ''
                          )}
                          <li
                            onClick={() => {
                              setViewComponent('agreement');
                              dispatch(setCustomerSelectedTab('agreement'));
                            }}
                            role="presentation">
                            <div
                              className={`left-details ${
                                viewComponent === 'agreement' ? 'active' : ''
                              }`}>
                              <img
                                className="file-contract"
                                src={FileContract}
                                alt=""
                              />
                              Agreements
                            </div>
                          </li>

                          <li
                            onClick={() => {
                              setViewComponent('company');
                              dispatch(setCustomerSelectedTab('company'));
                            }}
                            role="presentation">
                            <div
                              className={`left-details ${
                                viewComponent === 'company' ? 'active' : ''
                              }`}>
                              <img src={Organization} alt="" />
                              Company Details
                            </div>
                          </li>
                          {userInfo && userInfo.role === 'Customer' ? (
                            <li
                              onClick={() => setViewComponent('billing')}
                              role="presentation">
                              <div
                                className={`left-details ${
                                  viewComponent === 'billing' ? 'active' : ''
                                }`}>
                                <img src={BillingIcon} alt="dollar-invoice" />
                                Billing
                              </div>
                            </li>
                          ) : (
                            ''
                          )}

                          <li
                            onClick={() => {
                              setViewComponent('activity');
                              dispatch(setCustomerSelectedTab('activity'));
                            }}
                            role="presentation">
                            <div
                              className={`left-details ${
                                viewComponent === 'activity' ? 'active' : ''
                              }`}>
                              <img src={ExchangeIcon} alt="" />
                              Activity
                            </div>
                          </li>
                        </ul>
                      </WhiteCard>

                      <Select
                        options={viewOptions}
                        className="customer-dropdown-select d-lg-none d-block mb-3 "
                        onChange={(event) => {
                          setViewComponent(event.value);
                          dispatch(setCustomerSelectedTab(event.value));
                        }}
                        defaultValue={viewOptions[0]}
                      />

                      <WhiteCard className="mb-3">
                        <p className="black-heading-title mt-0 mb-4">
                          {' '}
                          Team Members (
                          {memberCount &&
                            (memberCount > 10 ? (
                              <u
                                className="link-video watch-video cursor"
                                onClick={() =>
                                  setShowMemberList({
                                    show: true,
                                    add: false,
                                    modal: true,
                                  })
                                }
                                role="presentation"
                                title="See more...">
                                {memberCount}
                              </u>
                            ) : (
                              memberCount
                            ))}
                          )
                        </p>
                        {userInfo && userInfo.role !== 'Customer' ? (
                          <div
                            className="add-new-tab"
                            onClick={() =>
                              setShowMemberList({
                                show: false,
                                add: true,
                                modal: true,
                              })
                            }
                            role="presentation">
                            <img className="mr-1" src={AddIcons} alt="" />
                            Add new
                          </div>
                        ) : (
                          ''
                        )}
                        <div className="ml-2">
                          {memberData.map((item) => (
                            <React.Fragment key={item.id}>
                              <div
                                className="add-more-people cursor "
                                data-tip
                                data-for={item.id}
                                onClick={() =>
                                  setShowMemberList({
                                    show: true,
                                    add: false,
                                    modal: true,
                                  })
                                }
                                role="presentation">
                                <GetInitialName
                                  userInfo={item.user_profile}
                                  type="team"
                                />
                              </div>
                              <ReactTooltip
                                place="bottom"
                                id={item.id}
                                aria-haspopup="true">
                                <strong>
                                  {(item.user_profile &&
                                    item.user_profile.first_name) ||
                                    ' '}{' '}
                                  {(item.user_profile &&
                                    item.user_profile.last_name) ||
                                    ' '}
                                </strong>
                                <p style={{ color: 'white', fontSize: '11px' }}>
                                  {item.user_profile && item.user_profile.role}
                                </p>
                              </ReactTooltip>
                            </React.Fragment>
                          ))}
                        </div>
                      </WhiteCard>

                      <WhiteCard className="mb-3 d-none d-lg-block">
                        <p className="black-heading-title mt-0 mb-4">
                          {' '}
                          Recent Activity
                        </p>
                        {activityData &&
                          activityData.slice(0, 2).map((item) => (
                            <GroupUser key={Math.random()}>
                              {images.find(
                                (op) => op.entity_id === item.history_user_id,
                              ) &&
                              images.find(
                                (op) => op.entity_id === item.history_user_id,
                              ).presigned_url ? (
                                <img
                                  src={
                                    isLoading.loader &&
                                    isLoading.type === 'page'
                                      ? DefaultUser
                                      : images.find(
                                          (op) =>
                                            op.entity_id ===
                                            item.history_user_id,
                                        ).presigned_url
                                  }
                                  className="default-user-activity"
                                  alt="pic"
                                />
                              ) : (
                                <div className="avatarName float-left mr-3">
                                  {getActivityInitials(
                                    item.history_change_reason,
                                  )}
                                </div>
                              )}
                              <div className="activity-user mb-4">
                                {activityDetail(item)}

                                <div className="time-date mt-1">
                                  {item && item.history_date
                                    ? item.history_date
                                    : ''}
                                </div>
                              </div>
                              <div className="clear-fix" />
                            </GroupUser>
                          ))}
                      </WhiteCard>
                    </div>
                    {viewComponent === 'agreement' ? (
                      <AgreementDetails agreements={agreement} id={id} />
                    ) : viewComponent === 'company' ? (
                      <CompanyDetail
                        id={id}
                        customer={customer}
                        amazonDetails={amazonDetails}
                        seller={
                          agreement &&
                          agreement.seller_type &&
                          agreement.seller_type.value
                        }
                        getAmazon={getAmazon}
                        getActivityLogInfo={getActivityLogInfo}
                      />
                    ) : viewComponent === 'performance' ? (
                      <CompanyPerformance
                        marketplaceChoices={marketplaceChoices}
                        id={id}
                      />
                    ) : viewComponent === 'billing' ? (
                      <BillingDetails id={id} userInfo={userInfo} />
                    ) : (
                      <Activity
                        activityData={activityData}
                        getActivityInitials={getActivityInitials}
                        activityDetail={activityDetail}
                        isLoading={isLoading}
                        images={images}
                        handlePageChange={handlePageChange}
                        count={activityCount}
                        pageNumber={pageNumber || 1}
                      />
                    )}
                  </div>
                </CustomerBody>

                <BackToTop />
              </CustomerDetailBanner>

              <Modal
                isOpen={showMemberList.modal}
                style={teamDeleteModal ? alertCustomStyles : customStyles}
                ariaHideApp={false}
                contentLabel="Add team modal">
                {showMemberList.add ? (
                  <AddTeamMember
                    id={id}
                    getCustomerMemberList={getCustomerMemberList}
                    setShowMemberList={setShowMemberList}
                  />
                ) : (
                  <EditTeamMember
                    id={id}
                    getCustomerMemberList={getCustomerMemberList}
                    setShowMemberList={setShowMemberList}
                    showMemberList={showMemberList}
                    setTeamDeleteModal={setTeamDeleteModal}
                    userInfo={userInfo}
                  />
                )}
              </Modal>
              <Modal
                isOpen={showModal}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Edit modal">
                <img
                  src={CloseIcon}
                  alt="close"
                  className="float-right cursor cross-icon"
                  onClick={() => setShowModal(false)}
                  role="presentation"
                />
                <ModalBox>
                  <EditAccountDetails
                    agreement={agreement}
                    customer={customer}
                    setShowModal={setShowModal}
                    setDocumentImage={customer.documents}
                    getActivityLogInfo={getActivityLogInfo}
                    IsSaveDataClicked={IsSaveDataClicked}
                  />
                </ModalBox>
              </Modal>
              <Modal
                isOpen={statusModal.show}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Status modal">
                <img
                  src={CloseIcon}
                  alt="close"
                  className="float-right cursor cross-icon"
                  onClick={() =>
                    setStatusModal({ ...statusModal, show: false })
                  }
                  role="presentation"
                />
                <CustomerStatus
                  type={statusModal.type}
                  setStatusModal={setStatusModal}
                  customer={customer}
                />
              </Modal>
              <Modal
                isOpen={showOnBoardingSuccessMsg}
                style={AccountSetupcustomStyles}
                ariaHideApp={false}
                contentLabel="Edit modal">
                <ModalBox>
                  <div className="modal-body account-setup-complete">
                    <img
                      className="mt-2"
                      src={AccountSetupIcon}
                      alt="company-icon"
                    />

                    <h3 className="page-heading mb-3 mt-3 ">
                      Account Set Up Complete
                    </h3>
                    <p className="extra-bold ">
                      {' '}
                      Congratulations on completing your account setup with Buy
                      Box Experts! Expect to hear from your On-boarding
                      Specialist in the next 24 hours to walk through final set
                      up items and get you in contact with your Brand Growth
                      Strategist.
                    </p>

                    <p className="extra-bold mt-2">
                      If you have any questions in the meantime please reach out
                      to{' '}
                      <a
                        className="link-url"
                        target="_BLANK"
                        rel="noopener noreferrer"
                        href="https://www.buyboxexperts.com/">
                        onboarding@buyboxexperts.com.
                      </a>
                    </p>
                    <Button
                      className="btn-primary w-100 on-boarding mt-3"
                      onClick={() => dispatch(showOnboardingMsg(false))}>
                      Ok. Got it!
                    </Button>
                  </div>
                </ModalBox>
              </Modal>
              {/* <Modal
                isOpen={showModal}
                style={AccountSetupcustomStyles}
                ariaHideApp={false}
                contentLabel="Edit modal">
                <img
                  src={CloseIcon}
                  alt="close"
                  className="float-right cursor cross-icon"
                  onClick={() => setShowModal(false)}
                  role="presentation"
                /> */}
              {/* <ModalBox>
                  <div className="modal-body "> */}
              {/* <h4 className="on-boarding mb-3">
                      Verify your bank account
                    </h4>
                    <p className="verify-info-text m-0">
                      {' '}
                      We have made a charge to your bank account for a small
                      amount (typically less than $1) from Buy Box Experts. In
                      order to verify your account, please enter the amount
                      below. This will verify your account and trigger a refund
                      for the amount we charged.
                    </p>
                    <p className=" verify-info-text font-italic mt-2">
                      {' '}
                      Please note the refund can take up to 3 business days to
                      reach you from the point of verifying your bank account.
                    </p>

                    <div className="does-not-match-box mt-1 mb-1">
                      <img
                        className="times-circle-icon mr-2"
                        src={TimesCircle}
                        alt="cross-circle"
                      />{' '}
                      Amount entered does not match our records
                    </div>
                    <ContractFormField className="mt-3">
                      <label htmlFor="emailAddress">
                        Amount Charged
                        <br />
                        <input
                          className="form-control"
                          type="text"
                          placeholder=" $"
                        />
                      </label>
                    </ContractFormField> */}
              {/* <Button className="btn-primary w-100  mt-3">Verify</Button> */}
              {/* <img
                      width="55px"
                      className="mb-3"
                      src={AccountSetupIcon}
                      alt="check"
                    />
                    <h3 className=" page-heading ">Success!</h3>
                    <p className="normal-text mt-2 mb-0">
                      Thank you, your bank account has now been verified.{' '}
                    </p>
                    <Button className="btn-primary w-100  mt-4">
                      Continue
                    </Button>
                  </div>
                </ModalBox>
              </Modal> */}
            </>
          )}
        </>
      )}
    </>
  );
}

const CustomerDetailBanner = styled.div`
  background: ${Theme.gray6};
  min-height: 100%;
  .banner {
    height: 307px;
    padding-left: 62px;
    background-image: url(${GreyBannerBg});
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;

    .inner {
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }

  @media only screen and (max-width: 991px) {
    .banner {
      padding-left: 0;
    }
  }

  @media only screen and (max-width: 991px) {
    .banner {
      padding-left: 0;
    }
  }
`;

const CustomerBody = styled.div`
  max-width: 1220px;
  margin: 0 auto;
  width: 100%;
  padding-left: 65px;
  .back-btn-link {
    background: ${Theme.white};
    border-radius: 23px;
    padding: 13px;
    color: ${Theme.gray85};
    position: absolute;
    top: 109px;
    cursor: pointer;

    .left-arrow {
      width: 18px;
      margin-right: 3px;
      vertical-align: bottom;
    }
  }

  .customer-body-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }
  .customer-dropdown-select {
    color: ${Theme.black};
    padding: 0 0px 0px 25px;
    background-color: ${Theme.white};
    border-radius: 8px;
    width: 100%;
    padding: 10px 0;
    border-left: 3px solid ${Theme.orange};
    color: #000000;
    font-size: 16px;
    font-weight: bold;
    height: 55px;
    border-right: none;
    border-top: none;
    border-bottom: none;

    &:focus {
      outline: none;
    }

    .css-yk16xz-control {
      border: none;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
    .css-1pahdxg-control {
      border: none !important;
      box-shadow: none !important;
      cursor: pointer;

      &:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    }

    .css-1okebmr-indicatorSeparator {
      display: none;
    }
    .css-26l3qy-menu {
      margin-top: -1px;
      border-radius: 4px;
      border-top: none;
      padding: 18px 0;
      border: none;
      box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.1);
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-weight: 500;
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 0 20px;
  }

  @media only screen and (min-width: 1600px) and (max-width: 1920px) {
    max-width: 1420px !important;
    margin: 0 auto;
    width: 100%;
  }
  @media only screen and (min-width: 1920px) {
    max-width: 80% !important;
    margin: 0 auto;
    width: 100%;
  }
`;
const BackBtn = styled.div`
  color: ${Theme.black};
  padding: 20px;
  font-size: ${Theme.normal};
  font-weight: 700;
  img {
    vertical-align: middle;
    width: 19px;
    margin-right: 6px;
  }
`;

// const AlertMsgUpdate = styled.div`
//   background: #fdf3d7;
//   border-radius: 4px;
//   width: 100%;
//   height: 50px;
//   color: #2e384d;
//   font-size: 13px;
//   text-align: center;
//   padding-top: 16px;
//   font-family: ${Theme.titleFontFamily};

//   &.account-verify {
//     background: #ffded6;
//     padding-top: 11px;
//   }
// `;
