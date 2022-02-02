import React from 'react';

import BBEGoalRevShareContribution from './BBEGoalRevShareContribution';
import BBEGoalHighLevelMetrics from './BBEGoalHighLevelMetrics';

export default function BBEGoalDashboardContainer() {
  return (
    <>
      <BBEGoalHighLevelMetrics />
      <BBEGoalRevShareContribution />
    </>
  );
}

BBEGoalDashboardContainer.defaultProps = {};
BBEGoalDashboardContainer.propTypes = {};
