import React from 'react';
import { GroupUser } from '../../theme/Global';
import { GetInitialName, WhiteCard } from '../../common';
import {
  EditOrangeIcon,
  MasterCardIcons,
  // DefaultUser,
} from '../../theme/images/index';

export default function Billing() {
  return (
    <>
      <div className="col-lg-8 col-12">
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              <p className="black-heading-title mt-0 mb-4"> Billing Details</p>
              <div className="edit-details" role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              <div className="label">Name on Account</div>
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
              <div className="straight-line horizontal-line mt-4 mb-4" />
              <div className="row">
                <div className="col-6">
                  <div className="label">Payment Type</div>
                  <div className="label-info">Credit Card</div>
                </div>
                <div className="col-6">
                  <div className="label-info mt-4">
                    <img
                      className="master-card-icon"
                      src={MasterCardIcons}
                      alt="master-card"
                    />{' '}
                    Mastercard
                  </div>
                </div>
              </div>
              <div className="label mt-3">Cardholder name</div>
              <div className="label-info">Randy Hetrick</div>
              <div className="row">
                <div className="col-6 pr-0 ">
                  <div className="label mt-3">Credit Card Number</div>
                  <div className="label-info">**** **** **** 2852</div>
                </div>
                <div className="col-3 pr-0">
                  <div className="label mt-3">Exp. Date</div>
                  <div className="label-info">09/25</div>
                </div>
                <div className="col-3">
                  <div className="label mt-3">CSV</div>
                  <div className="label-info">***</div>
                </div>
              </div>
            </WhiteCard>
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <WhiteCard className="fix-height">
              {' '}
              <p className="black-heading-title mt-0 mb-4"> Billing Contacts</p>
              <div className="edit-details" role="presentation">
                <img src={EditOrangeIcon} alt="" />
                Edit
              </div>
              <GroupUser>
                <GetInitialName property="float-left mr-3 " />
                <div className="activity-user">Randy Hetrick</div>
                <div className="user-email-address">
                  rhetrick@trxtraining.com
                </div>
                <div className="clear-fix" />
              </GroupUser>
              <GroupUser className="mt-3">
                <GetInitialName property="float-left mr-3 " />
                <div className="activity-user">Randy Hetrick</div>
                <div className="user-email-address">
                  rhetrick@trxtraining.com
                </div>
                <div className="clear-fix" />
              </GroupUser>
            </WhiteCard>
          </div>
        </div>
      </div>{' '}
    </>
  );
}
