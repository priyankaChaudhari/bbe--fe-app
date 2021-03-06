/* eslint-disable react/no-danger */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import queryString from 'query-string';
import { Collapse } from 'react-collapse';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AskSomeone from './AskSomeone';
import CheckSteps from './CheckSteps';
import BillingInfo from './BillingInfo';
import Header from '../../common/Header';
import CreateAccount from './CreateAccount';
import VideoModal from './Modals/VideoModal';
import CompanyDigital from './CompanyDigital';
import AmazonMerchant from './AmazonMerchant';
import NavigationHeader from './NavigationHeader';
import { getCustomerDetails } from '../../store/actions';
import { CollapseContainer } from './OnBoardingStyles';
import { CaretUp, VideoCall } from '../../theme/images';
import {
  OnBoardingBody,
  UnauthorizedHeader,
  GreyCard,
  PageLoader,
  CheckBox,
} from '../../common';
import {
  accountSummary,
  getStepDetails,
  getUserData,
  getVideoLink,
  verifyStepToken,
  getBillingDetails,
  getAmazonAccountDetails,
  getDSPContact,
} from '../../api';
import {
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_COMPANY_DETAILS,
  PATH_CUSTOMER_DETAILS,
  PATH_SUMMARY,
  PATH_THANKS,
  PATH_UNAUTHORIZED_COMPANY_DETAILS,
  PATH_UNAUTHORIZED_BILLING_DETAILS,
  PATH_UNAUTHORIZED_AMAZON_MERCHANT,
  PATH_CREATE_PASSWORD,
  PATH_ACCOUNT_SETUP,
  stepPath,
  customVideoStyle,
  delegatedInfo,
} from '../../constants';

export default function MainContainer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const params = queryString.parse(history.location.search);
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [stepData, setStepData] = useState({});
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [summaryData, setSummaryData] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [billingData, setBillingData] = useState({});
  const [apiError, setApiError] = useState({});
  const [formData, setFormData] = useState({});
  const [marketplaceDetails, setMarketplaceDetails] = useState({});
  const [showAmazonVideo, setShowAmazonVideo] = useState({});
  const [skipAmazonAccount, setSkipAmazonAccount] = useState(false);
  const [dspData, setDspData] = useState([]);
  const [showDSPContact, setshowDSPContact] = useState({
    show: false,
    sameAsBilling: true,
  });
  const [noAmazonAccount, setNoAmazonAccount] = useState(false);
  const [secondaryMarketplaces, setSecondaryMarketplaces] = useState([]);

  const [sellerMarketplaces, setSellerMarketplaces] = useState([]);
  const [vendorMarketplaces, setVendorMarketplaces] = useState([]);

  const whichStep = [
    {
      key: 'digital presence',
      stepof: 2,
      title: "Your Company's Digital Presence",
      skip: PATH_BILLING_DETAILS,
      bar: '40',
      path: 'company-details',
      subTitle: 'Need help on why we need this information?',
      video: true,
    },
    {
      key: 'billing information',
      stepof: 3,
      title: 'Billing Information',
      skip: skipAmazonAccount ? PATH_SUMMARY : PATH_AMAZON_MERCHANT,
      back: PATH_COMPANY_DETAILS,
      bar: '60',
      path: 'billing-details',
      video: false,
    },
    {
      key: 'merchant id',
      stepof: 4,
      title: 'Amazon Account Names & IDs',
      skip: PATH_SUMMARY,
      back: PATH_BILLING_DETAILS,
      bar: '80',
      path: 'amazon-merchant',
      subTitle: '',
      video: false,
    },
  ];

  const getStepName = () => {
    for (const item of whichStep) {
      if (history.location.pathname.includes(item.path)) {
        return item.key === 'summary' ? '' : item.key;
      }
    }
    return '';
  };

  const getAccountDetails = (id) => {
    setIsLoading({ loader: true, type: 'page' });
    getAmazonAccountDetails(
      'amazon-account-details',
      localStorage.getItem('customer') || id,
    ).then((response) => {
      if (response && response.data) {
        if (response?.data?.account_type === 'Hybrid') {
          setNoAmazonAccount(
            !!(
              response?.data?.Seller?.no_amazon_account &&
              response?.data?.Vendor?.no_amazon_account
            ),
          );
        } else {
          setNoAmazonAccount(
            response?.data?.[response?.data?.account_type]?.no_amazon_account ??
              false,
          );
        }

        setMarketplaceDetails({
          marketplace: response?.data?.marketplace?.name?.label,
          type: response?.data?.account_type,
          marketplaceId: response?.data?.marketplace?.id,
          Seller: response.data.marketplace && response.data.Seller,
          Vendor: response.data.marketplace && response.data.Vendor,
        });

        let sellerData = [];
        let vendorData = [];

        // Combine primary & secondary marketplaces of Seller
        if (response?.data?.Seller?.no_amazon_account) {
          const secondarySellerData = response?.data?.secondary_marketplaces.map(
            (entry) => {
              return {
                advertiser_name: entry?.Seller?.doesnt_advertise
                  ? ' '
                  : entry?.Seller?.advertiser_name,
                advertiser_id: entry?.Seller?.doesnt_advertise
                  ? ' '
                  : entry?.Seller?.advertiser_id,
                doesnt_advertise: entry?.Seller?.doesnt_advertise ?? false,
                marketplace: entry?.id,
                type: entry?.account_type,
                id: entry?.Seller?.id,
              };
            },
          );
          const sortedSellerData = secondarySellerData.filter(
            (entry) => entry.type === 'Seller',
          );
          sellerData = [
            ...sortedSellerData,
            {
              seller_central_name: response?.data?.Seller?.seller_central_name,
              merchant_id: response?.data?.Seller?.merchant_id,
              advertiser_name: response?.data?.Seller?.advertiser_name,
              advertiser_id: response?.data?.Seller?.advertiser_id,
              marketplace: response?.data?.marketplace?.id,
              id: response?.data?.Seller?.id,
            },
          ];
        } else {
          const secondarySellerData = response?.data?.secondary_marketplaces.map(
            (entry) => {
              return {
                advertiser_name: entry?.Seller?.doesnt_advertise
                  ? ' '
                  : entry?.Seller?.advertiser_name,
                advertiser_id: entry?.Seller?.doesnt_advertise
                  ? ' '
                  : entry?.Seller?.advertiser_id,
                doesnt_advertise: entry?.Seller?.doesnt_advertise ?? false,
                marketplace: entry?.id,
                type: entry?.account_type,
              };
            },
          );
          const sortedSellerData = secondarySellerData.filter(
            (entry) => entry.type === 'Seller',
          );
          sellerData = [
            ...sortedSellerData,
            {
              seller_central_name: response?.data?.Seller?.seller_central_name,
              merchant_id: response?.data?.Seller?.merchant_id,
              advertiser_name: response?.data?.Seller?.advertiser_name,
              advertiser_id: response?.data?.Seller?.advertiser_id,
              marketplace: response?.data?.marketplace?.id,
            },
          ];
        }

        // Combine primary & secondary marketplaces of Vendor
        if (response?.data?.Vendor?.no_amazon_account) {
          const secondaryVendorData = response?.data?.secondary_marketplaces.map(
            (entry) => {
              return {
                advertiser_name: entry?.Vendor?.doesnt_advertise
                  ? ' '
                  : entry?.Vendor?.advertiser_name,
                advertiser_id: entry?.Vendor?.doesnt_advertise
                  ? ' '
                  : entry?.Vendor?.advertiser_id,
                doesnt_advertise: entry?.Vendor?.doesnt_advertise ?? false,
                marketplace: entry?.id,
                type: entry?.account_type,
                id: entry?.Vendor?.id,
              };
            },
          );
          const sortedVendorData = secondaryVendorData.filter(
            (entry) => entry.type === 'Vendor',
          );
          vendorData = [
            ...sortedVendorData,
            {
              vendor_central_name: response?.data?.Vendor?.vendor_central_name,
              vendor_code: response?.data?.Vendor?.vendor_code,
              advertiser_name: response?.data?.Vendor?.advertiser_name,
              advertiser_id: response?.data?.Vendor?.advertiser_id,
              marketplace: response?.data?.marketplace?.id,
              id: response?.data?.Vendor?.id,
            },
          ];
        } else {
          const secondaryVendorData = response?.data?.secondary_marketplaces.map(
            (entry) => {
              return {
                advertiser_name: entry?.Vendor?.doesnt_advertise
                  ? ' '
                  : entry?.Vendor?.advertiser_name,
                advertiser_id: entry?.Vendor?.doesnt_advertise
                  ? ' '
                  : entry?.Vendor?.advertiser_id,
                doesnt_advertise: entry?.Vendor?.doesnt_advertise ?? false,
                marketplace: entry?.id,
                type: entry?.account_type,
              };
            },
          );
          const sortedVendorData = secondaryVendorData.filter(
            (entry) => entry.type === 'Vendor',
          );
          vendorData = [
            ...sortedVendorData,
            {
              vendor_central_name: response?.data?.Vendor?.vendor_central_name,
              vendor_code: response?.data?.Vendor?.vendor_code,
              advertiser_name: response?.data?.Vendor?.advertiser_name,
              advertiser_id: response?.data?.Vendor?.advertiser_id,
              marketplace: response?.data?.marketplace?.id,
            },
          ];
        }

        const marketplaceNames = [];
        const formattedSecondaryMarketplaces = [];

        for (const marketplace of response?.data?.secondary_marketplaces) {
          if (!marketplaceNames.includes(marketplace?.name?.value)) {
            marketplaceNames.push(marketplace?.name?.value);
            formattedSecondaryMarketplaces[marketplace?.name?.value] = {
              name: marketplace?.name?.label,
            };
          }
        }

        for (const marketplace of response?.data?.secondary_marketplaces) {
          if (marketplace.account_type === 'Seller') {
            formattedSecondaryMarketplaces[
              marketplace?.name?.value
            ].seller_marketplace = marketplace;
          } else {
            formattedSecondaryMarketplaces[
              marketplace?.name?.value
            ].vendor_marketplace = marketplace;
          }
        }

        const finalSecondaryMarketplace = [];

        // eslint-disable-next-line guard-for-in
        for (const key in formattedSecondaryMarketplaces) {
          finalSecondaryMarketplace.push(formattedSecondaryMarketplaces[key]);
        }

        setSellerMarketplaces([...sellerData]);
        setVendorMarketplaces([...vendorData]);
        setSecondaryMarketplaces([...finalSecondaryMarketplace]);

        getVideoLink(localStorage.getItem('customer') || id, 'hybrid').then(
          (res) => {
            setVideoData(res.data);
          },
        );
        setIsLoading({ loader: false, type: 'page' });
      }
    });
  };

  const addSellerID = () => {
    const secondarySellerData = secondaryMarketplaces.map((entry) => {
      const sellerFields = {
        advertiser_name: entry?.seller_marketplace?.Seller?.doesnt_advertise
          ? ' '
          : entry?.seller_marketplace?.Seller?.advertiser_name,
        advertiser_id: entry?.seller_marketplace?.Seller?.doesnt_advertise
          ? ' '
          : entry?.seller_marketplace?.Seller?.advertiser_id,
        doesnt_advertise:
          entry?.seller_marketplace?.Seller?.doesnt_advertise ?? false,
        type: entry?.seller_marketplace?.account_type,
        marketplace: entry?.seller_marketplace?.id,
      };

      if (entry?.seller_marketplace?.Seller?.id) {
        sellerFields.id = entry?.seller_marketplace?.Seller?.id;
      }
      return sellerFields;
    });

    const sortedSellerData = secondarySellerData.filter(
      (entry) => entry.type === 'Seller',
    );

    const primarySellerData = [
      {
        seller_central_name: marketplaceDetails?.Seller?.seller_central_name,
        merchant_id: marketplaceDetails?.Seller?.merchant_id,
        advertiser_name: marketplaceDetails?.Seller?.advertiser_name,
        advertiser_id: marketplaceDetails?.Seller?.advertiser_id,
        marketplace: marketplaceDetails?.marketplaceId,
      },
    ];

    if (marketplaceDetails?.Seller?.id) {
      primarySellerData[0].id = marketplaceDetails?.Seller?.id;
    }

    const sellerData = [...sortedSellerData, ...primarySellerData];

    setSellerMarketplaces([...sellerData]);
  };

  const addVendorID = () => {
    // console.log('secondary marketplaces vendor', secondaryMarketplaces);
    const secondaryVendorData = secondaryMarketplaces.map((entry) => {
      const vendorFields = {
        advertiser_name: entry?.vendor_marketplace?.Vendor?.doesnt_advertise
          ? ' '
          : entry?.vendor_marketplace?.Vendor?.advertiser_name,
        advertiser_id: entry?.vendor_marketplace?.Vendor?.doesnt_advertise
          ? ' '
          : entry?.vendor_marketplace?.Vendor?.advertiser_id,
        doesnt_advertise:
          entry?.vendor_marketplace?.Vendor?.doesnt_advertise ?? false,
        type: entry?.vendor_marketplace?.account_type,
        marketplace: entry?.vendor_marketplace?.id,
      };

      if (entry?.vendor_marketplace?.Vendor?.id) {
        vendorFields.id = entry?.vendor_marketplace?.Vendor?.id;
      }
      return vendorFields;
    });

    const sortedVendorData = secondaryVendorData.filter(
      (entry) => entry.type === 'Vendor',
    );

    const primaryVendorData = [
      {
        vendor_central_name: marketplaceDetails?.Vendor?.vendor_central_name,
        vendor_code: marketplaceDetails?.Vendor?.vendor_code,
        advertiser_name: marketplaceDetails?.Vendor?.advertiser_name,
        advertiser_id: marketplaceDetails?.Vendor?.advertiser_id,
        marketplace: marketplaceDetails?.marketplaceId,
      },
    ];

    if (marketplaceDetails?.Vendor?.id) {
      primaryVendorData[0].id = marketplaceDetails?.Vendor?.id;
    }

    const vendorData = [...sortedVendorData, ...primaryVendorData];

    setVendorMarketplaces([...vendorData]);
  };

  const handleUpdate = () => {
    switch (marketplaceDetails?.type) {
      case 'Seller':
        addSellerID();
        break;
      case 'Vendor':
        addVendorID();
        break;
      case 'Hybrid':
        addSellerID();
        addVendorID();
        break;
      default:
        break;
    }
  };

  const getOnboardingStepData = (customerId) => {
    if (
      history.location.pathname.includes(PATH_UNAUTHORIZED_COMPANY_DETAILS) ||
      history.location.pathname.includes(PATH_COMPANY_DETAILS)
    ) {
      dispatch(getCustomerDetails(customerId));
    } else if (
      history.location.pathname.includes(PATH_UNAUTHORIZED_BILLING_DETAILS) ||
      history.location.pathname.includes(PATH_BILLING_DETAILS)
    ) {
      getDSPContact(customerId).then((res) => {
        setshowDSPContact({
          show: res?.data?.is_dsp_contract,
          sameAsBilling: res?.data?.results?.[0]
            ? res?.data?.results?.[0]?.same_as_billing_contact
            : true,
        });
        setDspData(res?.data?.results?.[0]);
        getBillingDetails(customerId).then((response) => {
          if (response?.status === 200) {
            setBillingData(response?.data);
          }
          if (response?.status === 404) {
            setBillingData({});
          }
        });
      });
    } else if (
      history.location.pathname.includes(PATH_UNAUTHORIZED_AMAZON_MERCHANT) ||
      history.location.pathname.includes(PATH_AMAZON_MERCHANT)
    ) {
      getAccountDetails(customerId);
    }
  };

  const summaryDetails = (onboardingId) => {
    accountSummary(onboardingId).then((summary) => {
      if (summary?.status === 200) {
        const skip = summary?.data?.find((op) => op.step === 'merchant id');
        setSkipAmazonAccount(skip?.step_not_applicable);

        const fields = [];
        stepPath.map((item) => {
          if (summary && summary.data) {
            fields.push({
              [item.key]: summary.data.some((op) => {
                return op.step === item.key ? op.is_completed : false;
              }),
            });
          }
          return '';
        });
        setSummaryData(fields);
        setIsLoading({ loader: false, type: 'page' });
      }
    });
  };

  const getStepsData = (onboardingId, type) => {
    getStepDetails(onboardingId, getStepName()).then((response) => {
      if (
        response &&
        response.data &&
        response.data.results &&
        response.data.results[0]
      ) {
        setStepData(response.data.results[0]);
        if (
          response.data.results[0] &&
          response.data.results[0].step === getStepName()
        ) {
          setIsChecked(true);
        }
        if (type === 'callSummary') summaryDetails(onboardingId);
      } else setIsLoading({ loader: false, type: 'page' });
    });
  };

  useEffect(() => {
    if (
      (params && params.openCollapse === null) ||
      (params && params.customer && params.step)
    ) {
      setOpenCollapse(true);
    }
    setIsLoading({ loader: true, type: 'page' });
    if (!history.location.pathname.includes(PATH_CREATE_PASSWORD)) {
      if (
        history.location.pathname.includes(PATH_ACCOUNT_SETUP) &&
        params &&
        params.key
      ) {
        localStorage.setItem('match', params.key);
        verifyStepToken(params.key).then((verify) => {
          if (verify && verify.status === 401) {
            const stringified = queryString.stringify({
              step: 'completed',
            });
            history.push({
              pathname: PATH_THANKS,
              search: `${stringified}`,
            });
          }
          getStepsData(
            (verify && verify.data && verify.data.customer_onboarding_id) ||
              (userInfo && userInfo.customer_onboarding),
          );
          getOnboardingStepData(
            (verify && verify.data && verify.data.customer_id) ||
              (userInfo && userInfo.customer),
          );
          setVerifiedStepData(verify && verify.data);
        });
      }

      if (history.location.pathname.includes('assigned')) {
        setAssignedToSomeone(true);
      } else {
        getUserData(localStorage.getItem('customer')).then((res) => {
          if (res && res.status === 200) {
            if (params && params.customer && params.step) {
              if (res && res.data && res.data.step[params.customer] === 6) {
                history.push(
                  PATH_CUSTOMER_DETAILS.replace(':id', params.customer),
                );
              }
            }
            setUserInfo(res && res.data);
            getStepsData(
              (res && res.data && res.data.customer_onboarding) ||
                verifiedStepData.customer_onboarding_id,
              'callSummary',
            );
            summaryDetails(
              (res && res.data && res.data.customer_onboarding) ||
                verifiedStepData.customer_onboarding_id,
            );
            getOnboardingStepData(
              (res && res.data && res.data.customer) ||
                verifiedStepData.customer_id ||
                (userInfo && userInfo.customer),
            );
          } else {
            setIsLoading({ loader: false, type: 'page' });
          }
        });
        setAssignedToSomeone(false);
      }
    }
  }, [history.location.pathname]);

  const generateHTML = (path) => {
    if (path === 'company-details')
      return (
        <CompanyDigital
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
          isChecked={isChecked}
          loader={loader}
          summaryData={summaryData}
        />
      );
    if (path === 'billing-details')
      return (
        <BillingInfo
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={billingData}
          isLoading={isLoading}
          isChecked={isChecked}
          summaryData={summaryData}
          skipAmazonAccount={skipAmazonAccount}
          summaryDetails={summaryDetails}
          showDSPContact={showDSPContact}
          dspContactDetail={dspData}
          setshowDSPContact={setshowDSPContact}
        />
      );
    if (path === 'amazon-merchant' && !skipAmazonAccount)
      return (
        <AmazonMerchant
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          isLoading={isLoading}
          isChecked={isChecked}
          noAmazonAccount={noAmazonAccount}
          marketplaceDetails={marketplaceDetails}
          showVideo={showAmazonVideo}
          videoData={videoData}
          setShowVideo={setShowAmazonVideo}
          setNoAmazonAccount={setNoAmazonAccount}
          setApiError={setApiError}
          apiError={apiError}
          setMarketplaceDetails={setMarketplaceDetails}
          setFormData={setFormData}
          formData={formData}
          secondaryMarketplaces={secondaryMarketplaces}
          sellerMarketplaces={sellerMarketplaces}
          setSellerMarketplaces={setSellerMarketplaces}
          vendorMarketplaces={vendorMarketplaces}
          setVendorMarketplaces={setVendorMarketplaces}
        />
      );
    return '';
  };

  const getVideo = () => {
    setIsLoading({ loader: true, type: 'video ' });
    setShowVideo(true);
    getVideoLink(
      (verifiedStepData && verifiedStepData.customer_id) ||
        (userInfo && userInfo.customer),
      history.location.pathname.includes(PATH_COMPANY_DETAILS) ||
        history.location.pathname.includes(PATH_UNAUTHORIZED_COMPANY_DETAILS)
        ? 4
        : 2,
    ).then((response) => {
      setVideoData(response && response.data);
      setIsLoading({ loader: false, type: 'video ' });
    });
  };

  const getInformation = (item) => {
    if (item.key === 'billing information')
      return `has asked that you provide your companies <strong> ${item.title}</strong>, which will be used by our Finance Team to bill for our services.`;
    if (item.key === 'merchant id')
      return `has asked that you provide <strong> ${item.title} </strong> information, which will be used to access data we will use to best manage your account.`;
    return `has asked that you provide <strong>${item.title}</strong> information, which will be used by our Creative Team to best understand your brand.`;
  };

  const showNoAmazonAccountCheckbox = () => {
    return (
      <CheckBox
        className={
          isLoading.loader && isLoading.type === 'check'
            ? ' mb-4 isDisabled'
            : ' mb-4'
        }>
        <label
          className="check-container customer-pannel "
          htmlFor="no_amazon_account">
          I don&apos;t have an Amazon account yet
          <input
            type="checkbox"
            id="no_amazon_account"
            name="no_amazon_account"
            onChange={() => {
              setNoAmazonAccount(!noAmazonAccount);
              handleUpdate();
            }}
            readOnly
            checked={noAmazonAccount}
          />
          <span className="checkmark" />
        </label>
      </CheckBox>
    );
  };

  const showAmazonSubTitle = () => {
    if (marketplaceDetails && marketplaceDetails.type === 'Seller')
      return 'If you don???t have access to your Amazon Seller Central admin account then you can use the checkbox below';
    if (marketplaceDetails && marketplaceDetails.type === 'Vendor')
      return 'If you don???t have access to your Amazon Vendor Central admin account then you can use the checkbox below';
    return 'If you don???t have access to your Amazon Seller Central and Vender Central admin accounts then you can use the checkbox below';
  };

  const generateHeader = (item) => {
    if (history.location.pathname.includes(item.path))
      return (
        <>
          {assignedToSomeone ? (
            <UnauthorizedHeader />
          ) : (
            <Header type="onboarding" userInfo={userInfo} />
          )}
          {assignedToSomeone ? (
            ''
          ) : (
            <NavigationHeader
              bar={item.bar}
              skipStep={item.skip}
              backStep={item.back}
              showSuccessMsg={item.path === 'summary'}
              stepData={stepData}
              verifiedStepData={verifiedStepData}
              stepName={getStepName()}
              userInfo={userInfo}
            />
          )}

          {loader || (isLoading.loader && isLoading.type === 'page') ? (
            <PageLoader color="#FF5933" type="page" />
          ) : (
            <OnBoardingBody className="body-start">
              <div className="white-card-base panel ">
                {assignedToSomeone ? (
                  <GreyCard className="yellow-card mt-2 mb-4">
                    <div className="hi-name mb-2">
                      {' '}
                      <span className="video-link ">
                        {' '}
                        {verifiedStepData && verifiedStepData.user_email}{' '}
                      </span>
                      <span
                        style={{ color: 'black' }}
                        dangerouslySetInnerHTML={{
                          __html: getInformation(item),
                        }}
                      />
                    </div>
                    {delegatedInfo}
                  </GreyCard>
                ) : (
                  <p className="account-steps m-0">Step {item.stepof} of 4</p>
                )}
                <h3 className="page-heading ">{item.title}</h3>
                {item.path === 'billing-details' ? null : (
                  <p className="info-text-gray mt-0 mb-4 ">
                    {history.location.pathname.includes(
                      PATH_AMAZON_MERCHANT,
                    ) ? (
                      <>
                        {showAmazonSubTitle()} to assign this step to someone
                        that does.
                      </>
                    ) : history.location.pathname.includes(
                        PATH_UNAUTHORIZED_AMAZON_MERCHANT,
                      ) ? (
                      <>{showAmazonSubTitle()}.</>
                    ) : (
                      item.subTitle
                    )}{' '}
                    <br />
                    {item.video ? (
                      <>
                        <img
                          style={customVideoStyle}
                          src={VideoCall}
                          alt="video"
                        />
                        <span
                          className="video-link cursor"
                          onClick={() => getVideo()}
                          role="presentation">
                          Click here to watch the video.
                        </span>
                      </>
                    ) : null}
                  </p>
                )}
                {item.path === 'amazon-account' ? (
                  <p className="information-text mt-0 mb-0">
                    If you don???t have access to your Amazon Seller Central admin
                    account then you can use the checkbox below to assign this
                    step to someone that does.
                  </p>
                ) : (
                  ''
                )}
                {assignedToSomeone ? (
                  ''
                ) : (
                  <AskSomeone
                    setIsChecked={setIsChecked}
                    isChecked={isChecked}
                    step={item.key}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    params={verifiedStepData}
                    stepData={stepData}
                    setStepData={setStepData}
                    userInfo={userInfo}
                    setDisableBtn={setDisableBtn}
                    setOpenCollapse={setOpenCollapse}
                    history={history}
                    noAmazonAccount={noAmazonAccount}
                    accountType={marketplaceDetails.type}
                  />
                )}
                {(!isChecked &&
                  history.location.pathname.includes(PATH_AMAZON_MERCHANT)) ||
                history.location.pathname.includes(
                  PATH_UNAUTHORIZED_AMAZON_MERCHANT,
                ) ? (
                  <>{showNoAmazonAccountCheckbox()}</>
                ) : (
                  ''
                )}
                {assignedToSomeone || !isChecked ? (
                  <>{generateHTML(item.path)}</>
                ) : (
                  ''
                )}
              </div>

              {!assignedToSomeone && isChecked ? (
                <div className="white-card-base panel gap-none">
                  <div
                    className="label-title cursor mt-4"
                    type="button"
                    role="presentation"
                    onClick={() => setOpenCollapse(!openCollapse)}>
                    Expand questions
                    <img
                      className="arrow-up"
                      src={CaretUp}
                      alt="arrow"
                      style={{
                        transform: openCollapse ? 'rotate(180deg)' : '',
                      }}
                    />
                    <div className="clear-fix" />
                  </div>
                  <CollapseContainer>
                    <Collapse isOpened={openCollapse}>
                      {history.location.pathname.includes(
                        PATH_AMAZON_MERCHANT,
                      ) ? (
                        <div className="mt-3">
                          {showNoAmazonAccountCheckbox()}
                        </div>
                      ) : (
                        ''
                      )}
                      {generateHTML(item.path)}
                    </Collapse>
                  </CollapseContainer>
                  <CheckSteps
                    summaryData={summaryData}
                    step={item.key}
                    disableBtn={disableBtn}
                    skipAmazonAccount={skipAmazonAccount}
                  />
                </div>
              ) : (
                ''
              )}
            </OnBoardingBody>
          )}
          <VideoModal
            showVideo={showVideo}
            setShowVideo={setShowVideo}
            isLoading={isLoading}
            videoData={videoData}
            history={history}
          />
        </>
      );
    return '';
  };

  return (
    <>
      {history.location.pathname.includes('create-password') ? (
        <CreateAccount />
      ) : (
        <>
          {whichStep.map((item) => (
            <React.Fragment key={item.key}>
              {generateHeader(item)}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}
