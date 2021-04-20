import React from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import LoadingBar from 'react-top-loading-bar';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Theme from '../../theme/Theme';
import { LeftArrowIcon } from '../../theme/images';
import { PATH_ACCOUNT_SETUP } from '../../constants';

export default function NavigationHeader({ bar, backStep, skipStep }) {
  const history = useHistory();
  const params = queryString.parse(history.location.search);

  const redirect = () => {
    if (backStep === '1') {
      const stringified =
        queryString &&
        queryString.stringify({
          ...params,
        });

      history.push({
        pathname: PATH_ACCOUNT_SETUP,
        search: stringified,
      });
    } else {
      history.push(backStep);
    }
  };

  return (
    <>
      <LoadingBar color="#FF5933" height="4px" progress={bar} />
      <BackToStep>
        <div className="container-fluid">
          {' '}
          <div className="row">
            {backStep ? (
              <div className="col-6">
                {' '}
                <div
                  role="presentation"
                  className="back-link"
                  onClick={() => redirect()}>
                  <img
                    src={LeftArrowIcon}
                    alt="aarow-back"
                    className="arrow-back-icon "
                  />
                  Back a step
                </div>
              </div>
            ) : (
              ''
            )}
            {skipStep ? (
              <div
                className="col-6 text-right"
                onClick={() => redirect()}
                role="presentation">
                <div className="skip-steps pr-2">Skip this step</div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </BackToStep>
    </>
  );
}

NavigationHeader.defaultProps = {
  backStep: '',
  skipStep: '',
};

NavigationHeader.propTypes = {
  bar: PropTypes.string.isRequired,
  backStep: PropTypes.string,
  skipStep: PropTypes.string,
};

const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  top: 70px;
  padding: 20px 0px 20px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;
