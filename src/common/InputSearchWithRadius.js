import styled from 'styled-components';
import Theme from '../theme/Theme';

const InputSearchWithRadius = styled.div`
  position: relative;
  width: 100%;

  &.w-50 {
    max-width: 335px;
    width: 100%;
    float: right;
  }
  .article-search {
    position: absolute;
    z-index: 2;
  }

  .form-control {
    width: 100%;
    padding: 10px 10px 10px 40px;
    min-height: 40px;
    border-radius: 12px;
    font-size: ${Theme.normal};
    background-color: ${Theme.gray15};
    color: #333333;
    border: 1px solid ${Theme.gray9};
    border-radius: 20px;

    &::placeholder {
      color: ${Theme.gray30};
      font-size: ${Theme.normal};
    }

    &:focus {
      outline: none;
      background-color: ${Theme.white};
    }

    &.form-control-info {
      padding: 10px 33px 10px 40px;
    }
  }

  .search-input-icon {
    position: absolute;
    left: 15px;
    top: 11px;
    width: 18px;

    ::i-block-chrome,
    .search-input-icon {
      top: 14px;
    }
  }

  .info-icon {
    right: 16px;
    position: absolute;
    top: 12px;
  }

  .remove-icon {
    position: absolute;
    right: 16px;
    width: 17px;
    top: 11px;
    cursor: pointer;
  }
  .search-loader {
    text-align: center;
  }

  @media only screen and (max-width: 767px) {
    &.w-50 {
      max-width: 280px;
      float: left;
    }

    ::i-block-chrome,
    .search-input-icon {
      top: 14px;
    }
  }
`;

export default InputSearchWithRadius;
