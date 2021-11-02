/* eslint-disable react/no-danger */

import React from 'react';

export default function useActivityLog({ viewComponent }) {
  const displayMixedLog = (logUser, msg, header) => {
    return msg.map((item, index) => {
      if (index === 0 && header !== '') {
        return (
          <>
            {index === 0 ? logUser : ''}
            <span>updated </span> {header}
          </>
        );
      }
      const field = item && item.split('from')[0];

      let oldValue = item && item.split('from')[1].split(' to ')[0];
      let newValue =
        item &&
        item.split('from') &&
        item.split('from')[1] &&
        item.split('from')[1].split(' to ') &&
        item.split('from')[1].split(' to ')[1] &&
        item.split('from')[1].split(' to ')[1].split(', ,')[0];

      if (
        item.includes('annual revenue') ||
        item.includes('number of employees') ||
        item.includes('monthly retainer') ||
        item.includes('sales threshold') ||
        item.includes('fee') ||
        item.includes('discount amount') ||
        item.includes('billing cap')
        //  ||
        // item.includes('custom amazon store price')
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

  const activityDetail = (item, showAllActivity = false) => {
    let activityMessage = '';
    let logUser;
    let field;
    let oldValue;
    let newValue = '';
    let mixedLog = false;
    let customerSetupHeader = '';

    // For created new record by company name Activity
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

    // For deleted Activity
    if (item.history_change_reason.includes('deleted')) {
      activityMessage = item.history_change_reason.split('deleted');
      if (item.history_change_reason.includes('deleted note')) {
        return (
          <>
            {activityMessage[0]}
            <span>deleted</span>

            <span
              dangerouslySetInnerHTML={{
                __html:
                  viewComponent === 'activity' && showAllActivity
                    ? activityMessage &&
                      activityMessage.length &&
                      activityMessage[1]
                    : activityMessage &&
                      activityMessage.length &&
                      activityMessage[1] &&
                      activityMessage[1].slice(0, 80),
              }}
            />
            {/* {activityMessage[1]} */}
          </>
        );
      }
      return (
        <>
          {activityMessage[0]}
          <span>deleted</span>
          {activityMessage[1]}
        </>
      );
    }

    // For updated addendum Activity
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

    // For updated activity without brand profile activity
    if (
      item &&
      item.history_change_reason.includes('updated') &&
      !item.history_change_reason.includes('brand profile note')
    ) {
      activityMessage = item.history_change_reason.split('updated');
      const msg = activityMessage[0];
      logUser = msg;
      if (
        activityMessage[1] &&
        activityMessage[1].includes('Amazon account names and id')
      ) {
        const msg1 = activityMessage[1];
        customerSetupHeader = msg1;
        field = activityMessage[2] && activityMessage[2].split('from')[0];
        oldValue =
          activityMessage[2] &&
          activityMessage[2].split('from')[1].split(' to ')[0];
        newValue =
          activityMessage[2] &&
          activityMessage[2].split('from')[1].split(' to ')[1].split(', ,')[0];
      } else {
        field = activityMessage[1] && activityMessage[1].split('from')[0];
        oldValue =
          activityMessage[1] &&
          activityMessage[1].split('from')[1].split(' to ')[0];
        newValue =
          activityMessage[1] &&
          activityMessage[1].split('from') &&
          activityMessage[1].split('from')[1] &&
          activityMessage[1].split('from')[1].split(' to ') &&
          activityMessage[1].split('from')[1].split(' to ')[1] &&
          activityMessage[1].split('from')[1].split(' to ')[1].split(', ,')[0];
      }

      if (activityMessage && activityMessage.length > 2) {
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
          const temp = activityMessage[1].split(' from ')[1].split(' to ')[0];
          rowAmount = temp;
          if (rowAmount.split('.')[1] === '00') {
            const amt = rowAmount.split('.')[0];
            fromAmount = amt;
          } else {
            fromAmount = rowAmount;
          }
        }
        if (
          activityMessage &&
          activityMessage[1].split(' from ')[1].split(' to ')[1] !== ''
        ) {
          const temp = activityMessage[1].split(' from ')[1].split(' to ')[1];
          rowAmount = temp;
          if (rowAmount.split('.')[1] === '00') {
            const amt = rowAmount.split('.')[0];
            toAmount = amt;
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
        ? item.history_change_reason
        : mixedLog
        ? displayMixedLog(logUser, activityMessage, customerSetupHeader)
        : displayLog(logUser, field, oldValue, newValue);
    }

    // For updated activity without brand profile activity
    if (item && item.history_change_reason.includes('brand profile note')) {
      activityMessage = item.history_change_reason.includes('updated')
        ? item.history_change_reason.split('updated')
        : item.history_change_reason.split('created');
      return (
        <>
          {activityMessage && activityMessage[0]}
          {item.history_change_reason.includes('updated') ? (
            <span>updated</span>
          ) : (
            <span>created</span>
          )}
          {activityMessage && activityMessage[1]}
        </>
      );
    }

    // For requested Activity
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

    // For added Activity
    if (item && item.history_change_reason.includes('added')) {
      activityMessage = item.history_change_reason.split('added');
      let value;
      if (
        item &&
        item.history_change_reason.includes('Amazon Store Package Custom')
      ) {
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

    // For removed Activity
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
  return activityDetail;
}
