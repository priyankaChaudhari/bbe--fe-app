/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBar from 'react-top-loading-bar';
import styled from 'styled-components';
import { Collapse } from 'react-collapse';
import NumberFormat from 'react-number-format';
import Modal from 'react-modal';

import Theme from '../../theme/Theme';

import {
  Logo,
  CloseArrowIcons,
  AccountSetupIcon,
  blackBg,
  LockFinish,
  CloseIcon,
} from '../../theme/images/index';

import {
  Button,
  CheckBox,
  FormField,
  InnerContainer,
  ModalBox,
  ModalRadioCheck,
} from '../../common';
import AccountInfoPage from './AccountInfoPage';
import { Billing } from '../../constants/FieldConstants';
import { updateUserMe } from '../../api';
import { PATH_CUSTOMER_DETAILS } from '../../constants';
import { userMe } from '../../store/actions';

export default function BillingDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
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

  const generateNumeric = () => {
    return <NumberFormat className="form-control" />;
  };

  const generateRadio = (item) => {
    return (
      <ModalRadioCheck className="mt-4 ">
        <label className="radio-container contact-billing">
          {item.label}
          <br />
          <input type="radio" checked="checked" name="radio" />
          <span className="checkmark" />
        </label>
      </ModalRadioCheck>
    );
  };

  const generatePayment = (item) => {
    return (
      <>
        <div
          className="label-title cursor mt-4"
          type="button"
          role="presentation"
          onClick={() => setOpenCollapse(!openCollapse)}>
          Explore other payment options{' '}
          <img className="arrow-up" src={CloseArrowIcons} alt="arrow" />
          <div className="clear-fix" />
        </div>
        <CollapseOpenContainer>
          <Collapse isOpened={openCollapse}>
            <div className="inner-content mb-4">
              <p className="pay-card mt-0 mb-4">Pay By Credit Card</p>
              <div className="label-title">Credit Card Type</div>
              <ul className="payment-option">
                {item.choices.map((field) => (
                  <li key={field.key}>
                    <ModalRadioCheck className="mt-4 ">
                      <label className="radio-container contact-billing">
                        <img className="card" src={field.icon} alt="card" />{' '}
                        {field.label}
                        <br />
                        <input type="radio" checked="checked" name="radio" />
                        <span className="checkmark" />
                      </label>
                    </ModalRadioCheck>
                  </li>
                ))}
              </ul>

              <FormField className="mt-3">
                <label htmlFor="emailAddress">
                  Cardholder Name
                  <br />
                  <input className="form-control" type="text" />
                </label>
              </FormField>
              <FormField className="mt-3">
                <label htmlFor="emailAddress">
                  Credit Card Number
                  <br />
                  <input className="form-control" type="text" />
                </label>
              </FormField>
              <div className="row">
                <div className="col-8">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      Exp. Date
                      <br />
                      <input className="form-control" type="text" />
                    </label>
                  </FormField>
                </div>
                <div className="col-4">
                  <FormField className="mt-3">
                    <label htmlFor="emailAddress">
                      CVV
                      <br />
                    </label>
                    <input className="form-control" type="text" />
                  </FormField>
                </div>
              </div>
            </div>
          </Collapse>
        </CollapseOpenContainer>
      </>
    );
  };

  const saveBilling = () => {
    setSuccessMsg(true);
  };

  const nextStep = () => {
    updateUserMe(userInfo.id, { step: 4 }).then((res) => {
      if (res && res.status === 200) {
        dispatch(userMe());
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', userInfo.customer));
      }
    });
  };

  return (
    <div>
      {showInfo ? (
        <AccountInfoPage
          icon={LockFinish}
          step="4"
          title="Billing details"
          info="In this step, we require some billing information and your payment details."
          name="Continue"
          setShowInfo={setShowInfo}
          progress="We automatically save your status, so you can always comeback
                and easily make updates if you missed something."
        />
      ) : (
        <>
          <LoadingBar color="#FF5933" progress="99.9" />

          {!successMsg ? (
            <InnerContainer>
              <div className="logo text-center">
                <img className="header-logo" src={Logo} alt="logo " />{' '}
                <span> CENTRAL</span>
              </div>

              <p className="account-steps ">Step 4 of 4</p>
              <h3 className="page-heading mb-4">Payment Information</h3>

              <form>
                {Billing.map((item) => (
                  <FormField className="">
                    <label htmlFor={item.label}>
                      {item.label}
                      <br />
                      {item.type === 'number' ? (
                        <>{generateNumeric(item)}</>
                      ) : item.type === 'radio' ? (
                        <>{generateRadio(item)}</>
                      ) : item.key === 'credit_card' ? (
                        <>{generatePayment(item)}</>
                      ) : (
                        <input className="form-control" type="text" />
                      )}
                    </label>
                  </FormField>
                ))}
              </form>
              <CheckBox>
                <label className="container term-condition">
                  I hereby acknowledge that I am an authorized signer on the
                  account listed above and hereby authorize payments to be made
                  to BBE using this payment method to satisfy any and all
                  invoices or bills on our account with BBE moving forward until
                  or unless further notice is provided in writing. I further
                  agree to the additional Terms & Conditions for these payment
                  and agree to the terms and conditions found &nbsp;{' '}
                  <span onClick={() => setShowModal(true)} role="presentation">
                    {' '}
                    here.{' '}
                  </span>
                  <input type="checkbox" onChange={() => setTermsRead(true)} />
                  <span className="checkmark" />
                </label>
              </CheckBox>

              <Button
                className={
                  !termsRead
                    ? 'btn-primary w-100 on-boarding mt-4 disabled'
                    : 'btn-primary w-100 on-boarding mt-4'
                }
                onClick={() => saveBilling()}
                disabled={!termsRead}>
                Submit & Review
              </Button>
            </InnerContainer>
          ) : (
            <BackgroundBlack>
              <div className="white-card">
                <img src={AccountSetupIcon} alt="company-icon" />

                <h3 className="page-heading mb-3 mt-3 ">
                  Account Set Up Complete
                </h3>
                <p className="extra-bold ">
                  {' '}
                  Congratulations on completing your account setup with Buy Box
                  Experts! Expect to hear from your On-boarding Specialist in
                  the next 24 hours to walk through final set up items and get
                  you in contact with your Brand Growth Strategist.
                </p>

                <p className="extra-bold  mt-4">
                  If you have any questions in the meantime please reach out to{' '}
                  <span> onboarding@buyboxexperts.com.</span>
                </p>
                <Button
                  className="btn-primary w-100 on-boarding mt-3"
                  onClick={() => nextStep()}>
                  Ok. Got it!
                </Button>
              </div>
            </BackgroundBlack>
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
          <div className="modal-body" style={{ color: '#2E384D' }}>
            By accepting the terms on the Payment Information page, I
            acknowledge that I am an authorized signer, user or representative
            of the account provided and have the authority to set up payments
            against that account on a recurring basis moving forward. <br />
            <br /> I understand that this authorization will remain in effect
            until I cancel it in writing, and I agree to notify the merchant in
            writing of any changes in my account information or termination of
            this authorization at least 15 days prior to the next billing date.
            If the monthly billing date falls on a weekend or holiday, I
            understand that the payments may be executed automatically over
            those days or may be processed on the next business day. <br />
            <br /> A prorated initial billing may be charged to cover the dates
            between the signature date and the selected monthly billing date, if
            different. <br />
            <br /> For ACH debits to my checking/savings account, I understand
            that because these are electronic transactions, the funds may be
            withdrawn from my account as soon as electronic payment is
            processed. In the case of an ACH Transaction or Credit Card
            transactions being rejected for Non-Sufficient Funds (NSF), I
            understand that Buy Box Experts (“BBE”) may, at its discretion
            attempt to process the charge again within 30 days, and agree to an
            additional $25 charge for each attempt returned NSF which will be
            initiated as a separate transaction from the authorized recurring
            payment method. <br />
            <br /> I acknowledge that the origination of ACH transactions to my
            account must comply with the provisions of U.S. law. I certify that
            I am an authorized user/signer of this credit card/bank account and
            will not dispute these scheduled transactions with my bank or credit
            card company; so long as the transactions correspond to the terms
            indicated in this authorization form, our service agreement with
            BBE, and any invoice provided by BBE to me in conjunction with the
            payment.
          </div>
        </ModalBox>
      </Modal>
    </div>
  );
}

const CollapseOpenContainer = styled.div`
  margin-top: 10px;
  .ReactCollapse--collapse {
    max-width: 409px !important;
    .inner-content {
      background-color: ${Theme.white};
      border: 1px solid ${Theme.gray15};
      box-shadow: ${Theme.commonShadow};
      width: 409px;
      border-radius: 1px;
      padding: 15px;
      .pay-card {
        font-size: 15px;
        color: #2e384d;
        font-weight: 600;
      }
      .payment-option {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          display: inline-block;
          margin-right: 23px;

          &:last-child {
            margin-right: 0px;
          }

          .card {
            width: 20px;
            margin-right: 2px;
            vertical-align: top;
          }
        }
      }
    }
  }
`;

const BackgroundBlack = styled.div`
  background: url(${blackBg});
  height: 100%;
  .logo {
    position: relative;
    width: 100%;
    max-width: 330px;
    margin: 0 auto;
    padding: 20px 0 30px 0;
    .header-logo {
      width: 220px;
      display: inline-table;
      text-algn: center;
      padding: 35px 0 45px 0;
    }

    span {
      position: absolute;
      margin-top: 43px;
      margin-left: 8px;
      font-size: 14px;
      font-weight: bold;
      color: ${Theme.black};
      font-family: ${Theme.titleFontFamily};
    }
  }

  .white-card {
    background-color: ${Theme.white};
    padding: 35px 80px;
    border-radius: 20px;
    width: 100%;
    margin: 0 auto;
    max-width: 569px;
    .account-steps {
      text-transform: uppercase;
      font-size: 14px;
      font-family: ${Theme.baseFontFamily};
      color: #2e384d;
      font-weight: 600;
    }
  }
  @media only screen and (max-width: 578px) {
    .white-card {
      padding: 10px 15px;
    }

    span {
      position: absolute;
      margin-top: 43px;
      margin-left: 8px;
      font-size: 14px;
      font-weight: bold;
      color: ${Theme.black};
      font-family: ${Theme.titleFontFamily};
    }
    .white-card {
      background-color: ${Theme.white};
      padding: 20px 30px;
      border-radius: 20px;
      width: 100%;
      margin: 0 auto;
      max-width: 569px;
    }
  }
`;

// <Detail>
//   <div className="container">
//     <div className="row">
//       <div className="col-5">
//         <div className="view-details">
//           <div className="label">Name on Account</div>
//           <div className="info">Acme, Inc.</div>
//         </div>
//         <div className="view-details">
//           <div className="label">Account Number</div>
//           <div className="info">123456789101</div>
//         </div>
//         <div className="view-details">
//           <div className="label">Credit Card Type</div>
//           <div className="info">
//             <img className="card-img" src={MasterCardIcons} alt="card" />{' '}
//             Mastercard
//           </div>
//         </div>
//         <div className="view-details">
//           <div className="label">Account Number</div>
//           <div className="info">•••• 4444</div>
//         </div>
//       </div>
//       <div className="col-5">
//         <div className="view-details">
//           <div className="label">Bank Name</div>
//           <div className="info">Chase </div>
//         </div>
//         <div className="view-details">
//           <div className="label">Routing Number</div>
//           <div className="info">567899035</div>
//         </div>
//         <div className="view-details">
//           <div className="label">Cardholder Name</div>
//           <div className="info">John Doe </div>
//         </div>
//       </div>
//     </div>
//     <>
//       <Button
//         className=" btn-transparent mt-3 mb-3"
//         onClick={() => setShowModal(true)}>
//         <img
//           width="15px"
//           className="edit-icon mr-2"
//           src={EditFileIcons}
//           alt="edit "
//         />
//         Edit Payment Details
//       </Button>
//       <Modal
//         isOpen={showModal}
//         style={customStyles}
//         ariaHideApp={false}
//         contentLabel="Edit modal">
//         <img
//           src={CloseIcon}
//           alt="close"
//           className="float-right cursor cross-icon"
//           onClick={() => setShowModal(false)}
//           role="presentation"
//         />
//         <ModalBox>
//           <div className="modal-body">
//             <h4 className="pb-3">Edit Billing Details</h4>
//             <div className="body-content">
//               <div className="row">
//                 <div className="col-12">
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Name on Account
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Bank Name
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Account Number
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Routing Number
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                   <div className="heading  mt-4"> Payment Type</div>
//                   <ul className="payment-option">
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           ACH
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           Credit Card
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                   </ul>
//                   <div className="heading  mt-4"> Credit Card Type </div>
//                   <ul className="payment-option mb-2">
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           <img
//                             className="card"
//                             src={VisaCardIcons}
//                             alt="card"
//                           />{' '}
//                           Visa
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           <img
//                             className="card"
//                             src={MasterCardIcons}
//                             alt="card"
//                           />{' '}
//                           Mastercard
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           <img
//                             className="card"
//                             src={DiscoverCardIcons}
//                             alt="card"
//                           />{' '}
//                           Discover
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                     <li>
//                       <ModalRadioCheck className="mt-4 ">
//                         <label className="radio-container contact-billing">
//                           <img
//                             className="card"
//                             src={AmercianExpressCardIcons}
//                             alt="card"
//                           />{' '}
//                           American Express
//                           <br />
//                           <input
//                             type="radio"
//                             checked="checked"
//                             name="radio"
//                           />
//                           <span className="checkmark" />
//                         </label>
//                       </ModalRadioCheck>
//                     </li>
//                   </ul>
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Cardholder Name
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Credit Card Number
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                 </div>
//                 <div className="col-8">
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       Exp. Date
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                 </div>
//                 <div className="col-4">
//                   <FormField className="mt-3">
//                     <label htmlFor="emailAddress">
//                       CVV
//                       <input className="form-control" type="text" />
//                     </label>
//                   </FormField>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="footer-line " />
//           <div className=" col-12  modal-footer">
//             <Button className=" btn-primary mr-4">Save Changes</Button>
//             <Button className=" btn-borderless">Discard Changes</Button>
//           </div>
//         </ModalBox>
//       </Modal>
//     </>

//     <div className="heading mb-4 mt-3">Billing Contacts</div>
//     <div className="row">
//       <div className="col-5">
//         {' '}
//         <GreyCard>
//           <div className="contact-user-name">Karl Wilson</div>
//           <span className="user-details">
//             {' '}
//             Associate Marketing Director
//           </span>
//           <img
//             className="delete-contact cursor"
//             src={TrashIcons}
//             alt="delete"
//             role="presentation"
//           />
//           <img
//             className="edit-contact cursor"
//             src={EditFileIcons}
//             alt="edit"
//             role="presentation"
//           />
//           <div className="row mt-2">
//             <div className="col-6 ">
//               {' '}
//               <span className="user-details">
//                 {' '}
//                 <img src={EmailIcon} alt="email" />
//                 jenny@ashersapparel.com
//               </span>
//             </div>
//             <div className="col-6">
//               {' '}
//               <span className="user-details">
//                 {' '}
//                 <img src={PhoneIcon} alt="email" />
//                 800 888 888
//               </span>
//             </div>
//           </div>
//         </GreyCard>
//       </div>
//       <div className="col-5">
//         {' '}
//         <GreyCard>
//           <div className="contact-user-name">Karl Wilson</div>
//           <span className="user-details">
//             {' '}
//             Associate Marketing Director
//           </span>
//           <img
//             className="delete-contact cursor"
//             src={TrashIcons}
//             alt="delete"
//             role="presentation"
//           />
//           <img
//             className="edit-contact cursor"
//             src={EditFileIcons}
//             alt="edit"
//             role="presentation"
//           />
//           <div className="row mt-2">
//             <div className="col-6 ">
//               {' '}
//               <span className="user-details">
//                 {' '}
//                 <img src={EmailIcon} alt="email" />
//                 jenny@ashersapparel.com
//               </span>
//             </div>
//             <div className="col-6">
//               {' '}
//               <span className="user-details">
//                 {' '}
//                 <img src={PhoneIcon} alt="email" />
//                 800 888 888
//               </span>
//             </div>
//           </div>
//         </GreyCard>
//       </div>
//     </div>
//     <Button className="btn-add-contact  mt-3">
//       {' '}
//       <img
//         className="mr-2 add-new-icon "
//         src={AddNewIcons}
//         alt="add-icon"
//       />
//       Add New Billing Contact
//     </Button>
//   </div>
// </Detail>;
