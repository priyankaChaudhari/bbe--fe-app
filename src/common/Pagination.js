import React from 'react';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Theme from '../theme/Theme';

export default function CommonPagination({
  count,
  pageNumber,
  handlePageChange,
  marginStyle,
  showLessItems = false,
}) {
  return (
    <div>
      <PaginationStyled>
        <Pagination
          style={{ marginLeft: marginStyle || '' }}
          className="p-2 mt-2"
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`
          }
          total={count}
          showLessItems={showLessItems}
          current={pageNumber}
          hideOnSinglePage
          onChange={(event) => handlePageChange(event)}
          locale="en_US"
        />
      </PaginationStyled>
    </div>
  );
}

CommonPagination.defaultProps = {
  count: null,
  pageNumber: 1,
  handlePageChange: () => {},
  marginStyle: null,
  showLessItems: false,
};

CommonPagination.propTypes = {
  count: PropTypes.number,
  pageNumber: PropTypes.number,
  handlePageChange: PropTypes.func,
  marginStyle: PropTypes.number,
  showLessItems: PropTypes.bool,
};

const PaginationStyled = styled.div`
  ul.rc-pagination {
    text-align: end;
    .rc-pagination-total-text {
      float: left;
      color: ${Theme.gray85};
    }
    li {
      margin-bottom: 10px;

      &.rc-pagination-item {
        display: inline-block;
        border: none;
        a {
          color: ${Theme.black};
        }

        &.rc-pagination-item-active {
          font-weight: 500;
          border: none;
          a {
            color: ${Theme.orange};
          }
        }

        &:hover {
          font-weight: 500;
          a {
            color: ${Theme.orange};
          }
        }
      }
    }
    .rc-pagination-prev button,
    .rc-pagination-next button {
      //   .rc-pagination-next button:after {
      //     font-size: 22px !important;
      //   }
      // }
      font-size: 18px;
      .rc-pagination-next button:after {
        font-size: 15px !important;
        color: black;
      }
      .rc-pagination-prev button:after {
        content: '‹';
        display: block;
        color: black;
        font-size: 15px !important;
      }

      &:hover {
        border: 1px solid #d9d9d9;
        color: black;
      }
    }
    .rc-pagination-next:focus .rc-pagination-item-link,
    .rc-pagination-next:hover .rc-pagination-item-link,
    .rc-pagination-prev:focus .rc-pagination-item-link,
    .rc-pagination-prev:hover .rc-pagination-item-link {
      border: 1px solid #d9d9d9;
      font-size: 18px;
      color: black;
    }
  }
  .rc-pagination-options {
    margin-left: 0;
  }
`;
