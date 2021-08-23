/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import queryString from 'query-string';
import Modal from 'react-modal';

import {
  OnBoardingBody,
  UnauthorizedHeader,
  GreyCard,
  PageLoader,
  ModalBox,
  CheckBox,
} from '../../common';
import { CaretUp, CloseIcon } from '../../theme/images';
import AskSomeone from './AskSomeone';
import {
  accountSummary,
  getStepDetails,
  getUserData,
  getVideoLink,
  verifyStepToken,
  getBillingDetails,
} from '../../api';
import { getCustomerDetails } from '../../store/actions';
import NavigationHeader from './NavigationHeader';
import { PATH_CUSTOMER_DETAILS, PATH_THANKS } from '../../constants';
import Header from '../../common/Header';
import CompanyDigital from './CompanyDigital';
import BillingInfo from './BillingInfo';
import {
  AmazonDeveloperAccess,
  AmazonMerchant,
  CheckSteps,
  CreateAccount,
} from '.';
import { stepPath, whichStep } from '../../constants/FieldConstants';
import { getAmazonAccountDetails } from '../../api/OnboardingCustomerApi';

export default function MainContainer() {
  const history = useHistory();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const [assignedToSomeone, setAssignedToSomeone] = useState(false);
  const [stepData, setStepData] = useState({});
  const [verifiedStepData, setVerifiedStepData] = useState({});
  const params = queryString.parse(history.location.search);
  const [userInfo, setUserInfo] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [summaryData, setSummaryData] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [billingData, setBillingData] = useState({});
  const [noAmazonAccount, setNoAmazonAccount] = useState(false);
  const [marketplaceDetails, setMarketplaceDetails] = useState({});
  const [showAmazonVideo, setShowAmazonVideo] = useState({});

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '900px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const getStepName = () => {
    for (const item of whichStep) {
      if (history.location.pathname.includes(item.path)) {
        return item.key === 'summary' ? '' : item.key;
      }
    }
    return '';
  };

  const getAccountDetails = (id) => {
    getAmazonAccountDetails(
      'amazon-account-details',
      localStorage.getItem('customer') || id,
    ).then((response) => {
      if (response && response.data) {
        if (
          history.location.pathname.includes(
            '/account-setup/assigned-amazon-merchant/',
          )
        ) {
          if (
            (response.data &&
              response.data.Seller &&
              response.data.Seller.no_amazon_account) ||
            (response.data &&
              response.data.Vendor &&
              response.data.Vendor.no_amazon_account)
          ) {
            setNoAmazonAccount(false);
          }
        } else if (
          (response.data &&
            response.data.Seller &&
            response.data.Seller.no_amazon_account) ||
          (response.data &&
            response.data.Vendor &&
            response.data.Vendor.no_amazon_account)
        ) {
          setNoAmazonAccount(true);
        } else setNoAmazonAccount(false);
        setMarketplaceDetails({
          marketplace:
            response.data.marketplace &&
            response.data.marketplace.name &&
            response.data.marketplace.name.label,
          type: response.data.account_type,
          marketplaceId:
            response.data.marketplace && response.data.marketplace.id,
          Seller: response.data.marketplace && response.data.Seller,
          Vendor: response.data.marketplace && response.data.Vendor,
        });
        getVideoLink(localStorage.getItem('customer') || id, 'hybrid').then(
          (res) => {
            setVideoData(res.data);
          },
        );
        setIsLoading({ loader: false, type: 'page' });
      }
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
    if (!history.location.pathname.includes('/account-setup/create-password')) {
      if (
        history.location.pathname.includes('/account-setup/') &&
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
          getStepDetails(
            (verify && verify.data && verify.data.customer_onboarding_id) ||
              (userInfo && userInfo.customer_onboarding),
            getStepName(),
          ).then((response) => {
            setStepData(
              response &&
                response.data &&
                response.data.results &&
                response.data.results[0],
            );
            if (
              response &&
              response.data &&
              response.data.results &&
              response.data.results[0] &&
              response.data.results[0].step === getStepName()
            ) {
              setIsChecked(true);
            }
            setIsLoading({ loader: false, type: 'page' });
          });

          if (
            history.location.pathname.includes(
              '/account-setup/assigned-amazon-merchant',
            )
          ) {
            getAccountDetails(
              (verify && verify.data && verify.data.customer_id) ||
                (userInfo && userInfo.customer),
            );
          }

          if (
            history.location.pathname.includes(
              '/account-setup/assigned-company-details',
            )
          ) {
            dispatch(
              getCustomerDetails(
                (verify && verify.data && verify.data.customer_id) ||
                  (userInfo && userInfo.customer),
              ),
            );
          }
          if (
            history.location.pathname.includes(
              '/account-setup/assigned-billing-details',
            )
          ) {
            getBillingDetails(
              (verify && verify.data && verify.data.customer_id) ||
                (userInfo && userInfo.customer),
            ).then((response) => {
              if (response && response.status === 200) {
                setBillingData(response && response.data);
              }
              if (response && response.status === 404) {
                setBillingData({});
              }
            });
          }
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
            accountSummary(
              res && res.data && res.data.customer_onboarding,
            ).then((summary) => {
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
            });
            getStepDetails(
              (res && res.data && res.data.customer_onboarding) ||
                verifiedStepData.customer_onboarding_id,
              getStepName(),
            ).then((response) => {
              setStepData(
                response &&
                  response.data &&
                  response.data.results &&
                  response.data.results[0],
              );
              if (
                response &&
                response.data &&
                response.data.results &&
                response.data.results[0] &&
                response.data.results[0].step === getStepName()
              ) {
                setIsChecked(true);
              }
              setIsLoading({ loader: false, type: 'page' });
            });
            if (
              history.location.pathname.includes(
                '/account-setup/company-details',
              )
            ) {
              dispatch(
                getCustomerDetails(
                  (res && res.data && res.data.customer) ||
                    verifiedStepData.customer_id,
                ),
              );
            }

            if (
              history.location.pathname.includes(
                '/account-setup/amazon-merchant',
              )
            ) {
              getAccountDetails(
                (res && res.data && res.data.customer) ||
                  (userInfo && userInfo.customer),
              );
            }
            if (
              history.location.pathname.includes(
                '/account-setup/billing-details',
              )
            ) {
              getBillingDetails(
                (res && res.data && res.data.customer) ||
                  (userInfo && userInfo.customer),
              ).then((response) => {
                if (response && response.status === 200) {
                  setBillingData(response && response.data);
                }
                if (response && response.status === 404) {
                  setBillingData({});
                }
              });
            }
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
        />
      );
    if (path === 'amazon-merchant')
      return (
        <AmazonMerchant
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          isLoading={isLoading}
          isChecked={isChecked}
          customStyles={customStyles}
          noAmazonAccount={noAmazonAccount}
          marketplaceDetails={marketplaceDetails}
          showVideo={showAmazonVideo}
          videoData={videoData}
          setShowVideo={setShowAmazonVideo}
        />
      );
    if (path === 'amazon-account')
      return (
        <AmazonDeveloperAccess
          setIsLoading={setIsLoading}
          assignedToSomeone={assignedToSomeone}
          stepData={stepData}
          verifiedStepData={verifiedStepData}
          userInfo={userInfo}
          data={data}
          isLoading={isLoading}
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
      history.location.pathname.includes('/account-setup/company-details') ||
        history.location.pathname.includes(
          '/account-setup/assigned-company-details',
        )
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
        <label className="check-container customer-pannel " htmlFor="noamazon">
          I don’t have an Amazon account yet
          <input
            type="checkbox"
            id="noamazon"
            name="noamazon"
            onChange={(event) => {
              setNoAmazonAccount(event.target.checked);
              setDisableBtn(false);
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
    if (marketplaceDetails && setMarketplaceDetails.account_type === 'Hybrid')
      return 'If you don’t have access to your Amazon Seller Central and Vender Central admin accounts then you can use the checkbox below';
    if (marketplaceDetails && setMarketplaceDetails.account_type === 'Seller')
      return 'If you don’t have access to your Amazon Seller Central admin account then you can use the checkbox below';
    return 'If you don’t have access to your Amazon Vendor Central admin account then you can use the checkbox below';
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
            <OnBoardingBody className="body-white">
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
                    If you’re unable to provide this information or you think
                    this was sent to you unintentionally, please let them know
                    via the email address highlighted above.
                  </GreyCard>
                ) : (
                  <p className="account-steps m-0">Step {item.stepof} of 4</p>
                )}
                <h3 className="page-heading ">{item.title}</h3>
                {item.path === 'billing-details' ? null : (
                  <p className="info-text-gray m-0 mb-4 ">
                    {history.location.pathname.includes(
                      '/account-setup/amazon-merchant/',
                    ) ? (
                      <>
                        {showAmazonSubTitle()} to assign this step to someone
                        that does.
                      </>
                    ) : history.location.pathname.includes(
                        '/account-setup/assigned-amazon-merchant/',
                      ) ? (
                      <>{showAmazonSubTitle()}.</>
                    ) : (
                      item.subTitle
                    )}{' '}
                    <br />
                    {item.video ? (
                      <span
                        className="video-link cursor"
                        onClick={() => getVideo()}
                        role="presentation">
                        Click here to watch the video.
                      </span>
                    ) : null}
                  </p>
                )}
                {item.path === 'amazon-account' ? (
                  <p className="information-text mt-0 mb-0">
                    If you don’t have access to your Amazon Seller Central admin
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
                    setNoAmazonAccount={setNoAmazonAccount}
                    noAmazonAccount={noAmazonAccount}
                  />
                )}
                {(!isChecked &&
                  history.location.pathname.includes(
                    '/account-setup/amazon-merchant',
                  )) ||
                history.location.pathname.includes(
                  '/account-setup/assigned-amazon-merchant/',
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
                  <CollapseOpenContainer>
                    <Collapse isOpened={openCollapse}>
                      {history.location.pathname.includes(
                        '/account-setup/amazon-merchant',
                      ) ? (
                        <div className="mt-3">
                          {showNoAmazonAccountCheckbox()}
                        </div>
                      ) : (
                        ''
                      )}
                      {generateHTML(item.path)}
                    </Collapse>
                  </CollapseOpenContainer>
                  <CheckSteps
                    summaryData={summaryData}
                    step={item.key}
                    disableBtn={disableBtn}
                  />
                </div>
              ) : (
                ''
              )}
            </OnBoardingBody>
          )}
          <Modal
            isOpen={showVideo}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Edit modal">
            <img
              src={CloseIcon}
              alt="close"
              className="float-right cursor cross-icon"
              onClick={() => setShowVideo(false)}
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
                    src={
                      videoData
                        ? history.location.pathname.includes(
                            '/account-setup/company-details',
                          ) ||
                          history.location.pathname.includes(
                            '/account-setup/assigned-company-details',
                          )
                          ? videoData.step_4_video
                          : videoData.step_2_video
                        : ''
                    }
                  />
                </div>
              )}
            </ModalBox>
          </Modal>
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

const CollapseOpenContainer = styled.div`
  opacity: 0.6;
  pointer-events: none;
`;
