import { func, string } from 'prop-types';
import React from 'react';

import styled from 'styled-components';
import { CompanyDefaultUser } from '../theme/images';
import { WhiteCard } from './WhiteCard';
import Theme from '../theme/Theme';
import Status from './Status';

const TableMobileView = ({
  className,
  CompanyName,
  invoiceType,
  invoiceId,
  label,
  labelInfo,
  label1,
  label2,
  label3,
  labelInfo1,
  labelInfo2,
  labelInfo3,
  status,
  statusColor,
  onClick,
}) => {
  const col = `${label3 ? 'col-6' : 'col-4'}`;
  return (
    <TableMobileViewWrapper className={[className]} onClick={onClick}>
      <WhiteCard>
        <div className="row">
          <div className="col-7 pr-0">
            {CompanyName ? (
              <>
                <img
                  className="company-logo"
                  src={CompanyDefaultUser}
                  alt="logo"
                />
                <div className="CompanyName">{CompanyName}</div>
                {invoiceType && invoiceId ? (
                  <>
                    <div className="CompanyName">{invoiceType}</div>
                    <div className="CompanyId">#{invoiceId}</div>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div className="CompanyName">{invoiceType}</div>
                <div className="CompanyId">#{invoiceId}</div>
              </>
            )}
          </div>

          <div className="col-5   text-right">
            {' '}
            <Status
              className="card-staus-right"
              label={status}
              backgroundColor={statusColor}
            />
            <div className="clear-fix" />
          </div>
        </div>
        <div className="straight-line horizontal-line mb-3 mt-2" />
        <div className="row">
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label}</div>
            <div className="label-info label-bold"> {labelInfo}</div>
          </div>
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label1}</div>
            <div className="label-info label-bold"> {labelInfo1}</div>
          </div>
          <div className={`${col} mb-3`}>
            {' '}
            <div className="label">{label2}</div>
            <div className="label-info "> {labelInfo2}</div>
          </div>
          {label3 ? (
            <div className={`${col} mb-3`}>
              {' '}
              <div className="label">{label3}</div>
              <div className="label-info "> {labelInfo3}</div>
            </div>
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
`;

TableMobileView.defaultProps = {
  className: '',
  CompanyName: '',
  label: '',
  labelInfo: '',
  label1: '',
  labelInfo1: '',
  label2: '',
  labelInfo2: '',
  label3: '',
  labelInfo3: '',
  invoiceType: '',
  invoiceId: '',
  status: '',
  statusColor: '',
  onClick: () => {},
};

TableMobileView.propTypes = {
  className: string,
  CompanyName: string,
  label: string,
  labelInfo: string,
  label1: string,
  labelInfo1: string,
  label2: string,
  labelInfo2: string,
  label3: string,
  labelInfo3: string,
  invoiceType: string,
  invoiceId: string,
  status: string,
  statusColor: string,
  onClick: func,
};
