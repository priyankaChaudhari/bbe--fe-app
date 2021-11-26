import React from 'react';

import { arrayOf, bool } from 'prop-types';
import { PageLoader } from '../../../../common';

import TableMobileView from '../../../../common/TableMobileView';
import numberWithCommas from '../../../../hooks/numberWithComas';
import { CommissionTabletView } from './BGSComissionContainerStyle';

function BGSCommissionTableResponsiveView({
  isGroupBy,
  loader,
  commissionData,
}) {
  return (
    <CommissionTabletView className="mt-4 d-md-none d-block">
      {isGroupBy
        ? commissionData && commissionData.length > 0
          ? commissionData.map((item) => {
              return (
                <div key={item.bgs_manager?.id}>
                  {item && item.bgs_manager ? (
                    <TableMobileView
                      mainLabel={item.bgs_manager.name}
                      label="retainer"
                      labelInfo="$52,000.00"
                      label1="rev share"
                      labelInfo1="$52,000.00"
                      label2="DSP (15%)"
                      labelInfo2="$52,000.00"
                      label3="total book size"
                      labelInfo3="$52,000.00"
                      label4="total book size"
                      labelInfo4="$52,000.00"
                      label5="Book Size comm."
                      labelInfo5="$52,000.00"
                      label6="upsells"
                      labelInfo6="$52,000.00"
                      label7="Upsells comm."
                      labelInfo7="$52,000.00"
                    />
                  ) : null}
                  {item &&
                    item.members &&
                    item.members.map((memberItem) => {
                      return (
                        <TableMobileView
                          key={memberItem.id}
                          label="Team Member"
                          labelInfo={memberItem.name}
                          label1="retainer"
                          labelInfo1={`$${numberWithCommas(
                            memberItem.retainer,
                          )}`}
                          label2="rev share"
                          labelInfo2={`$${numberWithCommas(
                            memberItem.rev_share,
                          )}`}
                          label3="DSP"
                          labelInfo3={`$${numberWithCommas(memberItem.dsp)}`}
                          label4="total book size"
                          labelInfo4="$52,000.00"
                          label5="total book size"
                          labelInfo5="$52,000.00"
                          label6="Book Size comm."
                          labelInfo6="$52,000.00"
                          label7="upsells"
                          labelInfo7="$52,000.00"
                          label8="Upsells comm."
                          labelInfo8="$52,000.00"
                        />
                      );
                    })}
                </div>
              );
            })
          : null
        : commissionData && commissionData.length > 0
        ? commissionData.map((memberItem) => {
            return (
              <TableMobileView
                key={memberItem.id}
                label="Team Member"
                labelInfo={memberItem.name}
                label1="retainer"
                labelInfo1={`$${numberWithCommas(memberItem.retainer)}`}
                label2="rev share"
                labelInfo2={`$${numberWithCommas(memberItem.rev_share)}`}
                label3="DSP"
                labelInfo3={`$${numberWithCommas(memberItem.dsp)}`}
                label4="total book size"
                labelInfo4="$52,000.00"
                label5="total book size"
                labelInfo5="$52,000.00"
                label6="Book Size comm."
                labelInfo6="$52,000.00"
                label7="upsells"
                labelInfo7="$52,000.00"
                label8="Upsells comm."
                labelInfo8="$52,000.00"
              />
            );
          })
        : null}
      {loader ? (
        <PageLoader
          component="performance-graph"
          color="#FF5933"
          type="detail"
          width={40}
          height={40}
        />
      ) : null}
    </CommissionTabletView>
  );
}

export default BGSCommissionTableResponsiveView;
BGSCommissionTableResponsiveView.defaultProps = {
  isGroupBy: true,
  loader: false,
  commissionData: null,
};

BGSCommissionTableResponsiveView.propTypes = {
  isGroupBy: bool,
  loader: bool,
  commissionData: arrayOf(Array),
};
