import styled from 'styled-components';
import Theme from '../theme/Theme';

const ErrorMsg = styled.div`
  color: ${Theme.red};
  font-size: ${Theme.extraNormal};
  padding: 0;
  margin: 0 0 0 0;
  transform: translate(0, 10px);

  a {
    text-transform: lowercase;
    text-decoration: underline;
    display: block;
    color: ${Theme.red};
    font-size: ${Theme.extraSmall};
  }
`;
export default ErrorMsg;
