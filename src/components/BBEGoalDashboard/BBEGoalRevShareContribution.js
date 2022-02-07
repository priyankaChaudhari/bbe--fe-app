import React, { useCallback, useEffect, useRef, useState } from 'react';

import { string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import { ArrowDownIcon } from '../../theme/images';
import { getRevShareContributionData } from '../../api';
import { keyContributionConstant, noGraphDataMessage } from '../../constants';
import {
  Status,
  ToggleButton,
  WhiteCard,
  Table,
  TableMobileView,
  CommonPagination,
  NoData,
  PageLoader,
} from '../../common';

export default function BBEGoalRevShareContribution({ month }) {
  const mounted = useRef(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [contributionLoader, setContributionLoader] = useState(false);
  const [selectedContributionOption, setSelectedContributionOption] = useState(
    'positive',
  );
  const [contributionData, setContributionData] = useState([]);
  const [pageNumber, setPageNumber] = useState();
  const [contributionCount, setContributionCount] = useState(null);

  const getContributionData = useCallback(
    (type, page) => {
      setContributionLoader(true);
      getRevShareContributionData(month, type, page).then((res) => {
        if (mounted.current) {
          if (res && (res.status === 400 || res.status === 400)) {
            setContributionLoader(false);
            setContributionData([]);
          }
          if (res && res.status === 200) {
            setContributionData(res.data.result);
            setContributionCount(res.data.count);
          } else {
            setContributionData([]);
            setPageNumber(page);
          }
          setContributionLoader(false);
        }
      });
    },
    [month],
  );

  useEffect(() => {
    mounted.current = true;
    getContributionData('positive', 1);

    return () => {
      mounted.current = false;
    };
  }, [getContributionData]);

  const handleContributionOptions = (type) => {
    if (type !== selectedContributionOption) {
      setSelectedContributionOption(type);
      getContributionData(type, 1);
      setPageNumber(1);
    }
  };

  const renderPositiveNegativeOptions = (id) => {
    return (
      <ToggleButton id={id}>
        <div className="days-container spending">
          <ul className={contributionLoader ? 'days-tab disabled' : 'days-tab'}>
            {keyContributionConstant.noManagerSelected.map((item) => (
              <li key={item.id}>
                {' '}
                <input
                  className="d-none"
                  type="radio"
                  id={item.id}
                  name="flexRadioDefault2"
                  value={selectedContributionOption}
                  checked={item.id === selectedContributionOption}
                  onClick={() => handleContributionOptions(item.id)}
                  onChange={() => {}}
                />
                <label htmlFor={item.id}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
      </ToggleButton>
    );
  };

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          <th width="25%" className="product-header">
            Customer
          </th>
          <th width="15%" className="product-header">
            December
          </th>
          <th width="15%" className="product-header">
            january
          </th>
          <th width="15%" className="product-header">
            Change
          </th>
          <th width="15%" className="product-header">
            Contribution
          </th>
          <th width="15%" className="product-header text-right pr-2">
            {' '}
            Status
          </th>
        </tr>
      </thead>
    );
  };

  const renderTableData = () => {
    return (
      <tr>
        <td className="product-body">
          {' '}
          <div className="company-name">TRX Training</div>
          <div className="status">Gabriella Neske</div>
        </td>
        <td className="product-table-body">$52,350.00</td>
        <td className="product-table-body ">$52,350.00</td>
        <td className="product-table-body ">$52,350.00</td>
        <td className="product-table-body ">
          <div className="decrease-rate">
            {' '}
            <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
            21.47%
          </div>
        </td>
        <td className="product-table-body text-right">
          <Status
            className="float-right"
            label="High"
            // backgroundColor={StatusColorSet[item.status]}
          />
          <div className="clear-fix" />
        </td>
      </tr>
    );
  };

  const renderDekstopView = () => {
    return (
      <>
        <Table>
          {renderTableHeader()}
          {contributionData.length >= 1 ? (
            <>
              <tbody>
                {contributionData &&
                  contributionData.map((item) => renderTableData(item))}
              </tbody>
            </>
          ) : null}
        </Table>
        {!contributionData ||
        (contributionData && contributionData.length === 0) ? (
          <NoData>{noGraphDataMessage}</NoData>
        ) : null}
      </>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="d-md-none d-block">
        <div className="row mt-3 mb-1">
          <div className="col-md-8 col-12">
            <div className="black-heading-title text-bold mt-2 ">
              REV SHARE CONTRIBUTION
            </div>
          </div>
          <div className="col-md-4 col-12 mt-3 mb-3">
            {renderPositiveNegativeOptions()}
          </div>
        </div>

        {contributionLoader ? (
          <PageLoader
            component="performance-graph"
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : contributionData.length >= 1 ? (
          contributionData.map(() => (
            <TableMobileView
              invoiceType="  Customer"
              invoiceId=" December"
              label="December"
              labelInfo="hhhh"
              label1="January"
              labelInfo1="jjj"
              label2="Change"
              labelInfo2="jjj"
              status="high"
              // statusColor="#e3f2d2"
            />
          ))
        ) : contributionData && contributionData.length === 0 ? (
          <NoData>{noGraphDataMessage}</NoData>
        ) : null}
      </div>
    );
  };

  const handlePageChange = (currentPage) => {
    setPageNumber(currentPage);
    getContributionData(selectedContributionOption, currentPage);
  };

  return (
    <>
      <WhiteCard className="mt-3 d-md-block d-none">
        <div className="row">
          <div className="col-md-8 col-12">
            <div className="black-heading-title text-bold mt-2 ">
              REV SHARE CONTRIBUTION
            </div>
          </div>
          <div className="col-md-4 col-12">
            {renderPositiveNegativeOptions()}
          </div>
        </div>
        <div className="horizontal-line straight-line mt-3 mb-1" />
        {contributionLoader ? (
          <PageLoader
            component="performance-graph"
            color="#FF5933"
            type="detail"
            width={40}
            height={40}
          />
        ) : isDesktop ? (
          renderDekstopView()
        ) : null}

        {contributionData.length >= 1 ? (
          <CommonPagination
            count={contributionCount}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}
          />
        ) : null}
      </WhiteCard>
      {renderMobileView()}
    </>
  );
}

BBEGoalRevShareContribution.defaultProps = { month: '' };
BBEGoalRevShareContribution.propTypes = { month: string };
