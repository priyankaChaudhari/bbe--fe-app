/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';

import copy from 'copy-to-clipboard';
import Modal from 'react-modal';
import Select, { components } from 'react-select';
import { func, shape, arrayOf } from 'prop-types';

import {
  InputFormField,
  DropDownSelect,
  ErrorMsg,
  WhiteCard,
} from '../../../common';
import {
  EditOrangeIcon,
  CopyLinkIcon,
  CaretUp,
  CloseIcon,
} from '../../../theme/images';
import {
  amazonSellerAccountDetails,
  amazonVendorAccountDetails,
} from '../../../constants';
import { getAmazonSeller, getAmazonVendor } from '../../../api';
import EditAmazonAccountDetails from './EditAmazonAccountDetails';

export default function AmazonAccount({
  marketplaceData,
  customStyles,
  getActivityLogInfo,
}) {
  const { Option, SingleValue } = components;
  const [marketplaceChoices, setMarketplaceChoices] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [amazonDetails, setAmazonDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showBtn, setShowBtn] = useState(false);
  const [apiError, setApiError] = useState({});

  const getVendorDetails = (id, sellerData) => {
    getAmazonVendor(id).then((vendor) => {
      setAmazonDetails({
        Seller: sellerData,
        Vendor: vendor?.data?.results?.[0],
      });
      setFormData({
        Seller: sellerData,
        Vendor: vendor?.data?.results?.[0],
      });
    });
  };

  const getSellerDetails = useCallback(
    (id, type) => {
      getAmazonSeller(id).then((seller) => {
        setAmazonDetails({
          ...amazonDetails,
          Seller: seller?.data?.results?.[0],
        });
        setFormData({
          ...formData,
          Seller: seller?.data?.results?.[0],
        });
        if (type === 'Hybrid') {
          getVendorDetails(id, seller?.data?.results?.[0]);
        }
      });
    },
    [amazonDetails],
  );

  const sellerVendorCall = (type, marketplace, event) => {
    setSelectedMarketplace(
      event ||
        marketplaceData.find((value) => value.is_primary) ||
        marketplaceData?.[0],
    );
    if (type === 'Seller' || type === 'Hybrid') {
      getSellerDetails(marketplace, type);
    } else if (type === 'Vendor') {
      getVendorDetails(marketplace, '');
    }
  };

  useEffect(() => {
    setMarketplaceChoices(marketplaceData);
    sellerVendorCall(
      marketplaceData.find((value) => value.is_primary)?.account_type ||
        marketplaceData?.[0]?.account_type,
      marketplaceData.find((value) => value.is_primary)?.value ||
        marketplaceData?.[0]?.value,
      null,
    );
  }, [marketplaceData]);

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

  const singleMarketplaceOption = (dataProps) => (
    <SingleValue {...dataProps}>
      <span style={{ fontSize: '15px', color: '#000000' }}>
        {dataProps.data.label} {dataProps.data.is_primary ? '(primary)' : ''}
      </span>
    </SingleValue>
  );

  const IconOption = (dataProps) => (
    <Option {...dataProps}>
      {dataProps.data.label} {dataProps.data.is_primary ? '(primary)' : ''}
    </Option>
  );

  const handleChange = (event, item, part) => {
    setShowBtn(true);
    setApiError({
      ...apiError,
      [item]: '',
    });
    if (selectedMarketplace?.account_type === 'Hybrid' && part === 1) {
      setFormData({
        ...formData,
        Seller: {
          ...formData.Seller,
          [item]: event.target.value,
        },
      });
      setApiError({
        ...apiError,
        Seller: {
          ...apiError.Seller,
          [item]: '',
        },
      });
    }
    if (selectedMarketplace?.account_type === 'Hybrid' && part === 2) {
      setFormData({
        ...formData,
        Vendor: {
          ...formData.Vendor,
          [item]: event.target.value,
        },
      });
      setApiError({
        ...apiError,
        Vendor: {
          ...apiError.Vendor,
          [item]: '',
        },
      });
    } else if (selectedMarketplace?.account_type !== 'Hybrid')
      setFormData({
        ...formData,
        [selectedMarketplace.account_type]: {
          ...formData[selectedMarketplace.account_type],
          [item]: event.target.value,
        },
      });
  };

  const mapDefaultValues = (item, part) => {
    if (selectedMarketplace?.account_type === 'Hybrid') {
      if (part === 1) {
        return formData?.Seller?.[item];
      }
      if (part === 2) {
        return formData?.Vendor?.[item];
      }
    }
    return formData?.[selectedMarketplace?.account_type]?.[item] || '';
  };

  const generateInput = (item, part) => {
    return (
      <input
        className="form-control extra-space"
        type="text"
        name={item.key}
        id={item.key}
        placeholder={item.label}
        value={mapDefaultValues(item.key, part)}
        onChange={(event) => handleChange(event, item.key, part)}
      />
    );
  };

  const generateEditHTML = (mapData, part) => {
    return (
      <>
        {mapData?.map((item) => (
          <div className={item.property} id={item.key} key={item.key}>
            <InputFormField className="mt-3">
              <label htmlFor={item.key}>
                {item.label}
                <br />
                {generateInput(item, part)}
              </label>
              <ErrorMsg>{apiError?.[item.key]}</ErrorMsg>
              {part === 1 ? (
                <ErrorMsg>{apiError?.Seller?.[item.key]}</ErrorMsg>
              ) : part === 2 ? (
                <ErrorMsg>{apiError?.Vendor?.[item.key]}</ErrorMsg>
              ) : (
                ''
              )}
            </InputFormField>
          </div>
        ))}
      </>
    );
  };

  const generateHTML = (mapData, part) => {
    return (
      <>
        {mapData &&
          mapData.map((item) => {
            return (
              <div className="copy-info" key={item.key}>
                <div className="label mt-3">{item.label}</div>
                <div className="label-info card-title">
                  {mapDefaultValues(item.key, part) || 'None'}
                </div>
                <div
                  className="copy-text"
                  onClick={() => copy(mapDefaultValues(item.key, part))}
                  role="presentation">
                  <img src={CopyLinkIcon} alt="" />
                  Copy
                </div>
              </div>
            );
          })}
      </>
    );
  };

  const generateAccountHTML = (html) => {
    return (
      <>
        {selectedMarketplace?.account_type === 'Hybrid' ? (
          <div className=" liner-titles spacing mt-4 mb-3">Seller Central</div>
        ) : (
          ''
        )}
        {selectedMarketplace?.account_type === 'Seller' ||
        selectedMarketplace?.account_type === 'Hybrid' ? (
          <>
            {html === 'edit'
              ? generateEditHTML(amazonSellerAccountDetails, 1)
              : generateHTML(amazonSellerAccountDetails, 1)}
          </>
        ) : (
          ''
        )}
        {selectedMarketplace?.account_type === 'Hybrid' ? (
          <div className=" liner-titles spacing mt-4 mb-3"> Vendor Central</div>
        ) : (
          ''
        )}
        {selectedMarketplace?.account_type === 'Vendor' ||
        selectedMarketplace?.account_type === 'Hybrid' ? (
          <>
            {html === 'edit'
              ? generateEditHTML(amazonVendorAccountDetails, 2)
              : generateHTML(amazonVendorAccountDetails, 2)}
          </>
        ) : (
          ''
        )}
      </>
    );
  };

  const generateDropdown = () => {
    return (
      <>
        <div className="label mt-3">Marketplace</div>

        <DropDownSelect>
          <Select
            classNamePrefix="react-select"
            className="active"
            options={marketplaceChoices}
            value={selectedMarketplace}
            onChange={(event) =>
              sellerVendorCall(event.account_type, event.value, event)
            }
            components={{
              SingleValue: singleMarketplaceOption,
              DropdownIndicator,
              Option: IconOption,
            }}
          />
        </DropDownSelect>
      </>
    );
  };

  return (
    <WhiteCard>
      <p className="black-heading-title card-title mt-0 ">
        Amazon Account Names & IDs
      </p>
      {marketplaceChoices?.length === 0 ||
      selectedMarketplace?.account_type === null ||
      selectedMarketplace?.account_type === '' ? (
        ''
      ) : (
        <div
          className="edit-details"
          onClick={() => {
            setShowModal(true);
            setShowBtn(false);
          }}
          role="presentation">
          <img src={EditOrangeIcon} alt="" />
          Edit
        </div>
      )}
      {marketplaceChoices?.length === 0 ? (
        'Marketplace not found.'
      ) : (
        <>
          {generateDropdown()}
          {selectedMarketplace?.account_type ? (
            <>{generateAccountHTML('label')}</>
          ) : (
            <div className="mt-3">Account type not found.</div>
          )}
        </>
      )}

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
        <EditAmazonAccountDetails
          setShowModal={setShowModal}
          selectedMarketplace={selectedMarketplace}
          generateDropdown={generateDropdown}
          generateAccountHTML={generateAccountHTML}
          formData={formData}
          showBtn={showBtn}
          amazonDetails={amazonDetails}
          sellerVendorCall={sellerVendorCall}
          getActivityLogInfo={getActivityLogInfo}
          setApiError={setApiError}
        />
      </Modal>
    </WhiteCard>
  );
}

AmazonAccount.defaultProps = {
  customStyles: {},
};

AmazonAccount.propTypes = {
  customStyles: shape({}),
  marketplaceData: arrayOf(shape({})).isRequired,
  getActivityLogInfo: func.isRequired,
};
