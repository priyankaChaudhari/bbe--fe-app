import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import Theme from '../../theme/Theme';
import { Button } from '../../common';
import { blackBg, WhiteLogo } from '../../theme/images';

export default function AccountInfoPage({
  icon,
  title,
  step,
  name,
  info,
  setShowInfo,
  progress,
}) {
  const generateHTML = () => {
    return (
      <BackgroundBlack>
        <div className="logo text-center">
          <img className="header-logo" src={WhiteLogo} alt="logo " />
          <span> CENTRAL</span>
        </div>

        <div className="white-card">
          <img src={icon} alt="icon" />
          <p className="account-steps mt-4">Step {step} of 4</p>
          <h3 className="page-heading mb-3">{title}</h3>

          <p className=" extra-bold">{info}</p>
          <Button
            className="btn-primary w-100 on-boarding mt-3"
            onClick={() => setShowInfo(false)}>
            {name}
          </Button>
          <p className="help-info mt-4">{progress}</p>
        </div>
      </BackgroundBlack>
    );
  };

  return (
    <>
      <AccountModal>
        <div className="modal-container" />
      </AccountModal>
      {generateHTML()}
    </>
  );
}

AccountInfoPage.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  step: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setShowInfo: PropTypes.func.isRequired,
  progress: PropTypes.string.isRequired,
};

const AccountModal = styled.div`
  modal-container {
    max-width: 409px;
    width: 100%;
    margin: 0 auto;
  }
`;

const BackgroundBlack = styled.div`
  background: url(${blackBg});
  height: 100vh;
  .logo {
    position: relative;
    width: 100%;
    max-width: 330px;
    margin: 0 auto;
    padding: 20px 75px 30px 0;

    .header-logo {
      width: 185px;
      display: inline-table;
      text-algn: center;
      padding: 35px 0 45px 0;
    }

    span {
      position: absolute;
      margin-top: 45px;
      margin-left: 8px;
      font-size: 14px;
      font-weight: bold;
      color: ${Theme.white};
      font-family: ${Theme.titleFontFamily};
    }
  }

  .white-card {
    background-color: #ffffff;
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
      background-color: #ffffff;
      padding: 20px 30px;
      border-radius: 20px;
      width: 100%;
      margin: 0 auto;
      max-width: 569px;
    }
  }
`;
