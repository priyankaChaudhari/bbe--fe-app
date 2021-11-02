import React from 'react';

import queryString from 'query-string';
import LoadingBar from 'react-top-loading-bar';
import { useHistory } from 'react-router-dom';
import { string, shape, bool } from 'prop-types';

import { askSomeoneData } from '../../api';
import { BackToStep } from './OnBoardingStyles';
import { LeftArrowIcon } from '../../theme/images';
import { PATH_ACCOUNT_SETUP_CHOOSE } from '../../constants';

export default function NavigationHeader({
  bar,
  backStep,
  skipStep,
  showSuccessMsg,
  stepData,
  verifiedStepData,
  userInfo,
  stepName,
}) {
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  const redirect = (type) => {
    if (type === 'back') {
      if (backStep === '1') {
        const originalEmail = /\s/.test(params.email)
          ? params.email.replace(/\s/g, '+')
          : params.email;
        delete params.email;
        const stringified =
          queryString &&
          queryString.stringify({
            ...params,
          });

        history.push({
          pathname: PATH_ACCOUNT_SETUP_CHOOSE,
          search: `${stringified}&email=${originalEmail}`,
        });
      } else {
        history.push(backStep);
      }
    }
    if (type === 'skip') {
      if (
        (stepData === undefined ||
          (stepData &&
            Object.keys(stepData) &&
            Object.keys(stepData).length === 0)) &&
        verifiedStepData &&
        Object.keys(verifiedStepData) &&
        Object.keys(verifiedStepData).length === 0
      ) {
        const detail = {
          email: '',
          step: stepName,
          customer_onboarding: userInfo.customer_onboarding,
        };
        askSomeoneData(detail).then((stepResponse) => {
          if (stepResponse && stepResponse.status === 201) {
            history.push(skipStep);
            if (stepName === 'digital presence') {
              askSomeoneData({
                email: '',
                step: 'billing information',
                customer_onboarding: userInfo.customer_onboarding,
              });
            }
          }
        });
      } else {
        history.push(skipStep);
      }
    }
  };

  return (
    <>
      <LoadingBar
        className="loader-bar"
        color="#FF5933"
        height="4px"
        progress={bar}
      />
      {!showSuccessMsg ? (
        <BackToStep>
          <div className="container-fluid">
            {' '}
            <div className="row">
              <div className="col-6">
                {backStep !== '' ? (
                  <div
                    role="presentation"
                    className="back-link"
                    onClick={() => redirect('back')}>
                    <img
                      src={LeftArrowIcon}
                      alt="aarow-back"
                      className="arrow-back-icon "
                    />
                    Back a step
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="col-6 text-right">
                {skipStep !== '' ? (
                  <div onClick={() => redirect('skip')} role="presentation">
                    <div className="skip-steps pr-2">Skip this step</div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </BackToStep>
      ) : (
        ''
      )}
    </>
  );
}

NavigationHeader.defaultProps = {
  backStep: '',
  skipStep: '',
  showSuccessMsg: false,
  stepData: {},
};

NavigationHeader.propTypes = {
  bar: string.isRequired,
  backStep: string,
  skipStep: string,
  showSuccessMsg: bool,
  userInfo: shape({
    email: string,
    customer_onboarding: string,
  }).isRequired,
  stepData: shape({
    id: string,
  }),
  verifiedStepData: shape(
    shape({
      user_name: string,
    }),
  ).isRequired,
  stepName: string.isRequired,
};
