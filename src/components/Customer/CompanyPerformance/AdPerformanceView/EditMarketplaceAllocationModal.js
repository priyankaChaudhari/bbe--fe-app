import React, { useState } from 'react';

import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { bool, func, shape, string } from 'prop-types';
// import dayjs from 'dayjs';

// import { storeAllocatedBudget } from '../../../../api';
import ConfirmMarketPlaceBudgetModal from './ConfirmMarketPlaceBudgetModal';
import {
  CloseIcon,
  InfoRedIcon,
  LeftArrowIcon,
} from '../../../../theme/images';
import {
  ModalBox,
  Button,
  InputFormField,
  // PageLoader,
  AllocateBar,
  ErrorMsgBox,
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

function EditMarketplaceAllocationModal({
  id,
  customerId,
  marketplace,
  dspData,
  isOpen,
  addThousandSeperator,
  onClick,
  getActivityLogInfo,
}) {
  const currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setHours(currentDate.getHours() + 12);

  const dspPacing = dspData?.dsp_pacing;
  const escrowBalance = dspPacing?.escrow_converted_usd
    ? dspPacing?.escrow_converted_usd
    : 0;
  // const actualAllocatedMonths = dspPacing?.allocated_balance.length
  //   ? dspPacing?.allocated_balance
  //   : [
  //       {
  //         month_year: dayjs(currentDate).format('YYYY-MM-DD'),
  //         escrow_allocated_converted_usd: escrowBalance,
  //       },
  //     ];
  // const [isSubmitLoader, setIsSubmitLoader] = useState(false);
  // const [allocatedMonths, setAllocatedMonths] = useState(actualAllocatedMonths);
  const [isEscrowbalanceExceed, setIsEscrowbalanceExceed] = useState(
    escrowBalance < 0,
  );
  const [allocatedMarketplaceBudget, setAllocatedMarketPlaceBudget] = useState([
    { marketplace: 'US', escrow_allocated_converted_usd: '4000' },
    { marketplace: 'UK', escrow_allocated_converted_usd: '3000' },
    { marketplace: 'AUS', escrow_allocated_converted_usd: '2000' },
    { marketplace: 'Spain', escrow_allocated_converted_usd: '3000' },
    { marketplace: 'Germany', escrow_allocated_converted_usd: '3000' },
  ]);
  const [
    confirmMarketplaceBudgetModal,
    setConfirmMarketplaceBudgetModal,
  ] = useState(false);
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
  const renderConfirmMarketPlacebudgetModal = () => {
    return (
      <ConfirmMarketPlaceBudgetModal
        id="confirm-marketplace-budget"
        customerId={customerId}
        marketplace={marketplace}
        isOpen={confirmMarketplaceBudgetModal}
        addThousandSeperator={addThousandSeperator}
        escrowBalance={escrowBalance}
        allocatedMarketplaceBudget={allocatedMarketplaceBudget}
        // isEscrowbalanceExceed={isEscrowbalanceExceed}
        // isSubmitLoader={isSubmitLoader}
        onClick={() => {
          setConfirmMarketplaceBudgetModal(false);
        }}
        getActivityLogInfo={getActivityLogInfo}
      />
    );
  };
  const handleOnChange = (event) => {
    setAllocatedMarketPlaceBudget({ event });
    setIsEscrowbalanceExceed(false);
    // setIsSubmitLoader(true);
  };

  const renderMarketplace = () => {
    return allocatedMarketplaceBudget.map((item, index) => {
      return (
        <React.Fragment key={item.marketplace}>
          <div className="col-2 mt-4 pt-2">
            {' '}
            <p className="m-0 gray-normal-text">{item.marketplace}</p>
          </div>
          <div className="col-10  mb-3">
            <InputFormField id="BT-escrow-numberFormat-budgetAllocaion">
              <label htmlFor="amount"> amount </label>
              <div className="input-container ">
                <span className="input-icon">$</span>
                <NumberFormat
                  className="form-control"
                  name={item.marketplace}
                  defaultValue={item.escrow_allocated_converted_usd}
                  value={item.escrow_allocated_converted_usd}
                  placeholder={item.escrow_allocated_converted_usd}
                  onChange={(event) => handleOnChange(event, index)}
                  thousandSeparator
                  decimalScale={2}
                  allowNegative={!index}
                />
              </div>
            </InputFormField>
          </div>{' '}
          {isEscrowbalanceExceed ? (
            <ErrorMsgBox className="mt-2">
              <img className="info-icon" src={InfoRedIcon} alt="info" /> All
              budgets across the selected months need to add up to the available
              escrow balance
            </ErrorMsgBox>
          ) : null}
        </React.Fragment>
      );
    });
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
              {' '}
              <img
                className="modal-back-arrow "
                src={LeftArrowIcon}
                alt="close"
                onClick={() => {
                  onClick();
                }}
                role="presentation"
              />
              Marketplace Allocation
            </h4>
            <div className="body-content mt-2">
              <div className="row">
                <div className="col-12 mb-2">
                  <AllocateBar
                    id="BT-escrowBalance-budgetAllocaion"
                    className="mt-3 mb-3">
                    {' '}
                    <div className="remaing-label text-bold text-right">
                      Total Escrow Balance:{' '}
                      {addThousandSeperator(escrowBalance, 'currency')}
                    </div>{' '}
                    <div className="clear-fix" />
                  </AllocateBar>
                </div>
                {renderMarketplace()}
              </div>
              {isEscrowbalanceExceed ? (
                <ErrorMsgBox className="mt-2">
                  <img className="info-icon" src={InfoRedIcon} alt="info" /> All
                  budgets across the selected months need to add up to the
                  available escrow balance
                </ErrorMsgBox>
              ) : null}
            </div>
          </div>
          <div className="footer-line" />
          <div className="modal-footer">
            <div className="text-center ">
              <Button
                className={
                  isEscrowbalanceExceed
                    ? 'btn-primary on-boarding  w-100 disabled'
                    : 'btn-primary on-boarding  w-100'
                }
                onClick={() => setConfirmMarketplaceBudgetModal(true)}
                type="button">
                Continue
              </Button>
            </div>
          </div>
        </ModalBox>
      </Modal>
      {renderConfirmMarketPlacebudgetModal()}
    </>
  );
}

EditMarketplaceAllocationModal.defaultProps = {
  id: '',
  customerId: '',
  marketplace: '',
  isOpen: false,
  dspData: {},
  onClick: () => {},
  addThousandSeperator: () => {},
  getActivityLogInfo: () => {},
};

EditMarketplaceAllocationModal.propTypes = {
  id: string,
  customerId: string,
  marketplace: string,
  isOpen: bool,
  dspData: shape({}),
  onClick: func,
  addThousandSeperator: func,
  getActivityLogInfo: func,
};

export default EditMarketplaceAllocationModal;
