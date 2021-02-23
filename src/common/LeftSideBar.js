import React from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Theme from '../theme/Theme';
import {
  ReadBookIcon,
  ReadBookIconActive,
  OrganizationActiveIcon,
  OrganizationIcon,
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
            <img className="active" src={OrganizationActiveIcon} alt="" />
            <img className="disactive" src={OrganizationIcon} alt="" />
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
          {/* <li>
            <img className="user-group" src={UserGroupIconActive} alt="" />
            <img className="user-group-active " src={UserGroupIcon} alt="" />
          </li> */}
        </ul>
      </LeftSideBars>
    </div>
  );
}

const LeftSideBars = styled.div`
  max-width: 64px;
  position: fixed;
  top: 70px;
  left: 0;
  height: 90%;
  background: ${Theme.white};
  border-right: 1px solid ${Theme.gray7};
  .side-bar-icon {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin: 30px 0;
      padding: 0 22px 0 17px;
      border-left: 3px solid ${Theme.white};

      .read-book-active {
        display: block;
      }

      .read-book {
        display: none;
      }

      .active {
        display: none;
      }

      .disactive {
        display: block;
      }

      img {
        width: 24px;
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

        .disactive {
          display: none;
        }
        .active {
          display: block;
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

        .disactive {
          display: none;
        }
        .active {
          display: block;
        }
      }
    }
  }
  @media only screen and (min-width: 1500px) {
    height: 94%;
  }
  @media (max-width: 991px) {
    display: none;
  }
`;
