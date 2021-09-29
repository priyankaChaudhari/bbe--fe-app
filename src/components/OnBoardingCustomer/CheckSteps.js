/* eslint-disable no-lonely-if */
import React from 'react';

import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { Button } from '../../common';
import {
  PATH_AMAZON_MERCHANT,
  PATH_BILLING_DETAILS,
  PATH_SUMMARY,
  stepPath,
} from '../../constants';

export default function CheckSteps({
  summaryData,
  step,
  disableBtn,
  skipAmazonAccount,
}) {
  const history = useHistory();

  const getIncompleteStep = summaryData.find(
    (op) => Object.keys(op)[0] !== step && Object.values(op)[0] === false,
  );
  const checkOnceVisited = summaryData.find(
    (op) => Object.keys(op)[0] !== step && Object.values(op)[0] === true,
  );

  const CheckStep = () => {
    if (checkOnceVisited === undefined) {
      if (step === 'digital presence') history.push(PATH_BILLING_DETAILS);
      if (step === 'billing information' && skipAmazonAccount) {
        history.push(PATH_SUMMARY);
      } else if (step === 'billing information' && !skipAmazonAccount)
        history.push(PATH_AMAZON_MERCHANT);
      if (step === 'merchant id') history.push(PATH_SUMMARY);
    } else {
      if (step === 'merchant id' || getIncompleteStep === undefined) {
        history.push(PATH_SUMMARY);
      } else {
        stepPath.map((item) => {
          if (Object.keys(getIncompleteStep)[0] === item.key) {
            return history.push(item.view);
          }
          return '';
        });
      }
    }
  };

  return (
    <div>
      {' '}
      <Button
        className="btn-primary w-100  mt-4 mb-4"
        onClick={() => CheckStep()}
        disabled={disableBtn}>
        Continue
      </Button>
    </div>
  );
}

CheckSteps.propTypes = {
  step: PropTypes.string.isRequired,
  summaryData: PropTypes.arrayOf(PropTypes.object).isRequired,
  disableBtn: PropTypes.bool.isRequired,
  skipAmazonAccount: PropTypes.bool.isRequired,
};
