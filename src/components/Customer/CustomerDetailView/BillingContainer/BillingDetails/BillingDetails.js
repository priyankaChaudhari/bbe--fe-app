/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import { shape, string, arrayOf } from 'prop-types';

import Theme from '../../../../../theme/Theme';
import { GroupUser } from '../../../../../theme/Global';
import {
  billingAddress,
  paymentTermValueLabel,
} from '../../../../../constants';
import {
  CloseIcon,
  EditOrangeIcon,
  helpCircleIcon,
} from '../../../../../theme/images';
import {
  getBillingDetails,
  getDSPContact,
  getPaymentTermsDetails,
  getPaymentTermsOptions,
  saveBillingInfo,
  saveDSPContact,
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
  DropdownIndicator,
  ErrorMsgBox,
} from '../../../../../common';

export default function BillingDetails({
  id,
  userInfo,
  onBoardingId,
  customerStatus,
  memberData,
}) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });
  const [showModal, setShowModal] = useState(false);
  const [showPaymentTermsModal, setShowPaymentTermsModal] = useState(false);
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({
    billing_contact: {},
    billing_address: {},
  });
  const [paymentTermsData, setPaymentTermsData] = useState([]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState([]);
  const [paymentTermsValue, setPaymentTermsValue] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [showDSPModal, setShowDSPModal] = useState(false);
  const [DSPData, setDSPData] = useState([]);
  const [showDSPEdit, setShowDSPEdit] = useState(false);
  const [showDSPErrorTostr, setShowDSPErrorTostr] = useState(false);
  const [isAllowToEdit, setIsAllowToEdit] = useState(false);

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
          (Standard monthly DSP invoices have default payment terms which cannot
          be changed)`;

  const billingDetails = useCallback(() => {
    setIsLoading({ loader: true, type: 'page' });
    getBillingDetails(id).then((response) => {
      setData(response?.data);
      setIsLoading({ loader: false, type: 'page' });
      setFormData({
        billing_contact: response?.data?.billing_contact?.[0],
        billing_address: response?.data?.billing_address?.[0],
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

  const getDSPContactInfo = useCallback(() => {
    getDSPContact(id).then((res) => {
      if (res?.status === 200) {
        setFormData({ ...formData, dsp_contact: res?.data?.results?.[0] });
        if (res?.data?.is_dsp_contract) {
          if (userInfo?.role === 'Customer') {
            setShowDSPEdit(true);
          } else {
            for (const user of memberData) {
              if (user.user) {
                if (
                  (user?.role_group?.name === 'BGS Manager' ||
                    user?.role_group?.name === 'BGS' ||
                    user?.role_group?.name === 'DSP Ad Manager' ||
                    user?.role_group?.name === 'Ad Manager Admin') &&
                  user?.user?.id === userInfo?.id
                ) {
                  setShowDSPEdit(true);
                  break;
                }
              }
            }
          }
        } else setShowDSPEdit(false);
        setDSPData(res?.data?.results);
      }
    });
  }, [id]);

  useEffect(() => {
    for (const user of memberData) {
      if (user.user) {
        if (
          (user?.role_group?.name === 'BGS Manager' ||
            user?.role_group?.name === 'BGS') &&
          user?.user?.id === userInfo?.id
        ) {
          setIsAllowToEdit(true);
          break;
        }
      }
    }
  }, [memberData, userInfo]);

  useEffect(() => {
    billingDetails();
    getPaymentTerms();
    getDSPContactInfo();
  }, [billingDetails, getPaymentTerms, getDSPContactInfo]);

  const mapDefaultValues = (type, key) => {
    if (type === 'dsp_contact') {
      return key;
    }

    if (data?.[type]?.[0]) {
      return data[type][0][key];
    }
    return '';
  };
  const renderPaymentTermLabel = (value) => {
    return paymentTermValueLabel.filter((field) => field.value === value)[0]
      ?.label !== undefined ? (
      paymentTermValueLabel.filter((field) => field.value === value)[0].label
    ) : (
      <div style={{ textTransform: 'uppercase' }}>{value}</div>
    );
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
        <div className="label-info">
          {renderPaymentTermLabel(value?.[0]?.payment_term)}
        </div>
      </div>
    ) : null;
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
  const handlePaymentTermChange = (event, type) => {
    setShowBtn(true);
    setPaymentTermsValue([
      ...paymentTermsValue,
      {
        invoice_type: type,
        payment_term: event.value,
      },
    ]);
  };

  const generateNumeric = (item, type) => {
    return (
      <NumberFormat
        format={item.format}
        className="form-control"
        onChange={(event) => handleChange(event, item, type)}
        placeholder={`Enter ${item.label}`}
        defaultValue={formData?.[type]?.[item.key]}
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
        defaultValue={data?.[type]?.[0]?.[item.key] || DSPData?.[0]?.[item.key]}
        onChange={(event) => handleChange(event, item, type)}
        maxLength={item.key === 'postal_code' ? 10 : ''}
      />
    );
  };

  const mapContactDetails = (type) => {
    return (
      <div className="row">
        {billingAddress
          .filter((op) => op.section === 'contact')
          .map((item) => {
            return (
              <div
                className={type === 'dsp' ? 'col-md-12' : 'col-md-6'}
                key={item.key}>
                <InputFormField className="mt-3">
                  <label htmlFor={item.label}>
                    {item.label}
                    <br />
                    {item.type === 'number' ? (
                      <>
                        {generateNumeric(
                          item,
                          type === 'dsp' ? 'dsp_contact' : 'billing_contact',
                        )}
                      </>
                    ) : (
                      <>
                        {generateInput(
                          item,
                          type === 'dsp' ? 'dsp_contact' : 'billing_contact',
                        )}
                      </>
                    )}
                  </label>
                </InputFormField>
                <ErrorMsg>
                  {apiError?.billing_contact?.[item.key]?.[0]}
                </ErrorMsg>
                <ErrorMsg>{apiError?.dsp_contact?.[item.key]}</ErrorMsg>
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
          value?.length
            ? renderPaymentTermLabel(value?.[0]?.payment_term)
            : 'Select the terms'
        }
        defaultValue={paymentTerm}
        options={getOptions()}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
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
    if (showDSPModal && formData.dsp_contact) {
      saveDSPContact(
        { ...formData.dsp_contact, customer: id },
        formData?.dsp_contact?.id || DSPData?.[0]?.id,
      ).then((res) => {
        if (res?.status === 400) {
          setApiError({ ...apiError, dsp_contact: res.data });
          if (
            res.data?.first_name?.[0].includes(
              'This field may not be blank.',
            ) ||
            res.data?.last_name?.[0].includes('This field may not be blank.') ||
            res.data?.email?.[0].includes('This field may not be blank.') ||
            res.data?.first_name?.[0].includes('This field is required.') ||
            res.data?.last_name?.[0].includes('This field is required.') ||
            res.data?.email?.[0].includes('This field is required.')
          ) {
            setShowDSPErrorTostr(true);
            setTimeout(() => {
              setShowDSPErrorTostr(false);
            }, 4000);
          } else setShowDSPErrorTostr(false);

          setIsLoading({ loader: false, type: 'button' });
        }
        if (res?.status === 201 || res?.status === 200) {
          getDSPContactInfo(id);
          setShowDSPModal(false);
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    } else {
      if (
        formData?.billing_contact?.phone_number === '' ||
        formData?.billing_contact?.phone_number === null
      )
        delete formData.billing_contact.phone_number;
      let details = {
        customer_onboarding: userInfo.customer_onboarding || onBoardingId,
      };
      if (
        formData?.billing_address &&
        Object.keys(formData.billing_address).length !== 0
      ) {
        details = {
          ...details,
          ...formData,
          billing_address: formData?.billing_address,
        };
      }
      if (
        formData?.billing_contact &&
        Object.keys(formData.billing_contact).length !== 0
      ) {
        details = {
          ...details,
          ...formData,
          billing_contact: formData?.billing_contact,
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
        }
        if (res?.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
          setApiError(res?.data);
        }
      });
    }
  };

  const savePaymentTermsData = () => {
    setIsLoading({ loader: true, type: 'button' });
    savePaymentTerms(paymentTermsValue, id).then((res) => {
      if (res?.status === 200 || res?.status === 201) {
        setIsLoading({ loader: false, type: 'button' });
        getPaymentTerms();
        setShowModal(false);
        setShowBtn(false);
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
      {isLoading.loader && isLoading.type === 'page' ? (
        <PageLoader
          component="agrement-details"
          type="detail"
          color={Theme.orange}
          width={40}
          height={40}
        />
      ) : (
        <div className="mt-4">
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-3">
              {paymentTermsData?.length ? (
                <WhiteCard className="mt-3">
                  <p className="black-heading-title mt-0 mb-0">Payment Terms</p>
                  {isAllowToEdit ? (
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

              <WhiteCard className="mt-3">
                <p className="black-heading-title mt-0 mb-0">Billing Address</p>

                {customerStatus?.value !== 'pending' ? (
                  <div
                    className="edit-details"
                    role="presentation"
                    onClick={() => setShowModal(true)}>
                    <img src={EditOrangeIcon} alt="" />
                    Edit
                  </div>
                ) : null}
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
                <p className="black-heading-title mt-0 mb-4">Billing Contact</p>
                {customerStatus?.value !== 'pending' ? (
                  <div
                    className="edit-details"
                    role="presentation"
                    onClick={() => setShowModal(true)}>
                    <img src={EditOrangeIcon} alt="" />
                    Edit
                  </div>
                ) : null}
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
                <p className="black-heading-title mt-0 mb-4">DSP Contact</p>
                {customerStatus?.value !== 'pending' && showDSPEdit ? (
                  <div
                    className="edit-details"
                    role="presentation"
                    onClick={() => setShowDSPModal(true)}>
                    <img src={EditOrangeIcon} alt="" />
                    Edit
                  </div>
                ) : null}
                {DSPData?.map((item) => (
                  <GroupUser className="mt-3" key={item.key}>
                    {item.id ? (
                      <GetInitialName
                        property="float-left mr-3"
                        userInfo={item}
                      />
                    ) : (
                      ''
                    )}
                    <div className="activity-user">
                      {mapDefaultValues('dsp_contact', item.first_name)}{' '}
                      {mapDefaultValues('dsp_contact', item.last_name)}
                      <br />
                      <div className="user-email-address">
                        {mapDefaultValues('dsp_contact', item.email)}
                      </div>
                      <br />
                      <div className="user-email-address">
                        {mapDefaultValues('dsp_contact', item.phone_number)}
                      </div>
                    </div>
                    <div className="clear-fix" />
                  </GroupUser>
                ))}
              </WhiteCard>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={showModal || showDSPModal}
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
            setShowDSPModal(false);
          }}
          role="presentation"
        />
        <ModalBox>
          {' '}
          <div className="modal-body">
            {showDSPModal ? (
              <>
                <h4>Edit DSP Contact</h4>
                <div className="straight-line horizontal-line mt-3" />
                {showDSPErrorTostr ? (
                  <ErrorMsgBox
                    className="danger mt-3"
                    style={{ textAlign: 'center' }}>
                    You need to fill out all required fields before submitting
                    the DSP Contact.
                  </ErrorMsgBox>
                ) : null}
                {mapContactDetails('dsp')}
              </>
            ) : (
              <>
                <h4>Payment Details</h4>
                <div className="body-content mt-3 ">
                  <ErrorMsg style={{ textAlign: 'center' }}>
                    {apiError && apiError[0]}
                  </ErrorMsg>
                  <div className="straight-line horizontal-line  mt-3 mb-3" />
                  <h4>Billing Address</h4>
                  {mapAddressDetails()}
                  <div className="straight-line horizontal-line  mt-3 mb-3" />
                  <h4>Billing Contact</h4>
                  {mapContactDetails('billing')}
                </div>
              </>
            )}
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
                    'Confirm'
                  )}
                </Button>
                <Button
                  className=" btn-borderless"
                  onClick={() => {
                    setShowModal(false);
                    setShowBtn(false);
                    setApiError({});
                    setShowDSPModal(false);
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
  customerStatus: null,
  memberData: [],
};

BillingDetails.propTypes = {
  id: string.isRequired,
  userInfo: shape({
    customer_onboarding: string,
  }).isRequired,
  onBoardingId: string,
  customerStatus: shape({}),
  memberData: arrayOf(shape({})),
};
