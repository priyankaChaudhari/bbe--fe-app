import React from 'react';

import Modal from 'react-modal';
import { func, shape, bool, string } from 'prop-types';
import Notes from '../Notes';

export default function NotesModal({
  id,
  showNotesModal,
  setShowNotesModal,
  setNewNoteEditor,
  showNewNoteEditor,
}) {
  const customStyles = {
    content: {
      top: '50%',
      right: '0px',
      bottom: 'auto',
      maxWidth: '600px ',
      width: '100% ',
      maxHeight: '100%',
      overlay: ' {zIndex: 1000}',
      inset: '0% 0% 0% auto',
      marginRight: '0',
      borderRadius: '0px !important',
    },
  };

  return (
    <Modal
      isOpen={showNotesModal.modal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Add team modal">
      <Notes
        setShowNotesModal={setShowNotesModal}
        customerId={id}
        setNewNoteEditor={setNewNoteEditor}
        showNewNoteEditor={showNewNoteEditor}
        showNotesModal={showNotesModal}
      />
    </Modal>
  );
}

NotesModal.defaultProps = {
  setNewNoteEditor: () => {},
  setShowNotesModal: () => {},
};

NotesModal.propTypes = {
  showNotesModal: shape({
    modal: bool,
  }).isRequired,
  id: string.isRequired,
  setNewNoteEditor: func,
  setShowNotesModal: func,
  showNewNoteEditor: bool.isRequired,
};
