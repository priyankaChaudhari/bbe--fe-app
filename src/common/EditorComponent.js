import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import Theme from '../theme/Theme';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function EditorComponent({ setData, data }) {
  const [editorState, setEditorState] = useState(null);
  const [contentState, setContentState] = useState(null);

  useEffect(() => {
    let contentBlock;

    if (data) {
      contentBlock = htmlToDraft(data);
    } else {
      contentBlock = htmlToDraft('<p></p>');
    }
    const content = ContentState.createFromBlockArray(
      contentBlock.contentBlocks,
    );
    setEditorState(EditorState.createWithContent(content));
    setContentState(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEditorStateChange = (editorData) => {
    setEditorState(editorData);
    const content = editorData.getCurrentContent();
    const info = draftToHtml(convertToRaw(content));
    setData(info);
  };

  const displayEditor = () => {
    return (
      <EditorToll>
        <Editor
          editorState={editorState}
          contentState={contentState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          stripPastedStyles
          placeholder="   Enter note"
          toolbar={{
            options: [
              'inline',
              'blockType',
              'fontSize',
              'fontFamily',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'remove',
              'history',
            ],
            fontFamily: {
              options: [
                'Arial',
                'Georgia',
                'Impact',
                'Tahoma',
                'Times New Roman',
                'Verdana',
                'Open Sans',
                'Helvetica-Regular',
              ],
            },
          }}
        />
      </EditorToll>
    );
  };

  return <div>{displayEditor()}</div>;
}

export default EditorComponent;
EditorComponent.defaultProps = {
  setData: () => {},
  data: '',
};

EditorComponent.propTypes = {
  setData: PropTypes.func,
  data: PropTypes.string,
};

export const EditorToll = styled.div`
  .rdw-editor-wrapper {
    border: 1px solid #f1f1f1;
    border-radius: 4px;
  }
  .rdw-link-modal {
    min-height: 250px !important;
  }

  .rdw-embedded-modal {
    min-height: 250px !important;
  }

  .rdw-editor-main {
    border: none;
    background: ${Theme['$base-03']};
  }

  .rdw-editor-toolbar {
    border: none;
  }
`;
