import React from 'react';

import Modal from 'react-modal';

import { bool, func, number, string } from 'prop-types';

// import { storeAllocatedBudget } from '../../../../api';
import { CloseIcon, LeftArrowIcon } from '../../../../theme/images';
import {
  ModalBox,
  Button,
  Table,
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
      <>
        <Table className="d-md-block d-none">
          <table style={{ borderCollapse: 'collapse' }} width="100%">
            <thead>
              <tr>
                <th className="product-header" width="30%">
                  Marketplace
                </th>
                <th className="product-header" width="25%">
                  From
                </th>
                <th className="product-header" width="25%">
                  To
                </th>
                <th className="product-header text-right" width="20%">
                  change
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  width="30%"
                  className="small-label-text light-font product-body">
                  US
                </td>
                <td
                  width="25%"
                  className=" small-label-text light-font product-body">
                  $14,000
                </td>
                <td
                  width="25%"
                  className=" small-label-text light-font product-body">
                  $6,000
                </td>
                <td
                  width="20%"
                  className=" small-label-text light-font product-body text-right">
                  $6,000
                </td>
              </tr>
              <tr>
                <td
                  width="30%"
                  className="small-label-text light-font product-body">
                  US
                </td>
                <td
                  width="25%"
                  className=" small-label-text light-font product-body">
                  $14,000
                </td>
                <td
                  width="25%"
                  className=" small-label-text light-font product-body">
                  $6,000
                </td>
                <td
                  width="20%"
                  className=" small-label-text light-font product-body text-right">
                  $6,000
                </td>
              </tr>
            </tbody>
          </table>
        </Table>
        <Table className="d-md-none d-block">
          <div className="row">
            <div className="col-12 mb-2">
              <div className="label">Marketplace</div>
              <div className="label-info"> US</div>
            </div>
            <div className="col-4">
              {' '}
              <div className="label"> From</div>
              <div className="label-info"> $6,000</div>
            </div>
            <div className="col-4">
              <div className="label"> To</div>
              <div className="label-info"> $6,000</div>
            </div>
            <div className="col-4">
              <div className="label"> change</div>
              <div className="label-info"> $6,000</div>
            </div>
          </div>
        </Table>
      </>
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
            <h4>
              <img
                className="modal-back-arrow"
                src={LeftArrowIcon}
                alt="close"
                onClick={() => {
                  onClick();
                }}
                role="presentation"
              />
              Allocate Balance
            </h4>
            <div className="body-content mt-2">
              <p className="normal-text-black mb-0">
                Please confirm you wish to make the following changes. A
                confirmation email will be sent to the BGS, BGS Manager, DSP Ad
                Manager
              </p>
              <div className="row">
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
