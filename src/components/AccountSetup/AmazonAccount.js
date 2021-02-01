import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import Modal from 'react-modal';

import { Button, FormField, InnerContainer, ModalBox } from '../../common';
import { PATH_BILLING_DETAILS } from '../../constants';
import {
  Logo,
  VideoCall,
  // InfoIcons,
  AmazonIcon,
  CloseIcon,
  AddNewIcons,
  RightCircle,
} from '../../theme/images/index';
import AccountInfoPage from './AccountInfoPage';
import { createAmazonDetails, updateUserMe, getAmazonDetails } from '../../api';
import { userMe } from '../../store/actions';

export default function AmazonAccount() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [formData, setFormData] = useState({});
  const [amazonDetails, setAmazonDetails] = useState([
    {
      key: 'merchant_id',
      label: 'Merchant Id',
    },
    { key: 'marketplace_id', label: 'Marketplace Id' },
  ]);
  const [data, setData] = useState({});
  const userInfo = useSelector((state) => state.userState.userInfo);

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
    getAmazonDetails().then((response) => {
      setData(
        response &&
          response.data &&
          response.data.results &&
          response.data.results[0],
      );
    });
  }, []);

  const saveAccount = () => {
    const fields = [];
    for (const market of Object.keys(formData)) {
      if (market.includes('marketplace_id')) {
        fields.push(formData[market]);
      }
    }
    const detail = {
      merchant_id: formData.merchant_id,
      marketplace_id: fields,
    };
    createAmazonDetails(detail).then((market) => {
      if (market && market.status === 201) {
        setSuccessMsg(false);
      }
    });
    // setSuccessMsg(true);
  };

  const nextStep = () => {
    updateUserMe(userInfo.id, { step: 3 }).then((res) => {
      if (res && res.status === 200) {
        dispatch(userMe());
        history.push(PATH_BILLING_DETAILS);
      }
    });
  };

  const addMarketplace = (index) => {
    setAmazonDetails([
      ...amazonDetails,
      { key: `marketplace_id_${index}`, label: 'Marketplace Id' },
    ]);
  };

  const removeMarketplace = (index) => {
    const list = [...amazonDetails];
    list.splice(index, 1);
    setAmazonDetails(list);
  };

  const mapDefaultValues = (item) => {
    return data[item];
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
          {!successMsg ? (
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
                This information will be used by our data BOTS to access data we
                will use to best manage your account. For a quick tutorial on
                how to access this information, watch the video below.
              </p>
              <span
                className="link-video watch-video cursor"
                onClick={() => setShowModal(true)}
                role="presentation">
                <img className="video-call-icon" src={VideoCall} alt="" />
                Watch the tutorial
              </span>
              {amazonDetails.map((item, index) => (
                <FormField className="mt-4" key={item.key}>
                  <label htmlFor={item.key}>
                    {item.label}
                    <br />
                    <input
                      className="form-control"
                      type="text"
                      name={item.key}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          [item.key]: event.target.value,
                        })
                      }
                      defaultValue={mapDefaultValues(item.key)}
                    />
                    {item.key !== 'merchant_id' &&
                      item.key !== 'marketplace_id' &&
                      amazonDetails.length !== 1 && (
                        <img
                          src={CloseIcon}
                          alt="cross"
                          className="cursor"
                          onClick={() => removeMarketplace(index)}
                          role="presentation"
                        />
                      )}
                  </label>
                  {item.key !== 'merchant_id' &&
                    amazonDetails.length - 1 === index && (
                      <Button
                        className="btn-add-contact"
                        onClick={() => addMarketplace(index)}>
                        {' '}
                        <img
                          className="mr-2 add-new-icon "
                          src={AddNewIcons}
                          alt="add"
                        />
                        Add New Marketplace ID
                      </Button>
                    )}
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
                onClick={() => saveAccount()}>
                Continue
              </Button>
            </InnerContainer>
          ) : (
            <InnerContainer>
              <div className="logo text-center">
                <img className="header-logo" src={Logo} alt="logo " />{' '}
                <span> CENTRAL</span>
              </div>
              <img className="mt-2 mb-3" src={RightCircle} alt="" />

              <h3 className="page-heading mb-4">
                What&apos;s next to give us full access to your Amazon account
              </h3>
              <p className="help-info">
                Now that you have sent us the invitations for account access,
                our On-boarding team will accept those and follow up with an
                email with detailed instructions on the permissions you need to
                provide to each of the email profiles.
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
