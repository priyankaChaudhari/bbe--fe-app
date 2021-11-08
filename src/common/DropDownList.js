import styled from 'styled-components';
import Theme from '../theme/Theme';

const DropDownList = styled.div`
  display: none;
  background-color: ${Theme.white};
  border-radius: 8px;
  box-shadow: 0 5px 15px 0 rgba(68, 68, 79, 0.4);
  max-width: 230px;
  padding: 15px;
  position: absolute;
  z-index: 99999;
  top: 90px;
  width: 100%;
  .new-agreement-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      font-size: ${Theme.extraNormal};
      color: ${Theme.black};
      font-weight: 600;
      margin-bottom: 24px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      .sub-title {
        font-weight: 400;
      }
    }
  }
`;
export default DropDownList;
