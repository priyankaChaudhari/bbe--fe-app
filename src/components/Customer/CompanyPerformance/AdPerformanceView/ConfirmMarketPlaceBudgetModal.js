import React from 'react';

import Modal from 'react-modal';

import { bool, func, number, string } from 'prop-types';
// import dayjs from 'dayjs';

// import { storeAllocatedBudget } from '../../../../api';
import { CloseIcon } from '../../../../theme/images';
import {
  ModalBox,
  Button,

  // PageLoader,
  AllocateBar,
} from '../../../../common';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '600px ',
    width: '100% ',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function ConfirmMarketPlaceBudgetModal({
  id,
  // customerId,
  // marketplace,
  escrowBalance,
  isOpen,
  onClick,
  // getActivityLogInfo,
}) {
  // const submitAllocatedBudget = useCallback(() => {
  //   setIsSubmitLoader(true);
  //   storeAllocatedBudget(allocatedMonths, customerId, marketplace).then(
  //     (res) => {
  //       if (res && res.status === 200) {
  //         onClick();
  //         getActivityLogInfo();
  //       }
  //       setIsSubmitLoader(false);
  //     },
  //   );
  // }, [onClick, customerId, marketplace, allocatedMonths, getActivityLogInfo]);
  const renderAllocatedBalanceTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Marketplace</th>
            <th>From</th>
            <th>To</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>US</td>
            <td>14000</td>
            <td>12000</td>
            <td>-2000</td>
          </tr>
          <tr>
            <td>UK</td>
            <td>6000</td>
            <td>8000</td>
            <td>+2000</td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <>
      <Modal
        id={id}
        isOpen={isOpen}
        style={{ ...customStyles }}
        ariaHideApp={false}
        contentLabel="Edit modal">
        <img
          src={CloseIcon}
          alt="close"
          className="float-right cursor cross-icon"
          onClick={() => {
            onClick();
          }}
          role="presentation"
        />

        <ModalBox>
          <div className="modal-body  pb-0">
            <h4>Allocate Balance</h4>
            <div className="body-content">
              <div className="row">
                <div className="col-12">
                  Please confirm you wish to make the following changes. A
                  confirmation email will be sent to the BGS, BGS Manager, DSP
                  Ad Manager
                </div>
                <div className="col-12">
                  <AllocateBar
                    id="BT-escrowBalance-budgetAllocaion"
                    className="mt-3 mb-3">
                    <div className="remaing-label text-bold text-right">
                      Total Escrow Balance: {escrowBalance}
                    </div>
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
                <div className="col-12">{renderAllocatedBalanceTable()}</div>
              </div>
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button className="btn-primary on-boarding  w-100" type="button">
                Confirm
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>{' '}
    </>
  );
}

ConfirmMarketPlaceBudgetModal.defaultProps = {
  id: '',
  // customerId: '',
  // marketplace: '',
  isOpen: false,
  escrowBalance: number,
  onClick: () => {},
  // getActivityLogInfo: () => {},
};

ConfirmMarketPlaceBudgetModal.propTypes = {
  id: string,
  // customerId: string,
  // marketplace: string,
  isOpen: bool,
  escrowBalance: number,
  onClick: func,
  // getActivityLogInfo: func,
};
