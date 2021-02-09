/* eslint-disable import/no-cycle */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styled from 'styled-components';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';

import Theme from '../../theme/Theme';
import {
  BannerImg,
  EditOrangeIcon,
  FileContract,
  Organization,
  ExchangeIcon,
  AddIcons,
  DefaultUser,
  CloseIcon,
  CompanyDefaultUser,
  EditIcons,
  LeftArrowIcon,
  ExpandArrowIcon,
} from '../../theme/images/index';
import { GroupUser, WhiteCard } from '../../theme/Global';
import { ModalBox, PageLoader, GetInitialName } from '../../common';
import { getAccountDetails } from '../../store/actions/accountState';
import {
  getContactDetails,
  getCustomerDetails,
} from '../../store/actions/customerState';
import { AgreementDetails, CompanyDetail, EditAccountDetails } from './index';
import CompanyPerformance from './CompanyPerformance';
import Activity from './Activity';
import {
  getActivityLog,
  getAmazonDetails,
  getCustomerMembers,
  getDocumentList,
} from '../../api';
import { AddTeamMember, EditTeamMember } from '../Team/index';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    minHeight: '200px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function CustomerMainContainer() {
  const { id } = useParams();
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch();
  const agreement = useSelector((state) => state.accountState.data);
  const loader = useSelector((state) => state.accountState.isLoading);
  const customer = useSelector((state) => state.customerState.data);
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [viewComponent, setViewComponent] = useState('company');
  const [showMemberList, setShowMemberList] = useState({
    show: false,
    add: false,
    modal: false,
  });
  const [memberData, setMemberData] = useState([]);
  const [showSuccessMsg, setShowSuccessMsg] = useState({});
  const [activityData, setActivityData] = useState([]);
  const [activityCount, setActivityCount] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [images, setImages] = useState([]);
  const [amazonDetails, setAmazonDetails] = useState([]);
  console.log(showSuccessMsg);

  const getCustomerMemberList = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getCustomerMembers(id).then((member) => {
      setMemberData(member && member.data && member.data.results);
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [id]);

  const getActivityLogInfo = useCallback(
    (currentPage) => {
      setIsLoading({ loader: true, type: 'activityPage' });
      getActivityLog(currentPage, id).then((response) => {
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

  const getAmazon = useCallback(() => {
    getAmazonDetails(id).then((res) => {
      setAmazonDetails(
        res && res.data && res.data.results && res.data.results[0],
      );
    });
  }, [id]);

  useEffect(() => {
    dispatch(getAccountDetails(id));
    dispatch(getCustomerDetails(id));
    dispatch(getContactDetails(id));
    getCustomerMemberList();
    getActivityLogInfo();
    getAmazon();
  }, [dispatch, id, getCustomerMemberList, getActivityLogInfo, getAmazon]);

  const getActivityInitials = (userInfo) => {
    const firstName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[0].charAt(0)) ||
      '';
    const lastName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[1].charAt(0)) ||
      '';

    return firstName + lastName;
  };

  const activityDetail = (item) => {
    const newRecord = item.message.includes(
      'created new record by company name',
    )
      ? item.message.split('created new record by company name')
      : '';
    const updatedField = item.message.includes('updated')
      ? item.message.split('updated')
      : '';

    const deleteRecord = item.message.includes('deleted record')
      ? item.message.split('deleted record')
      : '';

    if (newRecord || deleteRecord) {
      return (
        <>
          {newRecord[0] || deleteRecord[0]}
          <span>
            {newRecord
              ? 'created new record by company name'
              : 'deleted record'}
          </span>
          {newRecord[1] || deleteRecord[1]}
        </>
      );
    }
    return (
      <>
        {updatedField[0]}
        <span>updated {updatedField[1].split(' from ')[0]} from </span>{' '}
        {updatedField[1].split(' from ')[1].split(' to ')[0]}
        <span> to </span> {updatedField[1].split(' from ')[1].split(' to ')[1]}
      </>
    );
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getActivityLogInfo(currentPage);
  };

  return (
    <>
      {loader || (isLoading.loader && isLoading.type === 'page') ? (
        <PageLoader color="#FF5933" type="page" width={20} />
      ) : (
        <>
          <BackBtn className="d-lg-none d-block ">
            <div className="back-btn-link  ">
              {' '}
              <img className="left-arrow" src={LeftArrowIcon} alt="" /> Back to
              all customers
            </div>
          </BackBtn>
          <CustomerDetailBanner>
            <div className="banner">
              <div className="inner" />
              <div className="back-btn-link d-lg-block d-none">
                {' '}
                <img className="left-arrow" src={LeftArrowIcon} alt="" /> Back
                to all customers
              </div>
            </div>
            <CustomerBody>
              <WhiteCard className="customer-brand-details mb-n2">
                <div className="row">
                  <div className="col-lg-3 col-md-12">
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
                      <img
                        className="edit-profile-picture"
                        src={EditIcons}
                        alt="edit"
                      />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-12 ">
                    <span className="brand-name ">
                      {agreement && agreement.contract_company_name}
                    </span>
                    <span
                      className="dropdown company-status "
                      onClick={() => {
                        setShowDropDown(!showDropDown);
                        setShowSuccessMsg({ show: false });
                      }}
                      role="presentation">
                      <span id="clickbox">
                        Active <img src={ExpandArrowIcon} alt="aarow-down" />
                      </span>
                    </span>
                    <ul
                      className="dropdown-content-status"
                      style={{ display: showDropDown ? 'block' : 'none' }}>
                      <li role="presentation">Pending</li>
                      <li role="presentation">Inactive</li>
                      <li role="presentation"> Risk</li>
                    </ul>

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
                          {agreement && agreement.address
                            ? `${agreement.address},`
                            : ' '}{' '}
                          {agreement && agreement.city
                            ? `${agreement.city},`
                            : ' '}{' '}
                          {agreement && agreement.state && agreement.state.label
                            ? `${agreement.state.label}, `
                            : agreement && agreement.state
                            ? `${agreement.state}, `
                            : ''}
                          {agreement && agreement.zip_code
                            ? `${agreement.zip_code}, `
                            : ''}
                          {customer &&
                          customer.country &&
                          customer.country.label
                            ? customer.country.label
                            : customer.country
                            ? customer.country
                            : ''}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="company-label-info">
                          <div className="brand-label">
                            Category
                            <span>
                              {customer &&
                                customer.category &&
                                customer.category.label}
                            </span>
                          </div>
                          <div className="brand-label">
                            Website
                            <span>
                              <a
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
                          </div>
                        </div>
                      </div>{' '}
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="company-label-info">
                          <div className="brand-label">
                            Annual Revenue
                            <NumberFormat
                              displayType="text"
                              thousandSeparator
                              value={
                                (customer && customer.annual_revenue) || null
                              }
                              prefix="$"
                            />
                          </div>
                          <div className="brand-label">
                            Company Size
                            <span>
                              {customer && customer.number_of_employees}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </WhiteCard>

              <div className="row">
                <div className="col-lg-4 col-12">
                  <WhiteCard className="left-border order-2 order-lg-1 d-lg-block d-none mb-3">
                    <ul className="left-details-card">
                      <li
                        onClick={() => setViewComponent('company')}
                        role="presentation">
                        <div
                          className={`left-details ${
                            viewComponent === 'company' ? 'active' : ''
                          }`}>
                          <img src={Organization} alt="" />
                          Company Details
                        </div>
                      </li>
                      <li
                        onClick={() => setViewComponent('agreement')}
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

                      {/* <li
                      onClick={() => setViewComponent('performance')}
                      role="presentation">
                      <div
                        className={`left-details ${
                          viewComponent === 'performance' ? 'active' : ''
                        }`}>
                        <img
                          className="file-contract"
                          src={HeartMonitorIcon}
                          alt="monitor"
                        />
                        Performance
                      </div>
                    </li> */}
                      <li
                        onClick={() => setViewComponent('activity')}
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
                  <select className="customeer-dropdown-select d-lg-none d-block mb-3">
                    <option> Agreements</option>
                    <option> Company Details</option>
                    <option> Activity</option>
                  </select>

                  <WhiteCard className="mb-3 order-1 order-lg-2">
                    <p className="black-heading-title mt-0 mb-4">
                      {' '}
                      Team Members ({memberData && memberData.length})
                    </p>
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
                    {memberData.map((item) => (
                      <React.Fragment key={item.id}>
                        <div
                          className="add-more-people cursor"
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
                  </WhiteCard>
                  <WhiteCard className="mb-3 d-none d-lg-block">
                    <p className="black-heading-title mt-0 mb-4">
                      {' '}
                      Recent Activity
                    </p>
                    {activityData.slice(1, 3).map((item) => (
                      <GroupUser key={Math.random()}>
                        {images.find((op) => op.entity_id === item.user_id) &&
                        images.find((op) => op.entity_id === item.user_id)
                          .presigned_url ? (
                          <img
                            src={
                              isLoading.loader && isLoading.type === 'page'
                                ? ''
                                : DefaultUser
                            }
                            className="default-user-activity"
                            alt="pic"
                          />
                        ) : (
                          <div className="avatarName float-left mr-3">
                            {getActivityInitials(item.message)}
                          </div>
                        )}
                        <div className="activity-user mb-4">
                          {activityDetail(item)}

                          <div className="time-date mt-1">
                            {item && item.time ? item.time : ''}
                          </div>
                        </div>
                        <div className="clear-fix" />
                      </GroupUser>
                    ))}
                  </WhiteCard>
                </div>
                {viewComponent === 'agreement' ? (
                  <AgreementDetails agreement={agreement} id={id} />
                ) : viewComponent === 'company' ? (
                  <CompanyDetail
                    customer={customer}
                    amazonDetails={amazonDetails}
                    seller={
                      agreement &&
                      agreement.seller_type &&
                      agreement.seller_type.value
                    }
                  />
                ) : viewComponent === 'performance' ? (
                  <CompanyPerformance />
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
              {viewComponent === 'agreement' ? (
                <AgreementDetails agreement={agreement} id={id} />
              ) : viewComponent === 'company' ? (
                <CompanyDetail
                  customer={customer}
                  amazonDetails={amazonDetails}
                  seller={
                    agreement &&
                    agreement.seller_type &&
                    agreement.seller_type.value
                  }
                  id={id}
                />
              ) : viewComponent === 'performance' ? (
                <CompanyPerformance />
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
            </CustomerBody>
          </CustomerDetailBanner>
        </>
      )}

      <Modal
        isOpen={showMemberList.modal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Add team modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() =>
            setShowMemberList({ show: false, add: false, mnodal: false })
          }
          role="presentation"
        />
        {showMemberList.add ? (
          <AddTeamMember
            id={id}
            getCustomerMemberList={getCustomerMemberList}
            setShowMemberList={setShowMemberList}
            setShowSuccessMsg={setShowSuccessMsg}
          />
        ) : (
          <EditTeamMember
            id={id}
            getCustomerMemberList={getCustomerMemberList}
            setShowMemberList={setShowMemberList}
            showMemberList={showMemberList}
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
          />
        </ModalBox>
      </Modal>
    </>
  );
}

const CustomerDetailBanner = styled.div`
  background: ${Theme.gray6};
  .banner {
    height: 307px;
    padding-left: 62px;
    background-image: url(${BannerImg});
    background-position: top;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;

    .inner {
      background: rgb(14 14 14 / 28%);
      height: 100%;
      top: 0;
      max-width: 100%;
      padding: 0 20px;
    }
  }
  .back-btn-link {
    background: ${Theme.white};
    border-radius: 23px;
    padding: 13px;
    color: ${Theme.gray85};
    position: absolute;
    margin-left: 74px;
    top: 109px;
    cursor: pointer;

    .left-arrow {
      width: 18px;
      margin-right: 3px;
      vertical-align: bottom;
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

  .customer-body-container {
    max-width: 1220px;
    margin: 0 auto;
    width: 100%;
  }
  .customeer-dropdown-select {
    color: ${Theme.black};
    padding: 0 0px 0px 25px;
    background-color: ${Theme.white};
    border-radius: 8px;
    width: 100%;
    padding: 13px;
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

    select {
      background: red;
      width: 140px;
      height: 35px;
      border: 1px solid #ccc;
      font-size: 18px;
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
