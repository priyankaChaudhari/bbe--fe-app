import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';

import { GroupUser } from '../../theme/Global';
import {
  Button,
  ContractFormField,
  ErrorMsg,
  GetInitialName,
  ModalBox,
  PageLoader,
  WhiteCard,
} from '../../common';
import {
  CloseIcon,
  EditOrangeIcon,
  // DefaultUser,
  // BlackCheckMark,
  // BellNotification,
  // ClockIcon,
} from '../../theme/images/index';
import { getBillingDetails, saveBillingInfo } from '../../api';
import { BillingAddress } from '../../constants/FieldConstants';

export default function BillingDetails({ id, userInfo }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({
    billing_contact: {},
  });
  const [showBtn, setShowBtn] = useState(false);

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

  useEffect(() => {
    getBillingDetails(id).then((response) => {
      setData(response && response.data);
      setIsLoading({ loader: false, type: 'page' });
      setFormData({
        billing_contact:
          response &&
          response.data &&
          response.data.billing_contact &&
          response.data.billing_contact[0],
      });
    });
  }, [id]);

  const mapDefaultValues = (type, key) => {
    if (data && data[type] && data[type][0]) {
      return data[type][0][key];
    }
    return '';
  };

  const handleChange = (event, item, type) => {
    setShowBtn(true);
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [item.key]: event.target.value,
      },
    });

    setApiError({
      ...apiError,
      [type]: {
        ...apiError[type],
        [item.key]: '',
      },
      0: '',
    });
  };

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        className="form-control"
        onChange={(event) => handleChange(event, item, type)}
        placeholder={`Enter ${item.label}`}
        value={data && data[type] && data[type][0] && data[type][0][item.key]}
      />
    );
  };

  const generateInput = (item, type) => {
    return (
      <input
        className="form-control"
        placeholder={`Enter ${item.label}`}
        type={item.type}
        defaultValue={
          data && data[type] && data[type][0] && data[type][0][item.key]
        }
        onChange={(event) => handleChange(event, item, type)}
      />
    );
  };

  const mapContactDetails = () => {
    return (
      <div className="row">
        {BillingAddress.filter((op) => op.section === 'contact').map((item) => {
          return (
            <div className="col-md-6" key={item.key}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.label}>
                  {item.label}
                  <br />
                  {item.type === 'number' ? (
                    <>{generateNumeric(item, 'billing_contact')}</>
                  ) : (
                    <>{generateInput(item, 'billing_contact')}</>
                  )}
                </label>
              </ContractFormField>
              <ErrorMsg>
                {apiError &&
                  apiError.billing_contact &&
                  apiError.billing_contact[item.key] &&
                  apiError.billing_contact[item.key][0]}
              </ErrorMsg>
            </div>
          );
        })}
        ;
      </div>
    );
  };

  const saveBillingData = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (formData && formData.billing_contact.phone_number === '')
      delete formData.billing_contact.phone_number;

    const details = {
      ...formData,
      billing_address: data.billing_address[0],
      billing_contact: formData.billing_contact,
      customer_onboarding: userInfo.customer_onboarding,
    };
    saveBillingInfo(details, data && data.id).then((res) => {
      if (res && res.status === 200) {
        setIsLoading({ loader: false, type: 'button' });
        getBillingDetails(id).then((contact) => {
          setData(contact && contact.data);
        });
        setShowModal(false);
      }
      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(res && res.data);
      }
    });
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
                  Billing Contact
                </p>
                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => setShowModal(true)}>
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
          {' '}
          <div className="modal-body">{mapContactDetails()}</div>
          {showBtn ? (
            <>
              <div className="footer-line " />
              <div className=" col-12  modal-footer">
                <Button
                  className=" btn-primary mr-4"
                  onClick={() => saveBillingData()}>
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  className=" btn-borderless"
                  onClick={() => setShowModal(false)}>
                  Discard Changes
                </Button>
              </div>
            </>
          ) : (
            ''
          )}
        </ModalBox>
      </Modal>
    </>
  );
}

BillingDetails.propTypes = {
  id: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    customer_onboarding: PropTypes.string,
  }).isRequired,
};
