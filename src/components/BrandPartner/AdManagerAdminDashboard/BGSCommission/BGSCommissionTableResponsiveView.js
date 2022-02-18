import React from 'react';

import { arrayOf, bool, func } from 'prop-types';

import Theme from '../../../../theme/Theme';
import TableMobileView from '../../../../common/TableMobileView';
import { NoData, PageLoader } from '../../../../common';
import { CommissionTabletView } from './BGSCommissionContainerStyle';

function BGSCommissionTableResponsiveView({
  isGroupBy,
  loader,
  commissionData,
  OnSetShowModal,
  formatNumber,
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
                      onClick={() =>
                        OnSetShowModal(
                          item.bgs_manager.id,
                          item.bgs_manager.full_name,
                          true,
                        )
                      }
                      mainLabel={item.bgs_manager.full_name.replace(
                        /\b(\w)/g,
                        (s) => s.toUpperCase(),
                      )}
                      label="retainer"
                      labelInfo={`${formatNumber(
                        item.bgs_manager.retainer,
                        '$',
                      )}`}
                      label1="rev share"
                      labelInfo1={`${formatNumber(
                        item.bgs_manager.rev_share,
                        '$',
                      )}`}
                      label2="DSP"
                      labelInfo2={`${formatNumber(item.bgs_manager.dsp, '$')}`}
                      label3="total book size"
                      labelInfo3={`${formatNumber(
                        item.bgs_manager.total_book_size,
                        '$',
                      )}`}
                      label4="Book Size Commission"
                      labelInfo4={`${formatNumber(
                        item.bgs_manager.total_book_size_commission,
                        '$',
                      )}`}
                      label5="Upsells"
                      labelInfo5={`${formatNumber(
                        item.bgs_manager.upsell,
                        '$',
                      )}`}
                      label6="Upsells Commission"
                      labelInfo6={`${formatNumber(
                        item.bgs_manager.upsell_commission,
                        '$',
                      )}`}
                      label7="Total Commission"
                      labelInfo7={`${formatNumber(
                        item.bgs_manager.total_commission,
                        '$',
                      )}`}
                    />
                  ) : null}
                  {item &&
                    item.members &&
                    item.members.map((memberItem) => {
                      return (
                        <TableMobileView
                          key={memberItem.id}
                          onClick={() =>
                            OnSetShowModal(
                              memberItem.id,
                              memberItem.full_name,
                              false,
                              item.bgs_manager.id,
                            )
                          }
                          label="Team Member"
                          labelInfo={memberItem.full_name.replace(
                            /\b(\w)/g,
                            (s) => s.toUpperCase(),
                          )}
                          label1="retainer"
                          labelInfo1={`${formatNumber(
                            memberItem.retainer,
                            '$',
                          )}`}
                          label2="rev share"
                          labelInfo2={`${formatNumber(
                            memberItem.rev_share,
                            '$',
                          )}`}
                          label3="DSP"
                          labelInfo3={`${formatNumber(memberItem.dsp, '$')}`}
                          label4="total book size"
                          labelInfo4={`${formatNumber(
                            memberItem.total_book_size,
                            '$',
                          )}`}
                          label5="book size Comm."
                          labelInfo5={`${formatNumber(
                            memberItem.total_book_size_commission,
                            '$',
                          )}`}
                          label6="Upsells"
                          labelInfo6={`${formatNumber(memberItem.upsell, '$')}`}
                          label7="Upsells Comm."
                          labelInfo7={`${formatNumber(
                            memberItem.upsell_commission,
                            '$',
                          )}`}
                          label8="Total Commission"
                          labelInfo8={`${formatNumber(
                            memberItem.total_commission,
                            '$',
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
                onClick={() =>
                  OnSetShowModal(memberItem.id, memberItem.full_name)
                }
                label="Team Member"
                labelInfo={memberItem.full_name?.replace(/\b(\w)/g, (s) =>
                  s.toUpperCase(),
                )}
                label1="retainer"
                labelInfo1={`${formatNumber(memberItem.retaine, '$')}`}
                label2="rev share"
                labelInfo2={`${formatNumber(memberItem.rev_share, '$')}`}
                label3="DSP"
                labelInfo3={`${formatNumber(memberItem.dsp, '$')}`}
                label4="total book size"
                labelInfo4={`${formatNumber(memberItem.total_book_size, '$')}`}
                label5="book size Comm."
                labelInfo5={`${formatNumber(
                  memberItem.total_book_size_commission,
                  '$',
                )}`}
                label6="Upsells"
                labelInfo6={`${formatNumber(memberItem.upsell, '$')}`}
                label7="Upsells Comm."
                labelInfo7={`${formatNumber(
                  memberItem.upsell_commission,
                  '$',
                )}`}
                label8="Total Commission"
                labelInfo8={`${formatNumber(memberItem.total_commission, '$')}`}
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
          color={Theme.orange}
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
  OnSetShowModal: () => {},
};

BGSCommissionTableResponsiveView.propTypes = {
  isGroupBy: bool,
  loader: bool,
  commissionData: arrayOf(Array),
  OnSetShowModal: func,
  formatNumber: func.isRequired,
};
