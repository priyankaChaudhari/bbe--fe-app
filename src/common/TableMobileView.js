import { bool, func, string } from 'prop-types';
import React from 'react';

import styled from 'styled-components';
import { CompanyDefaultUser, BellNotification } from '../theme/images';
import { WhiteCard } from './WhiteCard';
import Theme from '../theme/Theme';
import Status from './Status';

const TableMobileView = ({
  className,
  CompanyName,
  invoiceType,
  invoiceId,
  label,
  statusLabelColor,
  labelInfo,
  label1,
  label2,
  label3,
  label4,
  label5,
  label6,
  label7,
  labelInfo1,
  sublabel,
  sublabel1,
  labelInfo2,
  labelInfo3,
  labelInfo4,
  labelInfo5,
  labelInfo6,
  labelInfo7,
  status,
  statusColor,
  onClick,
  icon,
  marketplaces,
  isColumnOnClick = false,
  isShowBellIcon = false,
  onColumnClick,
}) => {
  const col = `${label3 ? (label7 ? 'col-4' : 'col-6') : 'col-4'}`;
  return (
    <TableMobileViewWrapper className={[className]} onClick={onClick}>
      <WhiteCard>
        <div className="row">
          <div className="col-7 pr-0">
            {CompanyName ? (
              <>
                <img
                  className="company-logo"
                  src={icon || CompanyDefaultUser}
                  alt="logo"
                />
                <div className="CompanyName">{CompanyName}</div>
                {invoiceType !== null ? (
                  <div className="CompanyName">{invoiceType}</div>
                ) : null}
                {invoiceId ? (
                  <div className="CompanyId">{`#${invoiceId}`}</div>
                ) : null}
              </>
            ) : (
              <>
                <div className="CompanyName">{invoiceType}</div>
                <div className="CompanyId">
                  {invoiceId ? `#${invoiceId}` : null}
                  {marketplaces}
                </div>
              </>
            )}
          </div>

          <div className="col-5   text-right">
            {' '}
            <Status
              className="card-staus-right"
              label={status}
              backgroundColor={statusColor}
              labelColor={statusLabelColor}
            />
            <div className="clear-fix" />
          </div>
        </div>
        <div className="straight-line horizontal-line mb-3 mt-2" />
        <div className="row">
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label}</div>
            <div className="label-info label-bold">
              {' '}
              {labelInfo}
              {isShowBellIcon ? (
                <img
                  className="notification-bell-icon"
                  src={BellNotification}
                  alt="bell"
                  data-tip="Pending BP Sign-off"
                  data-for="Pending-BP-Sign-off"
                />
              ) : null}
            </div>
            {sublabel && <div className="sub-label-text">{sublabel}</div>}
          </div>
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label1}</div>
            <div className="label-info label-bold"> {labelInfo1}</div>
            {sublabel1 && <div className="sub-label-text">{sublabel1}</div>}
          </div>
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label2}</div>
            <div
              role="presentation"
              className="label-info "
              onClick={isColumnOnClick ? () => onColumnClick() : null}>
              {' '}
              {labelInfo2}
            </div>
          </div>
          {label3 ? (
            <div className={`${col} mb-3`}>
              {' '}
              <div className="label">{label3}</div>
              <div className="label-info "> {labelInfo3}</div>
            </div>
          ) : null}
          {label7 ? (
            <>
              <div className={`${col} mb-3`}>
                {' '}
                <div className="label">{label4}</div>
                <div className="label-info "> {labelInfo4}</div>
              </div>
              <div className={`${col} mb-3`}>
                {' '}
                <div className="label">{label5}</div>
                <div className="label-info "> {labelInfo5}</div>
              </div>
              <div className={`${col} mb-3`}>
                {' '}
                <div className="label">{label6}</div>
                <div className="label-info "> {labelInfo6}</div>
              </div>
              <div className={`${col} mb-3`}>
                {' '}
                <div className="label">{label7}</div>
                <div className="label-info "> {labelInfo7}</div>
              </div>
            </>
          ) : null}
        </div>
      </WhiteCard>
    </TableMobileViewWrapper>
  );
};

export default TableMobileView;

const TableMobileViewWrapper = styled.div`
  .company-logo {
    border-radius: 10px;
    width: 47px;
    height: 47px;
    margin-bottom: 8px;
    float: left;
    margin-right: 14px;
    clear: both;
  }

  .CompanyName {
    vertical-align: middle;
    position: relative;
    color: ${Theme.black};
    font-size: ${Theme.extraNormal};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 270px;
    min-height: 20px;
    margin-top: 5px;
    text-transform: capitalize;

    &.LargeCompanyName {
      font-size: ${Theme.title};
    }
  }
  .CompanyId {
    font-size: ${Theme.extraNormal};
    color: ${Theme.gray85};
  }

  .card-staus-right {
    float: right;
  }

  .label-bold {
    font-weight: bold;
  }
  .sub-label-text {
    font-size: ${Theme.extraNormal};
    color: ${Theme.black};
  }
`;

TableMobileView.defaultProps = {
  isColumnOnClick: false,
  isShowBellIcon: false,
  className: '',
  CompanyName: '',
  label: '',
  statusLabelColor: '',
  labelInfo: '',
  label1: '',
  labelInfo1: '',
  sublabel: '',
  sublabel1: '',
  label2: '',
  labelInfo2: '',
  label3: '',
  labelInfo3: '',
  label4: '',
  labelInfo4: '',
  label5: '',
  labelInfo5: '',
  label6: '',
  labelInfo6: '',
  label7: '',
  labelInfo7: '',
  invoiceType: '',
  invoiceId: '',
  status: '',
  statusColor: '',
  icon: '',
  marketplaces: '',
  onClick: () => {},
  onColumnClick: () => {},
};

TableMobileView.propTypes = {
  isColumnOnClick: bool,
  isShowBellIcon: bool,
  className: string,
  CompanyName: string,
  label: string,
  statusLabelColor: string,
  labelInfo: string,
  label1: string,
  labelInfo1: string,
  sublabel: string,
  sublabel1: string,
  label2: string,
  labelInfo2: string,
  label3: string,
  labelInfo3: string,
  label4: string,
  labelInfo4: string,
  label5: string,
  labelInfo5: string,
  label6: string,
  labelInfo6: string,
  label7: string,
  labelInfo7: string,
  invoiceType: string,
  invoiceId: string,
  status: string,
  statusColor: string,
  icon: string,
  marketplaces: string,
  onClick: func,
  onColumnClick: func,
};
