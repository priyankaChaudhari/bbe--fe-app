import React from 'react';

import { arrayOf, bool } from 'prop-types';
import { NoData, PageLoader } from '../../../../common';

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
                      mainLabel={item.bgs_manager.full_name.replace(
                        /\b(\w)/g,
                        (s) => s.toUpperCase(),
                      )}
                      label="retainer"
                      labelInfo={`$${numberWithCommas(
                        item.bgs_manager.retainer,
                      )}`}
                      label1="rev share"
                      labelInfo1={`$${numberWithCommas(
                        item.bgs_manager.rev_share,
                      )}`}
                      label2="DSP"
                      labelInfo2={`$${numberWithCommas(item.bgs_manager.dsp)}`}
                      label3="total book size"
                      labelInfo3={`$${numberWithCommas(
                        item.bgs_manager.total_book_size,
                      )}`}
                      label4="Book Size Commission"
                      labelInfo4={`$${numberWithCommas(
                        item.bgs_manager.total_book_size_commission,
                      )}`}
                      label5="Upsells"
                      labelInfo5={`$${numberWithCommas(
                        item.bgs_manager.upsell,
                      )}`}
                      label6="Upsells Commission"
                      labelInfo6={`$${numberWithCommas(
                        item.bgs_manager.upsell_commission,
                      )}`}
                      label7="Total Commission"
                      labelInfo7={`$${numberWithCommas(
                        item.bgs_manager.total_commission,
                      )}`}
                    />
                  ) : null}
                  {item &&
                    item.members &&
                    item.members.map((memberItem) => {
                      return (
                        <TableMobileView
                          key={memberItem.id}
                          label="Team Member"
                          labelInfo={memberItem.full_name.replace(
                            /\b(\w)/g,
                            (s) => s.toUpperCase(),
                          )}
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
                          labelInfo4={`$${numberWithCommas(
                            memberItem.total_book_size,
                          )}`}
                          label5="book size Comm."
                          labelInfo5={`$${numberWithCommas(
                            memberItem.total_book_size_commission,
                          )}`}
                          label6="Upsells"
                          labelInfo6={`$${numberWithCommas(memberItem.upsell)}`}
                          label7="Upsells Comm."
                          labelInfo7={`$${numberWithCommas(
                            memberItem.upsell_commission,
                          )}`}
                          label8="Total Commission"
                          labelInfo8={`$${numberWithCommas(
                            memberItem.total_commission,
                          )}`}
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
                labelInfo={memberItem.full_name.replace(/\b(\w)/g, (s) =>
                  s.toUpperCase(),
                )}
                label1="retainer"
                labelInfo1={`$${numberWithCommas(memberItem.retainer)}`}
                label2="rev share"
                labelInfo2={`$${numberWithCommas(memberItem.rev_share)}`}
                label3="DSP"
                labelInfo3={`$${numberWithCommas(memberItem.dsp)}`}
                label4="total book size"
                labelInfo4={`$${numberWithCommas(memberItem.total_book_size)}`}
                label5="book size Comm."
                labelInfo5={`$${numberWithCommas(
                  memberItem.total_book_size_commission,
                )}`}
                label6="Upsells"
                labelInfo6={`$${numberWithCommas(memberItem.upsell)}`}
                label7="Upsells Comm."
                labelInfo7={`$${numberWithCommas(
                  memberItem.upsell_commission,
                )}`}
                label8="Total Commission"
                labelInfo8={`$${numberWithCommas(memberItem.total_commission)}`}
              />
            );
          })
        : null}

      {!loader && !commissionData ? (
        <NoData>No Commission Data Found</NoData>
      ) : null}
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
