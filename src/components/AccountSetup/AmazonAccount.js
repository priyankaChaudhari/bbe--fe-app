import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import Modal from 'react-modal';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-to-clipboard';

import {
  Button,
  ErrorMsg,
  FormField,
  InnerContainer,
  ModalBox,
  PageLoader,
} from '../../common';
import { PATH_BILLING_DETAILS } from '../../constants';
import {
  Logo,
  VideoCall,
  InfoIcons,
  AmazonIcon,
  CloseIcon,
  AddNewIcons,
  RightCircle,
} from '../../theme/images/index';
import AccountInfoPage from './AccountInfoPage';
import {
  createAmazonDetails,
  updateUserMe,
  getAmazonDetails,
  updateAmazonDetails,
  deleteAmazonMarketplace,
} from '../../api';
import { userMe } from '../../store/actions';

export default function AmazonAccount() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState({});
  const userInfo = useSelector((state) => state.userState.userInfo);
  const [showBotData, setShowBotData] = useState(false);
  const [apiError, setApiError] = useState({});
  const [marketplaceData, setMarketplaceData] = useState([]);
  const botDetails = [
    { key: 'account_management_email', label: 'Customer Id Email' },
    { key: 'data_bots_email', label: 'Data Mail' },
  ];
  const [isLoading, setIsLoading] = useState({ loader: true, type: 'page' });

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      minHeight: '200px',
      overlay: ' {zIndex: 1000}',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {
    setIsLoading({ loader: true, type: 'page' });
    getAmazonDetails().then((response) => {
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
      if (
        response &&
        response.data &&
        response.data.results &&
        response.data.results.length === 0
      ) {
        setMarketplaceData([
          {
            key: `marketplace_id`,
            label: 'Marketplace Id',
          },
        ]);
      }
      setIsLoading({ loader: false, type: 'page' });
    });
  }, []);

  const saveAccount = () => {
    if (formData && Object.keys(formData) && Object.keys(formData).length) {
      setIsLoading({ loader: true, type: 'button' });
      const fields =
        data && data.marketplace_id ? [...data.marketplace_id] : [];
      for (const market of Object.keys(formData)) {
        if (market !== 'merchant_id') {
          fields.push(formData[market]);
        }
      }
      const detail = {
        merchant_id: formData.merchant_id,
        marketplace_id: fields,
      };
      if (data && data.id) {
        updateAmazonDetails(data.id, detail).then((res) => {
          if (res && res.status === 200) {
            setShowBotData(true);
            getAmazonDetails().then((response) => {
              setData(
                response &&
                  response.data &&
                  response.data.results &&
                  response.data.results[0],
              );
              setIsLoading({ loader: false, type: 'button' });
            });
          }
          if (res && res.status === 400) {
            setApiError(res && res.data);
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      } else {
        createAmazonDetails(detail).then((market) => {
          if (market && market.status === 201) {
            setShowBotData(true);
            getAmazonDetails().then((response) => {
              setData(
                response &&
                  response.data &&
                  response.data.results &&
                  response.data.results[0],
              );
              setIsLoading({ loader: false, type: 'button' });
            });
          }
          if (market && market.status === 400) {
            setApiError(market && market.data);
            setIsLoading({ loader: false, type: 'button' });
          }
        });
      }
    }
  };

  const nextStep = () => {
    updateUserMe(userInfo.id, { step: 3 }).then((res) => {
      if (res && res.status === 200) {
        dispatch(userMe());
        history.push(PATH_BILLING_DETAILS);
      }
    });
  };

  const addMarketplace = () => {
    setMarketplaceData([
      ...marketplaceData,
      {
        key: `marketplace_id`,
      },
    ]);
  };

  const removeMarketplace = (index, type) => {
    if (type === 'string') {
      setIsLoading({ loader: true, type: 'page' });
      deleteAmazonMarketplace(data && data.id, index).then(() => {
        getAmazonDetails().then((response) => {
          setData(
            response &&
              response.data &&
              response.data.results &&
              response.data.results[0],
          );
          setIsLoading({ loader: false, type: 'page' });
        });
      });
    } else {
      const list = [...marketplaceData];
      list.splice(index, 1);
      setMarketplaceData(list);
    }
  };

  const generateMarketplace = (array) => {
    return (
      <>
        {array &&
          array.map((market, index) => {
            return (
              <FormField className="mt-4" key={market}>
                <label htmlFor={market}>
                  Marketplace Id
                  {(marketplaceData && marketplaceData.length === 0) ||
                  (marketplaceData && marketplaceData.length === 1) ? (
                    ''
                  ) : (
                    <img
                      src={CloseIcon}
                      alt="close"
                      className="float-right cursor cross-icon"
                      onClick={() =>
                        removeMarketplace(
                          typeof market === 'object' ? index : market,
                          typeof market,
                        )
                      }
                      role="presentation"
                    />
                  )}
                  <input
                    className="form-control info-tool"
                    type="text"
                    defaultValue={typeof market === 'object' ? '' : market}
                    name={
                      typeof market === 'object'
                        ? `marketplace_id_${index}`
                        : market
                    }
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        [event.target.name]: event.target.value,
                      });
                      setApiError({ ...apiError, marketplace_id: '' });
                    }}
                  />
                </label>
                <ErrorMsg>{apiError && apiError.marketplace_id}</ErrorMsg>
              </FormField>
            );
          })}
      </>
    );
  };

  return (
    <div>
      {showInfo ? (
        <AccountInfoPage
          icon={AmazonIcon}
          step="3"
          title="Amazon account access"
          info="In this step, we require some Amazon account details."
          name="Continue"
          setShowInfo={setShowInfo}
          progress="We automatically save your status, so you can always comeback
                and easily make updates if you missed something."
        />
      ) : (
        <>
          <LoadingBar color="#FF5933" progress="75" />
          {isLoading.loader && isLoading.type === 'page' ? (
            <PageLoader
              color="#FF5933"
              type="page"
              component="modal"
              width={40}
            />
          ) : (
            <>
              {!successMsg ? (
                <>
                  {showBotData ? (
                    <InnerContainer>
                      <div className="logo text-center">
                        <img className="header-logo" src={Logo} alt="logo " />{' '}
                        <span> CENTRAL</span>
                      </div>

                      <p className="account-steps">Step 3 of 4</p>
                      <h3 className="page-heading mb-4">
                        Your Amazon merchant and marketplace details
                      </h3>
                      <p className="help-info">
                        This information will be used by our data BOTS to access
                        data we will use to best manage your account. For a
                        quick tutorial on how to access this information, watch
                        the video below.
                      </p>
                      <span
                        className="link-video watch-video cursor"
                        onClick={() => setShowModal(true)}
                        role="presentation">
                        <img
                          className="video-call-icon"
                          src={VideoCall}
                          alt=""
                        />
                        Watch the tutorial
                      </span>
                      {botDetails.map((item) => (
                        <FormField className="mt-4" key={item.key}>
                          <label htmlFor="emailAddress">
                            {item.label}
                            <img
                              className="info-icon amazon"
                              src={InfoIcons}
                              alt="pdf"
                              name={item.key}
                              data-tip={
                                item.key === 'data_bots_email'
                                  ? `This email will provide access to your Amazon account reports and other 
                            performance data. The access will be used by our data aggregation BOTS.`
                                  : `This email will provide access to your Amazon account. 
                            The access will be used by our account manager.`
                              }
                              data-for={item.key}
                              role="presentation"
                            />
                            <ReactTooltip id={item.key} aria-haspopup="true" />

                            <input
                              className="form-control info-tool"
                              type="text"
                              readOnly
                              defaultValue={data && data[item.key]}
                            />
                          </label>
                          <div
                            className="copy-link"
                            style={{
                              top:
                                item.key === 'data_bots_email'
                                  ? '512px'
                                  : '412px',
                            }}
                            onClick={() => copy(data && data[item.key])}
                            role="presentation">
                            Copy Email
                          </div>
                        </FormField>
                      ))}

                      <Button className="btn-transparent w-100 mt-4">
                        <a
                          href="https://www.amazon.com/"
                          target="_blank"
                          rel="noopener noreferrer">
                          Login to your Amazon Account
                        </a>
                      </Button>
                      <Button
                        className="btn-primary w-100 mt-3"
                        onClick={() => setSuccessMsg(true)}>
                        {isLoading.loader && isLoading.type === 'button' ? (
                          <PageLoader color="#FFF" type="button" />
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </InnerContainer>
                  ) : (
                    <InnerContainer>
                      <div className="logo text-center">
                        <img className="header-logo" src={Logo} alt="logo " />{' '}
                        <span> CENTRAL</span>
                      </div>

                      <p className="account-steps">Step 3 of 4</p>
                      <h3 className="page-heading mb-4">
                        Your Amazon merchant and marketplace details
                      </h3>
                      <p className="help-info">
                        This information will be used by our data BOTS to access
                        data we will use to best manage your account. For a
                        quick tutorial on how to access this information, watch
                        the video below.
                      </p>
                      <span
                        className="link-video watch-video cursor"
                        onClick={() => setShowModal(true)}
                        role="presentation">
                        <img
                          className="video-call-icon"
                          src={VideoCall}
                          alt=""
                        />
                        Watch the tutorial
                      </span>

                      <FormField className="mt-4">
                        <label htmlFor="merchant_id">
                          Merchant ID
                          <input
                            className="form-control info-tool"
                            type="text"
                            defaultValue={data && data.merchant_id}
                            name="merchant_id"
                            onChange={(event) => {
                              setFormData({
                                ...formData,
                                [event.target.name]: event.target.value,
                              });
                              setApiError({
                                ...apiError,
                                merchant_id: '',
                              });
                            }}
                          />
                        </label>
                        <ErrorMsg>{apiError && apiError.merchant_id}</ErrorMsg>
                      </FormField>

                      {generateMarketplace(data && data.marketplace_id)}
                      {generateMarketplace(marketplaceData)}

                      <Button
                        className="btn-add-contact"
                        onClick={() => addMarketplace()}>
                        {' '}
                        <img
                          className="mr-2 add-new-icon "
                          src={AddNewIcons}
                          alt="add"
                        />
                        Add New Marketplace ID
                      </Button>

                      <Button className="btn-transparent w-100 mt-4">
                        <a
                          href="https://www.amazon.com/"
                          target="_blank"
                          rel="noopener noreferrer">
                          Login to your Amazon Account
                        </a>
                      </Button>
                      <Button
                        className="btn-primary w-100 mt-3"
                        onClick={() => saveAccount()}>
                        Continue
                      </Button>
                    </InnerContainer>
                  )}
                </>
              ) : (
                <InnerContainer>
                  <div className="logo text-center">
                    <img className="header-logo" src={Logo} alt="logo " />{' '}
                    <span> CENTRAL</span>
                  </div>
                  <img className="mt-2 mb-3" src={RightCircle} alt="" />

                  <h3 className="page-heading mb-4">
                    What&apos;s next to give us full access to your Amazon
                    account
                  </h3>
                  <p className="help-info">
                    Now that you have sent us the invitations for account
                    access, our On-boarding team will accept those and follow up
                    with an email with detailed instructions on the permissions
                    you need to provide to each of the email profiles.
                  </p>

                  <Button
                    className="btn-primary w-100 on-boarding mt-4"
                    onClick={() => nextStep()}>
                    Got it! & Continue
                  </Button>
                </InnerContainer>
              )}
            </>
          )}
        </>
      )}
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
          <div className="modal-body">
            <h4 className="pb-3">Video title goes here</h4>

            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                title="video"
                className="embed-responsive-item w-100"
                src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
                allowFullScreen
              />
            </div>
          </div>
        </ModalBox>
      </Modal>
    </div>
  );
}

//  <InnerContainer>
//    <div className="logo text-center">
//      <img className="header-logo" src={Logo} alt="logo " />{' '}
//      <span> CENTRAL</span>
//    </div>
//    <p className="account-steps">Step 3 of 4</p>
//    <h3 className="page-heading mb-4">
//      Please give us access to your Amazon account
//    </h3>
//    <p className="help-info">
//      This information will be used by our data BOTS to access data we will use
//      to best manage your account. For a quick tutorial on how to access this
//      information, watch the video below.{' '}
//    </p>

//    <span
//      className="link-video watch-video cursor"
//      onClick={() => setShowModal(true)}
//      role="presentation">
//      <img className="video-call-icon" src={VideoCall} alt="" />
//      Watch the tutorial
//    </span>
//    <form>
//      <FormField className="mt-4">
//        <label htmlFor="emailAddress">
//          Customer ID Email
//          <img
//            className="info-icon "
//            src={InfoIcons}
//            alt="pdf"
//            role="presentation"
//          />
//          <input className="form-control info-tool" type="text" />
//        </label>
//        <div className="copy-link">Copy Email</div>
//      </FormField>
//      <FormField className="mt-3">
//        <label htmlFor="emailAddress">
//          Data Email
//          <img
//            className="info-icon "
//            src={InfoIcons}
//            alt="pdf"
//            role="presentation"
//          />
//          <input className="form-control info-tool" type="text" />
//        </label>
//        <div className="copy-link">Copy Email</div>
//      </FormField>

//      <Button className="btn-transparent w-100 mt-5">
//        Login to your Amazon Account
//      </Button>
//      <Button
//        className="btn-primary w-100 mt-3"
//        onClick={() => history.push(PATH_BILLING_DETAILS)}>
//        Continue
//      </Button>
//    </form>
//  </InnerContainer>;
