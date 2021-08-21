/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { FormField, ModalBox, PageLoader, Button } from '../../common';
import {
  saveAmazonSellerAccount,
  saveAmazonVendorAccount,
} from '../../api/OnboardingCustomerApi';

export default function EditAmazonAccountDetails({
  setShowModal,
  generateDropdown,
  generateAccountHTML,
  formData,
  showBtn,
  selectedMarketplace,
  amazonDetails,
  sellerVendorCall,
  getActivityLogInfo,
}) {
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  const vendorAccount = (vendor) => {
    saveAmazonVendorAccount(
      vendor,
      amazonDetails && amazonDetails.Vendor && amazonDetails.Vendor.id,
    ).then((re) => {
      if ((re && re.status === 201) || (re && re.status === 200)) {
        toast.success('Amazon Account details saved!');
        setIsLoading({ loader: false, type: 'button' });
        setShowModal(false);
        sellerVendorCall(
          selectedMarketplace && selectedMarketplace.account_type,
          selectedMarketplace && selectedMarketplace.value,
          selectedMarketplace,
        );
        getActivityLogInfo();
      }
      if (re && re.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const saveAccountDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    const seller = {
      ...formData.Seller,
      marketplace: selectedMarketplace && selectedMarketplace.value,
    };
    const vendor = {
      ...formData.Vendor,
      marketplace: selectedMarketplace && selectedMarketplace.value,
    };

    if (
      (selectedMarketplace && selectedMarketplace.account_type === 'Seller') ||
      (selectedMarketplace && selectedMarketplace.account_type === 'Hybrid')
    ) {
      return saveAmazonSellerAccount(
        seller,
        amazonDetails && amazonDetails.Seller && amazonDetails.Seller.id,
      ).then((res) => {
        if ((res && res.status === 201) || (res && res.status === 200))
          if (
            selectedMarketplace &&
            selectedMarketplace.account_type === 'Hybrid'
          ) {
            vendorAccount(vendor);
          } else {
            setIsLoading({ loader: false, type: 'button' });
            toast.success('Amazon Account details saved!');
            setShowModal(false);
            sellerVendorCall(
              selectedMarketplace && selectedMarketplace.account_type,
              selectedMarketplace && selectedMarketplace.value,
              selectedMarketplace,
            );
            getActivityLogInfo();
          }
        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    }
    if (selectedMarketplace && selectedMarketplace.account_type === 'Vendor') {
      vendorAccount(vendor);
    }
    return '';
  };

  return (
    <ModalBox>
      <div className="modal-body ">
        <div className="row">
          <div className="col-12 modal-heading">
            <h4>Edit Amazon Account Names & IDs</h4>
            <div className="straight-line horizontal-line mt-3 mb-3" />
            <FormField className="mt-3">
              {generateDropdown()}
              <div className="straight-line horizontal-line mt-4 mb-3" />
            </FormField>
            {generateAccountHTML('edit')}
          </div>
        </div>
      </div>
      {showBtn ? (
        <>
          <div className="footer-line " />
          <div className=" col-12  modal-footer">
            <Button
              className=" btn-primary mr-4"
              onClick={() => saveAccountDetails()}>
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
  );
}

EditAmazonAccountDetails.defaultProps = {
  setShowModal: () => {},
  showBtn: false,
};

EditAmazonAccountDetails.propTypes = {
  setShowModal: PropTypes.func,
  selectedMarketplace: PropTypes.shape({
    account_type: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  formData: PropTypes.shape({
    Seller: PropTypes.objectOf(PropTypes.object),
    Vendor: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
  showBtn: PropTypes.bool,
  generateDropdown: PropTypes.func.isRequired,
  generateAccountHTML: PropTypes.func.isRequired,
  amazonDetails: PropTypes.shape({
    Seller: PropTypes.objectOf(PropTypes.object),
    Vendor: PropTypes.objectOf(PropTypes.object),
  }).isRequired,
  sellerVendorCall: PropTypes.func.isRequired,
  getActivityLogInfo: PropTypes.func.isRequired,
};
