import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';

import { Button, PageLoader } from '../../common';
import { PATH_SUMMARY } from '../../constants/index';
import { stepPath } from '../../constants/FieldConstants';

export default function CheckSteps({ summaryData, step, disableBtn }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });

  const getIncompleteStep = summaryData.find(
    (op) => Object.keys(op)[0] !== step && Object.values(op)[0] === false,
  );
  const CheckStep = () => {
    setIsLoading({ loader: true, type: 'button' });
    if (step === 'merchant id' || getIncompleteStep === undefined) {
      history.push(PATH_SUMMARY);
    } else {
      stepPath.map((item) => {
        if (Object.keys(getIncompleteStep)[0] === item.key) {
          return history.push(item.view);
        }
        return history.push(PATH_SUMMARY);
      });
    }
    setIsLoading({ loader: false, type: 'button' });
  };

  return (
    <div>
      {' '}
      <Button
        className="btn-primary w-100  mt-4 mb-4"
        onClick={() => CheckStep()}
        disabled={disableBtn}>
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
  step: PropTypes.string.isRequired,
  summaryData: PropTypes.arrayOf(PropTypes.array).isRequired,
  disableBtn: PropTypes.bool.isRequired,
};
