import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Theme from '../theme/Theme';
// import PageNotFoundImg from '../theme/images/page-not-found.svg';

export default function PdfLoadingMsg({
  type,
  setIsLoader,
  message = 'Loading...',
}) {
  useEffect(() => {
    setIsLoader({ loader: true });
  }, [setIsLoader]);

  return (
    <PageNotFounds>
      {/* <img src={PageNotFoundImg} alt="emoji" /> */}
      {/* <h5 className="mt-3">Page not found</h5> */}
      {type === 'error' ? <p className="not-found">{message}</p> : ''}
      {type === 'loading' ? <h5 className="not-found">{message}</h5> : ''}
    </PageNotFounds>
  );
}
const PageNotFounds = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  // left: 50%;
  transform: translate(-50%, -50%);

  .not-found {
    color: ${Theme.gray90};
    font-size: 16px;
    text-align: center;
  }
`;

PdfLoadingMsg.defaultProps = {
  type: '',
  message: '',
  setIsLoader: () => {},
};

PdfLoadingMsg.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  setIsLoader: PropTypes.func,
};
