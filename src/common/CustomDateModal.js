import React from 'react';

import Modal from 'react-modal';
import { DateRange } from 'react-date-range';
import { enGB } from 'react-date-range/src/locale';
import { bool, func, shape, string, instanceOf, arrayOf } from 'prop-types';

import ModalBox from './ModalBox';
import Button from './Button';
import Theme from '../theme/Theme';
import { CloseIcon } from '../theme/images';

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
  id,
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
      id={id}
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
  id: '',
  isOpen: false,
  onClick: () => {},
  onChange: () => {},
  onApply: () => {},
  style: {},
  title: 'Select Date Range',
  range: [
    {
      startDate: todaysDate,
      endDate: todaysDate,
      key: 'adSelection',
    },
  ],
  currentDate: todaysDate,
};

CustomDateModal.propTypes = {
  id: string,
  onClick: func,
  onChange: func,
  onApply: func,
  isOpen: bool,
  style: shape({}),
  range: arrayOf(Array),
  title: string,
  currentDate: instanceOf(Date),
};
