import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from 'axios';

import {
  ModalBox,
  PageLoader,
  Button,
  ContractFormField,
} from '../../../common';
import { saveAmazonSellerAccount, saveAmazonVendorAccount } from '../../../api';

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
  setApiError,
}) {
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  const afterSuccessAPI = () => {
    toast.success('Amazon Account details saved!');
    setIsLoading({ loader: false, type: 'button' });
    setShowModal(false);
    sellerVendorCall(
      selectedMarketplace && selectedMarketplace.account_type,
      selectedMarketplace && selectedMarketplace.value,
      selectedMarketplace,
    );
    getActivityLogInfo();
  };

  const vendorAccount = (vendor) => {
    saveAmazonVendorAccount(
      vendor,
      amazonDetails && amazonDetails.Vendor && amazonDetails.Vendor.id,
    ).then((re) => {
      if ((re && re.status === 201) || (re && re.status === 200))
        afterSuccessAPI();

      if (re && re.status === 400) {
        setApiError(re && re.data);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const sellerAccount = (seller) => {
    saveAmazonSellerAccount(
      seller,
      amazonDetails && amazonDetails.Seller && amazonDetails.Seller.id,
    ).then((res) => {
      if ((res && res.status === 201) || (res && res.status === 200))
        afterSuccessAPI();

      if (res && res.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
        setApiError(res && res.data);
        if (
          selectedMarketplace &&
          selectedMarketplace.account_type === 'Hybrid'
        ) {
          const div = document.getElementById('scroll');
          $('#scroll').animate(
            {
              scrollTop: div.scrollHeight,
            },
            500,
          );
        }
      }
    });
  };

  const hybridAccount = (seller, vendor) => {
    axios
      .all([
        saveAmazonSellerAccount(
          seller,
          amazonDetails && amazonDetails.Seller && amazonDetails.Seller.id,
        ),
        saveAmazonVendorAccount(
          vendor,
          amazonDetails && amazonDetails.Vendor && amazonDetails.Vendor.id,
        ),
      ])
      .then(
        axios.spread((...res) => {
          if (
            ((res[0] && res[0].status === 201) ||
              (res[0] && res[0].status === 200)) &&
            ((res[1] && res[1].status === 201) ||
              (res[1] && res[1].status === 200))
          )
            afterSuccessAPI();
          if (
            (res[0] && res[0].status === 400) ||
            (res[1] && res[1].status === 400)
          ) {
            let sel = {};
            let ven = {};
            if (res[0] && res[0].status === 400) {
              sel = res[0] && res[0].data;
            }
            if (res[1] && res[1].status === 400) {
              ven = res[1] && res[1].data;
            }
            setApiError({ Seller: sel, Vendor: ven });
            setIsLoading({ loader: false, type: 'button' });
            if (
              selectedMarketplace &&
              selectedMarketplace.account_type === 'Hybrid'
            ) {
              const div = document.getElementById('scroll');
              $('#scroll').animate(
                {
                  scrollTop: div.scrollHeight,
                },
                500,
              );
            }
          }
        }),
      );
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
    if (selectedMarketplace && selectedMarketplace.account_type === 'Seller')
      sellerAccount(seller);
    if (selectedMarketplace && selectedMarketplace.account_type === 'Vendor')
      vendorAccount(vendor);
    if (selectedMarketplace && selectedMarketplace.account_type === 'Hybrid')
      hybridAccount(seller, vendor);
  };

  return (
    <ModalBox>
      <div className="modal-body" id="scroll">
        <div className="row" id="scroll">
          <div className="col-12 modal-heading p-0">
            <h4>Edit Amazon Account Names & IDs</h4>
            <div className="straight-line horizontal-line mt-3 " />
            <div className="body-content pb-0">
              <ContractFormField>
                {generateDropdown()}
                <div className="straight-line horizontal-line mt-4 mb-3" />
              </ContractFormField>
              {generateAccountHTML('edit')}
            </div>
          </div>
        </div>
      </div>
      {showBtn ? (
        <>
          <div className="footer-line " />
          <div className="modal-footer">
            <div className="row">
              <div className=" col-6  ">
                <Button
                  className=" btn-primary w-100"
                  onClick={() => saveAccountDetails()}>
                  {isLoading.loader && isLoading.type === 'button' ? (
                    <PageLoader color="#fff" type="button" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </div>
              <div className=" col-6  ">
                <Button
                  className=" btn-borderless w-100"
                  onClick={() => {
                    setShowModal(false);
                    setApiError({});
                  }}>
                  Discard Changes
                </Button>
              </div>
            </div>
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
  setApiError: () => {},
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
  setApiError: PropTypes.func,
};
