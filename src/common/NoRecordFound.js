import React from 'react';
import styled from 'styled-components';
import Theme from '../theme/Theme';
import { TelescopeIcon } from '../theme/images';

export default function NoRecordFound() {
  return (
    <NoRecord>
      <div className="text-center no-record-found">
        <img src={TelescopeIcon} alt="No record found" />
        <p>We looked high and low, but…</p>
        <strong>No records found.</strong>
      </div>
    </NoRecord>
  );
}

const NoRecord = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  top: 98px;

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
