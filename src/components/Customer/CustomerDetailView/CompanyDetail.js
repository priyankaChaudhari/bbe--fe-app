import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import ReadMoreAndLess from 'react-read-more-less';
import { shape, arrayOf, string } from 'prop-types';

import EditCompanyDetails from './EditCompanyDetails';
import AmazonAccount from './AmazonAccount';
import { GroupUser } from '../../../theme/Global';
import { socialIcons } from '../../../constants';
import { EditOrangeIcon, CloseIcon } from '../../../theme/images';
import { getCustomerDetails, getCustomerContactDetails } from '../../../api';
import { GetInitialName, PageLoader, WhiteCard } from '../../../common';

export default function CompanyDetail({ customer, id, marketplaceData }) {
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

  const [showModal, setShowModal] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const [detail, setDetail] = useState(customer);
  const [contactInfo, setContactInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContactData = useCallback(() => {
    getCustomerContactDetails(id).then((res) => {
      setContactInfo(res && res.data);
      setIsLoading(false);
    });
  }, [id]);

  const customerDetails = useCallback(() => {
    setIsLoading(true);
    getCustomerDetails(id).then((res) => {
      if (res && res.status === 200) {
        setDetail(res && res.data);
        getContactData();
      }
    });
  }, [id, getContactData]);

  useEffect(() => {
    customerDetails();
  }, [id, getContactData, customerDetails]);

  const generateSocialIcon = (item) => {
    const fields = [];
    if (detail && detail[item.key]) {
      fields.push(
        <li key={detail && detail[item.key]}>
          <a
            href={detail && detail[item.key]}
            rel="noopener noreferrer"
            target="_blank">
            <img
              src={item.value}
              alt="brand"
              className={
                item.key === 'instagram' || item.key === 'pinterest'
                  ? 'social-icon-width'
                  : 'social-media'
              }
            />
          </a>
        </li>,
      );
    }
    if (fields && fields.length === 0) {
      return '';
    }
    return fields;
  };

  const getContactCard = () => {
    return (
      <WhiteCard className=" mt-3">
        <p className="black-heading-title card-title  mt-0 ">
          Company Contacts
        </p>
        <div
          className="edit-details"
          onClick={() => {
            setShowModal(true);
            setScrollDown(true);
          }}
          role="presentation">
          <img src={EditOrangeIcon} alt="" />
          Edit
        </div>
        <div className="company-contract-height">
          {contactInfo && contactInfo.length === 0
            ? 'No Record found.'
            : contactInfo.map((item) => (
                <GroupUser key={item.id} className="mb-3">
                  <GetInitialName userInfo={item} property="float-left mr-3 " />
                  <div className="activity-user">
                    {item.first_name || ' '} {item.last_name || ' '}{' '}
                    {item.role ? <>({item.role})</> : ''}
                    <br />
                    <div className="user-email-address">
                      {item.email || ' '}
                    </div>
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
              ))}
        </div>
      </WhiteCard>
    );
  };

  const getSocialIcons = () => {
    return (
      <WhiteCard className="mt-3">
        <p className="black-heading-title card-title  mt-0">Contact Info</p>
        <div
          className="edit-details"
          onClick={() => setShowModal(true)}
          role="presentation">
          <img src={EditOrangeIcon} alt="" />
          Edit
        </div>

        <div className="label">Phone Number</div>
        <div className="label-info">{detail.phone_number}</div>

        <div className="label mt-3">Social Accounts</div>

        <ul className="social-media-icons">
          {socialIcons.map((item) => generateSocialIcon(item))}
        </ul>
      </WhiteCard>
    );
  };

  return (
    <>
      {isLoading ? (
        <PageLoader
          component="customer-details"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : (
        <div className="col-lg-9 col-12 mb-3">
          <WhiteCard>
            <div className="row">
              <div className="col-10">
                <span className="black-heading-title  ">
                  Company Description
                </span>
                <br />
                <br />

                <span className="normal-text">
                  {' '}
                  <ReadMoreAndLess
                    className="read-more-content"
                    charLimit={150}
                    readMoreText="Read more"
                    readLessText="Read less">
                    {`${
                      detail.description === null ? '' : detail.description
                    }${' '}` || ''}
                  </ReadMoreAndLess>
                </span>
              </div>
            </div>
            <div
              className=" edit-details"
              onClick={() => {
                setShowModal(true);
              }}
              role="presentation">
              <img src={EditOrangeIcon} alt="" />
              Edit
            </div>
          </WhiteCard>
          <div className="row ">
            <div className="col-lg-6 col-md-6 col-12 mt-3">
              <WhiteCard>
                <p className="black-heading-title card-title mt-0">Brands</p>
                <p className="no-result-found">
                  {(detail && detail.brand) || 'No brands added'}
                </p>
                <div
                  className="edit-details"
                  onClick={() => setShowModal(true)}
                  role="presentation">
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
              </WhiteCard>
              <>{getContactCard()}</>
              <>{getSocialIcons()}</>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mt-3">
              <AmazonAccount
                marketplaceData={marketplaceData}
                customStyles={customStyles}
              />
            </div>
          </div>
          <Modal
            isOpen={showModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Add team modal">
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => setShowModal(false)}
              role="presentation"
            />
            <EditCompanyDetails
              setShowModal={setShowModal}
              id={id}
              detail={detail}
              showModal={showModal}
              scrollDown={scrollDown}
              setScrollDown={setScrollDown}
              setDetail={setDetail}
              getContactData={getContactData}
              contactInfo={contactInfo}
            />
          </Modal>
        </div>
      )}
    </>
  );
}

CompanyDetail.defaultProps = {
  id: '',
};

CompanyDetail.propTypes = {
  id: string,
  customer: shape({
    id: string,
    description: string,
    brand: string,
    phone_number: string,
    merchant_id: string,
  }).isRequired,
  marketplaceData: arrayOf(shape({})).isRequired,
};
