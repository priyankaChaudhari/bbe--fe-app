import React, { useCallback, useEffect, useRef, useState } from 'react';

import { instanceOf } from 'prop-types';
import { useMediaQuery } from 'react-responsive';

import useFormatNumber from '../../hooks/useFormatNumber';
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
import Theme from '../../theme/Theme';

export default function BBEGoalRevShareContribution({ monthYear }) {
  const mounted = useRef(false);
  const isDesktop = useMediaQuery({ minWidth: 767 });
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

  const renderTableData = (item, type, formatNumber) => {
    return (
      <tr>
        <td className="product-body">
          {' '}
          <div className="company-name">{item?.customer_name}</div>
          <div className="status">{item?.bgs}</div>
        </td>
        <td className="product-body">
          {formatNumber(item?.previous_rev_share, '$')}
        </td>
        <td className="product-body ">
          {formatNumber(item?.current_rev_share, '$')}
        </td>
        {type === 'positive' ? (
          <td className="product-body">
            <div className="increase-rate large text-medium">
              {' '}
              <img className="green-arrow" src={ArrowUpIcon} alt="arrow-up" />
              {`${formatNumber(item?.change_in_percentage, '', '%')}`}
            </div>
          </td>
        ) : (
          <td className="product-body ">
            <div className="decrease-rate large text-medium">
              <img className="red-arrow" src={ArrowDownIcon} alt="arrow-up" />
              {`${formatNumber(Math.abs(item?.change_in_percentage), '', '%')}`}
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
                    useFormatNumber,
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

  const renderMobileView = (formatNumber) => {
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
            color={Theme.orange}
            type="detail"
            width={40}
            height={40}
          />
        ) : selectedContibutionData?.length >= 1 ? (
          selectedContibutionData.map((item) => (
            <TableMobileView
              className="mb-3"
              invoiceType={item?.customer_name}
              invoiceId={item?.bgs}
              label={contributionData?.previous_date}
              labelInfo={`$${formatNumber(item?.previous_rev_share)}`}
              label1={contributionData?.current_date}
              labelInfo1={`$${formatNumber(item?.current_rev_share)}`}
              label2="Change"
              labelInfo2={`${formatNumber(
                Math.abs(item?.change_in_percentage),
                '',
                '%',
              )}`}
              status={item.contribution_bracket}
              statusColor={contributionColorSet[item.contribution_bracket]}
              isShowPercentage
              isLabelInfo2Positive={selectedContributionOption === 'positive'}
              statusLabelColor="#000000"
              isBBEDashboard
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
      {renderMobileView(useFormatNumber)}
    </>
  );
}

BBEGoalRevShareContribution.defaultProps = {};
BBEGoalRevShareContribution.propTypes = {
  monthYear: instanceOf(Date).isRequired,
};
