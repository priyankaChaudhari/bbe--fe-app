import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Document, Page } from 'react-pdf';
import { Document, Page, pdfjs } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import PdfLoadingMsg from './PdfLoadingMsg';
// import styled from 'styled-components';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export default function PdfViewer({ pdf, loadingMsg }) {
  const [totalPages, setNumPages] = useState(null);
  const [isLoader, setIsLoader] = useState({ loader: false });
  const pdfFile = useMemo(() => {
    return pdf;
  }, [pdf]);

  const isDesktopLarge = useMediaQuery({ minWidth: 1601 });
  const isDesktop = useMediaQuery({ minWidth: 1331, maxWidth: 1600 });
  const isDesktopView = useMediaQuery({ minWidth: 992, maxWidth: 1330 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isMobile = useMediaQuery({ minWidth: 590, maxWidth: 767 });
  const isMobileView = useMediaQuery({ minWidth: 455, maxWidth: 591 });
  const isMobileSmallView = useMediaQuery({ minWidth: 320, maxWidth: 456 });

  const giveWidth = useCallback(() => {
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
    // if (isTablet) {
    //   console.log(document.getElementById('root').clientWidth, 'tablet');
    //   return document.getElementById('root').clientWidth;
    // }
    // if (isMobile) {
    //   console.log(document.getElementById('root').clientWidth, 'mobile');

    //   return document.getElementById('root').clientWidth;
    // }
  }, [
    isDesktopLarge,
    isDesktop,
    isDesktopView,
    isTablet,
    isMobile,
    isMobileView,
    isMobileSmallView,
  ]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoader({ loader: false });
  }

  const displayPdf = useCallback(() => {
    return (
      <>
        {isLoader.loader ? '' : ''}
        <Document
          className="PDFDocument"
          file={pdfFile}
          options={{ workerSrc: 'pdf.worker.js' }}
          // error={PageNotFound}
          error={() => (
            <PdfLoadingMsg
              type="error"
              message="Please wait while contract document is being ready!! check this page
          after few minutes."
            />
          )}
          loading={() => (
            <PdfLoadingMsg
              type="loading"
              message={loadingMsg}
              setIsLoader={setIsLoader}
            />
          )}
          onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(totalPages), (el, index) => (
            <Page
              className="PDFPage PDFPageOne pdf-view"
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              // scale={1.2}
              width={giveWidth()}
              // maxWidth={giveWidth()}
            />
          ))}
        </Document>
      </>
    );
  }, [pdfFile, giveWidth, totalPages, loadingMsg, isLoader]);

  useEffect(() => {
    displayPdf();
  }, [displayPdf]);

  return <div id="ResumeContainer">{displayPdf()}</div>;
}

PdfViewer.defaultProps = {
  pdf: '',
  loadingMsg: '',
};

PdfViewer.propTypes = {
  pdf: PropTypes.string,
  loadingMsg: PropTypes.string,
};
