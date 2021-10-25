import styled from 'styled-components';

import Theme from '../../theme/Theme';

export const CollapseContainer = styled.div`
  opacity: 0.6;
  pointer-events: none;
`;

export const ThanksPage = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  .info {
    color: ${Theme.gray90};
    font-size: ${Theme.title};
    font-family: ${Theme.baseFontFamily};
  }
`;

export const BackToStep = styled.div`
  position: fixed;
  background-color: ${Theme.white};
  z-index: 2;
  top: 70px;
  padding: 22px 0px 18px 0px;
  width: 100%;
  border-bottom: 1px solid ${Theme.gray5};

  .skip-steps {
    color: ${Theme.gray40};
    font-size: ${Theme.extraNormal};
    cursor: pointer;
  }
`;

export const CollapseOpenContainer = styled.div`
  max-width: 430px !important;
  margin: 0 auto;
  .inner-content {
    background-color: ${Theme.white};
    padding: 4px 0px 4px 0px;
    .pay-card {
      font-size: ${Theme.extraNormal};
      color: ${Theme.black};
      font-weight: 600;
    }
    .label-title {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      letter-spacing: 1.13px;
      text-transform: uppercase;
      font-weight: bold;
      font-family: ${Theme.titleFontFamily};
    }
    .payment-option {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        display: inline-block;
        margin-right: 23px;
        margin-bottom: 7px;
        &:last-child {
          margin-right: 0px;
          margin-bottom: 0px;
        }
        .card {
          width: 18px;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }
  }
`;
