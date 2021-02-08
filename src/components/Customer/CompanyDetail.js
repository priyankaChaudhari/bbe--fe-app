import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReadMoreAndLess from 'react-read-more-less';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import Modal from 'react-modal';

import {
  EditOrangeIcon,
  // DefaultUser,
  CopyLinkIcon,
  InfoIcons,
  ExternalLink,
  CloseIcon,
} from '../../theme/images/index';
import { WhiteCard, GroupUser } from '../../theme/Global';
import {
  SocialIcons,
  AmazonMarketplaceDetails,
} from '../../constants/FieldConstants';
import { GetInitialName } from '../../common';
import EditCompanyDetails from './EditAccountDetails';

export default function CompanyDetail({ customer, amazonDetails, seller, id }) {
  const contactInfo = useSelector((state) => state.customerState.contactData);
  const [showModal, setShowModal] = useState({ modal: false, type: '' });

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
            <img src={item.value} alt="brand" className="social-media" />
          </a>
        </li>,
      );
    }
    if (fields && fields.length === 0) {
      return '';
    }
    return fields;
  };

  return (
    <>
      <div className="col-lg-8 col-12">
        <WhiteCard>
          <div className="row">
            <div className="col-10">
              <span className="black-heading-title ">Company Description</span>
              <span className="normal-text">
                {' '}
                <ReadMoreAndLess
                  className="read-more-content"
                  charLimit={150}
                  readMoreText="Read more"
                  readLessText="Read less">
                  {`${customer.description}${' '}` || ''}
                </ReadMoreAndLess>
              </span>
            </div>
          </div>
          <div
            className=" edit-details"
            onClick={() => setShowModal({ modal: true, type: 'description' })}
            role="presentation">
            <img src={EditOrangeIcon} alt="" />
            Edit
          </div>
        </WhiteCard>

        <div className="row mt-3">
          <div className="col-lg-6 col-md-6 col-12">
            <WhiteCard>
              <p className="black-heading-title mt-0">Brands</p>
              <p className="no-result-found">
                {(customer && customer.brand) || 'No brands added'}
              </p>
              <div
                className="edit-details"
                onClick={() => setShowModal({ modal: true, type: 'brand' })}
                role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
            </WhiteCard>

            <WhiteCard className="mt-3">
              <p className="black-heading-title mt-0">Contact Info</p>
              <div
                className="edit-details"
                onClick={() => setShowModal({ modal: true, type: 'social' })}
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
            <WhiteCard className=" mt-3">
              <p className="black-heading-title mt-0 ">Company Contacts</p>
              <div className="edit-details">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              <div className="company-contract-height">
                {contactInfo && contactInfo.length === 0
                  ? 'No Record found.'
                  : contactInfo.map((item) => (
                      <GroupUser key={item.id} className="mb-3">
                        <GetInitialName
                          userInfo={item}
                          property="float-left mr-3 "
                        />
                        <div className="activity-user">
                          {item.first_name || ' '} {item.last_name || ' '}
                        </div>
                        <div className="user-email-address">
                          {item.email || ' '}
                        </div>
                        <div className="clear-fix" />
                      </GroupUser>
                    ))}
              </div>
            </WhiteCard>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <WhiteCard>
              <p className="black-heading-title mt-0 ">Amazon Credentials</p>
              <div className="edit-details">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              {AmazonMarketplaceDetails.filter((op) => op.section === 1).map(
                (market) => (
                  <div className="copy-info" key={market.key}>
                    <div className="label mt-3">{market.label || ''}</div>
                    <div className="label-info">
                      {amazonDetails[market.key] || `No ${market.label}.`}
                    </div>

                    <div
                      className="copy-text"
                      onClick={() => copy(amazonDetails[market.key] || '')}
                      role="presentation">
                      <img src={CopyLinkIcon} alt="" />
                      Copy
                    </div>
                  </div>
                ),
              )}

              <div className="straight-line horizontal-line pt-3 mb-3" />

              {AmazonMarketplaceDetails.filter((op) => op.section === 2).map(
                (item) => (
                  <React.Fragment key={item.key}>
                    <div className="label mt-3">
                      {item.label}
                      <img className="info-icon" src={InfoIcons} alt="" />
                    </div>
                    <div className="label-info">
                      {amazonDetails[item.key] || `No ${item.label}.`}
                    </div>
                    {/* <div className="phone-number">+1 592 559 2950</div> */}
                    <div className="straight-line horizontal-line pt-3 mb-3" />
                  </React.Fragment>
                ),
              )}

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
              {seller === 'Hybrid' ? (
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
            </WhiteCard>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal.modal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Add team modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => setShowModal({ modal: false })}
          role="presentation"
        />
        <EditCompanyDetails
          setShowModal={setShowModal}
          id={id}
          customer={customer}
          showModal={showModal}
          amazonDetails={amazonDetails}
        />
      </Modal>
    </>
  );
}

CompanyDetail.propTypes = {
  id: PropTypes.string.isRequired,
  customer: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    brand: PropTypes.string,
    phone_number: PropTypes.string,
  }).isRequired,
  amazonDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  seller: PropTypes.string.isRequired,
};
