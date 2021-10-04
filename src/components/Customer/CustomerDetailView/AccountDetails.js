import React, { useState, useEffect, useCallback } from 'react';

import Modal from 'react-modal';
import Select, { components } from 'react-select';
import { string, shape, bool, func } from 'prop-types';

import Theme from '../../../theme/Theme';
import EditAccountDetails from './EditAccountDetails';
import { getCustomerDetails } from '../../../api';
import { DropDownStatus, ModalBox, Status } from '../../../common';
import {
  CaretUp,
  CloseIcon,
  CompanyDefaultUser,
  EditOrangeIcon,
  WhiteCaretUp,
} from '../../../theme/images';

export default function AccountDetails({
  id,
  customerData,
  setShowModal,
  userInfo,
  setStatusModal,
  showModal,
  getActivityLogInfo,
  IsSaveDataClicked,
  customStyles,
}) {
  let statusActions = [
    { value: 'active', label: 'Activate' },
    { value: 'at risk', label: 'Place at risk' },
    { value: 'inactive', label: 'Inactivate' },
  ];

  const [customer, setCustomer] = useState(customerData);

  const customerDetails = useCallback(() => {
    getCustomerDetails(id).then((res) => {
      if (res && res.status === 200) {
        setCustomer(res && res.data);
      }
    });
  }, [id]);

  useEffect(() => {
    customerDetails();
  }, [customerDetails]);

  const checkStatus = () => {
    if (customer && customer.status) {
      statusActions = statusActions.filter(
        (element) => element.value !== customer.status.value,
      );
    }
  };

  const DropdownIndicator = (dataProps) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...dataProps}>
          <img
            src={
              customer &&
              customer.status &&
              customer.status.value === 'pending cancellation'
                ? CaretUp
                : WhiteCaretUp
            }
            alt="caret"
            style={{
              transform: dataProps.selectProps.menuIsOpen
                ? 'rotate(180deg)'
                : '',
              width:
                customer &&
                customer.status &&
                customer.status.value === 'pending cancellation'
                  ? '15px'
                  : '11px',
              height:
                customer &&
                customer.status &&
                customer.status.value === 'pending cancellation'
                  ? '15px'
                  : '11px',
            }}
          />
        </components.DropdownIndicator>
      )
    );
  };

  const checkStatusColor = () => {
    if (customer && customer.status) {
      if (customer.status.value === 'inactive') {
        return Theme.gray60;
      }
      if (customer.status.value === 'pending cancellation') {
        return Theme.yellow;
      }
      if (customer.status.value === 'at risk') {
        return Theme.darkRed;
      }
      if (customer.status.value === 'pending account setup') {
        return Theme.gray60;
      }
      return Theme.darkGreen;
    }
    return '';
  };
  return (
    <>
      <div
        className=" edit-details edit-brand-details cursor "
        onClick={() => setShowModal(true)}
        role="presentation">
        <img src={EditOrangeIcon} alt="" />
        Edit
      </div>

      <div className="brand-logo-details mb-3 mt-3">
        {' '}
        {customer && customer.documents && customer.documents[0] ? (
          <img
            className="brand-logo-image"
            src={Object.values(customer.documents[0])}
            alt="company-logo"
          />
        ) : (
          <img
            className="brand-logo-image"
            src={CompanyDefaultUser}
            alt="company-logo"
          />
        )}
        <div className="brand-name mt-2 mb-1 ">
          {' '}
          {customer && customer.company_name}
        </div>
        {customer && customer.customer_account_type ? (
          <Status
            className=" account-type mt-2 mb-1"
            backgroundColor={Theme.gray8}
            label={customer.customer_account_type}
          />
        ) : null}
        <div className="company-label-info">
          {customer && customer.address ? `${customer.address}` : ''}
          {customer && customer.city ? `, ${customer.city}` : ''}
          {customer && customer.state && customer.state.label
            ? `, ${customer.state.label}`
            : customer && customer.state
            ? `, ${customer.state}`
            : ''}
          {customer && customer.zip_code ? `, ${customer.zip_code}` : ''}
          {customer && customer.country && customer.country.label
            ? `, ${customer.country.label}`
            : `, ${customer && customer.country}`
            ? customer && customer.country
            : ''}
        </div>
        <div className="mb-2">
          <a
            css="text-transform: initial;"
            href={
              customer && customer.website && customer.website.includes('http')
                ? customer && customer.website
                : `http://www.${customer && customer.website}`
            }
            target="_blank"
            rel=" noopener noreferrer">
            {customer && customer.website}
          </a>
        </div>
        {customer && customer.status && customer.status.value !== null ? (
          (customer &&
            customer.status &&
            customer.status.value === 'pending account setup') ||
          customer.status.value === 'pending' ? (
            <span className="company-status inactive ">
              {customer && customer.status && customer.status.label}
            </span>
          ) : userInfo && userInfo.role === 'Customer' ? (
            <span
              className="company-status"
              style={{
                background: checkStatusColor(),
                color:
                  customer.status.value === 'pending cancellation'
                    ? 'black'
                    : '',
              }}>
              {customer && customer.status && customer.status.label}
            </span>
          ) : (
            <DropDownStatus className=" customer-details">
              {checkStatus()}
              <Select
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    background: checkStatusColor(),
                    borderRadius: '50px',
                    minHeight: '24px',
                    outline: 'none !important',
                    boxShadow: 'none  !important',
                    outLine: 'none',
                    cursor: 'pointer',
                    width:
                      (customer &&
                        customer.status &&
                        customer.status.value === 'pending cancellation') ||
                      (customer &&
                        customer.status &&
                        customer.status.value === 'pending account setup')
                        ? '176px !important'
                        : customer &&
                          customer.status &&
                          customer.status.value === 'at risk'
                        ? '120px'
                        : '88px',
                    '&:focus': {
                      outline: 'none !important',
                      boxShadow: 'none  !important',
                    },
                    '&:hover': {
                      outline: 'none',
                    },
                  }),
                  singleValue: (provided) => {
                    const color =
                      customer &&
                      customer.status &&
                      customer.status.value === 'pending cancellation'
                        ? Theme.black
                        : Theme.white;

                    return { ...provided, color };
                  },
                }}
                classNamePrefix="react-select"
                options={statusActions}
                onChange={(e) =>
                  setStatusModal({
                    show: true,
                    type: e.value,
                  })
                }
                value={customer && customer.status}
                components={{
                  DropdownIndicator,
                }}
              />
            </DropDownStatus>
          )
        ) : (
          <div className="company-status inactive capitalize mb-3 ">
            {customer && customer.contract_status}
          </div>
        )}
        <div className="straight-line horizontal-line mb-3 mt-4" />
      </div>
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
          <EditAccountDetails
            setShowModal={setShowModal}
            setDocumentImage={customer.documents}
            getActivityLogInfo={getActivityLogInfo}
            IsSaveDataClicked={IsSaveDataClicked}
            customerDetails={customerDetails}
            id={id}
            customer={customer}
          />
        </ModalBox>
      </Modal>
    </>
  );
}

AccountDetails.defaultProps = {
  id: '',
  setShowModal: () => {},
  setStatusModal: () => {},
  IsSaveDataClicked: () => {},
  customStyles: {},
};

AccountDetails.propTypes = {
  id: string,
  getActivityLogInfo: func.isRequired,
  userInfo: shape({
    role: string,
  }).isRequired,
  customerData: shape({
    id: string,
  }).isRequired,
  setShowModal: func,
  setStatusModal: func,
  showModal: bool.isRequired,
  customStyles: func,
  IsSaveDataClicked: func,
};
