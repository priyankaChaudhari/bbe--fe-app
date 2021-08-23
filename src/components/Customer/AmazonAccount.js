/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';

import copy from 'copy-to-clipboard';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import { ContractFormField, DropDownSelect, WhiteCard } from '../../common';
import {
  EditOrangeIcon,
  CopyLinkIcon,
  CaretUp,
  CloseIcon,
} from '../../theme/images';
import {
  AmazonSellerAccountDetails,
  AmazonVendorAccountDetails,
} from '../../constants/FieldConstants';
import {
  getAmazonSeller,
  getAmazonVendor,
} from '../../api/OnboardingCustomerApi';
import EditAmazonAccountDetails from './EditAmazonAccountDetails';

export default function AmazonAccount({
  marketplaceData,
  customStyles,
  getActivityLogInfo,
}) {
  const { Option, SingleValue } = components;
  const [marketplaceChoices, setMarketplaceChoices] = useState([]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(null);
  const [amazonDetails, setAmazonDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showBtn, setShowBtn] = useState(false);

  const getVendorDetails = (id, sellerData) => {
    getAmazonVendor(id).then((vendor) => {
      setAmazonDetails({
        Seller: sellerData,
        Vendor:
          vendor &&
          vendor.data &&
          vendor.data.results &&
          vendor.data.results[0],
      });
    });
  };

  const getSellerDetails = useCallback(
    (id, type) => {
      getAmazonSeller(id).then((seller) => {
        setAmazonDetails({
          ...amazonDetails,
          Seller:
            seller &&
            seller.data &&
            seller.data.results &&
            seller.data.results[0],
        });
        if (type === 'Hybrid') {
          getVendorDetails(
            id,
            seller &&
              seller.data &&
              seller.data.results &&
              seller.data.results[0],
          );
        }
      });
    },
    [amazonDetails],
  );

  const sellerVendorCall = (type, marketplace, event) => {
    setSelectedMarketplace(event || (marketplaceData && marketplaceData[0]));
    if (type === 'Seller' || type === 'Hybrid') {
      getSellerDetails(marketplace, type);
    } else if (type === 'Vendor') {
      getVendorDetails(marketplace, '');
    }
  };

  useEffect(() => {
    setMarketplaceChoices(marketplaceData);
    sellerVendorCall(
      marketplaceData[0] && marketplaceData[0].account_type,
      marketplaceData[0] && marketplaceData[0].value,
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
    if (
      selectedMarketplace &&
      selectedMarketplace.account_type === 'Hybrid' &&
      part === 1
    ) {
      setFormData({
        ...formData,
        Seller: {
          ...formData.Seller,
          [item]: event.target.value,
        },
      });
    }
    if (
      selectedMarketplace &&
      selectedMarketplace.account_type === 'Hybrid' &&
      part === 2
    ) {
      setFormData({
        ...formData,
        Vendor: {
          ...formData.Vendor,
          [item]: event.target.value,
        },
      });
    } else if (
      selectedMarketplace &&
      selectedMarketplace.account_type !== 'Hybrid'
    )
      setFormData({
        ...formData,
        [selectedMarketplace.account_type]: {
          ...formData[selectedMarketplace.account_type],
          [item]: event.target.value,
        },
      });
  };

  const mapDefaultValues = (item, part) => {
    if (selectedMarketplace && selectedMarketplace.account_type === 'Hybrid') {
      if (part === 1) {
        return (
          amazonDetails && amazonDetails.Seller && amazonDetails.Seller[item]
        );
      }
      if (part === 2) {
        return (
          amazonDetails && amazonDetails.Vendor && amazonDetails.Vendor[item]
        );
      }
    }
    return (
      amazonDetails &&
      amazonDetails[selectedMarketplace && selectedMarketplace.account_type] &&
      amazonDetails[selectedMarketplace && selectedMarketplace.account_type][
        item
      ]
    );
  };

  const generateInput = (item, part) => {
    return (
      <input
        className="form-control extra-space"
        type="text"
        name={item.key}
        placeholder={item.label}
        defaultValue={mapDefaultValues(item.key, part)}
        onChange={(event) => handleChange(event, item.key, part)}
      />
    );
  };

  const generateEditHTML = (mapData, part) => {
    return (
      <>
        {mapData &&
          mapData.map((item) => (
            <div className={item.property} id={item.key} key={item.key}>
              <ContractFormField className="mt-3">
                <label htmlFor={item.id}>
                  {item.label}
                  <br />
                  {generateInput(item, part)}
                </label>
              </ContractFormField>
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
                <div className="label-info">
                  {mapDefaultValues(item.key, part) || `No ${item.label}.`}
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
        {selectedMarketplace &&
        selectedMarketplace.account_type === 'Hybrid' ? (
          <div className=" liner-titles spacing mt-4 mb-3">Seller Central</div>
        ) : (
          ''
        )}
        {selectedMarketplace &&
        (selectedMarketplace.account_type === 'Seller' ||
          selectedMarketplace.account_type === 'Hybrid') ? (
          <>
            {html === 'edit'
              ? generateEditHTML(AmazonSellerAccountDetails, 1)
              : generateHTML(AmazonSellerAccountDetails, 1)}
          </>
        ) : (
          ''
        )}
        {selectedMarketplace &&
        selectedMarketplace.account_type === 'Hybrid' ? (
          <div className=" liner-titles spacing mt-4 mb-3"> Vendor Central</div>
        ) : (
          ''
        )}
        {selectedMarketplace &&
        (selectedMarketplace.account_type === 'Vendor' ||
          selectedMarketplace.account_type === 'Hybrid') ? (
          <>
            {html === 'edit'
              ? generateEditHTML(AmazonVendorAccountDetails, 2)
              : generateHTML(AmazonVendorAccountDetails, 2)}
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
        <div className="label-info">
          <DropDownSelect className="mt-2">
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
        </div>
      </>
    );
  };

  return (
    <WhiteCard>
      <p className="black-heading-title mt-0 ">Amazon Account Names & IDs</p>
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
      {generateDropdown()}
      {generateAccountHTML('label')}
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
        />
      </Modal>
    </WhiteCard>
  );
}

AmazonAccount.defaultProps = {
  customStyles: {},
};

AmazonAccount.propTypes = {
  customStyles: PropTypes.objectOf(PropTypes.object),
  marketplaceData: PropTypes.arrayOf(PropTypes.array).isRequired,
  getActivityLogInfo: PropTypes.func.isRequired,
};
