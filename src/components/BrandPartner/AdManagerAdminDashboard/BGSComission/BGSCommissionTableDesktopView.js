import { arrayOf, bool } from 'prop-types';
import React from 'react';
import { NoData, PageLoader, TableGap, WhiteCard } from '../../../../common';

export default function BGSCommissionTableDesktopView({
  commissionData,
  isGroupBy,
  loader,
}) {
  return (
    <TableGap className="d-md-block d-none">
      <WhiteCard className="table-card">
        <table>
          <thead style={{ width: '100%', display: 'table' }}>
            <tr>
              <th width="10%" className=" text-left">
                team member
              </th>
              <th width="10%" className=" text-left">
                retainer
              </th>
              <th width="10%" className=" text-left">
                rev share
              </th>
              <th width="5%" className=" text-left">
                dsp
              </th>
              <th width="12%" className=" text-left">
                {' '}
                total book size
              </th>
              <th width="15%" className=" text-left">
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
          <table>
            <tbody style={{ width: '100%', display: 'table' }}>
              {commissionData.map((item) => {
                return (
                  <div key={item.id}>
                    <tr>
                      <td width="10%">Team Jake</td>
                      <td width="10%">$2,597.20</td>
                      <td width="10%">$2,597.20</td>
                      <td width="5%">$2,597.20</td>
                      <td width="12%">$805.00</td>
                      <td width="15%" className="text-bold">
                        0
                      </td>
                      <td width="8%">$805.00</td>
                      <td width="12%" className="text-bold">
                        $805.00
                      </td>
                      <td width="10%" className="text-bold">
                        {' '}
                        $1,714.59
                      </td>
                    </tr>
                    <tr>
                      <td width="10%">Team Jake</td>
                      <td width="10%">$2,597.20</td>
                      <td width="10%">$2,597.20</td>
                      <td width="5%">$2,597.20</td>
                      <td width="12%">$805.00</td>
                      <td width="15%" className="text-bold">
                        0
                      </td>
                      <td width="8%">$805.00</td>
                      <td width="12%" className="text-bold">
                        $805.00
                      </td>
                      <td width="10%" className="text-bold">
                        {' '}
                        $1,714.59
                      </td>
                    </tr>
                  </div>
                );
              })}
            </tbody>
          </table>
        ) : null}

        {!loader && !commissionData ? (
          <NoData>No commissions Found</NoData>
        ) : null}
      </WhiteCard>

      {isGroupBy && commissionData && commissionData.length > 0
        ? commissionData.map((item) => {
            return (
              <WhiteCard
                key={item && item.bgs_manager && item.bgs_manager.id}
                className="mt-3 ">
                <table>
                  <tbody style={{ width: '100%', display: 'table' }}>
                    {item && item.bgs_manager ? (
                      <tr>
                        <td width="10%" className="text-bold">
                          {item.bgs_manager.name}
                        </td>
                        <td width="10%">$2,597.20</td>
                        <td width="10%">$2,597.20</td>
                        <td width="5%">$2,597.20</td>
                        <td width="12%">$805.00</td>
                        <td width="15%" className="text-bold">
                          0
                        </td>
                        <td width="8%">$805.00</td>
                        <td width="12%" className="text-bold">
                          $805.00
                        </td>
                        <td width="10%" className="text-bold">
                          {' '}
                          $1,714.59
                        </td>
                      </tr>
                    ) : null}
                    {item &&
                      item.members &&
                      item.members.map((memberItem) => {
                        return (
                          <tr key={memberItem.id}>
                            <td width="10%">Team Jake</td>
                            <td width="10%">$2,597.20</td>
                            <td width="10%">$2,597.20</td>
                            <td width="5%">$2,597.20</td>
                            <td width="12%">$805.00</td>
                            <td width="15%" className="text-bold">
                              0
                            </td>
                            <td width="8%">$805.00</td>
                            <td width="12%" className="text-bold">
                              $805.00
                            </td>
                            <td width="10%" className="text-bold">
                              {' '}
                              $1,714.59
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </WhiteCard>
            );
          })
        : null}
    </TableGap>
  );
}

BGSCommissionTableDesktopView.defaultProps = {
  isGroupBy: true,
  loader: false,
  commissionData: null,
};

BGSCommissionTableDesktopView.propTypes = {
  isGroupBy: bool,
  loader: bool,
  commissionData: arrayOf(Array),
};
