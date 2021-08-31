import React from 'react';

import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { bool, func, object, oneOfType, shape, string } from 'prop-types';

import { CloseIcon } from '../theme/images';
import ModalBox from './ModalBox';
import Button from './Button';
import Theme from '../theme/Theme';

const todaysDate = new Date();
todaysDate.setDate(todaysDate.getDate() - 2);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '420px ',
    width: '100% ',
    minHeight: '390px',
    overlay: ' {zIndex: 1000}',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const CustomDateModal = ({
  isOpen,
  style,
  onClick,
  onChange,
  onApply,
  range,
  title,
  currentDate,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      style={{ ...customStyles, ...style }}
      ariaHideApp={false}
      contentLabel="Edit modal">
      <img
        src={CloseIcon}
        alt="close"
        className="float-right cursor cross-icon"
        onClick={onClick}
        role="presentation"
      />
      <ModalBox>
        <div className="modal-body">
          <h4>{title}</h4>
          <DateRange
            editableDateInputs
            onChange={onChange}
            showMonthAndYearPickers={false}
            ranges={range}
            moveRangeOnFirstSelection={false}
            showDateDisplay={false}
            maxDate={currentDate}
            rangeColors={[Theme.orange]}
            weekdayDisplayFormat="EEEEE"
            locale={enGB}
            {...props}
          />
          <div className="text-center mt-3">
            <Button
              onClick={onApply}
              type="button"
              className="btn-primary on-boarding   w-100">
              Apply
            </Button>
          </div>
        </div>
      </ModalBox>
    </Modal>
  );
};

export default CustomDateModal;

CustomDateModal.defaultProps = {
  isOpen: false,
  onClick: () => {},
  onChange: () => {},
  onApply: () => {},
  style: {},
  title: 'Select Date Range',
  range: {
    startDate: todaysDate,
    endDate: todaysDate,
  },
  currentDate: todaysDate,
};

CustomDateModal.propTypes = {
  onClick: func,
  onChange: func,
  onApply: func,
  isOpen: bool,
  style: shape({}),
  range: shape({
    startDate: oneOfType([Date, string, object]).isRequired,
    endDate: oneOfType([Date, string, object]).isRequired,
  }),
  title: string,
  currentDate: todaysDate,
};
