import React from 'react';

import { Collapse } from 'react-collapse';
import { bool, number, func, arrayOf, shape } from 'prop-types';

import { Advertise } from '../../../theme/images';
import { DSPAddendumDetails } from '../../../constants';
import { Button, InputFormField } from '../../../common';

function DspAdvertising({
  executeScroll,
  loader,
  showSection,
  setOpenCollapse,
  openCollapse,
  dspErrCount,
  renderCollapseBtnErrorHtml,
  showRightTick,
  generateHTML,
  displayError,
  formData,
  nextStep,
}) {
  const contractType = formData?.contract_type;

  return loader ? null : contractType?.toLowerCase()?.includes('dsp') ||
    (showSection?.dspAddendum &&
      !contractType?.toLowerCase()?.includes('one')) ? (
    <>
      <div className="straight-line sidepanel " />

      <div
        className="collapse-btn "
        role="presentation"
        type="button"
        onClick={() => {
          executeScroll('dspAddendum');
          setOpenCollapse({
            dspAddendum: !openCollapse.dspAddendum,
          });
        }}>
        <img className="service-agre" src={Advertise} alt="pdf" />
        <h4
          className={
            dspErrCount ? 'sendar-details error-container ' : 'sendar-details'
          }>
          DSP Advertising
          {renderCollapseBtnErrorHtml(
            false,
            dspErrCount,
            openCollapse.dspAddendum,
            'dspAddendum',
          )}
        </h4>
        <div className="clear-fix" />
      </div>

      <Collapse isOpened={openCollapse.dspAddendum}>
        <ul className="collapse-inner">
          {DSPAddendumDetails.map((item) =>
            item.key === 'dsp_length' && contractType === 'dsp only' ? null : (
              <li key={item.key}>
                <InputFormField>
                  <label htmlFor={item.key}>{item.label}</label>
                  {generateHTML(item)}
                  {displayError(item)}
                </InputFormField>
                <p className="m-0  pt-1 small-para">
                  {item.info ? item.info : ''}
                </p>
              </li>
            ),
          )}
          <li>
            <Button
              className={
                formData.additional_one_time_services
                  ? 'btn-primary btn-next-section sidepanel mt-1 mb-3 w-100 '
                  : 'btn-primary btn-next-section  mt-1 mb-3 w-100 '
              }
              disabled={!showRightTick('dspAddendum')}
              onClick={() => nextStep('addendum')}>
              Proceed to Next Section
            </Button>
          </li>
        </ul>
      </Collapse>
    </>
  ) : (
    ''
  );
}

export default DspAdvertising;

DspAdvertising.defaultProps = {
  executeScroll: () => {},
  loader: false,
  showSection: {},
  setOpenCollapse: () => {},
  openCollapse: {},
  dspErrCount: 0,
  renderCollapseBtnErrorHtml: () => {},
  showRightTick: () => {},
  generateHTML: () => {},
  displayError: () => {},
  formData: {},
  nextStep: () => {},
};
DspAdvertising.propTypes = {
  executeScroll: func,
  loader: bool,
  showSection: shape({
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  setOpenCollapse: func,
  openCollapse: shape({
    agreement: bool,
    statement: bool,
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  dspErrCount: number,
  renderCollapseBtnErrorHtml: func,
  showRightTick: func,
  generateHTML: func,
  displayError: func,
  formData: shape({
    additional_one_time_services: arrayOf(shape({})),
  }),
  nextStep: func,
};
