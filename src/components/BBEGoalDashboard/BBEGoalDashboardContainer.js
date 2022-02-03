import React from 'react';

import Select from 'react-select';

import BBEGoalRevShareContribution from './BBEGoalRevShareContribution';
import BBEGoalHighLevelMetrics from './BBEGoalHighLevelMetrics';
import { DashboardCard } from '../../theme/Global';
import { DropDownSelect } from '../../common';

export default function BBEGoalDashboardContainer() {
  return (
    <>
      <DashboardCard>
        <div className="dashboard-container-body">
          <div className="row">
            <div className="col-10">
              {' '}
              <h5 className="sub-title-text">Business Performance Snapshot</h5>
              <div className="sub-heading ">Last Updated 24 Jan, 2022</div>
            </div>
            <div className="col-2">
              {' '}
              <DropDownSelect>
                {' '}
                <Select />{' '}
              </DropDownSelect>{' '}
            </div>
          </div>

          <BBEGoalHighLevelMetrics />
          <BBEGoalRevShareContribution />
        </div>
      </DashboardCard>
    </>
  );
}

BBEGoalDashboardContainer.defaultProps = {};
BBEGoalDashboardContainer.propTypes = {};
