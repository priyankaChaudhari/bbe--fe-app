/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import queryString from 'query-string';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { userMe } from '../../store/actions';
import { CloseIcon, VideoCall } from '../../theme/images';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  deleteAmazonAccount,
  saveAmazonSellerAccount,
  saveAmazonVendorAccount,
} from '../../api';
import {
  PATH_AMAZON_MERCHANT,
  PATH_SUMMARY,
  PATH_THANKS,
  PATH_UNAUTHORIZED_AMAZON_MERCHANT,
  amazonSellerAccountDetails,
  amazonVendorAccountDetails,
} from '../../constants';
import {
  OnBoardingBody,
  ContractFormField,
  Button,
  PageLoader,
  ModalBox,
  ErrorMsg,
  CheckBox,
} from '../../common';

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
  showVideo,
  marketplaceDetails,
  videoData,
  setShowVideo,
  setNoAmazonAccount,
  apiError,
  setApiError,
  setMarketplaceDetails,
  setFormData,
  formData,
}) {
  const customVideostyle = {
    width: '16px',
    marginRight: '6px',
    verticalAlign: 'text-bottom',
    cursor: 'pointer',
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const params = queryString.parse(history.location.search);
  const [latestId, setLatestId] = useState({ Seller: null, Vendor: null });

  useEffect(() => {
    setFormData({
      Seller: marketplaceDetails.Seller,
      Vendor: marketplaceDetails.Vendor,
    });
  }, [marketplaceDetails]);

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

  const vendorAccount = (vendor) => {
    saveAmazonVendorAccount(
      vendor,
      marketplaceDetails.Vendor && marketplaceDetails.Vendor.id,
      noAmazonAccount.Vendor,
    ).then((re) => {
      if ((re && re.status === 201) || (re && re.status === 200)) saveDetails();
      if (re && re.status === 400) {
        setApiError(re && re.data);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const sellerAccount = (seller) => {
    saveAmazonSellerAccount(
      seller,
      (marketplaceDetails.Seller && marketplaceDetails.Seller.id) ||
        latestId.Seller,
      noAmazonAccount.Seller,
    ).then((res) => {
      if ((res && res.status === 201) || (res && res.status === 200))
        saveDetails();
      // setLatestId({ ...latestId, Seller: res && res.data && res.data.id });

      if (res && res.status === 400) {
        setApiError(res && res.data);
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  const saveAccountDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    let seller = {};
    let vendor = {};
    noAmazonAccount.Seller
      ? (seller = {
          marketplace: marketplaceDetails && marketplaceDetails.marketplaceId,
          seller_central_name: null,
          merchant_id: null,
          advertiser_name: null,
          advertiser_id: null,
        })
      : (seller = {
          ...formData.Seller,
          marketplace: marketplaceDetails && marketplaceDetails.marketplaceId,
        });
    noAmazonAccount.Vendor
      ? (vendor = {
          vendor_central_name: null,
          advertiser_name: null,
          advertiser_id: null,
          vendor_code: null,
          marketplace: marketplaceDetails && marketplaceDetails.marketplaceId,
        })
      : (vendor = {
          ...formData.Vendor,
          marketplace: marketplaceDetails && marketplaceDetails.marketplaceId,
        });

    if (marketplaceDetails.type === 'Seller') sellerAccount(seller);
    if (marketplaceDetails.type === 'Vendor') vendorAccount(vendor);
    if (marketplaceDetails.type === 'Hybrid') {
      axios
        .all([
          saveAmazonSellerAccount(
            seller,
            (marketplaceDetails.Seller && marketplaceDetails.Seller.id) ||
              latestId.Seller,
            noAmazonAccount.Seller,
          ),
          saveAmazonVendorAccount(
            vendor,
            (marketplaceDetails.Vendor && marketplaceDetails.Vendor.id) ||
              latestId.Vendor,
            noAmazonAccount.Vendor,
          ),
        ])
        .then(
          axios.spread((...res) => {
            setLatestId({
              Seller: res[0] && res[0].data && res[0].data.id,
              Vendor: res[1] && res[1].data && res[1].data.id,
            });
            if (
              ((res[0] && res[0].status === 201) ||
                (res[0] && res[0].status === 200)) &&
              ((res[1] && res[1].status === 201) ||
                (res[1] && res[1].status === 200))
            )
              saveDetails();
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
                marketplaceDetails.type === 'Hybrid' &&
                res[0] &&
                res[0].status === 400
              ) {
                document.body.scrollTop = 500; // For Safari
                document.documentElement.scrollTop = 500; // For Chrome, Firefox, IE and Opera
              }
            }
          }),
        );
    }
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
          marketplaceDetails &&
          marketplaceDetails.Seller &&
          marketplaceDetails.Seller[item]
        );
      }
      if (part === 5 || part === 6) {
        return (
          marketplaceDetails &&
          marketplaceDetails.Vendor &&
          marketplaceDetails.Vendor[item]
        );
      }
    }
    return (
      marketplaceDetails &&
      marketplaceDetails[marketplaceDetails.type] &&
      marketplaceDetails[marketplaceDetails.type][item]
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

  const removeError = (key, part) => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (part === 2 || part === 3) {
        setApiError({
          ...apiError,
          Seller: {
            ...apiError.Seller,
            [key]: '',
          },
        });
      }
      if (part === 5 || part === 6) {
        setApiError({
          ...apiError,
          Vendor: {
            ...apiError.Vendor,
            [key]: '',
          },
        });
      }
    }
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
        <p className="info-text-gray mt-1 mb-4 ">
          <img style={customVideostyle} src={VideoCall} alt="video" />
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
                  onChange={(event) => {
                    setDefaultValues(item.key, event.target.value, part);
                    setApiError({
                      ...apiError,
                      [item.key]: '',
                    });
                    removeError(item.key, part);
                  }}
                  defaultValue={mapDefaultValues(item.key, part)}
                  readOnly={isChecked}
                />
              </label>
              <ErrorMsg>{apiError && apiError[item.key]}</ErrorMsg>
              <ErrorMsg>
                {apiError && apiError.Seller && apiError.Seller[item.key]}
              </ErrorMsg>
              <ErrorMsg>
                {apiError && apiError.Vendor && apiError.Vendor[item.key]}
              </ErrorMsg>
            </ContractFormField>
          ))}
      </fieldset>
    );
  };

  const disableBtn = () => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (noAmazonAccount.Seller && noAmazonAccount.Vendor) return false;
      if (
        noAmazonAccount.Seller &&
        formData.Vendor &&
        formData.Vendor.vendor_central_name &&
        formData.Vendor &&
        formData.Vendor.vendor_code &&
        formData.Vendor &&
        formData.Vendor.advertiser_name &&
        formData.Vendor &&
        formData.Vendor.advertiser_id
      )
        return false;
      if (
        noAmazonAccount.Vendor &&
        formData.Seller &&
        formData.Seller.seller_central_name &&
        formData.Seller &&
        formData.Seller.merchant_id &&
        formData.Seller &&
        formData.Seller.advertiser_name &&
        formData.Seller &&
        formData.Seller.advertiser_id
      )
        return false;
      if (
        !formData.Seller ||
        !(formData.Seller && formData.Seller.seller_central_name) ||
        !(formData.Seller && formData.Seller.merchant_id) ||
        !(formData.Seller && formData.Seller.advertiser_name) ||
        !(formData.Seller && formData.Seller.advertiser_id) ||
        !formData.Vendor ||
        !(formData.Vendor && formData.Vendor.vendor_central_name) ||
        !(formData.Vendor && formData.Vendor.vendor_code) ||
        !(formData.Vendor && formData.Vendor.advertiser_name) ||
        !(formData.Vendor && formData.Vendor.advertiser_id)
      )
        return true;
      return false;
    }
    if (marketplaceDetails.type === 'Seller') {
      if (noAmazonAccount.Seller) return false;
      if (
        !formData.Seller ||
        !(formData.Seller && formData.Seller.seller_central_name) ||
        !(formData.Seller && formData.Seller.merchant_id) ||
        !(formData.Seller && formData.Seller.advertiser_name) ||
        !(formData.Seller && formData.Seller.advertiser_id)
      )
        return true;
      return false;
    }
    if (marketplaceDetails.type === 'Vendor') {
      if (noAmazonAccount.Vendor) return false;
      if (
        !formData.Vendor ||
        !(formData.Vendor && formData.Vendor.vendor_central_name) ||
        !(formData.Vendor && formData.Vendor.vendor_code) ||
        !(formData.Vendor && formData.Vendor.advertiser_name) ||
        !(formData.Vendor && formData.Vendor.advertiser_id)
      )
        return true;
      return false;
    }
    return false;
  };

  const generateSaveBtn = (part) => {
    return (
      <>
        {(marketplaceDetails.type === 'Hybrid' && part === 7) ||
        marketplaceDetails.type === 'Vendor' ||
        marketplaceDetails.type === 'Seller' ? (
          <Button
            className="btn-primary w-100 mt-3"
            onClick={() => saveAccountDetails()}
            disabled={disableBtn()}>
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
    );
  };

  const generateAdvertiser = (part, mapData) => {
    return (
      <fieldset className="shape-without-border  w-430 mt-3 mb-1">
        <p className="account-steps m-0">Part {part}</p>
        Navigate to Settings &gt; Account Info and enter your{' '}
        <strong>Advertiser Name</strong> and <strong>ID</strong> below.
        <p className="info-text-gray mt-1 mb-4 ">
          <img style={customVideostyle} src={VideoCall} alt="video" />
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
                    onChange={(event) => {
                      setDefaultValues(item.key, event.target.value, part);
                      setApiError({
                        ...apiError,
                        [item.key]: '',
                      });
                      removeError(item.key, part);
                    }}
                    defaultValue={mapDefaultValues(item.key, part)}
                    readOnly={isChecked}
                  />
                </label>
                <ErrorMsg>{apiError && apiError[item.key]}</ErrorMsg>
                {part === 3 ? (
                  <ErrorMsg>
                    {apiError && apiError.Seller && apiError.Seller[item.key]}
                  </ErrorMsg>
                ) : part === 6 ? (
                  <ErrorMsg>
                    {apiError && apiError.Vendor && apiError.Vendor[item.key]}
                  </ErrorMsg>
                ) : (
                  ''
                )}
              </ContractFormField>
            ))}
        {isChecked ? '' : <>{generateSaveBtn()}</>}
      </fieldset>
    );
  };

  const btnDesign = () => {
    return (
      <Button
        className="btn-primary w-100 mt-3"
        onClick={() => saveAccountDetails()}
        disabled={disableBtn()}>
        {' '}
        {isLoading.loader && isLoading.type === 'button' ? (
          <PageLoader color="#fff" type="button" />
        ) : (
          <>{assignedToSomeone ? 'Submit' : 'Continue'} </>
        )}
      </Button>
    );
  };

  const generateBtn = () => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (isChecked) return '';
      return <>{btnDesign()}</>;
    }
    if (
      history.location.pathname.includes(PATH_AMAZON_MERCHANT) &&
      (noAmazonAccount.Seller || noAmazonAccount.Vendor)
    ) {
      if (isChecked) return '';
      return <>{btnDesign()}</>;
    }

    if (
      history.location.pathname.includes(PATH_UNAUTHORIZED_AMAZON_MERCHANT) &&
      (noAmazonAccount.Seller || noAmazonAccount.Vendor)
    )
      return <>{btnDesign()}</>;
    return '';
  };

  const showNoAmazonAccountCheckbox = () => {
    return (
      <CheckBox
        className={
          isLoading.loader && isLoading.type === 'check'
            ? ' mb-4 isDisabled'
            : ' mb-4'
        }>
        <label className="check-container customer-pannel " htmlFor="Vendor">
          Our company hasn&apos;t setup an Amazon Vendor account yet
          <input
            type="checkbox"
            id="Vendor"
            name="Vendor"
            onChange={(event) => {
              setNoAmazonAccount({
                ...noAmazonAccount,
                Vendor: event.target.checked,
              });
              setApiError({});
              if (
                event.target.checked === false &&
                history.location.pathname.includes(PATH_AMAZON_MERCHANT) &&
                marketplaceDetails.Vendor &&
                marketplaceDetails.Vendor.id
              ) {
                deleteAmazonAccount(
                  'vendor',
                  marketplaceDetails.Vendor.id,
                ).then((res) => {
                  if (res && res.status === 204) {
                    setMarketplaceDetails({
                      ...marketplaceDetails,
                      Seller: formData.Seller || marketplaceDetails.Seller,
                      Vendor: {},
                    });
                  }
                });
              }
            }}
            readOnly
            checked={noAmazonAccount.Vendor}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
    );
  };

  return (
    <>
      <OnBoardingBody
        className={assignedToSomeone ? 'body-white' : 'body-white pb-1'}>
        {noAmazonAccount[marketplaceDetails.type] ? (
          ''
        ) : (
          <>
            {marketplaceDetails.type === 'Hybrid' ? (
              <>
                {noAmazonAccount.Seller ? (
                  ''
                ) : (
                  <>
                    {generateAmazon(1)}
                    {generateAccountType(2, amazonSellerAccountDetails)}
                    {generateAdvertiser(3, amazonSellerAccountDetails)}
                  </>
                )}
                <div className="straight-line horizontal-line spacing mt-4 mb-4" />
                {showNoAmazonAccountCheckbox()}
                {noAmazonAccount.Vendor ? (
                  ''
                ) : (
                  <>
                    {generateAmazon(4)}
                    {generateAccountType(5, amazonVendorAccountDetails)}
                    {generateAdvertiser(6, amazonVendorAccountDetails)}
                  </>
                )}
              </>
            ) : (
              <>
                {generateAmazon(1)}
                {generateAccountType(
                  2,
                  marketplaceDetails.type === 'Seller'
                    ? amazonSellerAccountDetails
                    : amazonVendorAccountDetails,
                )}
                {generateAdvertiser(
                  3,
                  marketplaceDetails.type === 'Seller'
                    ? amazonSellerAccountDetails
                    : amazonVendorAccountDetails,
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
        {generateBtn()}
      </OnBoardingBody>
    </>
  );
}

AmazonMerchant.defaultProps = {
  stepData: {},
  setShowVideo: () => {},
  showVideo: {},
  setNoAmazonAccount: () => {},
  setApiError: () => {},
  apiError: {},
  setMarketplaceDetails: () => {},
  setFormData: () => {},
  formData: {},
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
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  isChecked: PropTypes.bool.isRequired,
  customStyles: PropTypes.objectOf(PropTypes.object).isRequired,
  noAmazonAccount: PropTypes.shape({
    Seller: PropTypes.bool,
    Vendor: PropTypes.bool,
  }).isRequired,
  setShowVideo: PropTypes.func,
  showVideo: PropTypes.objectOf(PropTypes.object),
  marketplaceDetails: PropTypes.shape({
    type: PropTypes.string,
    marketplace: PropTypes.string,
    marketplaceId: PropTypes.string,
    Seller: PropTypes.shape({
      id: PropTypes.string,
    }),
    Vendor: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  videoData: PropTypes.shape({
    seller_central_info: PropTypes.string,
    seller_ad_info: PropTypes.string,
    vendor_central_info: PropTypes.string,
    vendor_ad_info: PropTypes.string,
  }).isRequired,
  setNoAmazonAccount: PropTypes.func,
  setApiError: PropTypes.func,
  apiError: PropTypes.objectOf(PropTypes.array),
  setMarketplaceDetails: PropTypes.func,
  setFormData: PropTypes.func,
  formData: PropTypes.shape({
    Seller: PropTypes.objectOf(PropTypes.Object),
    Vendor: PropTypes.objectOf(PropTypes.Object),
  }),
};
