import React from 'react';

import Select from 'react-select';

import BBEGoalRevShareContribution from './BBEGoalRevShareContribution';
import BBEGoalHighLevelMetrics from './BBEGoalHighLevelMetrics';
import { DashboardCard } from '../../theme/Global';
import { DropDownSelect } from '../../common';

export default function BBEGoalDashboardContainer() {
  return (
    <>
      <DashboardCard className="pt-md-0 pt-0">
        <div className="dashboard-container-body ">
          <div className="row">
            <div className="col-lg-10 col-md-8 col-6">
              {' '}
              <h5 className="sub-title-text">Business Performance Snapshot</h5>
              <div className="sub-heading ">Last Updated 24 Jan, 2022</div>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
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
