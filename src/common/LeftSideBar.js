import React from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { shape, string } from 'prop-types';

import Theme from '../theme/Theme';
import {
  ReadBookIcon,
  ReadBookIconActive,
  OrganizationActiveIcon,
  OrganizationIcon,
  SpeedometerActive,
  Speedometer,
  HomePageActiveIcon,
  HomePageIcon,
  GraphIconActive,
  GraphIconInActive,
} from '../theme/images';

import {
  PATH_ARTICLE_LIST,
  PATH_CUSTOMER_LIST,
  PATH_BBE_GOAL_DASHBOARD,
  roleURLs,
  dashboardRolePaths,
  dashboardRole,
  PATH_REPORTS_SECTION,
} from '../constants';

export default function LeftSideBar({ userInfo }) {
  const history = useHistory();
  const userRole = userInfo?.role;

  return (
    <div>
      <LeftSideBars>
        <ul className="side-bar-icon">
          <li
            className={
              history.location.pathname?.includes('bbe-Goal')
                ? ' cursor active'
                : ' cursor'
            }
            role="presentation"
            onClick={() => history.push(PATH_BBE_GOAL_DASHBOARD)}>
            {' '}
            <img
              width="28px"
              className=" home-page-icon active"
              src={HomePageActiveIcon}
              alt=""
            />
            <img
              width="28px"
              className=" home-page-icon  disactive"
              src={HomePageIcon}
              alt=""
            />
          </li>

          {dashboardRole.includes(userRole) ? (
            <li
              className={
                roleURLs.some((element) =>
                  history.location.pathname?.includes(element),
                )
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(dashboardRolePaths[userRole])}>
              {' '}
              <img
                width="32px"
                className=" speed0meter-icon active"
                src={SpeedometerActive}
                alt=""
              />
              <img
                width="32px"
                className=" speed0meter-icon  disactive"
                src={Speedometer}
                alt=""
              />
            </li>
          ) : null}

          <li
            className={
              history.location.pathname?.includes('customer')
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
              history.location.pathname?.includes('collections')
                ? 'cursor active'
                : ' cursor'
            }
            role="presentation"
            onClick={() => history.push(PATH_ARTICLE_LIST)}>
            <img className="read-book-active" src={ReadBookIconActive} alt="" />
            <img className="read-book" src={ReadBookIcon} alt="" />
          </li>

          <li
            className={
              history.location.pathname?.includes('reports')
                ? ' cursor active'
                : ' cursor'
            }
            role="presentation"
            onClick={() => history.push(PATH_REPORTS_SECTION)}>
            {' '}
            <img
              width="28px"
              className=" home-page-icon active"
              src={GraphIconActive}
              alt=""
            />
            <img
              width="28px"
              className=" home-page-icon  disactive"
              src={GraphIconInActive}
              alt=""
            />
          </li>
        </ul>
      </LeftSideBars>
    </div>
  );
}

LeftSideBar.defaultProps = {
  userInfo: {},
};

LeftSideBar.propTypes = {
  userInfo: shape({
    role: string.isRequired,
  }),
};

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

      .speed0meter-icon {
        width: 32px;
      }
      img {
        width: 28px;
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
  @media (max-width: 991.98px) {
    display: none;
  }
`;
