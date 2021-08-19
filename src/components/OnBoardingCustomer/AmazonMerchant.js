/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
  ModalBox,
} from '../../common';
import { askSomeoneData, updateAskSomeoneData, updateUserMe } from '../../api';
import { PATH_SUMMARY, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';
import {
  getAmazonAccountDetails,
  getAmazonSeller,
  getAmazonVendor,
  getVideoLink,
  saveAmazonSellerAccount,
  saveAmazonVendorAccount,
} from '../../api/OnboardingCustomerApi';
import {
  AmazonSellerAccountDetails,
  AmazonVendorAccountDetails,
} from '../../constants/FieldConstants';
import { CloseIcon } from '../../theme/images';

export default function AmazonMerchant({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  isLoading,
  isChecked,
  customStyles,
  noAmazonAccount,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ Seller: {}, Vendor: {} });
  const params = queryString.parse(history.location.search);
  const [marketplaceDetails, setMarketplaceDetails] = useState({
    marketplace: '',
    type: '',
  });
  const [videoData, setVideoData] = useState();
  const [showVideo, setShowVideo] = useState({});
  const [amazonDetails, setAmazonDetails] = useState({
    Seller: {},
    Vendor: {},
  });

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

  const getSellerDetails = (id, type) => {
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
  };

  useEffect(() => {
    getAmazonAccountDetails(4, localStorage.getItem('customer')).then(
      (response) => {
        if (response && response.data) {
          setMarketplaceDetails({
            marketplace:
              response.data.marketplace &&
              response.data.marketplace.name &&
              response.data.marketplace.name.label,
            type: response.data.account_type,
            marketplaceId:
              response.data.marketplace && response.data.marketplace.id,
          });
          const marketplaceID =
            response.data.marketplace && response.data.marketplace.id;

          if (
            response.data.account_type === 'Seller' ||
            response.data.account_type === 'Hybrid'
          ) {
            getSellerDetails(marketplaceID, response.data.account_type);
          } else if (response.data.account_type === 'Vendor') {
            getVendorDetails(marketplaceID, '');
          }
          getVideoLink(localStorage.getItem('customer'), 'hybrid').then(
            (res) => {
              setVideoData(res.data);
            },
          );
          setIsLoading({ loader: false, type: 'page' });
        }
      },
    );
  }, []);

  const mapVideoData = () => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (showVideo[2]) return videoData.seller_central_info;
      if (showVideo[3]) return videoData.seller_ad_info;
      if (showVideo[5]) return videoData.vendor_central_info;
      if (showVideo[6]) return videoData.vendor_ad_info;
    }
    if (marketplaceDetails.type === 'Seller') {
      if (showVideo[2]) return videoData.seller_central_info;
      if (showVideo[3]) return videoData.seller_ad_info;
    }
    if (marketplaceDetails.type === 'Vendor') {
      if (showVideo[2]) return videoData.vendor_central_info;
      if (showVideo[3]) return videoData.vendor_ad_info;
    }
    return '';
  };

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (
      (stepData === undefined ||
        (stepData &&
          Object.keys(stepData) &&
          Object.keys(stepData).length === 0)) &&
      verifiedStepData &&
      Object.keys(verifiedStepData) &&
      Object.keys(verifiedStepData).length === 0
    ) {
      const detail = {
        is_completed: true,
        email: userInfo.email,
        step: 'merchant id',
        customer_onboarding: userInfo.customer_onboarding,
      };
      askSomeoneData(detail).then((stepResponse) => {
        if (stepResponse && stepResponse.status === 201) {
          if (assignedToSomeone) {
            const stringified =
              queryString &&
              queryString.stringify({
                name: verifiedStepData.user_name,
              });
            history.push({
              pathname: PATH_THANKS,
              search: `${stringified}`,
            });
          } else {
            history.push(PATH_SUMMARY);
          }
          updateUserMe(userInfo.id || verifiedStepData.user_id, {
            step: {
              ...(userInfo.step || verifiedStepData.user_step),
              [userInfo.customer || verifiedStepData.customer_id]: 4,
            },
          }).then((user) => {
            if (user && user.status === 200) {
              if (assignedToSomeone) {
                localStorage.removeItem('match');
              } else dispatch(userMe());
            }
          });
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    } else {
      updateAskSomeoneData(
        (stepData && stepData.id) || verifiedStepData.step_id,
        {
          token: assignedToSomeone ? params && params.key : '',
          is_completed: true,
        },
      ).then((response) => {
        if (response && response.status === 200) {
          if (assignedToSomeone) {
            const stringified =
              queryString &&
              queryString.stringify({
                name: verifiedStepData.user_name,
              });
            history.push({
              pathname: PATH_THANKS,
              search: `${stringified}`,
            });
          } else {
            history.push(PATH_SUMMARY);
          }
          updateUserMe(userInfo.id || verifiedStepData.user_id, {
            step: {
              ...(userInfo.step || verifiedStepData.user_step),
              [userInfo.customer || verifiedStepData.customer_id]: 4,
            },
          }).then((user) => {
            if (user && user.status === 200) {
              if (assignedToSomeone) {
                localStorage.removeItem('match');
              } else dispatch(userMe());
            }
          });
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    }
  };

  const vendorAccount = () => {
    saveAmazonVendorAccount(
      {
        ...formData.Vendor,
        marketplace: [marketplaceDetails.marketplaceID],
      },
      amazonDetails.Vendor && amazonDetails.Vendor.id,
    ).then((re) => {
      if ((re && re.status === 201) || (re && re.status === 200)) saveDetails();
      if (re && re.status === 400) {
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const saveAccountDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (
      marketplaceDetails.type === 'Seller' ||
      marketplaceDetails.type === 'Hybrid'
    ) {
      return saveAmazonSellerAccount(
        { ...formData.Seller, marketplace: [marketplaceDetails.marketplaceID] },
        amazonDetails.Seller && amazonDetails.Seller.id,
      ).then((res) => {
        if ((res && res.status === 201) || (res && res.status === 200))
          saveDetails();
        if (res && res.status === 400) {
          setIsLoading({ loader: false, type: 'button' });
        }
        if (marketplaceDetails.type === 'Hybrid') {
          vendorAccount();
        }
      });
    }
    if (marketplaceDetails.type === 'Vendor') {
      vendorAccount();
    }
    return '';
  };

  const generateAmazon = (part) => {
    return (
      <fieldset className="shape-without-border  w-430 mt-3 mb-2">
        <p className="account-steps m-0">Part {part}</p>
        Log into your Amazon{' '}
        {(marketplaceDetails.type === 'Hybrid' && part === 1) ||
        marketplaceDetails.type === 'Seller'
          ? 'Seller'
          : 'Vendor'}{' '}
        Central admin account for your{' '}
        <strong>
          primary marketplace ({marketplaceDetails.marketplace}
          ).
        </strong>
        <a
          href={
            (marketplaceDetails.type === 'Hybrid' && part === 1) ||
            marketplaceDetails.type === 'Seller'
              ? 'https://sellercentral.amazon.com/'
              : 'https://vendorcentral.amazon.com/'
          }
          target="_blank"
          rel="noopener noreferrer">
          <Button className="btn-transparent font-style-regular w-100 mt-4">
            Log into Amazon{' '}
            {(marketplaceDetails.type === 'Hybrid' && part === 1) ||
            marketplaceDetails.type === 'Seller'
              ? 'Seller'
              : 'Vendor'}{' '}
            Account
          </Button>
        </a>
      </fieldset>
    );
  };

  const mapDefaultValues = (item, part) => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (part === 2 || part === 3) {
        return (
          amazonDetails && amazonDetails.Seller && amazonDetails.Seller[item]
        );
      }
      if (part === 5 || part === 6) {
        return (
          amazonDetails && amazonDetails.Vendor && amazonDetails.Vendor[item]
        );
      }
    }
    return (
      amazonDetails &&
      amazonDetails[marketplaceDetails.type] &&
      amazonDetails[marketplaceDetails.type][item]
    );
  };

  const setDefaultValues = (item, value, part) => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (part === 2 || part === 3) {
        setFormData({
          ...formData,
          Seller: {
            ...formData.Seller,
            [item]: value,
          },
        });
      }
      if (part === 5 || part === 6) {
        setFormData({
          ...formData,
          Vendor: {
            ...formData.Vendor,
            [item]: value,
          },
        });
      }
    } else
      setFormData({
        ...formData,
        [marketplaceDetails.type]: {
          ...formData[marketplaceDetails.type],
          [item]: value,
        },
      });
  };

  const generateAccountType = (part, mapData) => {
    return (
      <fieldset className="shape-without-border  w-430 mt-3 mb-2">
        <p className="account-steps m-0">Part {part}</p>
        Navigate to Settings &gt; Account Info and enter your{' '}
        <strong>
          {(marketplaceDetails.type === 'Hybrid' && part === 2) ||
          marketplaceDetails.type === 'Seller'
            ? 'Seller'
            : 'Vendor'}{' '}
          Display Name
        </strong>{' '}
        and{' '}
        <strong>
          {(marketplaceDetails.type === 'Hybrid' && part === 2) ||
          marketplaceDetails.type === 'Seller'
            ? 'Merchant Token ID'
            : 'Vendor Code'}{' '}
        </strong>{' '}
        below.
        <p className="info-text-gray m-0 mb-4 ">
          <span
            className="video-link cursor"
            onClick={() => setShowVideo({ [part]: true })}
            role="presentation">
            Click here to watch the video.
          </span>
        </p>
        {mapData
          .filter((op) => op.section === 1)
          .map((item) => (
            <ContractFormField className="mt-4" key={item.key}>
              <label htmlFor={item.label}>
                {item.label}
                <input
                  placeholder={`Enter ${item.label}`}
                  className="form-control"
                  onChange={(event) =>
                    setDefaultValues(item.key, event.target.value, part)
                  }
                  defaultValue={mapDefaultValues(item.key, part)}
                  readOnly={isChecked}
                />
              </label>
            </ContractFormField>
          ))}
      </fieldset>
    );
  };

  const generateAdvertiser = (part, mapData) => {
    return (
      <fieldset className="shape-without-border  w-430 mt-3 mb-2">
        <p className="account-steps m-0">Part {part}</p>
        Navigate to Settings &gt; Account Info and enter your{' '}
        <strong>Advertiser Name</strong> and <strong>ID</strong> below.
        <p className="info-text-gray m-0 mb-4 ">
          <span
            className="video-link cursor"
            onClick={() => setShowVideo({ [part]: true })}
            role="presentation">
            Click here to watch the video.
          </span>
        </p>
        {mapData &&
          mapData
            .filter((op) => op.section === 2)
            .map((item) => (
              <ContractFormField className="mt-4" key={item.key}>
                <label htmlFor={item.label}>
                  {item.label}
                  <input
                    placeholder={`Enter ${item.label}`}
                    className="form-control"
                    onChange={(event) =>
                      setDefaultValues(item.key, event.target.value, part)
                    }
                    defaultValue={mapDefaultValues(item.key, part)}
                    readOnly={isChecked}
                  />
                </label>
              </ContractFormField>
            ))}
        {isChecked ? (
          ''
        ) : (
          <>
            {(marketplaceDetails.type === 'Hybrid' && part === 6) ||
            marketplaceDetails.type === 'Vendor' ||
            marketplaceDetails.type === 'Seller' ? (
              <Button
                className="btn-primary w-100 mt-3"
                onClick={() => saveAccountDetails()}
                disabled={
                  formData &&
                  Object.keys(formData.Seller) &&
                  Object.keys(formData.Seller).length === 0
                }>
                {' '}
                {isLoading.loader && isLoading.type === 'button' ? (
                  <PageLoader color="#fff" type="button" />
                ) : (
                  <>{assignedToSomeone ? 'Submit' : 'Continue'} </>
                )}
              </Button>
            ) : (
              ''
            )}
          </>
        )}
      </fieldset>
    );
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        {noAmazonAccount ? (
          ''
        ) : (
          <>
            {marketplaceDetails.type === 'Hybrid' ? (
              <>
                {generateAmazon(1)}
                {generateAccountType(2, AmazonSellerAccountDetails)}
                {generateAdvertiser(3, AmazonSellerAccountDetails)}
                <div className="straight-line horizontal-line spacing mt-4 mb-4" />
                {generateAmazon(4)}
                {generateAccountType(5, AmazonVendorAccountDetails)}
                {generateAdvertiser(6, AmazonVendorAccountDetails)}
              </>
            ) : (
              <>
                {generateAmazon(1)}
                {generateAccountType(
                  2,
                  marketplaceDetails.type === 'Seller'
                    ? AmazonSellerAccountDetails
                    : AmazonVendorAccountDetails,
                )}
                {generateAdvertiser(
                  3,
                  marketplaceDetails.type === 'Seller'
                    ? AmazonSellerAccountDetails
                    : AmazonVendorAccountDetails,
                )}
              </>
            )}
            <Modal
              isOpen={showVideo[Object.keys(showVideo)]}
              style={customStyles}
              ariaHideApp={false}
              contentLabel="Edit modal">
              <img
                src={CloseIcon}
                alt="close"
                className="float-right cursor cross-icon"
                onClick={() => setShowVideo({ showVideo: false })}
                role="presentation"
              />
              <ModalBox>
                {isLoading.loader && isLoading.type === 'video' ? (
                  <PageLoader color="#FF5933" type="page" />
                ) : (
                  <div className="modal-body">
                    <iframe
                      title="video "
                      className="embed-responsive-item w-100 "
                      allow="accelerometer; autoplay;"
                      frameBorder="0"
                      allowFullScreen
                      src={videoData ? mapVideoData() : ''}
                    />
                  </div>
                )}
              </ModalBox>
            </Modal>
          </>
        )}
      </OnBoardingBody>
    </>
  );
}

AmazonMerchant.defaultProps = {
  stepData: {},
};

AmazonMerchant.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    customer: PropTypes.string,
    customer_onboarding: PropTypes.string,
    step: PropTypes.shape({
      step: PropTypes.number,
    }),
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.shape({
    id: PropTypes.string,
  }),
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
      user_step: PropTypes.objectOf(PropTypes.object),
    }),
  ).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    merchant_id: PropTypes.string,
  }).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  isChecked: PropTypes.bool.isRequired,
  customStyles: PropTypes.objectOf(PropTypes.object).isRequired,
  noAmazonAccount: PropTypes.bool.isRequired,
};
