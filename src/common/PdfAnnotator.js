import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import PdfLoadingMsg from './PdfLoadingMsg';
// import styled from 'styled-components';

export default function PdfAnnotator({
  pdf,
  loadingMsg,
  onPdfMouseDown,
  renderPDFAnnotations,
  clickOnAddNewAnnotation,
}) {
  const [totalPages, setNumPages] = useState(null);
  const isDesktopLarge = useMediaQuery({ minWidth: 1601 });
  const isDesktop = useMediaQuery({ minWidth: 1331, maxWidth: 1600 });
  const isDesktopView = useMediaQuery({ minWidth: 992, maxWidth: 1330 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ minWidth: 590, maxWidth: 767 });
  const isMobileView = useMediaQuery({ minWidth: 455, maxWidth: 591 });
  const isMobileSmallView = useMediaQuery({ minWidth: 320, maxWidth: 456 });
  //   const [demo, setDemo] = useState({ page: 0, left: 0, top: 0 });
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const giveWidth = () => {
    if (isDesktopLarge) {
      return 1000;
    }
    if (isDesktop) {
      return 900;
    }
    if (isDesktopView) {
      return 590;
    }
    if (isTablet) {
      return 750;
    }

    if (isMobile) {
      return 550;
    }

    if (isMobileView) {
      return 450;
    }

    if (isMobileSmallView) {
      return 320;
    }
    return null;
  };

  const onMouseDown = (e, selector) => {
    onPdfMouseDown(e, selector);
  };

  return (
    <div id="ResumeContainer">
      <Document
        className={
          clickOnAddNewAnnotation ? 'PDFDocument cursorPointer' : 'PDFDocument'
        }
        file={pdf}
        options={{ workerSrc: 'pdf.worker.js' }}
        error={() => <PdfLoadingMsg type="error" message="Loading error" />}
        loading={() => <PdfLoadingMsg type="loading" message={loadingMsg} />}
        onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(totalPages), (el, index) => (
          <Page
            onMouseDown={(event) => onMouseDown(event, `${index + 1}`)}
            // onscroll={(event) => onScroll(event)}
            className={`page_${index + 1} PDFPage PDFPageOne pdf-view`}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={giveWidth()}>
            {renderPDFAnnotations(true, index + 1)}
            {renderPDFAnnotations(false, index + 1)}
          </Page>
        ))}
      </Document>
    </div>
  );
}

PdfAnnotator.defaultProps = {
  pdf: '',
  loadingMsg: '',
  onPdfMouseDown: () => {},
  renderPDFAnnotations: () => {},
  clickOnAddNewAnnotation: false,
};

PdfAnnotator.propTypes = {
  pdf: PropTypes.string,
  loadingMsg: PropTypes.string,
  onPdfMouseDown: PropTypes.func,
  renderPDFAnnotations: PropTypes.func,
  clickOnAddNewAnnotation: PropTypes.bool,
};
