import React from 'react';
import { useLocation } from 'react-router-dom';

import styled from 'styled-components';
import Theme from '../theme/Theme';
import ErrorMsg from './ErrorMsg';
// import PageNotFoundImg from '../theme/images/page-not-found.svg';

export default function WarningComponent() {
  const location = useLocation();

  return (
    <PageNotFounds>
      <ErrorMsg className=" not-found contract-cancel">
        {location && location.state && location.state.error
          ? location && location.state && location.state.error
          : ''}
      </ErrorMsg>
    </PageNotFounds>
  );
}
const PageNotFounds = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .not-found {
    font-size: 16px;
    text-align: center;
  }

  &.contract-cancel {
    text-transform: capitalize;
    color: ${Theme.red};
  }
`;
