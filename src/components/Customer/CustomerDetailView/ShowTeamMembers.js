import React from 'react';

import ReactTooltip from 'react-tooltip';
import { func, string, shape, arrayOf } from 'prop-types';

import { GetInitialName } from '../../../common';
import { PlusIcon } from '../../../theme/images';

export default function ShowTeamMembers({
  role,
  memberData,
  setShowMemberList,
}) {
  return (
    <>
      <div className="col-6 mt-4 text-right">
        {' '}
        {role !== 'Customer' ? (
          <div className="add-more-people">
            {memberData &&
              memberData.map((item) => (
                <React.Fragment key={item.id}>
                  <div
                    className="add-more-people cursor "
                    data-tip
                    data-for={item.id}
                    onClick={() =>
                      setShowMemberList({
                        show: true,
                        add: false,
                        modal: true,
                      })
                    }
                    role="presentation">
                    <GetInitialName userInfo={item.user_profile} type="team" />
                  </div>

                  <ReactTooltip
                    place="bottom"
                    id={item.id}
                    aria-haspopup="true">
                    <strong>
                      {(item.user_profile && item.user_profile.first_name) ||
                        ' '}{' '}
                      {(item.user_profile && item.user_profile.last_name) ||
                        ' '}
                    </strong>
                    <p style={{ color: 'white', fontSize: '11px' }}>
                      {item.user_profile && item.user_profile.role}
                    </p>
                  </ReactTooltip>
                </React.Fragment>
              ))}

            <div
              className="add-more-people btn-add-team cursor"
              role="presentation"
              onClick={() =>
                setShowMemberList({
                  show: true,
                  add: true,
                  modal: true,
                })
              }>
              <img src={PlusIcon} alt="add" />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

ShowTeamMembers.defaultProps = {
  setShowMemberList: () => {},
};

ShowTeamMembers.propTypes = {
  role: string.isRequired,
  memberData: arrayOf(shape({})).isRequired,
  setShowMemberList: func,
};
