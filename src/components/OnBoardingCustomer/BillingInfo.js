import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import queryString from 'query-string';
import PropTypes from 'prop-types';

import {
  CheckBox,
  OnBoardingBody,
  ContractFormField,
  Button,
  ModalRadioCheck,
  PageLoader,
} from '../../common';
import { CaretUp } from '../../theme/images';
import { updateAskSomeoneData, updateUserMe } from '../../api';
import { PATH_AMAZON_MERCHANT, PATH_THANKS } from '../../constants';
import { userMe } from '../../store/actions';

export default function BillingInfo({
  setIsLoading,
  assignedToSomeone,
  stepData,
  verifiedStepData,
  userInfo,
  // data,
  isLoading,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  // const [formData, setFormData] = useState({});
  const [openCollapse, setOpenCollapse] = useState(false);
  const params = queryString.parse(history.location.search);

  const saveDetails = () => {
    setIsLoading({ loader: true, type: 'button' });
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
          history.push(PATH_AMAZON_MERCHANT);
        }
        updateUserMe(userInfo.id, { step: 3 }).then((user) => {
          if (user && user.status === 200) {
            dispatch(userMe());
          }
        });
        localStorage.removeItem('match');
        setIsLoading({ loader: false, type: 'button' });
      }
    });
  };

  return (
    <>
      <OnBoardingBody className="body-white">
        <ContractFormField className="mt-3">
          <label htmlFor="routing">
            Name on Account
            <input className="form-control" />
          </label>
        </ContractFormField>
        <ContractFormField className="mt-3">
          <label htmlFor="routing">
            Bank Name
            <input className="form-control" />
          </label>
        </ContractFormField>
        <ContractFormField className="mt-3">
          <label htmlFor="routing">
            Routing Number
            <input className="form-control" />
          </label>
        </ContractFormField>
        <ContractFormField className="mt-3">
          <label htmlFor="account">
            Account Number
            <input className="form-control" />
          </label>
        </ContractFormField>
        <div className="label-title mt-4"> Payment Type</div>
        <ModalRadioCheck className="mt-3 ">
          <label className="radio-container contact-billing" htmlFor="ACH">
            ACH
            <br />
            <input type="radio" checked="checked" name="radio" readOnly />
            <span className="checkmark checkmark-top" />
          </label>
        </ModalRadioCheck>
        <div
          className="label-title cursor mt-4"
          type="button"
          role="presentation"
          onClick={() => setOpenCollapse(!openCollapse)}>
          Explore other payment options{' '}
          <img className="arrow-up" src={CaretUp} alt="arrow" />
          <div className="clear-fix" />
        </div>

        <div className="white-card-base panel gap-none">
          <CheckBox className="mt-2 ">
            <label
              className="check-container customer-pannel hereby-acknowledge"
              htmlFor="contract-copy-check">
              I hereby acknowledge that I am an authorized signer on the account
              listed above and hereby authorize payments to be made to BBE using
              this payment method to satisfy any and all invoices or bills on
              our account with BBE moving forward until or unless further notice
              is provided in writing. I further agree to the additional Terms &
              Conditions for these payment and agree to the terms and conditions
              found{' '}
              <a className="link-url" href="*">
                here.
              </a>
              <input type="checkbox" id="contract-copy-check" />
              <span className="checkmark" />
            </label>
          </CheckBox>
          <Button
            className="btn-primary w-100  mt-3"
            onClick={() => saveDetails()}>
            {' '}
            {isLoading.loader && isLoading.type === 'button' ? (
              <PageLoader color="#fff" type="button" />
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </OnBoardingBody>
    </>
  );
}

BillingInfo.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  setIsLoading: PropTypes.func.isRequired,
  assignedToSomeone: PropTypes.bool.isRequired,
  stepData: PropTypes.arrayOf(PropTypes.array).isRequired,
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  // data: PropTypes.objectOf(PropTypes.object).isRequired,
  isLoading: PropTypes.shape({
    loader: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
};
