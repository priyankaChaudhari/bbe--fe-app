/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';

import Activity from './Activity';
import Theme from '../../../theme/Theme';
import CompanyDetail from './CompanyDetail';
import AccountDetails from './AccountDetails';
import ShowTeamMembers from './ShowTeamMembers';
import AgreementDetails from './AgreementDetails';
import CustomerTabDetails from './CustomerTabDetails';
import RecentActivityNotes from './RecentActivityNotes';
import useActivityLog from '../../../hooks/useActivityLog';
import BillingContainer from './BillingContainer/BillingContainer';
import CompanyPerformance from '../CompanyPerformance/CompanyPerformanceContainer';
import { CustomerDetailsBody } from './CustomerDetailStyles';
import { ProductCatalog } from '../index';
import { SetupCheckList } from '../../BrandAssetGathering/index';
import { LeftArrowIcon } from '../../../theme/images';
import { PATH_BRAND_ASSET, PATH_CUSTOMER_LIST } from '../../../constants';
import {
  getCustomerDetails,
  setCustomerSelectedTab,
} from '../../../store/actions/customerState';
import {
  TeamMemberModal,
  CustomerStatusModal,
  OtherModals,
  NotesModal,
} from './Modals';
import {
  PageLoader,
  PageNotFound,
  BackToTop,
  WhiteCard,
  GetInitialName,
  // ModalRadioCheck,
} from '../../../common';
import {
  getCustomerActivityLog,
  getCustomerMembers,
  getDocumentList,
  getMarketPlaceList,
  getAccountMarketplace,
} from '../../../api';

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

  const [subViewComponent, setSubViewComponent] = useState('seller');
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
  const activityDetail = useActivityLog(viewComponent);

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
      history.location.state === 'dspInvoicing' ||
      history.location.state === 'upSell'
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
      setMemberData(member && member.data && member.data.results);
      setIsLoading({ loader: false, type: 'page' });
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
    if (userInfo && userInfo.role === 'Customer') {
      setViewComponent('dashboard');
      dispatch(setCustomerSelectedTab('agreement'));
    }
    if (profileLoader) {
      getActivityLogInfo();
    }
  }, [dispatch, id, getActivityLogInfo, profileLoader, userInfo]);

  useEffect(() => {
    getActivityLogInfo();
  }, [getActivityLogInfo]);

  useEffect(() => {
    if (userInfo && userInfo.role !== 'Customer') {
      getMarketPlace(id);
    }
  }, [id, getMarketPlace]);

  useEffect(() => {
    dispatch(getCustomerDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (userInfo && userInfo.role !== 'Customer') getCustomerMemberList();
  }, [getCustomerMemberList]);

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

  if (customer && (customer.status !== null || customer.status !== 'pending')) {
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
    if (user) {
      const userDetail = {
        first_name: user.split(' ')[0],
        last_name: user.split(' ')[1],
      };
      return <GetInitialName userInfo={userDetail} type="activity" />;
    }
    return '';
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
                  <div className="col-6  mt-4 pt-1">
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
                  <ShowTeamMembers
                    role={userInfo && userInfo.role}
                    setShowMemberList={setShowMemberList}
                    memberData={memberData}
                  />
                </div>

                <div className="row mt-5 pt-2">
                  <div className="col-lg-3 col-12">
                    <WhiteCard className="left-border mb-3">
                      <AccountDetails
                        id={id}
                        setShowModal={setShowModal}
                        role={userInfo && userInfo.role}
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
                        subViewComponent={subViewComponent}
                        setSubViewComponent={setSubViewComponent}
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

                    {/* hide vendor feature */}
                    {/* {viewComponent === 'performance' ? (
                      <WhiteCard className="d-lg-none d-block mt-3 mb-3">
                        <ul className="sub-category-mobile-view">
                          <li>
                            {' '}
                            <ModalRadioCheck className="pb-1" key="seller">
                              <label
                                className="checkboxes radio-container customer-list"
                                htmlFor="seller">
                                Seller Reporting
                                <input
                                  type="radio"
                                  name="radio"
                                  id="seller"
                                  value="seller"
                                  onChange={() => setSubViewComponent('seller')}
                                  defaultChecked={subViewComponent === 'seller'}
                                />
                                <span className="checkmark checkmark-customer-list" />
                              </label>
                            </ModalRadioCheck>
                          </li>
                          <li>
                            {' '}
                            <ModalRadioCheck className="pb-1" key="vendor">
                              {' '}
                              <label
                                className="checkboxes radio-container customer-list"
                                htmlFor="vendor">
                                Vendor Reporting
                                <input
                                  type="radio"
                                  name="radio"
                                  id="vendor"
                                  value="vendor"
                                  onChange={() => setSubViewComponent('vendor')}
                                  defaultChecked={subViewComponent === 'vendor'}
                                />
                                <span className="checkmark checkmark-customer-list" />
                              </label>
                            </ModalRadioCheck>
                          </li>
                        </ul>
                      </WhiteCard>
                    ) : null} */}
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
                      seller={
                        agreement &&
                        agreement.seller_type &&
                        agreement.seller_type.value
                      }
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
                      subViewComponent={subViewComponent}
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
                getActivityLogInfo={getActivityLogInfo}
              />

              <CustomerStatusModal
                statusModal={statusModal}
                customStyles={customStyles}
                setStatusModal={setStatusModal}
                customer={customer}
                getActivityLogInfo={getActivityLogInfo}
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
