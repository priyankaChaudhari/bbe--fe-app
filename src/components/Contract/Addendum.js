/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */

import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  string,
  bool,
  number,
  func,
  oneOfType,
  arrayOf,
  shape,
  object,
} from 'prop-types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { AddendumParagraph, EditorToll } from '../../theme/AgreementStyle';

export default function Addendum({
  formData,
  templateData,
  newAddendumData,
  setNewAddendum,
  showEditor,
  setUpdatedFormData,
  updatedFormData,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const [editorState, setEditorState] = useState(null);
  const [contentState, setContentState] = useState(null);

  useEffect(() => {
    if (editorState === null) {
      let contentBlock;

      if (newAddendumData && newAddendumData.addendum) {
        contentBlock = htmlToDraft(newAddendumData.addendum);
      } else {
        contentBlock = htmlToDraft('<p></p>');
      }
      const content = ContentState.createFromBlockArray(
        contentBlock.contentBlocks,
      );
      setEditorState(EditorState.createWithContent(content));
      setContentState(newAddendumData);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (newAddendumData && !Object.keys(newAddendumData).length) {
      setEditorState(EditorState.createEmpty());
    }
  }, [newAddendumData]);

  const onEditorStateChange = (editorData) => {
    setEditorState(editorData);
    const content = editorData.getCurrentContent();
    const info = draftToHtml(convertToRaw(content));
    const updatedAddendumm = { ...newAddendumData, addendum: info };
    setNewAddendum(updatedAddendumm);
    setUpdatedFormData({ ...updatedFormData, addendum: info });
  };

  const mapDefaultValues = (key) => {
    if (key === 'company_name') {
      return formData?.customer_id[key]
        ? formData?.customer_id[key]
        : `Client Name`;
    }
    if (key === 'start_date') {
      return formData && dayjs(formData[key]).format('MM / DD / YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM / DD / YYYY');
    }
    return formData && formData[key];
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
          placeholder="   Add the points you would like to edit in the Standard Agreement"
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

  return (
    <div>
      <AddendumParagraph>
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.addendum &&
              templateData.addendum[0]
                .replace('CUSTOMER_NAME', mapDefaultValues('company_name'))
                .replace('AGREEMENT_DATE', mapDefaultValues('start_date')),
          }}
        />
        {showEditor ? displayEditor() : ''}

        {showEditor ? (
          ''
        ) : (
          <p
            className="long-text"
            dangerouslySetInnerHTML={{
              __html: newAddendumData && newAddendumData.addendum,
            }}
          />
        )}

        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.addendum &&
              templateData.addendum[1]
                .replace('CUSTOMER_NAME', mapDefaultValues('company_name'))
                .replace('AGREEMENT_DATE', mapDefaultValues('start_date'))
                .replace('BBE_DATE', mapDefaultValues('current_date')),
          }}
        />
      </AddendumParagraph>
    </div>
  );
}

Addendum.defaultProps = {
  formData: {},
  templateData: {},
  newAddendumData: {},
  setNewAddendum: () => {},
  showEditor: false,
  setUpdatedFormData: () => {},
  updatedFormData: {},
};

Addendum.propTypes = {
  formData: shape({
    length: oneOfType([
      string,
      shape({
        value: string,
        label: string,
      }),
    ]),
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    customer_id: shape({
      address: string,
      city: string,
      state: string,
      zip_code: string,
    }),
  }),
  templateData: shape({
    addendum: arrayOf(string),
  }),
  newAddendumData: shape({
    addendum: string,
    id: string,
  }),
  setNewAddendum: func,
  showEditor: bool,
  setUpdatedFormData: func,
  updatedFormData: shape({
    additional_services: arrayOf(arrayOf(shape({}))),
    company_name: string,
    primary_marketplace: oneOfType([
      string,
      shape({
        fee: number,
        name: string,
        id: string,
      }),
    ]),
    additional_marketplaces: oneOfType([object, arrayOf(object)]),
    additional_monthly_services: oneOfType([object, arrayOf(object)]),
    additional_one_time_services: oneOfType([object, arrayOf(object)]),
    quantity: number,
  }),
};
