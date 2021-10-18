import React from 'react';

import styled from 'styled-components';
import { arrayOf, func, string } from 'prop-types';

import Theme from '../theme/Theme';

const ToogleMetrics = ({ data, onToogle, value }) => {
  return (
    <Wrapper>
      <div className="toggle-container">
        <ul className="toggle-tab">
          {data.map((item) => {
            return (
              <li key={item.id}>
                <input
                  id={item.name}
                  className="d-none"
                  type="radio"
                  name="toggleMetrics"
                  value={item.name}
                  checked={value === item.name}
                  onClick={() => {
                    onToogle(item.name);
                  }}
                  onChange={() => {}}
                />
                <label htmlFor={item.name}>{item.label}</label>
              </li>
            );
          })}
        </ul>
      </div>
    </Wrapper>
  );
};

export default ToogleMetrics;

const Wrapper = styled.div`
  margin-bottom: 13px;
  margin-top: -8px;
  .toggle-container {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 5px;
    width: 100%;

    ul.toggle-tab {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li input[type='radio']:checked + label {
        background-color: ${Theme.white};
        border: 1px solid ${Theme.orange};
        border-radius: 5px;
        color: ${Theme.orange};
        width: 100%;
        text-align: center;
      }
      li {
        display: inline-block;
        width: 50%;

        label {
          color: ${Theme.black};
          padding: 3px 2px;
          font-size: ${Theme.verySmall};
          display: inline-block;
          cursor: pointer;
          text-align: center;
          width: 100%;
        }
      }
    }
  }
`;

ToogleMetrics.defaultProps = {
  data: [],
  onToogle: () => {},
  value: '',
};

ToogleMetrics.propTypes = {
  data: arrayOf(Array),
  onToogle: func,
  value: string,
};
