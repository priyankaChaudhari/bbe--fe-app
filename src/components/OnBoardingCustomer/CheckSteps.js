import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Button, PageLoader } from '../../common';

export default function CheckSteps({ userInfo }) {
  const [isLoading, setIsLoading] = useState({ loader: false, type: 'button' });
  console.log(
    userInfo.step &&
      Object.keys(userInfo.step) &&
      Object.keys(userInfo.step).find(
        (op) => op === (userInfo && userInfo.customer),
      ),
  );

  const CheckStep = () => {
    setIsLoading({ loader: true, type: 'button' });
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
          'Next Step'
        )}
      </Button>
    </div>
  );
}

CheckSteps.propTypes = {
  userInfo: PropTypes.shape({
    step: PropTypes.number,
    customer: PropTypes.string,
  }).isRequired,
};
