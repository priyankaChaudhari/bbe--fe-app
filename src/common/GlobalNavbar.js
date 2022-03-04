import React from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Tabs from './Tabs';
import { GlobalMenu } from './Styles/HeaderStyles';
import {
  roleURLs,
  dashboardRole,
  dashboardRolePaths,
  GlobalMenus,
} from '../constants';

function GlobalNavbar() {
  const userInfo = useSelector((state) => state.userState.userInfo);
  const userRole = userInfo?.role;
  const history = useHistory();

  const displayGlobalMenu = () => {
    return (
      <GlobalMenu>
        {/* <h3>Globalnav</h3> */}
        <Tabs>
          <ul className="tabs scrollable-container ">
            {GlobalMenus.map((menu) => {
              return menu.label === 'Dashboard' ? (
                dashboardRole.includes(userRole) ? (
                  <li
                    className={
                      roleURLs.some((element) =>
                        history.location.pathname?.includes(element),
                      )
                        ? ' cursor active scrollable-tab  '
                        : ' cursor scrollable-tab'
                    }
                    role="presentation"
                    onClick={() => history.push(dashboardRolePaths[userRole])}>
                    Dashboard
                  </li>
                ) : null
              ) : (
                <li
                  className={
                    history.location.pathname?.includes(menu.pathname)
                      ? ' cursor active scrollable-tab'
                      : ' cursor scrollable-tab'
                  }
                  role="presentation"
                  onClick={() => history.push(menu.pathToRedirect)}>
                  {menu.label}
                </li>
              );
            })}
          </ul>
        </Tabs>
      </GlobalMenu>
    );
  };
  return <div>{displayGlobalMenu()}</div>;
}

export default GlobalNavbar;
