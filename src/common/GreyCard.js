import styled from 'styled-components';
import Theme from '../theme/Theme';

const GreyCard = styled.div`
  padding: 15px;
  background: ${Theme.gray8};
  position: relative;
  border-radius: 8px;
  .contact-user-name {
    font-size: ${Theme.medium};
    color: ${Theme.gray90};
  }

  .user-details {
    color: ${Theme.gray35};
    font-size: 13px;

    img {
      width: 15px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .delete-contact {
    position: absolute;
    width: 16px;
    top: 15px;
    right: 20px;
  }
  .edit-contact {
    position: absolute;
    top: 14px;
    right: 50px;
    width: 14px;
  }
`;
export default GreyCard;
