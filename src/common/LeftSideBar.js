import React from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Theme from '../theme/Theme';
import {
  UserGroupIcon,
  ReadBookIcon,
  ReadBookIconActive,
  UserGroupIconActive,
} from '../theme/images/index';
import { PATH_ARTICLE_LIST, PATH_CUSTOMER_LIST } from '../constants';

export default function LeftSideBar() {
  const history = useHistory();

  return (
    <div>
      <LeftSideBars>
        <ul className="side-bar-icon">
          <li
            className={
              !(
                history.location.pathname &&
                history.location.pathname.includes('collections')
              )
                ? ' cursor active'
                : ' cursor'
            }
            role="presentation"
            onClick={() => history.push(PATH_CUSTOMER_LIST)}>
            <img className="user-group" src={UserGroupIconActive} alt="" />
            <img className="user-group-active " src={UserGroupIcon} alt="" />
          </li>
          <li
            className={
              history.location.pathname &&
              history.location.pathname.includes('collections')
                ? 'cursor active'
                : ' cursor'
            }
            role="presentation"
            onClick={() => history.push(PATH_ARTICLE_LIST)}>
            <img className="read-book-active" src={ReadBookIconActive} alt="" />
            <img className="read-book" src={ReadBookIcon} alt="" />
          </li>
        </ul>
      </LeftSideBars>
    </div>
  );
}

const LeftSideBars = styled.div`
  max-width: 64px;
  position: absolute;
  top: 70px;
  left: 0;
  height: 90%;
  background: ${Theme.gray6};
  border-right: 1px solid ${Theme.gray7};
  .side-bar-icon {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin: 18px 0;
      padding: 0 18px;
      border-left: 3px solid ${Theme.white};

      .read-book-active {
        display: block;
      }

      .read-book {
        display: none;
      }

      .user-group-active {
        display: block;
      }

      .user-group {
        display: none;
      }

      img {
        width: 22px;
        cursor: pointer;
      }

      &:hover {
        border-left: 3px solid ${Theme.orange};

        .read-book {
          display: block;
        }
        .read-book-active {
          display: none;
        }

        .user-group {
          display: block;
        }
        .user-group-active {
          display: none;
        }
      }

      &.active {
        border-left: 3px solid ${Theme.orange};

        .read-book {
          display: block;
        }
        .read-book-active {
          display: none;
        }

        .user-group {
          display: block;
        }
        .user-group-active {
          display: none;
        }
      }
    }
  }
  @media only screen and (min-width: 1500px) {
    height: 92%;
  }
  @media (max-width: 991px) {
    display: none;
  }
`;
