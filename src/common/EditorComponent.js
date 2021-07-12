import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js';
import Theme from '../theme/Theme';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function EditorComponent({ setData, data }) {
  const [editorState, setEditorState] = useState(null);
  const [contentState, setContentState] = useState(null);
  const maxLength = 2000;

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

  const handlePastedText = (input) => {
    const inputLength = editorState.getCurrentContent().getPlainText().length;
    const remainingLength = maxLength - inputLength;
    if (input.length + inputLength >= maxLength) {
      const newContent = Modifier.insertText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        input.slice(0, remainingLength),
      );
      onEditorStateChange(
        EditorState.push(editorState, newContent, 'insert-characters'),
      );
      return true;
    }
    return false;
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
          handleBeforeInput={(val) => {
            const textLength = editorState.getCurrentContent().getPlainText()
              .length;
            if (val && textLength >= maxLength) {
              return 'handled';
            }
            return 'not-handled';
          }}
          handlePastedText={handlePastedText}
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
  .DraftEditor-editorContainer {
    line-height: 18px;
  }
  .rdw-editor-wrapper {
    border-radius: 4px;
  }
  .rdw-link-modal {
    min-height: 250px !important;
  }

  .rdw-embedded-modal {
    min-height: 250px !important;
  }
  .rdw-link-decorator-icon {
    left: auto;
    margin-left: 2px;
  }

  .rdw-editor-main {
    border: none;
    background: ${Theme.gray8};
    border: 1px solid ${Theme.gray45};
    padding: 8px 0;
    min-height: 150px;
    margin: 0 5px;

    span {
      color: inherit;
      font-size: ${Theme.extraNormal};
      font-weight: unset;
    }
  }

  .rdw-editor-toolbar {
    border: none;
    padding: 0;
  }
`;
