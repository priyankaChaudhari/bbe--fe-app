import React from 'react';

import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

import { CommonPagination, NoData, PageLoader, Table } from '../../common';
import Theme from '../../theme/Theme';
import { DownloadIconActive, DownloadIconInActive } from '../../theme/images';

const ReportSectionFilter = ({
  reportsData,
  loader,
  selectedBp,
  onDownload,
  itemLoader,
  count,
  pageNumber,
  handlePageChange,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 767 });

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th width="25%" className="product-header">
            NAME/TYPE
          </th>
          <th width="50%" className="product-header">
            DESCRIPTION
          </th>
          <th width="25%" className="product-header text-right">
            DOWNLOAD REPORT
          </th>
        </tr>
      </thead>
    );
  };

  const renderTableData = () => {
    return (
      <tbody>
        {reportsData &&
          reportsData.length > 0 &&
          reportsData.map((item, index) => {
            return (
              <tr className="border-bottom" key={item.id}>
                <td className="product-body">
                  <div>{item.report_name}</div>
                  <div className="status">
                    {item?.report_type.replace('_', ' ')}
                  </div>
                </td>
                <td className="small-label-text p-0 ">
                  <div className="marketplace py-0">
                    {item.report_description}
                  </div>
                </td>
                <td
                  onClick={() => {
                    if (selectedBp !== 'Select-BP') {
                      onDownload(item.id, index);
                    }
                  }}
                  aria-hidden="true"
                  style={{
                    cursor:
                      selectedBp === 'Select-BP' ? 'not-allowed' : 'pointer',
                  }}
                  className="product-body light-font  text-right  pr-2">
                  {itemLoader[index] ? (
                    <PageLoader
                      color={Theme.orange}
                      component="table-download-btn"
                      type="button"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <>
                      <p
                        className={
                          selectedBp === 'Select-BP'
                            ? 'in-active'
                            : 'orange-text-label'
                        }>
                        <img
                          style={{ verticalAlign: 'text-bottom' }}
                          className="mr-2"
                          src={
                            selectedBp === 'Select-BP'
                              ? DownloadIconInActive
                              : DownloadIconActive
                          }
                          alt="download"
                        />
                        Download
                      </p>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    );
  };

  const renderMobileView = () => {
    return (
      <ReportsMobiveView>
        {reportsData &&
          reportsData.length > 0 &&
          reportsData.map((item, index) => {
            return (
              <div key={item.id}>
                <div className="row ">
                  <div className="col-9">
                    <p
                      className="normal-text-black  mb-2 "
                      style={{ textTransform: 'capitalize' }}>
                      {item?.report_type.replace('_', ' ')}
                    </p>
                    <h6 className="black-heading-title  mb-2 ">
                      {item.report_name}
                    </h6>
                    <p className="normal-text-black  mt-2">
                      {item.report_description}
                    </p>
                  </div>
                  <div className="col-3 text-right">
                    {itemLoader[index] ? (
                      <PageLoader
                        component="performance-graph"
                        color={Theme.orange}
                        type="detail"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <p
                        onClick={() => {
                          if (selectedBp !== 'Select-BP') {
                            onDownload(item.id, index);
                          }
                        }}
                        aria-hidden="true"
                        style={
                          selectedBp === 'Select-BP'
                            ? {
                                cursor: 'not-allowed',
                                border: `1px solid ${Theme.gray25}`,
                              }
                            : {
                                cursor: 'pointer',
                                border: `1px solid ${Theme.orange}`,
                              }
                        }
                        className="icon-with-border ">
                        <img
                          style={{ verticalAlign: 'text-bottom' }}
                          className="mr-2"
                          src={
                            selectedBp === 'Select-BP'
                              ? DownloadIconInActive
                              : DownloadIconActive
                          }
                          alt="download"
                        />
                      </p>
                    )}
                  </div>
                </div>
                <div className="horizontal-line straight-line mt-2" />
              </div>
            );
          })}
      </ReportsMobiveView>
    );
  };

  return (
    <>
      {loader ? (
        <PageLoader
          component="performance-graph"
          color={Theme.orange}
          type="detail"
          width={40}
          height={40}
        />
      ) : isDesktop ? (
        <>
          <Table>
            {renderTableHeader()}
            {renderTableData()}
          </Table>
        </>
      ) : (
        renderMobileView()
      )}

      {reportsData.length >= 1 ? (
        <CommonPagination
          count={count}
          pageNumber={pageNumber}
          handlePageChange={handlePageChange}
        />
      ) : null}

      {reportsData.length === 0 && !loader ? (
        <NoData>No reports data found.</NoData>
      ) : null}
    </>
  );
};

export default ReportSectionFilter;

ReportSectionFilter.defaultProps = {
  count: 0,
  pageNumber: 1,
  handlePageChange: () => {},
};

ReportSectionFilter.propTypes = {
  pageNumber: number,
  count: number,
  loader: bool.isRequired,
  selectedBp: string.isRequired,
  itemLoader: shape({}).isRequired,
  reportsData: arrayOf(Array).isRequired,
  handlePageChange: func,
  onDownload: func.isRequired,
};

const ReportsMobiveView = styled.div`
  .icon-with-border {
    border-radius: 8px;
    border: 1px solid #bfc5d2;
    height: 38px;
    width: 38px;
    padding: 10px;
  }
`;
