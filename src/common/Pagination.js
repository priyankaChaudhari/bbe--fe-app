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
}) {
  return (
    <div>
      <PaginationStyled>
        <Pagination
          style={{ float: 'right', marginLeft: marginStyle || '' }}
          className="p-2 mt-2"
          showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total}`}
          total={count}
          current={pageNumber}
          hideOnSinglePage
          showLessItems
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
};

CommonPagination.propTypes = {
  count: PropTypes.number,
  pageNumber: PropTypes.number,
  handlePageChange: PropTypes.func,
  marginStyle: PropTypes.number,
};

const PaginationStyled = styled.div`
  ul.rc-pagination {
    li {
      margin-bottom: 10px;
      &.rc-pagination-item {
        display: inline-block;

        a {
          color: ${Theme.gray90};
        }

        &.rc-pagination-item-active {
          font-weight: 500;
          background: ${Theme.baseColor};
          border-color: ${Theme.baseColor};
          a {
            color: ${Theme.white};
          }
        }
        &:hover {
          font-weight: 500;
          background: ${Theme.baseColor};
          border-color: ${Theme.baseColor};
          a {
            color: ${Theme.white};
          }
        }
      }
    }
  }
`;
