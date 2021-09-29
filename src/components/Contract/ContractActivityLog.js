/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  FileIcon,
  CheckFileIcon,
  EditFileIcon,
  SignatureIcon,
  NextActivityLogo,
  ContractEmailIcon,
} from '../../theme/images/index';
import { CommonPagination, Status } from '../../common/index';
import PageLoader from '../../common/PageLoader';
import Theme from '../../theme/Theme';

const _ = require('lodash');

function ContractActivityLog({
  activityLoader,
  activityData,
  images,
  activityCount,
  pageNumber,
  isApicalled,
  agreementData,
  setPageNumber,
  getContractActivityLogInfo,
  loader,
}) {
  const getContractStatusData = (type) => {
    const status =
      (agreementData &&
        agreementData.contract_status &&
        agreementData.contract_status.value) ||
      '';
    let statusClass = '';
    let statusSrc = '';
    let dispalyStatus = '';

    if (status !== '') {
      switch (status) {
        case 'pending contract':
          statusClass = 'pending-contract';
          statusSrc = FileIcon;
          dispalyStatus = 'Pending Contract';
          break;

        case 'pending contract approval':
          statusClass = '';
          statusSrc = CheckFileIcon;
          dispalyStatus = 'Pending Contract Approval';
          break;

        case 'pending contract signature':
          statusClass = 'pending-signature';
          statusSrc = EditFileIcon;
          dispalyStatus = 'Pending Signature';
          break;

        case 'pending account setup':
          statusClass = 'signature';
          statusSrc = SignatureIcon;
          dispalyStatus = 'Signed';
          break;

        case 'active':
          statusClass = 'signature';
          statusSrc = SignatureIcon;
          dispalyStatus = 'Signed';
          break;

        case 'inactive':
          statusClass = '';
          statusSrc = '';
          dispalyStatus = 'Inactive';
          break;

        case 'cancel':
          statusClass = '';
          statusSrc = '';
          dispalyStatus = 'Cancel';
          break;

        case 'pending for cancellation':
          statusClass = '';
          statusSrc = '';
          dispalyStatus = 'Pending for cancellation';
          break;

        case 'pause':
          statusClass = '';
          statusSrc = '';
          dispalyStatus = 'Pause';
          break;

        default:
          statusClass = 'pending-contract';
          statusSrc = 'FileIcon';
          dispalyStatus = 'Signed';
          break;
      }
    }

    if (type === 'class') {
      return statusClass;
    }
    if (type === 'src') {
      return statusSrc;
    }
    if (type === 'status') {
      return dispalyStatus;
    }
    return '';
  };

  const getActivityInitials = (userInfo) => {
    if (userInfo && userInfo === 'Contract initiated') {
      return 'SU';
    }
    const firstName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[0].charAt(0)) ||
      '';
    const lastName =
      (userInfo &&
        userInfo.split(' ').slice(0, 2) &&
        userInfo.split(' ').slice(0, 2)[1].charAt(0)) ||
      '';

    return firstName + lastName;
  };

  const displayMixedLog = (logUser, msg) => {
    return msg.map((item, index) => {
      const field = item.split('from')[0];
      let oldValue = item.split('from')[1].split(' to ')[0];
      let newValue = item.split('from')[1].split(' to ')[1].split(', ,')[0];

      if (
        item.includes('annual revenue') ||
        item.includes('number of employees') ||
        item.includes('monthly retainer') ||
        item.includes('sales threshold') ||
        item.includes('fee') ||
        item.includes('discount amount') ||
        item.includes('billing cap')
      ) {
        oldValue = oldValue.replace('.00', '');
        newValue = newValue.replace('.00', '');
        oldValue =
          oldValue && oldValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        newValue =
          newValue && newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      return (
        <>
          {index === 0 ? logUser : ''}
          <span>updated {field || ''} from </span> {oldValue || ''}
          <span> to </span> {newValue === '' ? 'None' : newValue}
        </>
      );
    });
  };

  const displayLog = (logUser, field, oldValue, newValue) => {
    return (
      <>
        {logUser || ''}
        <span>updated {field || ''} from </span> {oldValue || ''}
        <span> to </span> {newValue === '' ? 'None' : newValue}
      </>
    );
  };

  const activityDetail = (item) => {
    let activityMessage = '';
    let logUser;
    let field;
    let oldValue;
    let newValue = '';
    let mixedLog = false;
    if (
      item &&
      item.history_change_reason.includes('created new record by company name')
    ) {
      activityMessage = item.history_change_reason.split(
        'created new record by company name',
      );
      return (
        <>
          {activityMessage[0]}
          <span>created new record by company name</span>
          {activityMessage[1]}
        </>
      );
    }
    if (item.history_change_reason.includes('deleted')) {
      activityMessage = item.history_change_reason.split('deleted');
      return (
        <>
          {activityMessage[0]}
          <span>deleted</span>
          {activityMessage[1]}
        </>
      );
    }

    if (item.history_change_reason.includes('updated addendum')) {
      activityMessage = item.history_change_reason.split('updated addendum');
      return (
        <>
          {activityMessage[0]}
          <span>updated </span>
          addendum
        </>
      );
    }

    if (item.history_change_reason.includes('resumed')) {
      activityMessage = item.history_change_reason.split('resumed');
      return (
        <>
          {activityMessage[0]}
          <span>resumed</span>
          {activityMessage[1]}
        </>
      );
    }

    if (item.history_change_reason.includes('approved and sent')) {
      activityMessage = item.history_change_reason.split('approved and sent');
      return (
        <>
          {activityMessage[0]}
          <span>approved and sent </span>
          {activityMessage[1]}
        </>
      );
    }

    if (item.history_change_reason.includes('sent')) {
      activityMessage = item.history_change_reason.split('sent');
      return (
        <>
          {activityMessage[0]}
          <span>sent</span>
          {activityMessage[1]}
        </>
      );
    }

    if (item.history_change_reason.includes('signed')) {
      activityMessage = item.history_change_reason.split('signed');
      return (
        <>
          {activityMessage[0]}
          <span>signed</span>
          {activityMessage[1]}
        </>
      );
    }

    if (item.history_change_reason.includes('approved')) {
      activityMessage = item.history_change_reason.split('approved');
      logUser = activityMessage[0];
      if (activityMessage[1].includes('from')) {
        field = activityMessage[1].split('from')[0];
        oldValue = activityMessage[1].split('from')[1].split(' to ')[0];
        newValue = activityMessage[1]
          .split('from')[1]
          .split(' to ')[1]
          .split(', ,')[0];

        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>
              approved{' '}
              {activityMessage && activityMessage[1].split(' from ')[0]} from{' '}
            </span>{' '}
            {oldValue}
            <span> to </span> {newValue}
          </>
        );
      }
      return (
        <>
          {activityMessage[0]}
          <span>approved</span>
          {activityMessage[1]}
        </>
      );
    }

    if (item && item.history_change_reason.includes('updated')) {
      activityMessage = item.history_change_reason.split('updated');
      logUser = activityMessage[0];
      field = activityMessage[1].split('from')[0];
      oldValue = activityMessage[1].split('from')[1].split(' to ')[0];
      newValue = activityMessage[1]
        .split('from')[1]
        .split(' to ')[1]
        .split(', ,')[0];

      if (activityMessage.length > 2) {
        mixedLog = true;
        activityMessage.shift();
      }
      if (
        !mixedLog &&
        ((item && item.history_change_reason.includes('annual revenue')) ||
          (item &&
            item.history_change_reason.includes('number of employees')) ||
          (item && item.history_change_reason.includes('monthly retainer')) ||
          (item && item.history_change_reason.includes('sales threshold')) ||
          (item && item.history_change_reason.includes('fee')) ||
          (item && item.history_change_reason.includes('discount amount')) ||
          (item &&
            item.history_change_reason.includes('custom amazon store price')) ||
          (item && item.history_change_reason.includes('billing cap')))
      ) {
        let fromAmount = '';
        let toAmount = '';
        let rowAmount = [];
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[0] !== ''
        ) {
          rowAmount = activityMessage[1].split(' from ')[1].split(' to ')[0];
          if (rowAmount.split('.')[1] === '00') {
            fromAmount = rowAmount.split('.')[0];
          } else {
            fromAmount = rowAmount;
          }
        }
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[1] !== ''
        ) {
          rowAmount = activityMessage[1].split(' from ')[1].split(' to ')[1];
          if (rowAmount.split('.')[1] === '00') {
            toAmount = rowAmount.split('.')[0];
          } else {
            toAmount = rowAmount;
          }
        }
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>
              updated {activityMessage && activityMessage[1].split(' from ')[0]}{' '}
              from{' '}
            </span>{' '}
            {fromAmount === ''
              ? 'None'
              : fromAmount &&
                fromAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span> to </span>{' '}
            {toAmount === ''
              ? 'None'
              : toAmount &&
                toAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }

      return activityMessage && activityMessage[1].includes('addendum')
        ? item && item.history_change_reason
        : mixedLog
        ? displayMixedLog(logUser, activityMessage)
        : displayLog(logUser, field, oldValue, newValue);
    }
    if (item && item.history_change_reason.includes('requested for')) {
      activityMessage = item.history_change_reason.split('requested for');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>requested for</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    if (item && item.history_change_reason.includes('added')) {
      activityMessage = item.history_change_reason.split('added');
      let value;
      if (
        item &&
        item.history_change_reason.includes('Amazon Store Package Custom')
      ) {
        // activityMessage = item.history_change_reason.split('as')[1];
        value = activityMessage[1].split('as');
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>added</span>
            {value && value[0]}
            as
            {value &&
              value[1] &&
              value[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </>
        );
      }
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>added</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    if (item && item.history_change_reason.includes('removed')) {
      activityMessage = item.history_change_reason.split('removed');
      return (
        <>
          {activityMessage && activityMessage[0]}
          <span>removed</span>
          {activityMessage && activityMessage[1]}
        </>
      );
    }
    return item && item.history_change_reason ? item.history_change_reason : '';
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContractActivityLogInfo(currentPage);
  };

  const renderContractActivityPanel = () => {
    return (
      <>
        {agreementData &&
        agreementData.contract_status &&
        agreementData.contract_status.value ? (
          <div className={`contract-status ${getContractStatusData('class')}`}>
            <img
              width="16px"
              className="contract-file-icon"
              src={getContractStatusData('src')}
              alt=""
            />
            {_.startCase(getContractStatusData('status'))}
          </div>
        ) : null}
        <div className="activity-log">Contract Activity</div>
        {activityLoader === true || loader ? (
          <PageLoader component="activityLog" color="#FF5933" type="page" />
        ) : activityData && activityData.length !== 0 ? (
          <>
            {activityData.map((item) => (
              <ul className="menu">
                <li>
                  {(images &&
                    images.find(
                      (op) => op.entity_id === item.history_user_id,
                    ) &&
                    images.find((op) => op.entity_id === item.history_user_id)
                      .presigned_url) ||
                  (item.history_change_reason &&
                    item.history_change_reason.split(' ').slice(0, 2) &&
                    item.history_change_reason.split(' ').slice(0, 2)[0] ===
                      'System' &&
                    item.history_change_reason
                      .split(' ')
                      .slice(0, 2)[1]
                      .toLowerCase() === 'user') ||
                  (item && item.status !== undefined) ? (
                    <div
                      className={
                        item && item.status !== undefined
                          ? 'contract-email'
                          : ''
                      }>
                      <img
                        src={
                          item.history_change_reason.split(' ').slice(0, 2) &&
                          item.history_change_reason
                            .split(' ')
                            .slice(0, 2)[0] === 'System'
                            ? NextActivityLogo
                            : item && item.status !== undefined
                            ? ContractEmailIcon
                            : images.find(
                                (op) => op.entity_id === item.history_user_id,
                              ).presigned_url
                        }
                        className={
                          item && item.status !== undefined
                            ? 'default-user-activity contract-mail'
                            : 'default-user-activity '
                        }
                        alt="pic"
                      />
                    </div>
                  ) : (
                    <div className="avatarName float-left mr-3">
                      {getActivityInitials(item.history_change_reason)}
                    </div>
                  )}

                  <div className="activity-user">
                    {activityDetail(item)}
                    <div className="time-date mt-1">
                      {item && item.history_date ? item.history_date : ''}
                    </div>
                    {item && item.status ? (
                      <>
                        <Status
                          label={item.status}
                          backgroundColor={
                            item.status === 'delivered'
                              ? Theme.lightGreen
                              : item.status === 'processed'
                              ? Theme.lightYellow
                              : Theme.lightRed
                          }
                          pointColor={
                            item.status === 'delivered'
                              ? Theme.green
                              : item.status === 'processed'
                              ? Theme.yellow
                              : Theme.red
                          }
                        />
                        {item.status === 'delivered' ? (
                          <div className="email-clicks">
                            <span className="email-opens">
                              Opens: {item.opens || 0}
                            </span>{' '}
                            <span className="email-opens">
                              {' '}
                              Clicks: {item.clicks || 0}{' '}
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="clear-fix" />
                </li>
              </ul>
            ))}

            {activityCount > 10 ? (
              <Footer className="pdf-footer">
                <CommonPagination
                  count={activityCount}
                  pageNumber={pageNumber || 1}
                  handlePageChange={handlePageChange}
                  showLessItems
                />
              </Footer>
            ) : null}
          </>
        ) : isApicalled ? (
          <div className="ml-3 mt-3">No activity log found.</div>
        ) : null}
      </>
    );
  };

  return <div>{renderContractActivityPanel()}</div>;
}

export default ContractActivityLog;

ContractActivityLog.defaultProps = {
  activityLoader: false,
  activityData: [],
  images: [],
  activityCount: 0,
  pageNumber: 1,
  isApicalled: false,
  agreementData: {},
  setPageNumber: () => {},
  getContractActivityLogInfo: () => {},
  loader: false,
};

ContractActivityLog.propTypes = {
  activityLoader: PropTypes.bool,
  activityData: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.arrayOf(PropTypes.object),
  activityCount: PropTypes.number,
  pageNumber: PropTypes.number,
  isApicalled: PropTypes.bool,
  agreementData: PropTypes.shape({
    contract_status: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  }),
  setPageNumber: PropTypes.func,
  getContractActivityLogInfo: PropTypes.func,
  loader: PropTypes.bool,
};

const Footer = styled.div`
  border: 1px solid ${Theme.gray7};
  bottom: 80px;
  background: ${Theme.white};
  box-shadow: ${Theme.boxShadow};
  position: fixed;
  min-height: 60px;
  z-index: 2;
  width: 336px;

  @media only screen and (max-width: 991px) {
    width: 100%;
  }
  @media only screen and (min-width: 1500px) {
    width: 400px;
  }
`;
