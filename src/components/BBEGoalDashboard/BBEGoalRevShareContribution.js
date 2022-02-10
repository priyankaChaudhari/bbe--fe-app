import React, { useCallback, useEffect, useRef, useState } from 'react';

import { string } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import numberWithCommas from '../../hooks/numberWithCommas';
import { ArrowDownIcon, ArrowUpIcon } from '../../theme/images';
import { getRevShareContributionData } from '../../api';
import {
  keyContributionConstant,
  noGraphDataMessage,
  contributionColorSet,
} from '../../constants';
import {
  Status,
  ToggleButton,
  WhiteCard,
  Table,
  TableMobileView,
  NoData,
  PageLoader,
} from '../../common';

export default function BBEGoalRevShareContribution({ monthYear }) {
  const mounted = useRef(false);
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const [contributionLoader, setContributionLoader] = useState(false);
  const [selectedContributionOption, setSelectedContributionOption] = useState(
    'positive',
  );
  const [contributionData, setContributionData] = useState([{}, {}, {}, {}]);

  const getContributionData = useCallback(() => {
    setContributionLoader(true);
    getRevShareContributionData(monthYear).then((res) => {
      if (mounted.current) {
        if (res && (res.status === 400 || res.status === 403)) {
          setContributionLoader(false);
          setContributionData([]);
        }
        if (res && res.status === 200) {
          setContributionData(res.data);
        } else {
          setContributionData([]);
        }
        setContributionLoader(false);
      }
    });
  }, [monthYear]);

  useEffect(() => {
    mounted.current = true;
    getContributionData();

    return () => {
      mounted.current = false;
    };
  }, [getContributionData]);

  const handleContributionOptions = (type) => {
    if (type !== selectedContributionOption) {
      setSelectedContributionOption(type);
    }
  };

  const renderPositiveNegativeOptions = (id) => {
    return (
      <ToggleButton id={id}>
        <div className="days-container toggle-container">
          <ul className={contributionLoader ? 'days-tab disabled' : 'days-tab'}>
            {keyContributionConstant.noManagerSelected.map((item) => (
              <li key={item.id}>
                {' '}
                <input
                  className="d-none"
                  type="radio"
                  // id={item.id}
                  id="postnegCheck"
                  name="flexRadioDefault2"
                  value={selectedContributionOption}
                  checked={item.id === selectedContributionOption}
                  onClick={() => handleContributionOptions(item.id)}
                  onChange={() => {}}
                />
                <label htmlFor="postnegCheck">{item.label}</label>
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
          <th width="30%" className="product-header">
            Customer
          </th>
          <th width="20%" className="product-header">
            {contributionData?.previous_date}
          </th>
          <th width="20%" className="product-header">
            {contributionData?.current_date}
          </th>
          <th width="15%" className="product-header">
            Change
          </th>
          <th width="15%" className="product-header text-right pr-2">
            {' '}
            Contribution
          </th>
        </tr>
      </thead>
    );
  };

  const renderTableData = (item, type) => {
    return (
      <tr>
        <td className="product-body">
          {' '}
          <div className="company-name">{item?.customer_name}</div>
          <div className="status">{item?.bgs}</div>
        </td>
        <td className="product-table-body">
          ${numberWithCommas(item?.previous_rev_share)}
        </td>
        <td className="product-table-body ">
          ${numberWithCommas(item?.current_rev_share)}
        </td>
        {type === 'positive' ? (
          <td className="product-table-body ">
            <div className="increase-rate">
              {' '}
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
              {`${item?.change_in_percentage.toFixed(2)}%`}
            </div>
          </td>
        ) : (
          <td className="product-table-body ">
            <div className="decrease-rate">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {`${item?.change_in_percentage.toFixed(2)}%`}
            </div>
          </td>
        )}

        <td className="product-table-body text-right">
          <Status
            className="float-right"
            label={item.contribution_bracket}
            backgroundColor={contributionColorSet[item.contribution_bracket]}
          />
          <div className="clear-fix" />
        </td>
      </tr>
    );
  };

  const renderDekstopView = () => {
    let selectedContibutionData = [];

    selectedContibutionData =
      selectedContributionOption && selectedContributionOption === 'positive'
        ? contributionData?.positive
        : selectedContributionOption &&
          selectedContributionOption === 'negative'
        ? contributionData?.negative
        : [];

    return (
      <>
        {selectedContibutionData && selectedContibutionData.length >= 1 ? (
          <Table>
            {renderTableHeader()}
            <tbody>
              {selectedContibutionData &&
                selectedContibutionData.map((item) =>
                  renderTableData(
                    item,
                    selectedContributionOption === 'positive'
                      ? 'positive'
                      : 'negative',
                  ),
                )}
            </tbody>
          </Table>
        ) : null}
        {!selectedContibutionData ||
        (selectedContibutionData && selectedContibutionData.length === 0) ? (
          <NoData>{noGraphDataMessage}</NoData>
        ) : null}
      </>
    );
  };

  const renderMobileView = () => {
    let selectedContibutionData = [];

    selectedContibutionData =
      selectedContributionOption && selectedContributionOption === 'positive'
        ? contributionData?.positive
        : selectedContributionOption &&
          selectedContributionOption === 'negative'
        ? contributionData?.negative
        : [];

    return (
      <div className="d-md-none d-block">
        <div className="row mt-3 mb-1">
          <div className="col-md-8 col-12">
            <div className="black-heading-title text-bold mt-2 ">
              REV SHARE CONTRIBUTION
            </div>
          </div>
          <div className="col-md-4 col-12 mt-3 mb-3">
            {!isDesktop ? renderPositiveNegativeOptions() : null}
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
        ) : selectedContibutionData?.length >= 1 ? (
          selectedContibutionData.map((item) => (
            <TableMobileView
              invoiceType={item?.customer_name}
              invoiceId={item?.bgs}
              label={contributionData?.previous_date}
              labelInfo={`$${numberWithCommas(item?.previous_rev_share)}`}
              label1={contributionData?.current_date}
              labelInfo1={`$${numberWithCommas(item?.current_rev_share)}`}
              label2="Change"
              labelInfo2={`${item.change_in_percentage.toFixed(2)}%`}
              status={item.contribution_bracket}
              statusColor={contributionColorSet[item.contribution_bracket]}
              isShowPercentage
              isLabelInfo2Positive={selectedContributionOption === 'positive'}
            />
          ))
        ) : selectedContibutionData && selectedContibutionData.length === 0 ? (
          <NoData>{noGraphDataMessage}</NoData>
        ) : null}
      </div>
    );
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
            {isDesktop ? renderPositiveNegativeOptions() : null}
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
      </WhiteCard>
      {renderMobileView()}
    </>
  );
}

BBEGoalRevShareContribution.defaultProps = { monthYear: '' };
BBEGoalRevShareContribution.propTypes = { monthYear: string };
