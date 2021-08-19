import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import LoadingBar from 'react-top-loading-bar';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import { LeftArrowIcon } from '../../theme/images';
import { PATH_ACCOUNT_SETUP_CHOOSE } from '../../constants';
import { askSomeoneData } from '../../api';

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
        const originalEmail = params.email;
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
  bar: PropTypes.string.isRequired,
  backStep: PropTypes.string,
  skipStep: PropTypes.string,
  showSuccessMsg: PropTypes.bool,
  userInfo: PropTypes.shape({
    email: PropTypes.string,
    customer_onboarding: PropTypes.string,
  }).isRequired,
  stepData: PropTypes.shape({
    id: PropTypes.string,
  }),
  verifiedStepData: PropTypes.objectOf(
    PropTypes.shape({
      user_name: PropTypes.string,
    }),
  ).isRequired,
  stepName: PropTypes.string.isRequired,
};

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  top: 70px;
  padding: 22px 0px 18px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;
