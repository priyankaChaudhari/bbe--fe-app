import React from 'react';
import styled from 'styled-components';
import Theme from '../theme/Theme';
import { NextLogo } from '../theme/images/index';

export default function UnauthorizedHeader() {
  return (
    <HeaderVoided>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            <img
              role="presentation"
              onClick={() => {
                window.location.href = 'http://www.buyboxexperts.com/';
              }}
              className="logo"
              src={NextLogo}
              alt="logo"
            />
          </div>
        </div>
      </div>
    </HeaderVoided>
  );
}

const HeaderVoided = styled.div`
  background-color: ${Theme.white};
  height: 70px;
  border-bottom: 1px solid ${Theme.gray7};
  padding-top: 16px;
  position: fixed;
  width: 100%;
  z-index: 3;
  top: 0;
  .logo {
    width: 75px;
    cursor: pointer;
  }
`;
