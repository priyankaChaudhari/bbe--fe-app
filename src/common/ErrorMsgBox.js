import styled from 'styled-components';
import Theme from '../theme/Theme';

const ErrorMsgBox = styled.div`
  color: ${Theme.red};
  background-color: #fbf2f2;
  padding: 9px 13px 11px 13px;
  border-radius: 4px;
  font-weight: 500;
  text-align: left;
  font-size: ${Theme.extraSmall};
  font-family: ${Theme.baseFontFamily};
  display: inline-block;

  .info-icon {
    width: 11px;
    margin-right: 2px;
  }
`;

export default ErrorMsgBox;
