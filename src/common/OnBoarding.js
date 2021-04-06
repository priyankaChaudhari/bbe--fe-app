import styled from 'styled-components';
import Theme from '../theme/Theme';

const OnBoardingBody = styled.div`
  background: ${Theme.gray8};
  height: 100%;
  padding-left: 64px;
  padding: 60px 10px 0 10px;

  &.body-white {
    background: ${Theme.white};
    padding-top: 0;
  }

  .white-card-base {
    background-color: ${Theme.white};
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    margin: 0 auto;
    padding: 40px 40px 35px 40px;
    color: ${Theme.black};
    font-size: ${Theme.normal};
    box-shadow: 0px 5px 15px 0px #44444f33;

    .lock-finish {
      padding-bottom: 22px;
      margin-top: -10px;
    }
    .account-steps {
      color: ${Theme.gray40};
      font-size: ${Theme.verySmall};
      font-family: ${Theme.titleFontFamily};
      text-transform: uppercase;
      padding-bottom: 8px;
    }
    .page-heading {
      font-family: ${Theme.baseFontFamily};
      text-transform: initial;
      padding-bottom: 13px;
    }
    .information-text {
      font-weight: 300;
      padding-bottom: 13px;
      line-height: 22px;
      font-size: ${Theme.normal};

      .hi-name {
        margin-bottom: 12px;
      }
      .note {
        font-style: italic;
      }
    }
    .complete-steps {
      font-family: ${Theme.titleFontFamily};
    }
    .account-steps-check {
      list-style-type: none;
      padding: 0;
      marging: 0;

      li {
        padding-bottom: 10px;

        img {
          width: 14px;
          margin-right: 6px;
        }
      }
    }
    .reach-out {
      color: ${Theme.gray90};
      font-family: ${Theme.regularItalicFontFamily};
      font-weight: 500;
      font-size: ${Theme.normal};

      .reach-out-link {
        color: ${Theme.orange};
        font-family: ${Theme.regularItalicFontFamily};
        text-transform: lowercase;
        text-decoration: underline;
      }
    }
    .info-text-gray {
      color: ${Theme.gray40};
      font-size: 14px;
      line-height: 22px;
    }
  }
  .panel {
    padding: 0;
    max-width: 400px;
    margin-top: 105px;
    box-shadow: none;
  }
`;

export default OnBoardingBody;
