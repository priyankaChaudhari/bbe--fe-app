import React, { useState, useEffect, useCallback } from 'react';

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
import {
  BillingAddress,
  creditCardDetails,
} from '../../constants/FieldConstants';

export default function BillingDetails({ id, userInfo, onBoardingId }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({
    billing_contact: {},
    billing_address: {},
    card_details: {},
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

  const billingDetails = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getBillingDetails(id).then((response) => {
      setData(response && response.data);
      setIsLoading({ loader: false, type: 'page' });
      setFormData({
        billing_contact:
          response &&
          response.data &&
          response.data.billing_contact &&
          response.data.billing_contact[0],
        billing_address:
          response &&
          response.data &&
          response.data.billing_address &&
          response.data.billing_address[0],
        card_details:
          response &&
          response.data &&
          response.data.card_details &&
          response.data.card_details[0],
        expiryMessage:
          response.data &&
          response.data.card_details &&
          response.data.card_details[0] &&
          response.data.card_details[0].expiry_info,
      });
    });
  }, [id]);

  useEffect(() => {
    billingDetails();
  }, [billingDetails]);

  const mapDefaultValues = (type, key) => {
    if (key === 'expiration_date') {
      const getDate =
        data.card_details && data.card_details[0] && data.card_details[0][key]
          ? data.card_details[0][key].split('-')
          : '';
      return getDate
        ? `${getDate[1]}/${getDate[0].substring(2)}`
        : data.id
        ? '**/**'
        : '';
    }
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
        [item.key]: item.key === 'card_number' ? event : event.target.value,
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

  const mapPaymentDefaultValues = (item) => {
    if (item === 'card_number')
      return `************${
        data.card_details && data.card_details[0] && data.card_details[0][item]
      }`;
    if (item === 'expiration_date') {
      const getDate =
        data.card_details && data.card_details[0] && data.card_details[0][item]
          ? data.card_details[0][item].split('-')
          : '';
      return getDate ? `${getDate[1] + getDate[0].substring(2)}` : '****';
    }
    return '';
  };

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        format={item.format}
        className="form-control"
        onChange={(event) =>
          item.key !== 'card_number' ? handleChange(event, item, type) : ''
        }
        placeholder={
          item.key === 'expiration_date'
            ? `Enter ${item.label} (MM/YY)`
            : `Enter ${item.label}`
        }
        defaultValue={
          type === 'card_details' && data && data.id
            ? mapPaymentDefaultValues(item.key)
            : item.key === 'expiration_date'
            ? [formData.type][item.key]
            : formData && formData[type] && formData[type][item.key]
        }
        onValueChange={(values) =>
          item.key === 'card_number'
            ? handleChange(values.value, item, type)
            : ''
        }
        isNumericString
        // readOnly={
        //   (type === 'card_details' || type === 'billing_address') &&
        //   data &&
        //   data.id
        // }
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
        maxLength={item.key === 'postal_code' ? 10 : ''}
        readOnly={data && data.id && item.key === 'email'}
      />
    );
  };

  const mapContactDetails = () => {
    return (
      <div className="row">
        {BillingAddress.filter((op) => op.section === 'contact').map((item) => {
          return (
            <div
              className="col-md-6"
              key={item.key}
              style={{
                opacity: data && data.id && item.key === 'email' ? 0.5 : '',
              }}>
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
      </div>
    );
  };

  const mapAddressDetails = () => {
    return (
      <div className="row">
        {BillingAddress.filter((op) => op.section === 'address').map((item) => {
          return (
            <div
              className="col-md-6"
              key={item.key}
              style={{ opacity: item.key === 'email' ? 0.5 : '' }}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.label}>
                  {item.label}
                  <br />
                  {item.type === 'number' ? (
                    <>{generateNumeric(item, 'billing_address')}</>
                  ) : (
                    <>{generateInput(item, 'billing_address')}</>
                  )}
                </label>
              </ContractFormField>
              <ErrorMsg>
                {apiError &&
                  apiError.billing_address &&
                  apiError.billing_address[item.key] &&
                  apiError.billing_address[item.key][0]}
              </ErrorMsg>
            </div>
          );
        })}
      </div>
    );
  };

  const mapPaymentDetails = () => {
    return (
      <>
        {creditCardDetails.map((field) => (
          <div className="row" key={field}>
            {field.details.map((item) => {
              return (
                <div className="col-md-6" key={item.key}>
                  <ContractFormField className="mt-3">
                    <label htmlFor={item.label}>
                      {item.label}
                      <br />
                      {item.type === 'number' ? (
                        <>{generateNumeric(item, 'card_details')}</>
                      ) : (
                        <>{generateInput(item, 'card_details')}</>
                      )}
                    </label>
                  </ContractFormField>
                  <ErrorMsg>
                    {apiError &&
                      apiError.card_details &&
                      apiError.card_details[item.key] &&
                      apiError.card_details[item.key][0]}
                  </ErrorMsg>
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  const saveBillingData = () => {
    setIsLoading({ loader: true, type: 'button' });

    const getYear = new Date().getFullYear().toString().substring(0, 2);
    let format = '';
    if (
      formData &&
      formData.card_details &&
      formData.card_details.expiration_date &&
      !formData.card_details.expiration_date.includes(getYear)
    ) {
      format = formData.card_details.expiration_date.split('/');
      formData.card_details.expiration_date = `${getYear + format[1]}-${
        format[0]
      }`;
    }
    if (
      (formData &&
        formData.billing_contact &&
        formData.billing_contact.phone_number === '') ||
      (formData &&
        formData.billing_contact &&
        formData.billing_contact.phone_number === null)
    )
      delete formData.billing_contact.phone_number;
    if (
      JSON.stringify(
        data && data.id && data.card_details && data.card_details[0],
      ) === JSON.stringify(formData.card_details)
    ) {
      delete formData.card_details;
      delete formData.old_billinginfo_id;
    } else {
      formData.old_billinginfo_id = data && data.id;
    }

    if (formData && formData.old_billinginfo_id === '')
      delete formData.old_billinginfo_id;
    if (formData.billing_contact && formData.billing_contact.expiry_info)
      delete formData.billing_contact.expiry_info;
    delete formData.expiryMessage;

    let details = {};

    if ((data && data.id === undefined) || data.id === '') {
      details = {
        ...formData,
        billing_address: formData.billing_address || {},
        billing_contact: formData.billing_contact || {},
        card_details: formData.card_details || {},
        customer_onboarding: userInfo.customer_onboarding || onBoardingId,
        payment_type: 'credit card',
      };
    } else {
      details = {
        ...formData,
        billing_address: formData.billing_address,
        billing_contact: formData.billing_contact,
        // card_details: formData.card_details,
        customer_onboarding: userInfo.customer_onboarding || onBoardingId,
        payment_type: 'credit card',
      };
    }

    saveBillingInfo(
      details,
      formData && formData.old_billinginfo_id ? null : data && data.id,
    ).then((res) => {
      if ((res && res.status === 200) || (res && res.status === 201)) {
        setIsLoading({ loader: false, type: 'button' });
        billingDetails();
        setShowModal(false);
        setShowBtn(false);
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
        <PageLoader
          component="customer-details"
          type="detail"
          color="#FF5933"
          width={40}
          height={40}
        />
      ) : (
        <div className="col-lg-8 col-12">
          {formData.expiryMessage && formData.expiryMessage.message ? (
            <div
              className="already-user-msg mt-2 mb-3 p-2 text-center"
              style={{
                color: !formData.expiryMessage.is_expired ? '#000' : '#FF5933',
                backgroundColor: !formData.expiryMessage.is_expired
                  ? '#f7c137'
                  : '#ffe5df',
                borderRadius: '15px',
              }}>
              {formData.expiryMessage.message}
            </div>
          ) : (
            ''
          )}
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              <WhiteCard>
                <p className="black-heading-title mt-0 mb-3">Billing Details</p>

                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => setShowModal(true)}>
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>

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
                      {data.id
                        ? `**** **** **** ${mapDefaultValues(
                            'card_details',
                            'card_number',
                          )}`
                        : ''}
                    </div>
                  </div>
                  <div className="col-3 pr-0">
                    <div className="label mt-3">Exp. Date</div>
                    <div className="label-info">
                      {mapDefaultValues('card_details', 'expiration_date')}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="label mt-3">CVV</div>
                    <div className="label-info">{data.id ? '***' : ''}</div>
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

                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => setShowModal(true)}>
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>

                {/* {formData.expiryMessage && formData.expiryMessage.message ? (
                  <div
                    className="edit-details"
                    role="presentation"
                    onClick={() => setShowModal(true)}>
                    <img src={EditOrangeIcon} alt="" />
                    Edit
                  </div>
                ) : (
                  ''
                )} */}
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
                  {data && data.id ? (
                    <GetInitialName
                      property="float-left mr-3"
                      userInfo={data.billing_contact && data.billing_contact[0]}
                    />
                  ) : (
                    ''
                  )}
                  <div className="activity-user">
                    {mapDefaultValues('billing_contact', 'first_name')}{' '}
                    {mapDefaultValues('billing_contact', 'last_name')}
                  </div>
                  <div className="user-email-address">
                    {mapDefaultValues('billing_contact', 'email')}
                  </div>
                  <div className="user-email-address">
                    {mapDefaultValues('billing_contact', 'phone_number')}
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
          onClick={() => {
            setShowModal(false);
            setShowBtn(false);
            setApiError({});
          }}
          role="presentation"
        />
        <ModalBox>
          {' '}
          <div className="modal-body">
            <h4>Payment Details</h4>
            {mapPaymentDetails()}
            <ErrorMsg style={{ textAlign: 'center' }}>
              {apiError && apiError[0]}
            </ErrorMsg>
            <div className="straight-line horizontal-line  mt-3 mb-3" />
            <h4>Billing Address</h4>
            {mapAddressDetails()}
            <div className="straight-line horizontal-line  mt-3 mb-3" />
            <h4>Billing Contact</h4>
            {mapContactDetails()}
          </div>
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
                  onClick={() => {
                    setShowModal(false);
                    setShowBtn(false);
                    setApiError({});
                  }}>
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

BillingDetails.defaultProps = {
  onBoardingId: null,
};

BillingDetails.propTypes = {
  id: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    customer_onboarding: PropTypes.string,
  }).isRequired,
  onBoardingId: PropTypes.string,
};
