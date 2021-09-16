import styled from 'styled-components';
import Theme from '../theme/Theme';

const CustomDateRange = styled.div`
  .react-datepicker {
    font-size: 16px !important;
    font-family: ${Theme.baseFontFamily}!important;
    border: none !important;
    width: 100% !important;

    .react-datepicker__triangle {
      position: absolute;
      width: 100% !important;
      left: 50px;
    }
    .react-datepicker__month-container {
      float: left;
      width: 100% !important;
    }
    .react-datepicker__month-container {
      width: 100% !important;
      float: left;
      .react-datepicker__header {
        text-align: center;
        font-size: 16px !important;
        padding: 14px 0 !important;
        position: relative;
        border: none !important;
        background: transparent !important;
      }
    }
    .react-datepicker__month .react-datepicker__month-text,
    .react-datepicker__month .react-datepicker__quarter-text {
      display: inline-block;
      width: 4rem;
      margin: 5px 0;
    }
    .react-datepicker__month-text:hover,
    .react-datepicker__quarter-text:hover {
      background-color: transparent;
      // border-radius: 0;
      // border-radius: 25px;
    }
    .react-datepicker__month .react-datepicker__month-text,
    .react-datepicker__month .react-datepicker__quarter-text {
      display: inline-block;
      max-width: 6rem;
      width: 100%;
      padding: 10px;

      @media only screen and (max-width: 670px) {
        max-width: 5rem;
      }
    }
    .react-datepicker__day--keyboard-selected,
    .react-datepicker__month-text--keyboard-selected,
    .react-datepicker__quarter-text--keyboard-selected,
    .react-datepicker__year-text--keyboard-selected {
      // border-radius: 0;
      // background-color: #ff5933;
      // color: #fff;
      border-radius: 25px;
      background-color: transparent;
      color: #171725;
      border: 1px solid red;
    }

    .react-datepicker__month--range-end {
      border-top-right-radius: 25px !important;
      border-bottom-right-radius: 25px !important;
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      right: 2px;
      border-left: none;
    }

    .react-datepicker__month-2,
    .react-datepicker__month-5,
    .react-datepicker__month-8,
    .react-datepicker__month-11 {
      border-top-right-radius: 25px !important;
      border-bottom-right-radius: 25px !important;
    }
    .react-datepicker__month-0,
    .react-datepicker__month-3,
    .react-datepicker__month-6,
    .react-datepicker__month-9 {
      border-top-left-radius: 25px !important;
      border-bottom-left-radius: 25px !important;
    }
    .react-datepicker__month-text--keyboard-selected {
      border: 1px solid ${Theme.orange};
    }
    .jUfUYu .react-datepicker .react-datepicker__month--selected,
    .jUfUYu .react-datepicker .react-datepicker__month--in-selecting-range,
    .jUfUYu .react-datepicker .react-datepicker__month--in-range,
    .jUfUYu .react-datepicker .react-datepicker__quarter--selected,
    .jUfUYu .react-datepicker .react-datepicker__quarter--in-selecting-range,
    .jUfUYu .react-datepicker .react-datepicker__quarter--in-range {
      border-radius: 0.3rem;
      background-color: transparent;
      color: ${Theme.black} !important;
    }
    .coRVAu .react-datepicker .react-datepicker__month--selected,
    .coRVAu .react-datepicker .react-datepicker__month--in-selecting-range,
    .coRVAu .react-datepicker .react-datepicker__month--in-range,
    .coRVAu .react-datepicker .react-datepicker__quarter--selected,
    .coRVAu .react-datepicker .react-datepicker__quarter--in-selecting-range,
    .coRVAu .react-datepicker .react-datepicker__quarter--in-range {
      border-radius: 0.3rem;
      background-color: transparent;
      color: ${Theme.black} !important;
    }
    .react-datepicker__month--selected,
    .react-datepicker__month--in-selecting-range,
    .react-datepicker__month--in-range,
    .react-datepicker__quarter--selected,
    .react-datepicker__quarter--in-selecting-range,
    .react-datepicker__quarter--in-range {
      border-radius: 0.3rem;
      // background-color: ${Theme.orange};
      // color: ${Theme.black};
    }
    react-datepicker__month--selected,
    .react-datepicker__month--in-selecting-range,
    .react-datepicker__month--in-range,
    .react-datepicker__quarter--selected,
    .react-datepicker__quarter--in-selecting-range,
    .react-datepicker__quarter--in-range {
      // border-radius: 0;
      background-color: transparent;
      color: ${Theme.orange};
      border: 1px solid ${Theme.orange};
      font-weight: 600;
    }
    .react-datepicker__month--selected {
      background-color: transparent;
      font-weight: bold;
      color: ${Theme.black};
      border-radius: 25px;
    }

    .react-datepicker__month--range-start {
      border-top-left-radius: 25px !important;
      border-bottom-left-radius: 25px !important;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      left: 2px;
      border-right: none;
    }

    .react-datepicker__month--in-range {
      border-right: none;
      border-left: none;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &:first-child {
        border-left: 1px solid ${Theme.orange};
      }
      &:last-child {
        border-right: 1px solid ${Theme.orange};
      }
    }
  }
`;

export default CustomDateRange;
