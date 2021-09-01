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
}) => (
  <StatusWrapper
    pointColor={pointColor}
    style={{ 'background-color': backgroundColor }}
    className={['status_container capitalize', className]}>
    {pointColor ? (
      <div
        style={{ 'background-color': pointColor }}
        className="status_symbol"
      />
    ) : null}
    <span style={{ color: labelColor }} className="status_text">
      {label}
    </span>
  </StatusWrapper>
);

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
  margin-top: 5px;
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
};

Status.propTypes = {
  label: string.isRequired,
  backgroundColor: string,
  pointColor: string.isRequired,
  className: string,
  labelColor: string,
};
