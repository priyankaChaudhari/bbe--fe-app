import React from 'react';

import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { number, oneOfType, string } from 'prop-types';

import Theme from '../theme/Theme';
import numberWithCommas from '../hooks/numberWithComas';

const rendeTootipData = (retainer, revshare, dsp) => {
  return `
    <div style="padding:0; margin: 0 0 4px 0; max-width: 240px; width: 100%;opacity: 100%;"> 
      <div style="display: "> 
        <div style="color:#ffffff; font-size: 12px">Total Book Size BreakDown</div>
      </div>
      <div class="row">
          <div class="col-6">
           <div style="color: #f4f6fc;
          text-transform: uppercase;
          font-size: 11px;
          margin-top: 8px;
         ">Retainer
         
        </div>
          </div>
           <div class="col-6">
             <div style="color: #f4f6fc;
              font-size: 16px;
              margin-left: 25px;
              float: right;
              text-align: right;
              margin-top: 4px;
             "> $${numberWithCommas(retainer)}
           </div>
           </div>
             <div class="col-6">
           <div style="color: #f4f6fc;
          text-transform: uppercase;
          font-size: 11px;
          margin-top:7px;
         ">Rev Share
        </div>
          </div>
           <div class="col-6">
             <div style="color: #f4f6fc;
              font-size: 16px;
              margin-left: 25px;
              float: right;
              text-align: right;
              margin-top: 4px;
             ">
             $${numberWithCommas(revshare)}
           </div>
           </div>
           <div class="col-6">
           <div style="color: #f4f6fc;
          text-transform: uppercase;
          font-size: 11px;
          margin-top:7px;
         ">DSP
        </div>
          </div>
           <div class="col-6">
             <div style="color: #f4f6fc;
              font-size: 16px;
              margin-left: 25px;
              float: right;
              text-align: right;
              margin-top: 4px;
             ">
             $${numberWithCommas(dsp)}
           </div>
           </div>
      </div>     
    </div>`;
};

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
  breakDown,
  retainer,
  revShare,
  dsp,
}) => (
  <CardWrapper className={[className]}>
    <p className="heading mt-0">{heading}</p>
    {type === 'invoices' ? (
      <>
        <div
          style={{
            marginBottom: subTitle ? (subTitle ? '20px' : '32px') : '0',
          }}>
          <p style={{ color: titleColor }} className="title">
            {prefix}
            {title}
            {postfix}
          </p>

          {subTitle ? <p className="sub-title">{subTitle}</p> : null}
          {breakDown ? (
            <div
              className="label-card-text "
              data-tip={rendeTootipData(retainer, revShare, dsp)}
              data-html
              data-for="break-down">
              {breakDown}
            </div>
          ) : null}
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
    <ReactTooltip
      id="break-down"
      aria-haspopup="true"
      place="bottom"
      effect="solid"
      backgroundColor="#162c50"
    />
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
    word-break: break-all;
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
  breakDown: '',
  retainer: 0,
  dsp: 0,
  revShare: 0,
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
  breakDown: string,
  retainer: number,
  dsp: number,
  revShare: number,
};
