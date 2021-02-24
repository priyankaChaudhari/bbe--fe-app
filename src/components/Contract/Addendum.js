/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import dayjs from 'dayjs';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import Theme from '../../theme/Theme';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function Addendum({
  // details,
  formData,
  templateData,
  newAddendumData,
  setNewAddendum,
  showEditor,
  // setShowEditor,
  setUpdatedFormData,
  updatedFormData,
  // showFooter,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const [editorState, setEditorState] = useState(null);
  const [contentState, setContentState] = useState(null);

  useEffect(() => {
    // if (newAddendumData) {
    //   setShowEditor(false);
    // } else {
    //   setShowEditor(true);
    // }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  useEffect(() => {
    if (!Object.keys(newAddendumData).length) {
      setEditorState(EditorState.createEmpty());
    }
  }, [newAddendumData]);

  const onEditorStateChange = (editorData) => {
    // showFooter(true);
    setEditorState(editorData);
    const content = editorData.getCurrentContent();
    const info = draftToHtml(convertToRaw(content));
    const updatedAddendumm = { ...newAddendumData, addendum: info };
    setNewAddendum(updatedAddendumm);
    setUpdatedFormData({ ...updatedFormData, addendum: info });
  };

  const mapDefaultValues = (key) => {
    // if (key === 'contract_company_name') {
    //   return details && details[key]
    //     ? details && details[key]
    //     : `Enter ${label}.`;
    // }
    if (key === 'contract_company_name') {
      return formData && formData[key]
        ? formData && formData[key]
        : `Client Name`;
    }
    // if (key === 'length') {
    //   return details && details.length.label;
    // }
    // if (key === 'primary_marketplace') {
    //   return (
    //     details &&
    //     details.primary_marketplace &&
    //     details.primary_marketplace.name
    //   );
    // }
    if (key === 'start_date') {
      return formData && dayjs(formData[key]).format('MM-DD-YYYY');
    }
    if (key === 'current_date') {
      return dayjs(Date()).format('MM-DD-YYYY');
    }
    return formData && formData[key];
    // if (type && type.includes('number')) {
    //   return `${type === 'number-currency' ? '$' : '%'} ${
    //     details && details[key]
    //       ? details[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //       : ''
    //   }`;
    // }
    // return key === 'rev_share' || key === 'seller_type'
    //   ? details && details[key] && details[key].label
    //  details && details[key];
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
    <>
      <Paragraph>
        <p
          className="long-text"
          dangerouslySetInnerHTML={{
            __html:
              templateData.addendum &&
              templateData.addendum[0]
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name'),
                )
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
                .replace(
                  'CUSTOMER_NAME',
                  mapDefaultValues('contract_company_name'),
                )
                .replace('AGREEMENT_DATE', mapDefaultValues('start_date'))
                .replace('BBE_DATE', mapDefaultValues('current_date')),
          }}
        />
      </Paragraph>
    </>
  );
}

Addendum.defaultProps = {
  formData: {},
  templateData: {},
  newAddendumData: {},
  setNewAddendum: () => {},
  // setShowEditor: () => {},
  showEditor: false,
  setUpdatedFormData: () => {},
  updatedFormData: {},
};

Addendum.propTypes = {
  formData: PropTypes.shape({
    length: PropTypes.string,
    primary_marketplace: PropTypes.shape({
      fee: PropTypes.number,
      name: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  templateData: PropTypes.shape({
    addendum: PropTypes.arrayOf(PropTypes.string),
  }),
  newAddendumData: PropTypes.shape({
    addendum: PropTypes.string,
    id: PropTypes.string,
  }),
  setNewAddendum: PropTypes.func,
  showEditor: PropTypes.bool,
  // setShowEditor: PropTypes.func,
  setUpdatedFormData: PropTypes.func,
  updatedFormData: PropTypes.shape({
    additional_services: PropTypes.arrayOf(PropTypes.array),
    start_date: PropTypes.string,
    company_name: PropTypes.string,
    primary_marketplace: PropTypes.string,
    additional_marketplaces: PropTypes.arrayOf(PropTypes.array),
    additional_monthly_services: PropTypes.arrayOf(PropTypes.object),
    additional_one_time_services: PropTypes.arrayOf(PropTypes.object),
    quantity: PropTypes.number,
  }),
};

const Paragraph = styled.div`
  .summary {
    margin: 0;
    li {
      margin-top: 10px;
    }
  }
  .contact-list table,
  td,
  th {
    border: 1px solid black;
    padding: 13px;
  }
  tr {
    .total-service {
      font-weight: 800;
    }
    th {
      text-align: left;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  .refer-agreement {
    border-bottom: 1px solid black;
    font-weight: 400;
    margin-left: 35px;
    padding: 6px 0;

    .label {
      font-weight: 800;
    }
  }
`;

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
