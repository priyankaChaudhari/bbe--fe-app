import styled from 'styled-components';
import Theme from '../theme/Theme';

const SearchInput = styled.div`
  position: relative;
  width: 100%;

  &.w-50 {
    max-width: 335px;
    width: 100%;
    float: right;
  }

  .form-control {
    width: 100%;
    padding: 10px 10px 10px 40px;
    border-radius: 12px;
    font-size: ${Theme.small};
    background-color: ${Theme.gray15};
    color: ${Theme.gray35};
    border: 1px solid ${Theme.gray9};
    border-radius: 5px;

    &::placeholder {
      color: ${Theme.gray35};
    }

    &:focus {
      outline: none;
    }
  }

  .search-input-icon {
    position: absolute;
    left: 15px;
    top: 10px;
    width: 18px;

    &.info-icon {
      left: 300px;

      @media only screen and (max-width: 320px) {
        left: 250px;
      }
    }
  }

  @media only screen and (max-width: 767px) {
    max-width: 280px;
    float: left;
  }
`;

export default SearchInput;
