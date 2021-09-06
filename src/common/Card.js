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
  prefix = null,
  postfix = null,
}) => (
  <CardWrapper className={[className]}>
    <p className="heading mt-0">{heading}</p>
    <div style={{ marginBottom: subTitle ? '20px' : '32px' }}>
      <p style={{ color: titleColor }} className="title">
        {prefix}
        {title}
        {postfix}
      </p>
      {subTitle ? <p className="sub-title">{subTitle}</p> : null}
    </div>
  </CardWrapper>
);

export default Card;

const CardWrapper = styled.div`
  background-color: ${Theme.white};
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-direction: column;

  .heading {
    color: ${Theme.gray40};
    font-size: 11px;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 15px;
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
};

Card.propTypes = {
  className: string,
  heading: string,
  title: oneOfType([string, number]),
  subTitle: string,
  titleColor: string,
  prefix: string,
  postfix: string,
};
