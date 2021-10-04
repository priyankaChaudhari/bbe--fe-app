/* eslint-disable react/no-danger */

import React, { useState, useEffect, useCallback } from 'react';

import ReactTooltip from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';

import Activity from './Activity';
import Theme from '../../../theme/Theme';
import AccountDetails from './AccountDetails';
import CompanyPerformance from '../CompanyPerformance/CompanyPerformanceContainer';
import BillingContainer from './BillingContainer/BillingContainer';

import { SetupCheckList } from '../../BrandAssetGathering/index';
import {
  TeamMemberModal,
  CustomerStatusModal,
  OtherModals,
  NotesModal,
} from './Modals';
import { PATH_BRAND_ASSET, PATH_CUSTOMER_LIST } from '../../../constants';
import {
  getContactDetails,
  getCustomerDetails,
  setCustomerSelectedTab,
} from '../../../store/actions/customerState';
import {
  AgreementDetails,
  CompanyDetail,
  ProductCatalog,
  CustomerDetailsBody,
  RecentActivityNotes,
} from '../index';
import {
  getCustomerActivityLog,
  getAmazonDetails,
  getCustomerMembers,
  getDocumentList,
  getMarketPlaceList,
  getAccountMarketplace,
} from '../../../api';
import {
  PageLoader,
  GetInitialName,
  PageNotFound,
  BackToTop,
  WhiteCard,
} from '../../../common';
import { LeftArrowIcon, PlusIcon } from '../../../theme/images';
import CustomerTabDetails from './CustomerTabDetails';

export default function CustomerMainContainer() {
  const history = useHistory();
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
  const [showNewNoteEditor, setNewNoteEditor] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState({
    modal: false,
    apiCall: false,
    deleteNote: false,
  });

  const [statusModal, setStatusModal] = useState({
    show: false,
    type: '',
  });
  const profileLoader = useSelector(
    (state) => state.userState.isActivityLoading,
  );
  const customerError = useSelector((state) => state.customerState.error);
  const userInfo = useSelector((state) => state.userState.userInfo);

  const [marketplaceData, setMarketplaceData] = useState([]);
  const [agreementDetailModal, setAgreementDetailModal] = useState({
    pause: false,
  });

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

  useEffect(() => {
    if (
      history.location.state === 'revShare' ||
      history.location.state === 'dspInvoicing'
    ) {
      setViewComponent('billing');
    }
  }, [dispatch, history.location.state]);

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
      setViewComponent('dashboard');
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
    if (userInfo && userInfo.role !== 'Customer') getCustomerMemberList();
    getActivityLogInfo();
  }, [dispatch, id, getActivityLogInfo, getCustomerMemberList, userInfo]);

  useEffect(() => {
    if (viewComponent === 'company') {
      getAccountMarketplace(id).then((response) => {
        setMarketplaceData(response && response.data);
        setIsLoading({ loader: false, type: 'page' });
      });
    }
  }, [id, viewComponent]);

  if (userInfo && userInfo.role === 'Customer') {
    viewOptions = [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'agreement', label: 'Agreements' },
      { value: 'brand asset', label: 'Brand Assets' },
      { value: 'company', label: 'Company Details' },
      { value: 'billing', label: 'Billing' },
      { value: 'activity', label: 'Activity' },
      // { value: 'product catalog', label: 'Product Catalog' },
    ];
  }

  if (customer && customer.status !== null) {
    viewOptions = [
      { value: 'performance', label: 'Performance' },
      { value: 'agreement', label: 'Agreements' },
      { value: 'company', label: 'Company Details' },
      { value: 'billing', label: 'Billing' },
      { value: 'activity', label: 'Activity' },
      // { value: 'product catalog', label: 'Product Catalog' },
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

  const displayMixedLog = (logUser, msg, header) => {
    return msg.map((item, index) => {
      if (index === 0 && header !== '') {
        return (
          <>
            {index === 0 ? logUser : ''}
            <span>updated </span> {header}
          </>
        );
      }
      const field = item && item.split('from')[0];

      let oldValue = item && item.split('from')[1].split(' to ')[0];
      let newValue =
        item && item.split('from')[1].split(' to ')[1].split(', ,')[0];

      if (
        item.includes('annual revenue') ||
        item.includes('number of employees') ||
        item.includes('monthly retainer') ||
        item.includes('sales threshold') ||
        item.includes('fee') ||
        item.includes('discount amount') ||
        item.includes('billing cap')
        //  ||
        // item.includes('custom amazon store price')
      ) {
        oldValue = oldValue.replace('.00', '');
        newValue = newValue.replace('.00', '');
        oldValue =
          oldValue && oldValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        newValue =
          newValue && newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const activityDetail = (item, showAllActivity = false) => {
    let activityMessage = '';
    let logUser;
    let field;
    let oldValue;
    let newValue = '';
    let mixedLog = false;
    let customerSetupHeader = '';
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
      if (item.history_change_reason.includes('deleted note')) {
        return (
          <>
            {activityMessage[0]}
            <span>deleted</span>

            <span
              dangerouslySetInnerHTML={{
                __html:
                  viewComponent === 'activity' && showAllActivity
                    ? activityMessage &&
                      activityMessage.length &&
                      activityMessage[1]
                    : activityMessage &&
                      activityMessage.length &&
                      activityMessage[1] &&
                      activityMessage[1].slice(0, 80),
              }}
            />
            {/* {activityMessage[1]} */}
          </>
        );
      }
      return (
        <>
          {activityMessage[0]}
          <span>deleted</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item.history_change_reason.includes('updated addendum')) {
      activityMessage = item.history_change_reason.split('updated addendum');
      return (
        <>
          {activityMessage[0]}
          <span>updated </span>
          addendum
        </>
      );
    }
    if (item && item.history_change_reason.includes('updated')) {
      activityMessage = item.history_change_reason.split('updated');
      const msg = activityMessage[0];
      logUser = msg;
      if (
        activityMessage[1] &&
        activityMessage[1].includes('Amazon account names and id')
      ) {
        const msg1 = activityMessage[1];
        customerSetupHeader = msg1;
        field = activityMessage[2] && activityMessage[2].split('from')[0];
        oldValue =
          activityMessage[2] &&
          activityMessage[2].split('from')[1].split(' to ')[0];
        newValue =
          activityMessage[2] &&
          activityMessage[2].split('from')[1].split(' to ')[1].split(', ,')[0];
      } else {
        field = activityMessage[1] && activityMessage[1].split('from')[0];
        oldValue =
          activityMessage[1] &&
          activityMessage[1].split('from')[1].split(' to ')[0];
        newValue =
          activityMessage[1] &&
          activityMessage[1].split('from')[1].split(' to ')[1].split(', ,')[0];
      }

      if (activityMessage && activityMessage.length > 2) {
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
            item.history_change_reason.includes('custom amazon store price')) ||
          (item && item.history_change_reason.includes('billing cap')))
      ) {
        let fromAmount = '';
        let toAmount = '';
        let rowAmount = [];
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[0] !== ''
        ) {
          const temp = activityMessage[1].split(' from ')[1].split(' to ')[0];
          rowAmount = temp;
          if (rowAmount.split('.')[1] === '00') {
            const amt = rowAmount.split('.')[0];
            fromAmount = amt;
          } else {
            fromAmount = rowAmount;
          }
        }
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[1] !== ''
        ) {
          const temp = activityMessage[1].split(' from ')[1].split(' to ')[1];
          rowAmount = temp;
          if (rowAmount.split('.')[1] === '00') {
            const amt = rowAmount.split('.')[0];
            toAmount = amt;
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
              : fromAmount &&
                fromAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span> to </span>{' '}
            {toAmount === ''
              ? 'None'
              : toAmount &&
                toAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }

      return activityMessage && activityMessage[1].includes('addendum')
        ? item.history_change_reason
        : mixedLog
        ? displayMixedLog(logUser, activityMessage, customerSetupHeader)
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
      let value;
      if (
        item &&
        item.history_change_reason.includes('Amazon Store Package Custom')
      ) {
        value = activityMessage[1].split('as');
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>added</span>
            {value && value[0]}
            as
            {value &&
              value[1] &&
              value[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }

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
            <PageLoader color={Theme.orange} type="page" width={20} />
          ) : (
            <>
              <CustomerDetailsBody role={userInfo && userInfo.role}>
                <div className="row">
                  <div className="col-6 mt-4 pt-1">
                    {' '}
                    {userInfo && userInfo.role !== 'Customer' ? (
                      <Link to={PATH_CUSTOMER_LIST}>
                        <div className="back-btn-link ">
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
                  </div>
                  <div className="col-6 mt-4 text-right">
                    {' '}
                    {userInfo && userInfo.role !== 'Customer' ? (
                      <div className="add-more-people">
                        {memberData &&
                          memberData.map((item) => (
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

                        <div
                          className="add-more-people btn-add-team cursor"
                          role="presentation"
                          onClick={() =>
                            setShowMemberList({
                              show: true,
                              add: true,
                              modal: true,
                            })
                          }>
                          <img src={PlusIcon} alt="add" />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div className="row mt-5 pt-2">
                  <div className="col-lg-3 col-12">
                    <WhiteCard className="left-border mb-3">
                      <AccountDetails
                        id={id}
                        setShowModal={setShowModal}
                        userInfo={userInfo}
                        setStatusModal={setStatusModal}
                        customerData={customer}
                        showModal={showModal}
                        IsSaveDataClicked={IsSaveDataClicked}
                        getActivityLogInfo={getActivityLogInfo}
                        customStyles={customStyles}
                      />
                      <CustomerTabDetails
                        role={userInfo && userInfo.role}
                        setViewComponent={setViewComponent}
                        viewComponent={viewComponent}
                        customer={customer}
                      />
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
                  </div>
                  {viewComponent === 'agreement' ? (
                    <AgreementDetails
                      id={id}
                      userId={userInfo && userInfo.id}
                      setShowMemberList={setShowMemberList}
                      showModal={agreementDetailModal}
                      setShowModal={setAgreementDetailModal}
                      userRole={userInfo && userInfo.role}
                      customerStatus={
                        customer && customer.status && customer.status.value
                      }
                      getActivityLogInfo={getActivityLogInfo}
                    />
                  ) : viewComponent === 'product catalog' ? (
                    <ProductCatalog id={id} />
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
                      marketplaceData={marketplaceData}
                    />
                  ) : viewComponent === 'dashboard' ? (
                    <SetupCheckList
                      id={id}
                      brandId={
                        customer &&
                        customer.brand_assets &&
                        customer.brand_assets.id
                      }
                      productAssetsId={
                        customer &&
                        customer.product_assets &&
                        customer.product_assets.id
                      }
                    />
                  ) : viewComponent === 'brand asset' ? (
                    history.push({
                      pathname: PATH_BRAND_ASSET.replace(':id', id).replace(
                        ':brandId',
                        customer &&
                          customer.brand_assets &&
                          customer.brand_assets.id,
                      ),
                      search: 'step=brand-logo',
                    })
                  ) : viewComponent === 'performance' ? (
                    <CompanyPerformance
                      marketplaceChoices={marketplaceChoices}
                      id={id}
                    />
                  ) : viewComponent === 'billing' ? (
                    <BillingContainer
                      redirectType={history.location.state}
                      id={id}
                      userInfo={userInfo}
                      customerStatus={customer && customer.status}
                      onBoardingId={customer && customer.customer_onboarding_id}
                    />
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
                  <RecentActivityNotes
                    id={id}
                    setViewComponent={setViewComponent}
                    activityData={activityData}
                    images={images}
                    isLoading={isLoading}
                    getActivityInitials={getActivityInitials}
                    activityDetail={activityDetail}
                    role={userInfo && userInfo.role}
                    setShowNotesModal={setShowNotesModal}
                    setNewNoteEditor={setNewNoteEditor}
                    showNotesModal={showNotesModal}
                    getActivityLogInfo={getActivityLogInfo}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </CustomerDetailsBody>
              <div className="col-12 mt-5">
                <BackToTop />
              </div>

              {/* Customer Modals starts */}
              <TeamMemberModal
                id={id}
                getCustomerMemberList={getCustomerMemberList}
                showMemberList={showMemberList}
                setShowMemberList={setShowMemberList}
                setAgreementDetailModal={setAgreementDetailModal}
                userInfo={userInfo}
                customStyles={customStyles}
              />

              <CustomerStatusModal
                statusModal={statusModal}
                customStyles={customStyles}
                setStatusModal={setStatusModal}
                customer={customer}
              />

              <NotesModal
                id={id}
                showNotesModal={showNotesModal}
                setShowNotesModal={setShowNotesModal}
                setNewNoteEditor={setNewNoteEditor}
                showNewNoteEditor={showNewNoteEditor}
              />
              <OtherModals />
              {/* Customer Modals ends */}
            </>
          )}
        </>
      )}
    </>
  );
}
