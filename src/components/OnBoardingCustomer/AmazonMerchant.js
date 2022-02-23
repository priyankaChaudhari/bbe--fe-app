/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import axios from 'axios';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { string, shape, bool, func, number, arrayOf } from 'prop-types';

import AmazonVideo from './Modals/AmazonVideo';
import { userMe } from '../../store/actions';
import { VideoCall } from '../../theme/images';
import {
  SingleAccountMarketplaces,
  HybridAccountMarketplaces,
} from './Marketplaces';
import {
  askSomeoneData,
  updateAskSomeoneData,
  updateUserMe,
  saveAmazonSellerMarketplaces,
  saveAmazonVendorMarketplaces,
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
  InputFormField,
  Button,
  PageLoader,
  ErrorMsg,
} from '../../common';

export default function AmazonMerchant({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  isLoading,
  isChecked,
  noAmazonAccount,
  showVideo,
  marketplaceDetails,
  videoData,
  setShowVideo,
  apiError,
  setApiError,
  setFormData,
  secondaryMarketplaces,
  sellerMarketplaces,
  setSellerMarketplaces,
  vendorMarketplaces,
  setVendorMarketplaces,
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

  useEffect(() => {
    setFormData({
      Seller: marketplaceDetails.Seller,
      Vendor: marketplaceDetails.Vendor,
    });
  }, [marketplaceDetails]);

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

  // Save Seller Account details
  const sellerAccount = (seller) => {
    saveAmazonSellerMarketplaces(
      seller,
      marketplaceDetails?.Seller?.id,
      noAmazonAccount,
    ).then((res) => {
      if ((res && res.status === 201) || (res && res.status === 200))
        saveDetails();

      if (res && res.status === 400) {
        setApiError({ ...apiError, Seller: [...res?.data] });
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  // Save Vendor Account details
  const vendorAccount = (vendor) => {
    saveAmazonVendorMarketplaces(
      vendor,
      marketplaceDetails?.Vendor?.id,
      noAmazonAccount,
    ).then((res) => {
      if ((res && res.status === 201) || (res && res.status === 200))
        saveDetails();
      if (res && res.status === 400) {
        setApiError({ ...apiError, Vendor: [...res?.data] });
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  // Save complete account details (Seller & Vendor)
  const saveAccountDetails = (sellerID, vendorID) => {
    setIsLoading({ loader: true, type: 'button' });
    let seller = [];
    let vendor = [];

    // If don't have Amazon account yet then make all entries null except mentioned in condition for seller & vendor
    if (noAmazonAccount) {
      sellerMarketplaces.forEach((marketplace) => {
        Object.keys(marketplace).forEach((key) => {
          if (
            key !== 'marketplace' &&
            key !== 'doesnt_advertise' &&
            key !== 'id'
          ) {
            marketplace[key] = null;
          }
        });
      });
      vendorMarketplaces.forEach((marketplace) => {
        Object.keys(marketplace).forEach((key) => {
          if (
            key !== 'marketplace' &&
            key !== 'doesnt_advertise' &&
            key !== 'id'
          ) {
            marketplace[key] = null;
          }
        });
      });
    }

    // Filter all the updated seller marketplaces from list as we only send those (patch)
    seller = sellerID
      ? sellerMarketplaces.filter((entry) => entry?.id)
      : [...sellerMarketplaces];

    // Filter all the updated vendors marketplaces from list as we only send those (patch)
    vendor = vendorID
      ? vendorMarketplaces.filter((entry) => entry?.id)
      : [...vendorMarketplaces];

    // Only if the account is Seller
    if (marketplaceDetails.type === 'Seller')
      sellerAccount(noAmazonAccount ? sellerMarketplaces : seller);

    // Only if the account is Vendor
    if (marketplaceDetails.type === 'Vendor')
      vendorAccount(noAmazonAccount ? vendorMarketplaces : vendor);

    // Only if the account is Hybrid
    if (marketplaceDetails.type === 'Hybrid') {
      axios
        .all([
          saveAmazonSellerMarketplaces(
            noAmazonAccount ? sellerMarketplaces : seller,
            marketplaceDetails?.Seller?.id,
            noAmazonAccount,
          ),
          saveAmazonVendorMarketplaces(
            noAmazonAccount ? vendorMarketplaces : vendor,
            marketplaceDetails?.Vendor?.id,
            noAmazonAccount,
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
              saveDetails();
            if (
              (res[0] && res[0].status === 400) ||
              (res[1] && res[1].status === 400)
            ) {
              let sellerErrors = [];
              let vendorErrors = [];
              if (res[0] && res[0].status === 400) {
                sellerErrors = res[0]?.data;
              }
              if (res[1] && res[1].status === 400) {
                vendorErrors = res[1]?.data;
              }

              setApiError({
                Seller: [...sellerErrors],
                Vendor: [...vendorErrors],
              });

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

  // Generate Login in to your account step
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

  // Use this method to map errors
  const mapApiErrors = (key, marketplaceID, type) => {
    const errors = apiError?.[type]?.find(
      (entry) => entry?.marketplace?.[0] === marketplaceID,
    );
    return errors?.[key]?.[0];
  };

  // Use this methid to map basic details (Primary marketplace)
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

  // Use this methid to map extra details (Secondary marketplaces)
  const mapSecondaryMarketplaceValues = (item, marketplaceID, type) => {
    const accountType =
      type === 'Seller' ? 'seller_marketplace' : 'vendor_marketplace';
    const marketplace = secondaryMarketplaces.find(
      (entry) => entry[accountType]?.id === marketplaceID,
    );
    return marketplace?.[accountType]?.[type]?.[item];
  };

  // Add/Update Seller Marketplaces
  const updateSellerMarketplaces = (item, value, accountID) => {
    if (Object.keys(sellerMarketplaces).length > 0) {
      const updatedMarketplaces = sellerMarketplaces.map((entry) => {
        if (entry.marketplace === marketplaceDetails.marketplaceId)
          return accountID
            ? { ...entry, id: accountID, [item]: value }
            : { ...entry, [item]: value };

        return entry;
      });
      setSellerMarketplaces([...updatedMarketplaces]);
    } else {
      setSellerMarketplaces([
        ...sellerMarketplaces,
        { marketplace: marketplaceDetails.marketplaceId, [item]: value },
      ]);
    }
  };

  // Add/Update Vendor Marketplaces
  const updateVendorMarketplaces = (item, value, accountID) => {
    if (Object.keys(vendorMarketplaces).length > 0) {
      const updatedMarketplaces = vendorMarketplaces.map((entry) => {
        if (entry.marketplace === marketplaceDetails.marketplaceId)
          return accountID
            ? { ...entry, id: accountID, [item]: value }
            : { ...entry, [item]: value };

        return entry;
      });
      setVendorMarketplaces([...updatedMarketplaces]);
    } else {
      setVendorMarketplaces([
        ...vendorMarketplaces,
        { marketplace: marketplaceDetails.marketplaceId, [item]: value },
      ]);
    }
  };

  // setting default value for primary marketplace only
  const setDefaultValues = (item, value, part, accountID) => {
    if (marketplaceDetails.type === 'Hybrid') {
      if (part === 2 || part === 3) {
        updateSellerMarketplaces(item, value, accountID);
      }

      if (part === 5 || part === 6) {
        updateVendorMarketplaces(item, value, accountID);
      }
    }
    if (marketplaceDetails.type === 'Seller') {
      updateSellerMarketplaces(item, value, accountID);
    }
    if (marketplaceDetails.type === 'Vendor') {
      updateVendorMarketplaces(item, value, accountID);
    }
  };

  // setting default value for secondary marketplace only
  const setDefaultForSecondary = (
    item,
    value,
    marketplaceID,
    section,
    accountID,
  ) => {
    // Set the values of Seller marketplace fields
    if (section === 'Seller') {
      if (
        Object.keys(sellerMarketplaces).length > 0 &&
        sellerMarketplaces.some((entry) => entry.marketplace === marketplaceID)
      ) {
        const updatedMarketplaces = sellerMarketplaces.map((entry) => {
          // If the do not advertise on marketplace then make two fields blank
          if (
            entry.marketplace === marketplaceID &&
            item === 'doesnt_advertise' &&
            value
          ) {
            return accountID
              ? {
                  ...entry,
                  id: accountID,
                  advertiser_name: ' ',
                  advertiser_id: ' ',
                  [item]: value,
                }
              : {
                  ...entry,
                  advertiser_name: ' ',
                  advertiser_id: ' ',
                  [item]: value,
                };
          }

          // Check If that markeplace already has a Seller or vendor account with accountID
          if (entry.marketplace === marketplaceID)
            return accountID
              ? { ...entry, id: accountID, [item]: value }
              : { ...entry, [item]: value };

          return entry;
        });

        setSellerMarketplaces([...updatedMarketplaces]);
      } else {
        setSellerMarketplaces([
          ...sellerMarketplaces,
          { marketplace: marketplaceID, [item]: value },
        ]);
      }
    }

    // Set the values of Vendor marketplace fields
    if (section === 'Vendor') {
      // Check if there are any marketplaces + current marketplace is already avaiailable then update it
      if (
        Object.keys(vendorMarketplaces).length > 0 &&
        vendorMarketplaces.some((entry) => entry.marketplace === marketplaceID)
      ) {
        const updatedMarketplaces = vendorMarketplaces.map((entry) => {
          // if marketplace is mathced + key is doesnt_advertise + doesnt_advertise value is true
          if (
            entry.marketplace === marketplaceID &&
            item === 'doesnt_advertise' &&
            value
          ) {
            // if seller account is already there
            return accountID
              ? {
                  ...entry,
                  id: accountID,
                  advertiser_name: ' ',
                  advertiser_id: ' ',
                  [item]: value,
                }
              : {
                  ...entry,
                  advertiser_name: ' ',
                  advertiser_id: ' ',
                  [item]: value,
                };
          }

          // If only marketplace is matched
          if (entry.marketplace === marketplaceID)
            return accountID
              ? { ...entry, id: accountID, [item]: value }
              : { ...entry, [item]: value };

          return entry;
        });

        setVendorMarketplaces([...updatedMarketplaces]);
      } else {
        // if marketplace is not present at all
        setVendorMarketplaces([
          ...vendorMarketplaces,
          { marketplace: marketplaceID, [item]: value },
        ]);
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
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

  const generateAccountType = (part, mapData, accountType) => {
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
            <InputFormField className="mt-4" key={item.key}>
              <label htmlFor={item.label}>
                {item.label}
                <input
                  placeholder={`Enter ${item.label}`}
                  className="form-control"
                  onChange={(event) => {
                    setDefaultValues(
                      item.key,
                      event.target.value,
                      part,
                      marketplaceDetails?.[accountType]?.id,
                    );
                    // setApiError({
                    //   ...apiError,
                    //   [item.key]: '',
                    // });
                    // removeError(item.key, part);
                  }}
                  defaultValue={mapDefaultValues(item.key, part)}
                  readOnly={isChecked}
                />
              </label>
              {Object.keys(apiError).length > 0 ? (
                <>
                  <ErrorMsg>
                    {mapApiErrors(
                      item.key,
                      marketplaceDetails?.[accountType]?.marketplace,
                      accountType,
                    )}
                  </ErrorMsg>
                </>
              ) : null}
            </InputFormField>
          ))}
      </fieldset>
    );
  };

  // Validation logic to check if all the required fields are filled
  const validateMarketplaces = () => {
    let allEntries = [];

    // Get all the fields that are required for seller
    if (
      marketplaceDetails.type === 'Seller' ||
      marketplaceDetails.type === 'Hybrid'
    ) {
      if (noAmazonAccount) return false;

      // get all the field values from seller markeplaces
      for (let entry = 0; entry < sellerMarketplaces.length; entry += 1) {
        allEntries = [
          ...allEntries,
          ...Object.values(sellerMarketplaces[entry]),
        ];
      }
    }

    // Get all the fields that are required for Vendor
    if (
      marketplaceDetails.type === 'Vendor' ||
      marketplaceDetails.type === 'Hybrid'
    ) {
      if (noAmazonAccount) return false;

      // get all the field values from vendor markeplaces
      for (let entry = 0; entry < vendorMarketplaces.length; entry += 1) {
        allEntries = [
          ...allEntries,
          ...Object.values(vendorMarketplaces[entry]),
        ];
      }
    }

    // If even single field is undefined it will retrun true, making button disabled
    return (
      allEntries.includes(undefined) ||
      allEntries.includes(null) ||
      allEntries.includes('')
    );
  };

  // Show this Btn if account is either Seller or Vendor
  const generateSaveBtn = (part) => {
    return (
      <>
        {(marketplaceDetails.type === 'Hybrid' && part === 7) ||
        marketplaceDetails.type === 'Vendor' ||
        marketplaceDetails.type === 'Seller' ? (
          <Button
            className="btn-primary w-100 mt-3"
            disabled={validateMarketplaces()}
            onClick={() =>
              saveAccountDetails(
                marketplaceDetails?.Seller?.id,
                marketplaceDetails?.Vendor?.id,
              )
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
    );
  };

  // Generate Advertiser details section (Part 2 & Part 6) for Primary marketplace
  const generateAdvertiser = (part, mapData, accountType) => {
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
              <InputFormField className="mt-4" key={item.key}>
                <label htmlFor={item.label}>
                  {item.label}
                  <input
                    placeholder={`Enter ${item.label}`}
                    className="form-control"
                    onChange={(event) => {
                      setDefaultValues(
                        item.key,
                        event.target.value,
                        part,
                        marketplaceDetails?.[accountType]?.id,
                      );
                      // setApiError({
                      //   ...apiError,
                      //   [item.key]: '',
                      // });
                      // removeError(item.key, part);
                    }}
                    defaultValue={mapDefaultValues(item.key, part)}
                    readOnly={isChecked}
                  />
                </label>
                {Object.keys(apiError).length > 0 ? (
                  <>
                    <ErrorMsg>
                      {mapApiErrors(
                        item.key,
                        marketplaceDetails?.[accountType]?.marketplace,
                        accountType,
                      )}
                    </ErrorMsg>
                  </>
                ) : null}
              </InputFormField>
            ))}
      </fieldset>
    );
  };

  // Generate Secondary Marketplaces depending on the type of account (Seller, Vendor & Hybrid)
  const generateMarketplaces = (part, advertisingFields) => {
    return (
      <fieldset className="shape-without-border  w-430 mt-3 mb-1">
        <p className="account-steps m-0">Part {part}</p>
        Please log into the marketplaces listed below and enter your{' '}
        <strong>Advertiser Name</strong> and <strong>ID</strong> below.
        {marketplaceDetails.type === 'Hybrid'
          ? secondaryMarketplaces.map((accountDetails) => {
              return (
                <HybridAccountMarketplaces
                  accountDetails={accountDetails}
                  advertisingFields={advertisingFields}
                  mapSecondaryMarketplaceValues={mapSecondaryMarketplaceValues}
                  setDefaultForSecondary={setDefaultForSecondary}
                  sellerAdvertiseForMarketplace={mapSecondaryMarketplaceValues(
                    'doesnt_advertise',
                    accountDetails?.seller_marketplace?.id,
                    'Seller',
                  )}
                  vendorAdvertiseForMarketplace={mapSecondaryMarketplaceValues(
                    'doesnt_advertise',
                    accountDetails?.vendor_marketplace?.id,
                    'Vendor',
                  )}
                  apiError={apiError}
                  mapApiErrors={mapApiErrors}
                />
              );
            })
          : secondaryMarketplaces.map((accountDetails) => {
              return (
                <SingleAccountMarketplaces
                  accountDetails={accountDetails}
                  advertisingFields={advertisingFields}
                  mapSecondaryMarketplaceValues={mapSecondaryMarketplaceValues}
                  setDefaultForSecondary={setDefaultForSecondary}
                  accountType={marketplaceDetails.type}
                  advertiseForMarketplace={mapSecondaryMarketplaceValues(
                    'doesnt_advertise',
                    marketplaceDetails.type === 'Seller'
                      ? accountDetails?.seller_marketplace?.id
                      : accountDetails?.vendor_marketplace?.id,
                    marketplaceDetails.type,
                  )}
                  apiError={apiError}
                  mapApiErrors={mapApiErrors}
                />
              );
            })}
      </fieldset>
    );
  };

  const btnDesign = () => {
    return (
      <Button
        className="btn-primary w-100 mt-3"
        disabled={validateMarketplaces()}
        onClick={() =>
          saveAccountDetails(
            marketplaceDetails?.Seller?.id,
            marketplaceDetails?.Vendor?.id,
          )
        }>
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
    // Hybrid
    if (marketplaceDetails.type === 'Hybrid') {
      // Ask someone else
      if (isChecked) return '';
      return <>{btnDesign()}</>;
    }
    if (
      // logged in user & don't have seller or vendor account
      history.location.pathname.includes(PATH_AMAZON_MERCHANT) &&
      noAmazonAccount
    ) {
      if (isChecked) return '';
      return <>{btnDesign()}</>;
    }

    // unauthorized user & don't have seller or vendor account
    if (
      history.location.pathname.includes(PATH_UNAUTHORIZED_AMAZON_MERCHANT) &&
      noAmazonAccount
    )
      return <>{btnDesign()}</>;
    return '';
  };

  return (
    <>
      <OnBoardingBody
        className={assignedToSomeone ? 'body-white' : 'body-white pb-1'}>
        {noAmazonAccount ? (
          ''
        ) : (
          <>
            {marketplaceDetails.type === 'Hybrid' ? (
              <>
                <>
                  <p className="text-detail text-bold ml-3">
                    Seller Central Details
                  </p>
                  {generateAmazon(1)}
                  {generateAccountType(2, amazonSellerAccountDetails, 'Seller')}
                  {generateAdvertiser(3, amazonSellerAccountDetails, 'Seller')}
                </>

                <>
                  <p className="text-detail text-bold ml-3">
                    Vendor Central Details
                  </p>
                  {generateAmazon(4)}
                  {generateAccountType(5, amazonVendorAccountDetails, 'Vendor')}
                  {generateAdvertiser(6, amazonVendorAccountDetails, 'Vendor')}
                  {secondaryMarketplaces.length > 0 ? (
                    <>
                      <p className="text-detail text-bold ml-3">
                        Additional Marketplaces
                      </p>
                      {/* Step 7 for Hybrid account secondary marketplaces */}
                      {generateMarketplaces(7, amazonVendorAccountDetails)}
                    </>
                  ) : null}
                </>
              </>
            ) : (
              <>
                {generateAmazon(1)}
                {generateAccountType(
                  2,
                  marketplaceDetails.type === 'Seller'
                    ? amazonSellerAccountDetails
                    : amazonVendorAccountDetails,
                  marketplaceDetails.type === 'Seller' ? 'Seller' : 'Vendor',
                )}
                {generateAdvertiser(
                  3,
                  marketplaceDetails.type === 'Seller'
                    ? amazonSellerAccountDetails
                    : amazonVendorAccountDetails,
                  marketplaceDetails.type === 'Seller' ? 'Seller' : 'Vendor',
                )}

                {/* Add a step 4 for seller and vendor secondary marketplaces */}
                {secondaryMarketplaces.length > 0 ? (
                  <>
                    {generateMarketplaces(
                      4,
                      marketplaceDetails.type === 'Seller'
                        ? amazonSellerAccountDetails
                        : amazonVendorAccountDetails,
                    )}
                  </>
                ) : null}
              </>
            )}
            <AmazonVideo
              showVideo={showVideo}
              setShowVideo={setShowVideo}
              isLoading={isLoading}
              videoData={videoData}
              marketplaceDetails={marketplaceDetails}
            />
          </>
        )}

        <p className="text-detail ml-3">
          To continue, please fill up all the fields above. Please review the
          information for each marketplace before continuing.
        </p>

        {marketplaceDetails.type === 'Hybrid'
          ? generateBtn()
          : generateSaveBtn()}
      </OnBoardingBody>
    </>
  );
}

AmazonMerchant.defaultProps = {
  stepData: {},
  apiError: {},
  showVideo: {},
  setShowVideo: () => {},
  setApiError: () => {},
  setFormData: () => {},
};

AmazonMerchant.propTypes = {
  userInfo: shape({
    id: string,
    email: string,
    customer: string,
    customer_onboarding: string,
    step: shape({
      step: number,
    }),
  }).isRequired,
  setIsLoading: func.isRequired,
  assignedToSomeone: bool.isRequired,
  stepData: shape({
    id: string,
  }),
  verifiedStepData: shape(
    shape({
      user_name: string,
      user_step: shape({}),
    }),
  ).isRequired,
  isLoading: shape({
    loader: bool,
    type: string,
  }).isRequired,
  isChecked: bool.isRequired,
  noAmazonAccount: bool.isRequired,
  setShowVideo: func,
  showVideo: shape(shape({})),
  marketplaceDetails: shape({
    type: string,
    marketplace: string,
    marketplaceId: string,
    Seller: shape({
      id: string,
    }),
    Vendor: shape({
      id: string,
    }),
  }).isRequired,
  videoData: shape({
    seller_central_info: string,
    seller_ad_info: string,
    vendor_central_info: string,
    vendor_ad_info: string,
  }).isRequired,
  setApiError: func,
  apiError: shape([]),
  setFormData: func,
  secondaryMarketplaces: arrayOf(shape({})).isRequired,
  vendorMarketplaces: arrayOf(shape({})).isRequired,
  sellerMarketplaces: arrayOf(shape({})).isRequired,
  setSellerMarketplaces: func.isRequired,
  setVendorMarketplaces: func.isRequired,
};
