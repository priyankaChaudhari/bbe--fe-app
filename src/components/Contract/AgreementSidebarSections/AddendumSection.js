import React from 'react';

import { Collapse } from 'react-collapse';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  shape,
  object,
  objectOf,
} from 'prop-types';

import { CreateAddendum, EditFileIcons } from '../../../theme/images';
import { CheckBox, Button } from '../../../common';

function AddendumSection({
  showSection,
  executeScroll,
  setOpenCollapse,
  openCollapse,
  loader,
  newAddendumData,
  onEditAddendum,
  showEditor,
  setShowEditor,
  setNewAddendum,
  nextStep,
  setShowCollpase,
  setUpdatedFormData,
  showFooter,
  updatedFormData,
  originalAddendumData,
}) {
  const onCheckOfAddendum = (flag) => {
    setShowCollpase({
      ...showSection,
      addendum: flag,
    });
    setShowEditor(false);
    if (!flag) {
      if (newAddendumData.addendum && newAddendumData.addendum.length > 7) {
        setNewAddendum({ ...newAddendumData, addendum: '<p></p>' });
        setUpdatedFormData({ ...updatedFormData, addendum: '<p></p>' });
        showFooter(true);
      }
    } else if (Object.keys(updatedFormData).length) {
      showFooter(true);
    } else {
      showFooter(false);
      delete updatedFormData.addendum;
      setNewAddendum(originalAddendumData);
    }
    // }
  };

  const displayAddendum = () => {
    return newAddendumData && newAddendumData.id ? (
      <Button
        className=" btn-transparent sidepanel mt-3 mb-3 w-100"
        onClick={() => {
          onEditAddendum();
          executeScroll('addendum');
        }}>
        <img
          className="edit-folder-icon mr-2"
          src={EditFileIcons}
          alt="edit "
        />
        Edit Addendum
      </Button>
    ) : !showEditor &&
      !(newAddendumData && Object.keys(newAddendumData).length) ? (
      <Button
        className=" sidepanel btn-transparent create-addendum mt-1 mb-3 w-100"
        onClick={() => {
          onEditAddendum();
          executeScroll('addendum');
        }}>
        Create Addendum
      </Button>
    ) : (
      <>
        <Button
          className={
            (newAddendumData && !Object.keys(newAddendumData).length) ||
            (newAddendumData &&
              newAddendumData.addendum &&
              newAddendumData.addendum.startsWith('<p></p>'))
              ? ' btn-gray sidepanel on-boarding mt-1 mb-3 w-100 disabled'
              : 'btn-primary sidepanel on-boarding mt-1 mb-3 w-100  '
          }
          onClick={() => nextStep('final')}>
          Save Addendum
        </Button>
        <Button
          className="btn-transparent sidepanel on-boarding mt-1 mb-3 w-100"
          onClick={() => {
            setShowEditor(false);
            setNewAddendum({});
          }}>
          Cancel
        </Button>
      </>
    );
  };

  return (
    <div>
      <div
        className={
          showSection && showSection.addendum
            ? 'collapse-btn '
            : 'collapse-btn '
        }
        role="presentation"
        type="button"
        onClick={() => {
          if (showSection && showSection.addendum) {
            executeScroll('addendum');
          }
          setOpenCollapse({ addendum: !openCollapse.addendum });
        }}>
        <img className="service-agre" src={CreateAddendum} alt="pdf" />
        <h4 className="sendar-details ">Addendum </h4>
        <div className="clear-fix" />
      </div>
      <Collapse isOpened={openCollapse.addendum}>
        {loader ? null : (
          <ul className="collapse-inner">
            <li>
              <p className="small-para  mt-0">
                [Optional] Use this to modify, clarify, or nullify a portion of
                the original agreement.
              </p>

              <CheckBox>
                <label
                  className="check-container customer-pannel"
                  htmlFor="add-addendum">
                  Add Addendum
                  <input
                    type="checkbox"
                    id="add-addendum"
                    onClick={(event) => {
                      onCheckOfAddendum(event.target.checked);
                    }}
                    checked={showSection && showSection.addendum}
                  />
                  <span className="checkmark" />
                </label>
              </CheckBox>
              {showSection && showSection.addendum ? displayAddendum() : ''}
            </li>
          </ul>
        )}
      </Collapse>
    </div>
  );
}

export default AddendumSection;

AddendumSection.defaultProps = {
  showSection: {},
  executeScroll: () => {},
  setOpenCollapse: () => {},
  openCollapse: {},
  loader: false,
  newAddendumData: {},
  onEditAddendum: () => {},
  showEditor: false,
  setShowEditor: () => {},
  setNewAddendum: () => {},
  nextStep: () => {},
  setShowCollpase: () => {},
  setUpdatedFormData: () => {},
  showFooter: () => {},
  updatedFormData: {},
  originalAddendumData: {},
};

AddendumSection.propTypes = {
  showSection: shape({
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  executeScroll: func,
  setOpenCollapse: func,
  openCollapse: shape({
    agreement: bool,
    statement: bool,
    addendum: bool,
    dspAddendum: bool,
    amendment: bool,
  }),
  loader: bool,
  newAddendumData: oneOfType([
    number,
    objectOf(object),
    shape({
      id: string,
      addendum: string,
    }),
  ]),
  onEditAddendum: func,
  showEditor: bool,
  setShowEditor: func,
  setNewAddendum: func,
  nextStep: func,
  setShowCollpase: func,
  setUpdatedFormData: func,
  showFooter: func,
  updatedFormData: shape({}),
  originalAddendumData: oneOfType([
    number,
    objectOf(object),
    shape({
      id: string,
    }),
  ]),
};
