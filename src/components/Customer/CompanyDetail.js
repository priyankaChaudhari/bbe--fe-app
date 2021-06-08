import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ReadMoreAndLess from 'react-read-more-less';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { EditOrangeIcon, CloseIcon } from '../../theme/images/index';
import { GroupUser } from '../../theme/Global';
import { SocialIcons } from '../../constants/FieldConstants';
import { GetInitialName, WhiteCard } from '../../common';
import EditCompanyDetails from './EditCompanyDetails';

export default function CompanyDetail({
  customer,
  // amazonDetails,
  // seller,
  id,
  getAmazon,
  getActivityLogInfo,
}) {
  const contactInfo = useSelector((state) => state.customerState.contactData);
  const [showModal, setShowModal] = useState(false);
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [scrollDown, setScrollDown] = useState(false);

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

  const generateSocialIcon = (item) => {
    const fields = [];
    if (customer && customer[item.key]) {
      fields.push(
        <li key={customer && customer[item.key]}>
          <a
            href={customer && customer[item.key]}
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
        <p className="black-heading-title mt-0 ">Company Contacts</p>
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
                    {item.first_name || ' '} {item.last_name || ' '}
                  </div>
                  <div className="user-email-address">{item.email || ' '}</div>
                  <div className="clear-fix" />
                </GroupUser>
              ))}
        </div>
      </WhiteCard>
    );
  };

  return (
    <>
      <div className="col-lg-8 col-12 mb-3">
        <WhiteCard>
          <div className="row">
            <div className="col-10">
              <span className="black-heading-title ">Company Description</span>
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
                    customer.description === null ? '' : customer.description
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
              <p className="black-heading-title mt-0">Brands</p>
              <p className="no-result-found">
                {(customer && customer.brand) || 'No brands added'}
              </p>
              <div
                className="edit-details"
                onClick={() => setShowModal(true)}
                role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
            </WhiteCard>
            {userInfo && userInfo.role !== 'Customer' ? (
              <>{getContactCard()}</>
            ) : (
              ''
            )}
          </div>
          <div className="col-lg-6 col-md-6 col-12 mt-3">
            <WhiteCard>
              <p className="black-heading-title mt-0">Contact Info</p>
              <div
                className="edit-details"
                onClick={() => setShowModal(true)}
                role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>

              <div className="label">Phone Number</div>
              <div className="label-info">{customer.phone_number}</div>

              <div className="label mt-3">Social Accounts</div>

              <ul className="social-media-icons">
                {SocialIcons.map((item) => generateSocialIcon(item))}
              </ul>
            </WhiteCard>
          </div>
          {/* <div className="col-lg-6 col-md-6 col-12 mt-3">
            <WhiteCard>
              <p className="black-heading-title mt-0 ">Amazon Credentials</p>
              <div
                className="edit-details"
                onClick={() => setShowModal(true)}
                role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              {AmazonMarketplaceDetails.filter((op) => op.section === 1).map(
                (market) => (
                  <div className="copy-info" key={market.key}>
                    <div className="label mt-3">{market.label || ''}</div>
                    <div className="label-info">
                      {market.key === 'merchant_id' ? (
                        <>{customer[market.key]}</>
                      ) : (
                        <>
                          {(amazonDetails && amazonDetails[market.key]) ||
                            `No ${market.label}.`}
                        </>
                      )}
                    </div>

                    <div
                      className="copy-text"
                      onClick={() => copy(customer && customer.merchant_id)}
                      role="presentation">
                      <img src={CopyLinkIcon} alt="" />
                      Copy
                    </div>
                  </div>
                ),
              )}

              {userInfo && userInfo.role !== 'Customer' ? (
                <>
                  <div className="straight-line horizontal-line pt-3 mb-3" />

                  {AmazonMarketplaceDetails.filter(
                    (op) => op.section === 2,
                  ).map((item) => (
                    <React.Fragment key={item.key}>
                      <div className="label mt-3">
                        {item.label}
                        <img className="info-icon" src={InfoIcons} alt="" />
                      </div>
                      <div className="label-info">
                        {(amazonDetails && amazonDetails[item.key]) ||
                          `No ${item.label}.`}
                      </div>
                      <div className="straight-line horizontal-line pt-3 mb-3" />
                    </React.Fragment>
                  ))}

                  <div className="label mt-3">
                    {seller === 'Seller' || seller === 'Hybrid'
                      ? 'Seller Central Username and Password'
                      : 'Vendor Central Username and Password'}{' '}
                    <br />
                    <a
                      href="https://my.1password.com/signin?l=en"
                      target="_BLANK"
                      rel="noopener noreferrer">
                      {' '}
                      View Credentials
                      <img
                        className="external-link-icon"
                        src={ExternalLink}
                        alt="link"
                      />
                    </a>
                  </div>
                  <>
                    {userInfo &&
                    userInfo.role !== 'Customer' &&
                    seller === 'Hybrid' ? (
                      <div className="label mt-3">
                        Vendor Central Username & password
                        <br />
                        <a
                          href="https://my.1password.com/signin?l=en"
                          target="_BLANK"
                          rel="noopener noreferrer">
                          {' '}
                          View Credentials
                          <img
                            className="external-link-icon"
                            src={ExternalLink}
                            alt="link"
                          />
                        </a>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                </>
              ) : (
                ''
              )}
            </WhiteCard>
            {userInfo && userInfo.role === 'Customer' ? (
              <>{getContactCard()}</>
            ) : (
              ''
            )}
          </div> */}
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
            customer={customer}
            showModal={showModal}
            // amazonDetails={amazonDetails}
            getAmazon={getAmazon}
            getActivityLogInfo={getActivityLogInfo}
            scrollDown={scrollDown}
            setScrollDown={setScrollDown}
          />
        </Modal>
      </div>
    </>
  );
}

CompanyDetail.defaultProps = {
  id: '',
  // amazonDetails: [],
};

CompanyDetail.propTypes = {
  id: PropTypes.string,
  customer: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    brand: PropTypes.string,
    phone_number: PropTypes.string,
    merchant_id: PropTypes.string,
  }).isRequired,
  // amazonDetails: PropTypes.arrayOf(PropTypes.array),
  // seller: PropTypes.string.isRequired,
  getAmazon: PropTypes.func.isRequired,
  getActivityLogInfo: PropTypes.func.isRequired,
};
