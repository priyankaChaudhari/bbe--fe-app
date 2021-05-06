import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';

import { Button, PageLoader } from '../../common';
import {
  PATH_AMAZON_MERCHANT,
  PATH_COMPANY_DETAILS,
  PATH_CUSTOMER_DETAILS,
  PATH_SUMMARY,
} from '../../constants/index';

export default function CheckSteps({ userInfo }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  const id =
    userInfo.step &&
    Object.keys(userInfo.step) &&
    Object.keys(userInfo.step).find(
      (op) => op === (userInfo && userInfo.customer),
    );

  const CheckStep = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (id === undefined || id === null) {
      history.push(PATH_COMPANY_DETAILS);
    } else {
      if (
        userInfo.step === null ||
        userInfo.step === undefined ||
        userInfo.step[id] === null ||
        userInfo.step[id] === undefined
      ) {
        history.push(PATH_COMPANY_DETAILS);
      }
      if (userInfo.step[id] === 1) {
        history.push(PATH_COMPANY_DETAILS);
      }
      // if (userInfo.step[id] === 2) {
      //   history.push(PATH_BILLING_DETAILS);
      // }
      if (userInfo.step[id] === 2 || userInfo.step[id] === 3) {
        history.push(PATH_AMAZON_MERCHANT);
      }
      // if (userInfo.step[id] === 4) {
      //   history.push(PATH_AMAZON_ACCOUNT);
      // }
      if (userInfo.step[id] === 4 || userInfo.step[id] === 5) {
        history.push(PATH_SUMMARY);
      }
      if (userInfo.step[id] === 6) {
        history.push(PATH_CUSTOMER_DETAILS.replace(':id', userInfo.customer));
      }
    }
  };

  return (
    <div>
      {' '}
      <Button
        className="btn-primary w-100  mt-4 mb-4"
        onClick={() => CheckStep()}>
        {isLoading.loader && isLoading.type === 'button' ? (
          <PageLoader color="#fff" type="button" />
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
}

CheckSteps.propTypes = {
  userInfo: PropTypes.shape({
    step: PropTypes.shape({
      id: PropTypes.string,
    }),
    customer: PropTypes.string,
  }).isRequired,
};
