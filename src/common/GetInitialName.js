import React from 'react';

import { shape, string } from 'prop-types';

const getInitials = (userInfo, type) => {
  if (type === 'list') {
    return userInfo && userInfo.match(/\b(\w)/g).join('');
  }
  const firstName =
    (userInfo && userInfo.first_name && userInfo.first_name.charAt(0)) || '';
  const lastName =
    (userInfo && userInfo.last_name && userInfo.last_name.charAt(0)) || '';
  return firstName + lastName;
};

export default function GetInitialName({ userInfo, property, type }) {
  if (type === 'profile') return getInitials(userInfo);
  return (
    <div
      className={
        type === 'list'
          ? ` avatarName dropdown-avartName ${property}`
          : type === 'team'
          ? 'avatarName team-avatarName'
          : type === 'activity'
          ? ''
          : `avatarName ${property}`
      }>
      {getInitials(userInfo, type)}
    </div>
  );
}

GetInitialName.defaultProps = {
  property: '',
  type: '',
  userInfo: {},
};

GetInitialName.propTypes = {
  property: string,
  type: string,
  userInfo: shape({}),
};
