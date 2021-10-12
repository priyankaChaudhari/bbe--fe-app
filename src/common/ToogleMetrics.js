import { arrayOf, func, string } from 'prop-types';
import React from 'react';

import styled from 'styled-components';

import Theme from '../theme/Theme';

const ToogleMetrics = ({ data, onToogle, value }) => {
  return (
    <Wrapper>
      <div className="toggle-container">
        <ul className="toggle-tab">
          {data.map((item) => {
            return (
              <li>
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
  .toggle-container {
    background-color: ${Theme.white};
    border: 1px solid ${Theme.gray45};
    border-radius: 5px;
    width: fit-content;

    ul.toggle-tab {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li input[type='radio']:checked + label {
        background-color: ${Theme.white};
        border: 1px solid ${Theme.orange};
        border-radius: 5px;
        color: ${Theme.orange};
      }
      li {
        display: inline-block;
        label {
          color: ${Theme.black};
          padding: 7px 19px;
          font-size: 14px;
          display: inline-block;
          cursor: pointer;
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
