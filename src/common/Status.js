import React from 'react';

import styled from 'styled-components';
import { string } from 'prop-types';

import Theme from '../theme/Theme';

const Status = ({
  label,
  className,
  backgroundColor,
  pointColor,
  labelColor,
}) => {
  return (
    <StatusWrapper
      pointColor={pointColor}
      style={{ backgroundColor }}
      className={['status_container', className]}>
      {pointColor ? (
        <div
          style={{ backgroundColor: pointColor }}
          className="status_symbol"
        />
      ) : null}
      <span style={{ color: labelColor }} className="status_text">
        {label ? label.charAt(0).toUpperCase() + label.slice(1) : ''}
      </span>
    </StatusWrapper>
  );
};

export default Status;

const StatusWrapper = styled.div`
  float: left;
  border-radius: 5px;
  width: fit-content;
  min-width: 70px;
  padding: 5px 10px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  // margin-top: 5px;
  .status_symbol {
    border-radius: 100%;
    width: 8px;
    height: 8px;
    z-index: 20 !important;
  }
  span.status_text {
    margin-left: ${(props) => (props.pointColor ? 8 : 0)}px;
    font-size: ${Theme.extraNormal};
    font-weight: 500;
  }
`;

Status.defaultProps = {
  backgroundColor: Theme.lightYellow,
  className: '',
  labelColor: Theme.black,
  pointColor: '',
};

Status.propTypes = {
  label: string.isRequired,
  backgroundColor: string,
  pointColor: string,
  className: string,
  labelColor: string,
};
