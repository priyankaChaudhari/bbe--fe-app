import React from 'react';
import styled from 'styled-components';
import Theme from '../theme/Theme';
import { ArrowUp } from '../theme/images/index';

export default function BackToTop() {
  return (
    <ScrollToTop>
      <div className=" text-center d-lg-none d-md-block ">
        <div
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="presentation">
          {' '}
          <img src={ArrowUp} alt="" /> Back to top
        </div>
      </div>
    </ScrollToTop>
  );
}

const ScrollToTop = styled.div`
  .back-to-top {
    position: absolute;
    bottom: 0;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
    padding: 5px 10px;
    width: 135px;
    background: ${Theme.gray15};
    display: block;
    border-radius: 5px;
    border: 1px solid ${Theme.gray7};
    color: ${Theme.gray90};
    font-size: ${Theme.title};
    font-weight: 600;
    line-height: 39px;
    margin-top: 30px;
    cursor: pointer;

    img {
      width: 19px;
      vertical-align: text-top;
      margin-right: 2px;
    }
  }
`;
