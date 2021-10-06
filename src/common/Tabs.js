import styled from 'styled-components';
import Theme from '../theme/Theme';

const Tabs = styled.div`
  .tabs {
    list-style-type: none;
    position: relative;
    text-align: left;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid ${Theme.gray11};

    li {
      display: inline-block;
      margin-right: 10px;
      font-weight: normal;
      color: ${Theme.black};
      font-size: ${Theme.extraMedium};
      font-family: ${Theme.baseFontFamily};
      cursor: pointer;
      padding: 0 15px 15px 15px;

      &:last-child {
        margin-right: 0;
      }

      &.a {
        text-decoration: none;
      }

      &.active {
        border-bottom: 2px solid ${Theme.orange};
        color: ${Theme.black};
        font-family: ${Theme.titleFontFamily};
      }
    }
  }
   @media only screen and (max-width: 768px) { 
     .tabs {
    li {
      margin-right: 5px;
      padding: 10px 10px 10px 10px;
      font-size: ${Theme.normal};
    }
   }
`;

export default Tabs;
