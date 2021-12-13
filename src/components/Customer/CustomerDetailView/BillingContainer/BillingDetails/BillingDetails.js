import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import { useDispatch } from 'react-redux';
import { shape, string } from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import Select, { components } from 'react-select';

import Theme from '../../../../../theme/Theme';
import { GroupUser } from '../../../../../theme/Global';
import { showProfileLoader } from '../../../../../store/actions/userState';
import {
  CaretUp,
  CloseIcon,
  EditOrangeIcon,
  helpCircleIcon,
} from '../../../../../theme/images';
import { billingAddress, creditCardDetails } from '../../../../../constants';
import {
  getBillingDetails,
  getPaymentTermsDetails,
  getPaymentTermsOptions,
  saveBillingInfo,
  savePaymentTerms,
} from '../../../../../api';
import {
  Button,
  InputFormField,
  ErrorMsg,
  GetInitialName,
  ModalBox,
  PageLoader,
  WhiteCard,
  ContractInputSelect,
} from '../../../../../common';

export default function BillingDetails({ id, userInfo, onBoardingId }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [showPaymentTermsModal, setShowPaymentTermsModal] = useState(false);
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({
    billing_contact: {},
    billing_address: {},
    card_details: {},
  });
  const [paymentTermsData, setPaymentTermsData] = useState([]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
  const [paymentTermsValue, setPaymentTermsValue] = useState([]);
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
  const renderDspToolTipInfo = `The payment terms you select here will only apply to one-time and
          permanent additional DSP invoices. <br />
          Standard monthly DSP invoices have default payment terms which cannot
          be changed)`;

  const billingDetails = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getBillingDetails(id).then((response) => {
      setData(response?.data);
      setIsLoading({ loader: false, type: 'page' });
      setFormData({
        billing_contact: response?.data?.billing_contact?.[0],
        billing_address: response?.data?.billing_address?.[0],
        card_details: response?.data?.card_details?.[0],
        expiryMessage: response?.data?.card_details?.[0]?.expiry_info,
      });
    });
  }, [id]);
  const getPaymentTerms = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getPaymentTermsDetails(id).then((response) => {
      setIsLoading({ loader: false, type: 'page' });
      setPaymentTermsData(response?.data?.results);
    });
    getPaymentTermsOptions(id).then((response) => {
      setIsLoading({ loader: false, type: 'page' });
      setPaymentTermsOptions(response?.data);
    });
  }, [id]);

  useEffect(() => {
    billingDetails();
    getPaymentTerms();
  }, [billingDetails, getPaymentTerms]);

  const mapDefaultValues = (type, key) => {
    if (key === 'expiration_date') {
      const getDate = data?.card_details?.[0]?.[key]
        ? data.card_details[0][key].includes('-')
          ? data.card_details[0][key].split('-')
          : data.card_details[0][key].split('/')
        : '';

      return getDate
        ? getDate[0].length > 2
          ? `${getDate[1]}/${getDate[0].substring(2)}`
          : `${getDate[1]}/${getDate[0]}`
        : data.id
        ? '**/**'
        : '';
    }
    if (data?.[type]?.[0]) {
      return data[type][0][key];
    }
    return '';
  };
  const mapPaymentTermsDefaultValues = (type, label) => {
    const value = paymentTermsData.filter((op) => op.invoice_type === type);
    return value?.length ? (
      <div className="col-6">
        {label === 'Dsp' ? (
          <>
            <div className="label mt-3">
              DSP (Additional)
              <img
                src={helpCircleIcon}
                alt="helpCircleIcon"
                style={{
                  width: '14px',
                  verticalAlign: 'middle',
                  paddingBottom: '3px',
                }}
                data-tip={renderDspToolTipInfo}
                data-for="dspAdditionalInfo"
              />
            </div>
            <ReactTooltip
              id="dspAdditionalInfo"
              aria-haspopup="true"
              place="bottom"
              effect="solid"
              html
            />
          </>
        ) : (
          <div className="label mt-3">{label}</div>
        )}
        <div className="label-info">{value?.[0]?.payment_term}</div>
      </div>
    ) : null;
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
  const handlePaymentTermChange = (event, type) => {
    setShowBtn(true);
    setPaymentTermsValue([
      ...paymentTermsValue,
      {
        invoice_type: type,
        payment_term: event.label,
      },
    ]);
  };
  const mapPaymentDefaultValues = (item) => {
    if (item === 'card_number')
      return `************${data?.card_details?.[0]?.[item]}`;
    if (item === 'expiration_date') {
      const getDate = data?.card_details?.[0]?.[item]?.split('-') || '';
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
          type === 'card_details' && data?.id
            ? mapPaymentDefaultValues(item.key)
            : item.key === 'expiration_date'
            ? [formData.type][item.key]
            : formData?.[type]?.[item.key]
        }
        onValueChange={(values) =>
          item.key === 'card_number'
            ? handleChange(values.value, item, type)
            : ''
        }
        isNumericString
      />
    );
  };

  const generateInput = (item, type) => {
    return (
      <input
        className="form-control"
        placeholder={`Enter ${item.label}`}
        type={item.type}
        defaultValue={data?.[type]?.[0]?.[item.key]}
        onChange={(event) => handleChange(event, item, type)}
        maxLength={item.key === 'postal_code' ? 10 : ''}
        readOnly={data?.id && item.key === 'email'}
      />
    );
  };

  const mapContactDetails = () => {
    return (
      <div className="row">
        {billingAddress
          .filter((op) => op.section === 'contact')
          .map((item) => {
            return (
              <div
                className="col-md-6"
                key={item.key}
                style={{
                  opacity: data?.id && item.key === 'email' ? 0.5 : '',
                }}>
                <InputFormField className="mt-3">
                  <label htmlFor={item.label}>
                    {item.label}
                    <br />
                    {item.type === 'number' ? (
                      <>{generateNumeric(item, 'billing_contact')}</>
                    ) : (
                      <>{generateInput(item, 'billing_contact')}</>
                    )}
                  </label>
                </InputFormField>
                <ErrorMsg>
                  {apiError?.billing_contact?.[item.key]?.[0]}
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
        {billingAddress
          .filter((op) => op.section === 'address')
          .map((item) => {
            return (
              <div
                className="col-md-6"
                key={item.key}
                style={{ opacity: item.key === 'email' ? 0.5 : '' }}>
                <InputFormField className="mt-3">
                  <label htmlFor={item.label}>
                    {item.label}
                    <br />
                    {item.type === 'number' ? (
                      <>{generateNumeric(item, 'billing_address')}</>
                    ) : (
                      <>{generateInput(item, 'billing_address')}</>
                    )}
                  </label>
                </InputFormField>
                <ErrorMsg>
                  {apiError?.billing_address?.[item.key]?.[0]}
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
                  <InputFormField className="mt-3">
                    <label htmlFor={item.label}>
                      {item.label}
                      <br />
                      {item.type === 'number' ? (
                        <>{generateNumeric(item, 'card_details')}</>
                      ) : (
                        <>{generateInput(item, 'card_details')}</>
                      )}
                    </label>
                  </InputFormField>
                  <ErrorMsg>{apiError?.card_details?.[item.key]?.[0]}</ErrorMsg>
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  };

  const DropdownIndicator = (dataProps) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...dataProps}>
          <img
            src={CaretUp}
            alt="caret"
            style={{
              transform: dataProps.selectProps.menuIsOpen
                ? 'rotate(180deg)'
                : '',
              width: '25px',
              height: '25px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const getOptions = () => {
    const options = paymentTermsOptions.filter((op) => op.value !== 'standard');
    return options;
  };
  const generateDropdown = (type) => {
    const value = paymentTermsData.filter((op) => op.invoice_type === type);
    const invoiceType = value?.length ? value[0].invoice_type : null;
    const paymentTerm = value?.length ? value[0].payment_term : null;
    return (
      <Select
        classNamePrefix="react-select"
        placeholder={
          value?.length ? value?.[0]?.payment_term : 'Select the terms'
        }
        defaultValue={paymentTerm}
        options={getOptions()}
        name={invoiceType}
        components={{ DropdownIndicator }}
        onChange={(event) => handlePaymentTermChange(event, type)}
      />
    );
  };
  const mapPaymentTermsModalDetails = (type, label) => {
    const paymentTerm = paymentTermsData.filter(
      (item) => item.invoice_type === type,
    );
    return paymentTerm?.length ? (
      <div className="col-12" key={paymentTerm[0].invoice_type}>
        <div className="label mt-3">
          {label}
          {paymentTerm[0].invoice_type === 'dsp service' ? (
            <img
              src={helpCircleIcon}
              alt="helpCircleIcon"
              style={{
                width: '14px',
                verticalAlign: 'middle',
                paddingBottom: '3px',
              }}
              data-tip={renderDspToolTipInfo}
              data-for="dspAdditionalInfo"
            />
          ) : null}
        </div>
        <ReactTooltip
          id="dspAdditionalInfo"
          aria-haspopup="true"
          place="bottom"
          effect="solid"
          html
        />
        <ContractInputSelect>
          {generateDropdown(paymentTerm[0].invoice_type)}
        </ContractInputSelect>
      </div>
    ) : null;
  };

  const saveBillingData = () => {
    setIsLoading({ loader: true, type: 'button' });

    const getYear = new Date().getFullYear().toString().substring(0, 2);
    let format = '';
    if (!formData?.card_details?.expiration_date?.includes(getYear)) {
      format = formData.card_details.expiration_date.split('/');
      formData.card_details.expiration_date = `${getYear + format[1]}-${
        format[0]
      }`;
    }
    if (
      formData?.billing_contact?.phone_number === '' ||
      formData?.billing_contact?.phone_number === null
    )
      delete formData.billing_contact.phone_number;
    if (
      JSON.stringify(data?.card_details?.[0]) ===
      JSON.stringify(formData.card_details)
    ) {
      delete formData.card_details;
      delete formData.old_billinginfo_id;
    } else {
      formData.old_billinginfo_id = data?.id;
    }

    if (formData?.old_billinginfo_id === '') delete formData.old_billinginfo_id;
    if (formData?.billing_contact?.expiry_info)
      delete formData.billing_contact.expiry_info;
    delete formData.expiryMessage;

    let details = {};

    if (data?.id === undefined || data?.id === '') {
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
        customer_onboarding: userInfo.customer_onboarding || onBoardingId,
        payment_type: 'credit card',
      };
    }

    saveBillingInfo(
      details,
      formData?.old_billinginfo_id ? null : data?.id,
    ).then((res) => {
      if (res?.status === 200 || res?.status === 201) {
        setIsLoading({ loader: false, type: 'button' });
        billingDetails();
        setShowModal(false);
        setShowBtn(false);
        dispatch(showProfileLoader(true));
        dispatch(showProfileLoader(false));
      }
      if (res?.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(res && res.data);
      }
    });
  };

  const savePaymentTermsData = () => {
    setIsLoading({ loader: true, type: 'button' });
    savePaymentTerms(paymentTermsValue, id).then((res) => {
      if (res?.status === 200 || (res && res.status === 201)) {
        setIsLoading({ loader: false, type: 'button' });
        getPaymentTerms();
        setShowModal(false);
        setShowBtn(false);
        dispatch(showProfileLoader(true));
        dispatch(showProfileLoader(false));
        toast.success('You have successfully changed your payment terms');
      }
      if (res?.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(res && res.data);
      }
    });
  };

  return (
    <>
      {' '}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnFocusLoss={false}
      />
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader
          component="performance-graph"
          type="detail"
          color={Theme.orange}
          width={40}
          height={40}
        />
      ) : (
        <div className="mt-4">
          {formData?.expiryMessage?.message ? (
            <div
              className="already-user-msg mt-2 mb-3 p-2 text-center"
              style={{
                color: !formData.expiryMessage.is_expired
                  ? Theme.black
                  : Theme.orange,
                backgroundColor: !formData.expiryMessage.is_expired
                  ? Theme.yellow
                  : Theme.lightOrange,
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
                <p className="black-heading-title mt-0 mb-3">Payment Type</p>
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
              {paymentTermsData?.length ? (
                <WhiteCard className="mt-3">
                  <p className="black-heading-title mt-0 mb-0">Payment Terms</p>
                  {userInfo?.role === 'BGS' ||
                  userInfo?.role === 'BGS Manager' ? (
                    <div
                      className="edit-details"
                      role="presentation"
                      onClick={() => setShowPaymentTermsModal(true)}>
                      <img src={EditOrangeIcon} alt="" />
                      Edit
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="row">
                    {mapPaymentTermsDefaultValues(
                      'retainer',
                      'Monthly Retainer',
                    )}
                    {mapPaymentTermsDefaultValues('rev share', 'Revenue share')}
                    {mapPaymentTermsDefaultValues('dsp service', 'Dsp')}
                    {mapPaymentTermsDefaultValues('upsell', 'Upsells')}
                  </div>
                </WhiteCard>
              ) : (
                ''
              )}
            </div>
            <div className="col-md-6 col-sm-12 mb-3">
              <WhiteCard>
                <p className="black-heading-title mt-0 mb-4">Billing Contact</p>
                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => setShowModal(true)}>
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
                <GroupUser className="mt-3">
                  {data?.id ? (
                    <GetInitialName
                      property="float-left mr-3"
                      userInfo={data?.billing_contact?.[0]}
                    />
                  ) : (
                    ''
                  )}
                  <div className="activity-user">
                    {mapDefaultValues('billing_contact', 'first_name')}{' '}
                    {mapDefaultValues('billing_contact', 'last_name')}
                    <br />
                    <div className="user-email-address">
                      {mapDefaultValues('billing_contact', 'email')}
                    </div>
                    <br />
                    <div className="user-email-address">
                      {mapDefaultValues('billing_contact', 'phone_number')}
                    </div>
                  </div>
                  <div className="clear-fix" />
                </GroupUser>
              </WhiteCard>

              <WhiteCard className="mt-3">
                <p className="black-heading-title mt-0 mb-0">Billing Address</p>

                <div
                  className="edit-details"
                  role="presentation"
                  onClick={() => setShowModal(true)}>
                  <img src={EditOrangeIcon} alt="" />
                  Edit
                </div>
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
            <div className="body-content mt-3 ">
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
          </div>
          {showBtn ? (
            <>
              <div className="footer-line " />
              <div className=" col-12  modal-footer">
                <Button
                  className=" btn-primary mr-4"
                  onClick={() => saveBillingData()}>
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color={Theme.white} type="button" />
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
      <Modal
        isOpen={showPaymentTermsModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            setShowPaymentTermsModal(false);
            setShowBtn(false);
            setApiError({});
          }}
          role="presentation"
        />
        <ModalBox>
          <div className="modal-body">
            <h4>Payment Terms</h4>
            <div className="body-content mt-3 ">
              <div className="row">
                {mapPaymentTermsModalDetails('retainer', 'Monthly Retainer')}
                {mapPaymentTermsModalDetails('rev share', 'Revenue share')}
                {mapPaymentTermsModalDetails('dsp service', 'Dsp (Additional)')}
                {mapPaymentTermsModalDetails('upsell', 'Upsells')}
              </div>
            </div>
          </div>

          <div className="footer-line " />
          <div className="modal-footer">
            <Button
              className=" btn-primary mr-4 w-100"
              onClick={() => savePaymentTermsData()}>
              {isLoading.loader && isLoading.type === 'button' ? (
                <PageLoader color={Theme.white} type="button" />
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </ModalBox>
      </Modal>
    </>
  );
}

BillingDetails.defaultProps = {
  onBoardingId: null,
};

BillingDetails.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
};
