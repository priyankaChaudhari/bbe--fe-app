import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { GroupUser } from '../../theme/Global';
import { GetInitialName, PageLoader, WhiteCard } from '../../common';
import {
  EditOrangeIcon,
  // MasterCardIcons,
  // DefaultUser,
  // BlackCheckMark,
  // BellNotification,
  // ClockIcon,
} from '../../theme/images/index';
import { getBillingDetails } from '../../api';

export default function BillingDetails({ id }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });

  useEffect(() => {
    getBillingDetails(id).then((response) => {
      setData(response && response.data);
      setIsLoading({ loader: false, type: 'page' });
    });
  }, [id]);

  const mapDefaultValues = (type, key) => {
    if (data && data[type] && data[type][0]) {
      return data[type][0][key];
    }
    return '';
  };

  return (
    <>
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader type="detail" color="#FF5933" width={40} height={40} />
      ) : (
        <div className="col-lg-8 col-12">
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              <WhiteCard>
                <p className="black-heading-title mt-0 mb-3">Billing Details</p>
                {/* <div className="edit-details" role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div> */}
                <div className="row">
                  <div className="col-6">
                    <div className="label">Payment Type</div>
                    <div className="label-info">Credit Card</div>
                  </div>
                  {/* <div className="col-6">
                  <div className="label-info mt-4">
                    <img
                      className="master-card-icon"
                      src={MasterCardIcons}
                      alt="master-card"
                    />{' '}
                    Mastercard
                  </div>
                </div> */}
                </div>
                <div className="label mt-3">Cardholder name</div>
                <div className="label-info">
                  {' '}
                  {mapDefaultValues('card_details', 'card_holder_name')}
                </div>
                <div className="row">
                  <div className="col-6 pr-0 ">
                    <div className="label mt-3">Credit Card Number</div>
                    <div className="label-info">
                      **** **** ****{' '}
                      {mapDefaultValues('card_details', 'card_number')}
                    </div>
                  </div>
                  <div className="col-3 pr-0">
                    <div className="label mt-3">Exp. Date</div>
                    <div className="label-info">**/**</div>
                  </div>
                  <div className="col-3">
                    <div className="label mt-3">CSV</div>
                    <div className="label-info">***</div>
                  </div>
                </div>
              </WhiteCard>
              {/* <WhiteCard>
              <p className="black-heading-title mt-0 mb-3"> Billing Details</p>
              <div className="edit-details" role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              <div className="label">Payment Type</div>
              <div className="label-info">
                ACH{' '}
                <span className="ACH-status unverified pending">
                  {' '}
                  <img
                    className="checked-mark-icon"
                    src={BlackCheckMark}
                    alt="check"
                  />{' '}
                  <img className="bell-icon" src={BellNotification} alt="" />{' '}
                  <img className="bell-icon ml-1" src={CountDayClock} alt="" />{' '}
                  Pending
                </span>
              </div>
              <div className="label mt-3">Name on Account </div>
              <div className="label-info">TRX Training Inc.</div>
              <div className="label mt-3">Bank Name</div>
              <div className="label-info">Chase</div>
              <div className="row">
                <div className="col-6">
                  <div className="label mt-3">Routing Number</div>
                  <div className="label-info">685 448 298</div>
                </div>
                <div className="col-6">
                  <div className="label mt-3">Account Number</div>
                  <div className="label-info">7847 0412 80</div>
                </div>
              </div>
            </WhiteCard> */}

              <WhiteCard className="mt-3">
                <p className="black-heading-title mt-0 mb-0">Billing Address</p>
                {/* <div className="edit-details" role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div> */}
                <div className="label mt-3">Address </div>
                <div className="label-info">
                  {mapDefaultValues('billing_address', 'address')}
                </div>
                <div className="label mt-3">City </div>
                <div className="label-info">
                  {mapDefaultValues('billing_address', 'city')}
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="label mt-3">State</div>
                    <div className="label-info">
                      {mapDefaultValues('billing_address', 'state')}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="label mt-3">Postal Code</div>
                    <div className="label-info">
                      {mapDefaultValues('billing_address', 'postal_code')}
                    </div>
                  </div>
                </div>
              </WhiteCard>
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <WhiteCard>
                {' '}
                <p className="black-heading-title mt-0 mb-4">
                  {' '}
                  Billing Contacts
                </p>
                <div className="edit-details" role="presentation">
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
                <GroupUser className="mt-3">
                  <GetInitialName
                    property="float-left mr-3"
                    userInfo={data.billing_contact && data.billing_contact[0]}
                  />
                  <div className="activity-user">
                    {mapDefaultValues('billing_contact', 'first_name')}{' '}
                    {mapDefaultValues('billing_contact', 'last_name')}
                  </div>
                  <div className="user-email-address">
                    {mapDefaultValues('billing_contact', 'email')}
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
              </WhiteCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

BillingDetails.propTypes = {
  id: PropTypes.string.isRequired,
};
