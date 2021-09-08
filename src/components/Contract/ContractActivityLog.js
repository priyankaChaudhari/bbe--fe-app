import React from 'react';

import { useSelector } from 'react-redux';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
} from 'prop-types';

import PageLoader from '../../common/PageLoader';
import Theme from '../../theme/Theme';
import { ContractActivityLogFooter } from '../../theme/AgreementStyle';
import { CommonPagination, Status } from '../../common';
import {
  FileIcon,
  CheckFileIcon,
  EditFileIcon,
  SignatureIcon,
  NextActivityLogo,
  ContractEmailIcon,
} from '../../theme/images';

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
  checkContractStatus,
}) {
  const loggedInuserInfo = useSelector((state) => state.userState.userInfo);
  const contractStatusValue = agreementData?.contract_status?.value;
  const displayNumber = (num) => {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return res;
  };

  const getContractStatusData = (type) => {
    const status = contractStatusValue || '';
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
        oldValue = displayNumber(oldValue && oldValue);
        newValue = displayNumber(newValue && newValue);
      }
      return (
        <React.Fragment key={Math.random()}>
          {index === 0 ? logUser : ''}
          <span>updated {field || ''} from </span> {oldValue || ''}
          <span> to </span> {newValue === '' ? 'None' : newValue}
        </React.Fragment>
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
  const renderHistoryChangeLog = (activityMessage, changeReason) => {
    return (
      <>
        {activityMessage && activityMessage[0]}
        <span>{changeReason}</span>
        {activityMessage && activityMessage[1]}
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
    const historyChangeReason = item?.history_change_reason;

    if (historyChangeReason.includes('created new record by company name')) {
      activityMessage = historyChangeReason.split(
        'created new record by company name',
      );
      return (
        <>
          {renderHistoryChangeLog(
            activityMessage,
            'created new record by company name',
          )}
        </>
      );
    }
    if (historyChangeReason.includes('deleted')) {
      activityMessage = historyChangeReason.split('deleted');
      return <>{renderHistoryChangeLog(activityMessage, 'deleted')}</>;
    }
    if (historyChangeReason.includes('updated addendum')) {
      activityMessage = historyChangeReason.split('updated addendum');
      return (
        <>
          {activityMessage[0]}
          <span>updated </span>
          addendum
        </>
      );
    }
    if (historyChangeReason.includes('resumed')) {
      activityMessage = historyChangeReason.split('resumed');
      return <>{renderHistoryChangeLog(activityMessage, 'resumed')}</>;
    }
    if (historyChangeReason.includes('approved and sent')) {
      activityMessage = historyChangeReason.split('approved and sent');
      return (
        <>{renderHistoryChangeLog(activityMessage, 'approved and sent')}</>
      );
    }
    if (historyChangeReason.includes('sent')) {
      activityMessage = historyChangeReason.split('sent');
      return <>{renderHistoryChangeLog(activityMessage, 'sent')}</>;
    }
    if (historyChangeReason.includes('signed')) {
      activityMessage = historyChangeReason.split('signed');
      return <>{renderHistoryChangeLog(activityMessage, 'signed')}</>;
    }
    if (historyChangeReason.includes('approved')) {
      activityMessage = historyChangeReason.split('approved');

      const [activityUser, message] = activityMessage;
      logUser = activityUser;

      if (message.includes('from')) {
        const splittedMessage = message.split('from');
        const [fieldLog, remainingMessage] = splittedMessage;

        const splittedRemainingMessage = remainingMessage.split(' to ');
        const [oldVal, subRemainingMessage] = splittedRemainingMessage;

        field = fieldLog;
        oldValue = oldVal;
        newValue = subRemainingMessage;
        return (
          <>
            {logUser}
            <span>approved {field} from</span> {oldValue} <span> to </span>
            {newValue}
          </>
        );
      }
      return <>{renderHistoryChangeLog(activityMessage, 'approved')}</>;
    }

    if (item && historyChangeReason.includes('updated')) {
      activityMessage = historyChangeReason.split('updated');

      const [activityUser, message] = activityMessage;

      const splittedMessage = message.split('from');
      const [fieldLabel, remainingMessage] = splittedMessage;

      const splittedRemainingMessage = remainingMessage.split(' to ');
      const [oldVal, subRemainingMessage] = splittedRemainingMessage;

      const splittedSubRemainingMessage = subRemainingMessage.split(', ,');
      const [newVal] = splittedSubRemainingMessage;

      logUser = activityUser;
      field = fieldLabel;
      oldValue = oldVal;
      newValue = newVal;

      if (activityMessage.length > 2) {
        mixedLog = true;
        activityMessage.shift();
      }
      if (
        !mixedLog &&
        (historyChangeReason.includes('annual revenue') ||
          historyChangeReason.includes('number of employees') ||
          historyChangeReason.includes('monthly retainer') ||
          historyChangeReason.includes('sales threshold') ||
          historyChangeReason.includes('fee') ||
          historyChangeReason.includes('discount amount') ||
          historyChangeReason.includes('custom amazon store price') ||
          historyChangeReason.includes('billing cap'))
      ) {
        let fromAmount = '';
        let toAmount = '';
        let rowAmount = [];

        if (oldValue !== '') {
          rowAmount = oldValue;
          const splittedRowAmount = rowAmount.split('.');
          const [fromAmt, remainingRowAmount] = splittedRowAmount;
          if (remainingRowAmount === '00') {
            fromAmount = fromAmt;
          } else {
            fromAmount = rowAmount;
          }
        }

        if (subRemainingMessage !== '') {
          rowAmount = subRemainingMessage;
          const splittedRowAmount = rowAmount.split('.');
          const [toAmt, remainingRowAmount] = splittedRowAmount;
          if (remainingRowAmount === '00') {
            toAmount = toAmt;
          } else {
            toAmount = rowAmount;
          }
        }

        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>
              updated {activityMessage && activityMessage[1].split(' from ')[0]}
              from
            </span>
            {fromAmount === ''
              ? 'None'
              : displayNumber(fromAmount && fromAmount)}
            <span> to </span>
            {toAmount === '' ? 'None' : displayNumber(toAmount && toAmount)}
          </>
        );
      }

      return activityMessage && activityMessage[1].includes('addendum')
        ? historyChangeReason
        : mixedLog
        ? displayMixedLog(logUser, activityMessage)
        : displayLog(logUser, field, oldValue, newValue);
    }
    if (historyChangeReason.includes('requested for')) {
      activityMessage = historyChangeReason.split('requested for');
      return <>{renderHistoryChangeLog(activityMessage, 'requested for')}</>;
    }

    if (historyChangeReason.includes('added')) {
      activityMessage = historyChangeReason.split('added');
      let value;
      if (item && historyChangeReason.includes('Amazon Store Package Custom')) {
        // activityMessage = historyChangeReason.split('as')[1];
        value = activityMessage[1].split('as');
        return (
          <>
            {activityMessage && activityMessage[0]}
            <span>added</span>
            {value && value[0]}
            as
            {displayNumber(value && value[1] && value[1])}
          </>
        );
      }
      return <>{renderHistoryChangeLog(activityMessage, 'added')}</>;
    }
    if (item && historyChangeReason.includes('removed')) {
      activityMessage = historyChangeReason.split('removed');
      return <>{renderHistoryChangeLog(activityMessage, 'removed')}</>;
    }
    return item && historyChangeReason ? historyChangeReason : '';
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContractActivityLogInfo(currentPage);
  };

  const renderContractActivityPanel = () => {
    return (
      <>
        {contractStatusValue ? (
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
              <ul key={Math.random()} className="menu">
                <li key={Math.random()}>
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
                            </span>
                            <span className="email-opens">
                              Clicks: {item.clicks || 0}
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
              <ContractActivityLogFooter
                className="pdf-footer"
                bottom={
                  checkContractStatus()
                    ? (contractStatusValue === 'pending for cancellation' ||
                        contractStatusValue === 'active pending for pause') &&
                      loggedInuserInfo?.role === 'BGS Manager'
                      ? '80px'
                      : '0px'
                    : '80px'
                }>
                <CommonPagination
                  count={activityCount}
                  pageNumber={pageNumber || 1}
                  handlePageChange={handlePageChange}
                  showLessItems
                />
              </ContractActivityLogFooter>
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
  checkContractStatus: () => {},
};

ContractActivityLog.propTypes = {
  activityLoader: bool,
  activityData: arrayOf(shape({})),
  images: arrayOf(shape({})),
  activityCount: oneOfType([arrayOf(shape({})), number]),
  pageNumber: number,
  isApicalled: bool,
  agreementData: shape({
    contract_status: shape({
      value: string,
      label: string,
    }),
  }),
  setPageNumber: func,
  getContractActivityLogInfo: func,
  loader: bool,
  checkContractStatus: func,
};
