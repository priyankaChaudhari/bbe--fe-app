import React from 'react';

import { toast } from 'react-toastify';
import { func, shape } from 'prop-types';

import { ErrorMsg } from '../../../common';
import { sendReminderOfContract } from '../../../api';

function SendReminder({
  transactionalData,
  reminderError,
  renderbuttonHtml,
  setIsLoading,
  setShowModal,
  removeParams,
  setReminderErrors,
  agreementData,
}) {
  const sendReminder = () => {
    setIsLoading({ loader: true, type: 'button' });
    sendReminderOfContract({
      contract_id: agreementData?.id,
    }).then((res) => {
      setIsLoading({ loader: false, type: 'button' });
      if (res?.status === 200) {
        setShowModal(false);
        removeParams('step');
        toast.success('Reminder sent successfully!');
      }
      if (res?.status === 400) {
        setReminderErrors(res?.data);
      }
    });
  };

  return (
    <>
      <div className="modal-body on-boarding">
        <h4 className="on-boarding mb-4">Send Reminder</h4>

        <div className="row">
          <div className="col-12">
            <div className="signature-request">
              TO:
              <span className="email-address">
                {transactionalData?.primary_email}
              </span>
            </div>
            <ErrorMsg>{reminderError?.Contact} </ErrorMsg>
          </div>
        </div>
        <div className=" mt-4">
          {renderbuttonHtml(false, () => sendReminder(), 'Send Reminder')}
        </div>
      </div>
    </>
  );
}

export default SendReminder;

SendReminder.defaultProps = {
  transactionalData: {},
  reminderError: {},
  renderbuttonHtml: () => {},
  setIsLoading: () => {},
  setShowModal: () => {},
  removeParams: () => {},
  setReminderErrors: () => {},
  agreementData: {},
};
SendReminder.propTypes = {
  transactionalData: shape({}),
  reminderError: shape({}),
  renderbuttonHtml: func,
  setIsLoading: func,
  setShowModal: func,
  removeParams: func,
  setReminderErrors: func,
  agreementData: shape({}),
};
