import {
  PATH_BBE_GOAL_DASHBOARD,
  PATH_CUSTOMER_LIST,
  PATH_ARTICLE_LIST,
  PATH_REPORTS_SECTION,
} from './RouteConstants';

const GlobalMenu = [
  {
    label: 'Home',
    pathname: 'bbe-Goal',
    pathToRedirect: PATH_BBE_GOAL_DASHBOARD,
  },
  {
    label: 'Dashboard',
  },
  {
    label: 'Partners',
    pathname: 'customer',
    pathToRedirect: PATH_CUSTOMER_LIST,
  },
  {
    label: 'Knowledge Base',
    pathname: 'collections',
    pathToRedirect: PATH_ARTICLE_LIST,
  },
  {
    label: 'Report',
    pathname: 'reports',
    pathToRedirect: PATH_REPORTS_SECTION,
  },
];

export default GlobalMenu;
