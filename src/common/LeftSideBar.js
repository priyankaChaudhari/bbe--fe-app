import React from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { shape, arrayOf, string } from 'prop-types';

import Theme from '../theme/Theme';
import {
  ReadBookIcon,
  ReadBookIconActive,
  OrganizationActiveIcon,
  OrganizationIcon,
  SpeedometerActive,
  Speedometer,
} from '../theme/images';
import {
  PATH_ARTICLE_LIST,
  PATH_CUSTOMER_LIST,
  PATH_BGS_DASHBOARD,
  PATH_BGS_MANAGER_DASHBOARD,
  PATH_SPONSORED_DASHBOARD,
  PATH_DSP_DASHBOARD,
  PATH_HYBRID_DASHBOARD,
  PATH_AD_MANAGER_ADMIN_DASHBOARD,
  PATH_FINANCE_DASHBOARD,
  PATH_BGS_ADMIN_DASHBOARD,
} from '../constants';

export default function LeftSideBar({ userInfo }) {
  const history = useHistory();

  return (
    <div>
      <LeftSideBars>
        <ul className="side-bar-icon">
          {userInfo?.role?.includes('BGS') ? (
            <li
              className={
                history.location.pathname?.includes('bgs')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_BGS_DASHBOARD)}>
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

          {userInfo?.role?.includes('BGS Manager') ? (
            <li
              className={
                history.location.pathname?.includes('bgsManager')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_BGS_MANAGER_DASHBOARD)}>
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

          {userInfo?.role?.includes('BGS Admin') ? (
            <li
              className={
                history.location.pathname?.includes('bgsAdmin')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_BGS_ADMIN_DASHBOARD)}>
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

          {userInfo?.role?.includes('Sponsored Advertising Ad Manager') ? (
            <li
              className={
                history.location.pathname?.includes('sponsored')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_SPONSORED_DASHBOARD)}>
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

          {userInfo?.role?.includes('DSP Ad Manager') ? (
            <li
              className={
                history.location.pathname?.includes('dsp')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_DSP_DASHBOARD)}>
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

          {userInfo?.role?.includes('Hybrid Ad Manager') ? (
            <li
              className={
                history.location.pathname?.includes('hybrid')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_HYBRID_DASHBOARD)}>
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

          {userInfo?.role?.includes('Ad Manager Admin') ? (
            <li
              className={
                history.location.pathname?.includes('adMangerAdmin')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_AD_MANAGER_ADMIN_DASHBOARD)}>
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

          {userInfo?.role?.includes('Finance') ? (
            <li
              className={
                history.location.pathname?.includes('finance')
                  ? ' cursor active'
                  : ' cursor'
              }
              role="presentation"
              onClick={() => history.push(PATH_FINANCE_DASHBOARD)}>
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
    role: arrayOf(string).isRequired,
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
