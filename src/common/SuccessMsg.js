import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Theme from '../theme/Theme';

export default function SuccessMsg({ message, property }) {
  $('#success').delay(3000).fadeOut(100);

  return (
    <>
      {message !== '' ? (
        <div className={property} id="success" style={{ textAlign: 'center' }}>
          <SuccessWrapper>{message}</SuccessWrapper>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

SuccessMsg.defaultProps = {
  property: '',
};

SuccessMsg.propTypes = {
  message: PropTypes.string.isRequired,
  property: PropTypes.string,
};

const SuccessWrapper = styled.div`
  color: ${Theme.green};
  background: ${Theme.lightGreen};
  padding: 9px 20px 11px 20px;
  border-radius: 4px;
  font-weight: 500;
  text-align: left;
  font-size: ${Theme.small};
  font-family: ${Theme.baseFontFamily};
  display: inline-block;

  .undo-text {
    color: ${Theme.black};
    font-size: 13px;
  }
`;
