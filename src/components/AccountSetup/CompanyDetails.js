import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import Modal from 'react-modal';

import {
  Button,
  FormField,
  InnerContainer,
  ModalBox,
  PageLoader,
} from '../../common';
import AccountInfoPage from './AccountInfoPage';
import { Logo, CompanyDetailsIcon, CloseIcon } from '../../theme/images/index';
import { SocialIcons } from '../../constants/FieldConstants';
import ContactDetails from './ContactDetails';
import {
  getContactDetails,
  getCustomerDetails,
} from '../../store/actions/customerState';
import { updateCustomerDetails } from '../../api';

export default function CompanyDetails() {
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const data = useSelector((state) => state.customerState.data);
  const loader = useSelector((state) => state.customerState.isLoading);
  const contactInfo = useSelector((state) => state.customerState.contactData);
  const userInfo = useSelector((state) => state.userState.userInfo);

  useEffect(() => {
    dispatch(getCustomerDetails(userInfo.customer));
    dispatch(getContactDetails(userInfo.customer));
  }, [dispatch, userInfo.customer]);

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

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (formData && Object.keys(formData).length) {
      updateCustomerDetails(userInfo.customer, formData).then((res) => {
        if (res && res.status === 200) {
          setShowContactDetails(true);
          setIsLoading({ loader: false, type: 'button' });
        }
      });
    } else {
      setShowContactDetails(true);
      setIsLoading({ loader: false, type: 'button' });
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div>
      {showInfo ? (
        <AccountInfoPage
          icon={CompanyDetailsIcon}
          step="2"
          title="Company details"
          info="In this step, we require you to enter your company details"
          name="Continue"
          setShowInfo={setShowInfo}
          progress="We automatically save your status, so you can always comeback
                and easily make updates if you missed something."
        />
      ) : (
        <>
          {loader ? (
            <PageLoader component="modal" color="#FF5933" type="page" />
          ) : (
            <>
              <LoadingBar color="#FF5933" progress="50" />
              {showContactDetails ? (
                <ContactDetails contactInfo={contactInfo} userInfo={userInfo} />
              ) : (
                <InnerContainer>
                  <div className="logo text-center">
                    <img className="header-logo" src={Logo} alt="logo " />{' '}
                    <span> CENTRAL</span>
                  </div>

                  <p className="account-steps">Step 2 of 4</p>
                  <h3 className="page-heading">
                    Your company’s digital prescence
                  </h3>
                  <p className="help-info">
                    Need help on why we need this information? <br />
                    <span
                      className="link-video"
                      onClick={() => setShowModal(true)}
                      role="presentation">
                      {' '}
                      Click here
                    </span>
                    &nbsp; to watch the video.
                  </p>
                  <FormField className="mt-4">
                    <label htmlFor="emailAddress">
                      Website
                      <br />
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Website"
                        defaultValue={data && data.website}
                        name="website"
                        onChange={(event) => handleChange(event)}
                      />
                    </label>
                  </FormField>
                  <div className="label-title mb-2 mt-3">Social</div>
                  <div className="row">
                    {SocialIcons.map((item) => (
                      <React.Fragment key={item.key}>
                        <div className="col-4 mt-2">
                          <span>
                            <img
                              src={item.value}
                              alt={item.key}
                              className="social-media mr-1"
                            />{' '}
                            {item.label}
                          </span>
                        </div>
                        <div className="col-8 mb-3">
                          {' '}
                          <FormField>
                            <input
                              className="form-control"
                              type="text"
                              name={item.key}
                              defaultValue={data && data[item.key]}
                              onChange={(event) => handleChange(event)}
                            />
                          </FormField>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <Button
                    className=" mt-4 btn-primary w-100 on-boaring"
                    onClick={() => saveDetails()}>
                    {isLoading.loader && isLoading.type === 'button' ? (
                      <PageLoader color="#fff" type="button" />
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </InnerContainer>
              )}{' '}
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
