import React from 'react';

import PropTypes from 'prop-types';

const getInitials = (userInfo, type) => {
  if (type === 'list') {
    return userInfo.match(/\b(\w)/g).join('');
  }
  const firstName =
    (userInfo && userInfo.first_name && userInfo.first_name.charAt(0)) || '';
  const lastName =
    (userInfo && userInfo.last_name && userInfo.last_name.charAt(0)) || '';
  return firstName + lastName;
};

// eslint-disable-next-line react/prop-types
export default function GetInitialName({ userInfo, property, type }) {
  return (
    <div
      className={
        type === 'list'
          ? ` avatarName dropdown-avartName ${property}`
          : `avatarName ${property}`
      }>
      {getInitials(userInfo, type)}
    </div>
  );
}

GetInitialName.defaultProps = {
  property: '',
  type: '',
};

GetInitialName.propTypes = {
  property: PropTypes.string,
  type: PropTypes.string,
};
