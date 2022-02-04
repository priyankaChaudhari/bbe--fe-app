import React from 'react';

import { arrayOf, bool, func } from 'prop-types';

import { NoData, PageLoader, TableGap, WhiteCard } from '../../../../common';
import numberWithCommas from '../../../../hooks/numberWithComas';

export default function BGSCommissionTableDesktopView({
  commissionData,
  isGroupBy,
  loader,
  OnSetShowModal,
}) {
  return (
    <TableGap className="d-md-block d-none">
      <WhiteCard className="table-card ">
        <table>
          <thead
            style={{
              width: '100%',
              display: 'table',

              borderBottom: isGroupBy ? 'none' : '1px solid #e0e6e8',
            }}>
            <tr className="BGSCommission-header">
              <th width="10%" className=" text-left">
                team member
              </th>
              <th width="10%" className=" text-left">
                retainer
              </th>
              <th width="10%" className=" text-left">
                rev share
              </th>
              <th width="8%" className=" text-left">
                dsp
              </th>
              <th width="12%" className=" text-left">
                {' '}
                total book size
              </th>
              <th width="12%" className=" text-left">
                {' '}
                BOOK Size commission
              </th>
              <th width="8%" className=" text-left">
                {' '}
                upsells
              </th>
              <th width="12%" className=" text-left">
                {' '}
                Upsells commission
              </th>
              <th width="10%" className=" text-left">
                {' '}
                total commission
              </th>
            </tr>
          </thead>
        </table>
        {loader ? (
          <PageLoader
            component="performance-graph"
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : null}
        {!isGroupBy && commissionData && commissionData.length > 0 ? (
          <div className="commission-section">
            <table>
              <tbody>
                {commissionData.map((item) => {
                  return (
                    <div key={item.id}>
                      <tr
                        onClick={() => OnSetShowModal(item.id, item.full_name)}
                        className="ungroup cursor">
                        <td width="10%">
                          {item.full_name?.replace(/\b(\w)/g, (s) =>
                            s.toUpperCase(),
                          )}
                        </td>
                        <td width="10%" className="text-medium">
                          {`$${numberWithCommas(item.retainer)}`}
                        </td>
                        <td width="10%" className="text-medium">
                          {`$${numberWithCommas(item.rev_share)}`}
                        </td>
                        <td width="8%" className="text-medium">
                          {`$${numberWithCommas(item.dsp)}`}
                        </td>
                        <td width="12%" className="text-medium">
                          {`$${numberWithCommas(item.total_book_size)}`}
                        </td>
                        <td width="12%" className="text-bold">
                          {`$${numberWithCommas(
                            item.total_book_size_commission,
                          )}`}
                        </td>
                        <td width="8%" className="text-medium">
                          {`$${numberWithCommas(item.upsell)}`}
                        </td>
                        <td width="12%" className="text-bold">
                          {`$${numberWithCommas(item.upsell_commission)}`}
                        </td>
                        <td width="10%" className="text-bold">
                          {`$${numberWithCommas(item.total_commission)}`}
                        </td>
                      </tr>
                    </div>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loader && !commissionData ? (
          <NoData>No Commission Data Found</NoData>
        ) : null}
      </WhiteCard>

      {isGroupBy && commissionData && commissionData.length > 0 ? (
        <div className="commission-section">
          {' '}
          {commissionData.map((item) => {
            return (
              <WhiteCard
                key={item && item.bgs_manager && item.bgs_manager.id}
                className="mb-3 pt-1 pb-2">
                <table>
                  <tbody style={{ width: '100%', display: 'table' }}>
                    {item && item.bgs_manager ? (
                      <tr
                        className="cursor"
                        onClick={() =>
                          OnSetShowModal(
                            item.bgs_manager.id,
                            item.bgs_manager.full_name,
                            true,
                          )
                        }>
                        <td width="10%" className="text-bold">
                          {item.bgs_manager.full_name.replace(/\b(\w)/g, (s) =>
                            s.toUpperCase(),
                          )}
                        </td>
                        <td width="10%" className="text-medium">
                          {`$${numberWithCommas(item.bgs_manager.retainer)}`}
                        </td>
                        <td width="10%" className="text-medium">
                          {`$${numberWithCommas(item.bgs_manager.rev_share)}`}
                        </td>
                        <td width="8%" className="text-medium">
                          {`$${numberWithCommas(item.bgs_manager.dsp)}`}
                        </td>
                        <td width="12%" className="text-medium">
                          {`$${numberWithCommas(
                            item.bgs_manager.total_book_size,
                          )}`}
                        </td>
                        <td width="12%" className="text-bold">
                          {`$${numberWithCommas(
                            item.bgs_manager.total_book_size_commission,
                          )}`}
                        </td>
                        <td width="8%" className="text-medium">
                          {`$${numberWithCommas(item.bgs_manager.upsell)}`}
                        </td>
                        <td width="12%" className="text-bold">
                          {`$${numberWithCommas(
                            item.bgs_manager.upsell_commission,
                          )}`}
                        </td>
                        <td width="10%" className="text-bold">
                          {`$${numberWithCommas(
                            item.bgs_manager.total_commission,
                          )}`}
                        </td>
                      </tr>
                    ) : null}
                    {item &&
                      item.members &&
                      item.members.map((memberItem) => {
                        return (
                          <tr
                            className="cursor"
                            key={memberItem.id}
                            onClick={() =>
                              OnSetShowModal(
                                memberItem.id,
                                memberItem.full_name,
                                false,
                                item.bgs_manager.id,
                              )
                            }>
                            <td width="10%">
                              {memberItem.full_name.replace(/\b(\w)/g, (s) =>
                                s.toUpperCase(),
                              )}
                            </td>
                            <td width="10%" className="text-medium">
                              {`$${numberWithCommas(memberItem.retainer)}`}
                            </td>
                            <td width="10%" className="text-medium">
                              {`$${numberWithCommas(memberItem.rev_share)}`}
                            </td>
                            <td width="8%" className="text-medium">
                              {`$${numberWithCommas(memberItem.dsp)}`}
                            </td>
                            <td width="12%" className="text-medium">
                              {`$${numberWithCommas(
                                memberItem.total_book_size,
                              )}`}
                            </td>
                            <td width="12%" className="text-bold">
                              {`$${numberWithCommas(
                                memberItem.total_book_size_commission,
                              )}`}
                            </td>
                            <td width="8%" className="text-medium">
                              {`$${numberWithCommas(memberItem.upsell)}`}
                            </td>
                            <td width="12%" className="text-bold">
                              {`$${numberWithCommas(
                                memberItem.upsell_commission,
                              )}`}
                            </td>
                            <td width="10%" className="text-bold">
                              {`$${numberWithCommas(
                                memberItem.total_commission,
                              )}`}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </WhiteCard>
            );
          })}
        </div>
      ) : null}
    </TableGap>
  );
}

BGSCommissionTableDesktopView.defaultProps = {
  isGroupBy: true,
  loader: false,
  commissionData: null,
  OnSetShowModal: () => {},
};

BGSCommissionTableDesktopView.propTypes = {
  isGroupBy: bool,
  loader: bool,
  commissionData: arrayOf(Array),
  OnSetShowModal: func,
};
