import React from 'react';
import { DefaultUser } from '../../theme/images/index';

import { WhiteCard, GroupUser } from '../../theme/Global';

export default function () {
  return (
    <div>
      <div className="col-8">
        <WhiteCard className="activity-card">
          <p className="black-heading-title mt-0 mb-4"> Recent Activity</p>
          <GroupUser>
            <img className="default-user-activity" src={DefaultUser} alt="" />
            <div className="activity-user">
              System User added new team member
              <span className="font-bold"> Randy Hetrick</span>
              <div className="time-date mt-1">01/14/2021, 5:13:42 PM MST</div>
            </div>
            <div className="clear-fix" />
          </GroupUser>
          <GroupUser className="mt-4">
            <img className="default-user-activity" src={DefaultUser} alt="" />
            <div className="activity-user">
              System User added new team member
              <span className="font-bold"> Randy Hetrick</span>
              <div className="time-date mt-1">01/14/2021, 5:13:42 PM MST</div>
            </div>
            <div className="clear-fix" />
          </GroupUser>
          <GroupUser className="mt-4">
            <img className="default-user-activity" src={DefaultUser} alt="" />
            <div className="activity-user">
              System User added new team member
              <span className="font-bold"> Randy Hetrick</span>
              <div className="time-date mt-1">01/14/2021, 5:13:42 PM MST</div>
            </div>
            <div className="clear-fix" />
          </GroupUser>
        </WhiteCard>
      </div>
    </div>
  );
}
