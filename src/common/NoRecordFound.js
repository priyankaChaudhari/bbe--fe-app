import React from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import Theme from '../theme/Theme';
import { TelescopeIcon } from '../theme/images';

export default function NoRecordFound({ type }) {
  return (
    <NoRecord>
      <div
        className={
          type === 'brand'
            ? 'NoRecordFound no-record-found'
            : 'text-center no-record-found'
        }>
        <img src={TelescopeIcon} alt="No record found" />
        <p>We looked high and low, but…</p>
        <strong>No records found.</strong>
      </div>
    </NoRecord>
  );
}

NoRecordFound.defaultProps = {
  type: '',
};

NoRecordFound.propTypes = {
  type: PropTypes.string,
};

const NoRecord = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  top: 40%;
  padding-top: 100px;

  .NoRecordFound {
    margin: auto;
    text-align: center;
    //padding-top: 10%;
    // padding-left: 65px;
    // left: 65px;
  }
  .no-record-found {
    img {
      width: 240px;
      height: 240px;
    }
    p {
      font-size: 16px;
      color: ${Theme.gray90};
    }

    strong {
      font-size: 24px;
      color: ${Theme.gray90};
    }
  }
`;
