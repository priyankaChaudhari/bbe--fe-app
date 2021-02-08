import React from 'react';
import { useSelector } from 'react-redux';

import ReadMoreAndLess from 'react-read-more-less';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import {
  EditOrangeIcon,
  // DefaultUser,
  CopyLinkIcon,
  InfoIcons,
  ExternalLink,
  LinkedinIcon,
  InstagramIcon,
  TwitterIcon,
  LeftArrowIcon,
} from '../../theme/images/index';
import { WhiteCard, GroupUser } from '../../theme/Global';
import {
  SocialIcons,
  AmazonMarketplaceDetails,
} from '../../constants/FieldConstants';
import { GetInitialName } from '../../common';

export default function CompanyDetail({ customer, amazonDetails, seller }) {
  const contactInfo = useSelector((state) => state.customerState.contactData);

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
      <BackBtn className="d-lg-none d-block">
        <div className="back-btn-link  ">
          {' '}
          <img className="left-arrow" src={LeftArrowIcon} alt="" /> Back to all
          customers
        </div>
      </BackBtn>
      <CustomerDetailBanner>
        <div className="banner">
          <div className="inner" />
          <div className="back-btn-link d-lg-block d-none">
            {' '}
            <img className="left-arrow" src={LeftArrowIcon} alt="" /> Back to
            all customers
          </div>
        </div>

        <CustomerBody>
          <WhiteCard className="customer-brand-details mb-n2">
            <div className="row">
              <div className="col-lg-3 col-md-12">
                <div className="brand-logo" />
              </div>
              <div className="col-lg-9 col-md-12 ">
                <div className="brand-name mb-2">
                  TRX Training
                  <span>Active</span>
                </div>
                <div className=" edit-details edit-brand-details ">
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>

                <div className="row">
                  <div className="col-lg-4 col-12">
                    <div className="company-label-info text-left">
                      1660 Pacific Ave, San Francisco, CA, United States
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="company-label-info">
                      <div className="brand-label">
                        Category
                        <span>Health_Wellness_And_Fitness</span>
                      </div>
                      <div className="brand-label">
                        Website
                        <span>
                          {' '}
                          <a href="*">trxtraining.com</a>
                        </span>
                      </div>
                    </div>
                  </div>{' '}
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="company-label-info">
                      <div className="brand-label">
                        Annual Revenue
                        <span>$50,000,000</span>
                      </div>
                      <div className="brand-label">
                        Company Size
                        <span> 200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WhiteCard>
            <div className="col-lg-8 col-12">
              <WhiteCard>
          <div className="row">
            <div className="col-10">
              <span className="black-heading-title mt-0">
                Company Description
              </span>
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
          <div className=" edit-details">
            <img src={EditOrangeIcon} alt="" />
            Edit
          </div>
        </WhiteCard>

        <div className="row mt-3">
          <div className="col-6">
            <WhiteCard>
              <p className="black-heading-title mt-0">Brands</p>
              <p className="no-result-found">
                {(customer && customer.brand) || 'No brands added'}
              </p>
              <div className="edit-details">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
            </WhiteCard>

            <WhiteCard className="mt-3">
              <p className="black-heading-title mt-0">Contact Info</p>
              <div className="edit-details">
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
            <WhiteCard className="mt-3">
              <p className="black-heading-title mt-0 ">Company Contacts</p>
              <div className="edit-details">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              {contactInfo && contactInfo.length === 0
                ? 'No Record found.'
                : contactInfo.map((item) => (
                    <GroupUser key={item.id}>
                      <GetInitialName userInfo={item} />
                      <div className="activity-user">
                        {item.first_name || ' '} {item.last_name || ' '}
                      </div>
                      <div className="user-email-address">
                        {item.email || ' '}
                      </div>
                      <div className="clear-fix" />
                    </GroupUser>
                  ))}
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
    </>
  );
}

CompanyDetail.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    brand: PropTypes.string,
    phone_number: PropTypes.string,
  }).isRequired,
  amazonDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  seller: PropTypes.string.isRequired,
};
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
      position: relative;
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
`;
