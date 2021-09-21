import { number, oneOfType, string } from 'prop-types';
import React from 'react';

import styled from 'styled-components';

import Theme from '../theme/Theme';

const Card = ({
  className,
  heading,
  title,
  subTitle,
  titleColor,
  noBill,
  totalBill,
  noBillText,
  totalBillText,
  prefix = null,
  postfix = null,
  type,
}) => (
  <CardWrapper className={[className]}>
    <p className="heading mt-0">{heading}</p>
    {type === 'invoices' ? (
      <>
        <div style={{ marginBottom: subTitle ? '20px' : '32px' }}>
          <p style={{ color: titleColor }} className="title">
            {prefix}
            {title}
            {postfix}
          </p>

          {subTitle ? <p className="sub-title">{subTitle}</p> : null}
        </div>
      </>
    ) : (
      <ul className="billing">
        <li>
          {' '}
          <p className="title">{noBill}</p>
          <p className="sub-title">{noBillText}</p>
        </li>
        <li>
          {' '}
          <p className="title">
            {prefix}
            {totalBill}
            {postfix}
          </p>
          <p className="sub-title">{totalBillText}</p>
        </li>
      </ul>
    )}
  </CardWrapper>
);

export default Card;

const CardWrapper = styled.div`
  background-color: ${Theme.white};
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  // justify-content: space-between;
  align-items: start;
  flex-direction: column;

  .heading {
    color: ${Theme.gray40};
    font-size: 11px;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .billing {
    list-style-type: none;
    padding: 0;
    margin: 10px 0;
    li {
      display: inline-block;
      margin-right: 25px;
      color: ${Theme.gray80};
      &:last-child {
        margin-right: 0;
      }
    }
  }
  p.title {
    margin-bottom: 2px !important;
    margin-top: 0px !important;
    word-break: keep-all;
  }

  .title {
    font-size: 26px;
    font-family: ${Theme.titleFontFamily};
  }

  p.sub-title {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
  }

  .sub-title {
    color: ${Theme.gray40};
    font-size: 14px;
  }
`;

Card.defaultProps = {
  className: '',
  heading: '',
  title: '',
  subTitle: '',
  titleColor: Theme.gray80,
  prefix: null,
  postfix: null,
  noBill: '',
  totalBill: '',
  noBillText: '',
  totalBillText: '',
  type: '',
};

Card.propTypes = {
  className: string,
  heading: string,
  title: oneOfType([string, number]),
  subTitle: string,
  titleColor: string,
  prefix: string,
  postfix: string,
  noBill: string,
  totalBill: string,
  noBillText: string,
  totalBillText: string,
  type: string,
};
