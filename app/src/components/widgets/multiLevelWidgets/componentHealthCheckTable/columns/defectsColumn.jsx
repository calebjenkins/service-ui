/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { DefectStatistics } from 'pages/inside/common/launchSuiteGrid/defectStatistics';
import { DefectLink } from 'pages/inside/common/defectLink';
import { defaultDefectsMessages } from 'components/widgets/singleLevelWidgets/tables/components/messages';
import { getItemNameConfig } from 'components/widgets/common/utils';
import styles from '../componentHealthCheckTable.scss';

const cx = classNames.bind(styles);

const getDefects = (values, name) => {
  const defects = Object.keys(values)
    .filter((item) => item.indexOf(name) !== -1)
    .map((defect) => {
      const value = values[defect];
      const { locator } = getItemNameConfig(defect);

      return {
        [locator]: value,
      };
    });

  return Object.assign({}, ...defects);
};

export const DefectsColumn = ({ className, value }, name) => {
  const defaultColumnProps = {};
  const data = value.statistics
    ? getDefects(value.statistics, name)
    : getDefects(value.total.statistics, name);

  return (
    <div className={cx('defect-col', className)}>
      {value.statistics ? (
        <Fragment>
          <div className={cx('desktop-block')}>
            <DefectStatistics type={name} data={data} {...defaultColumnProps} />
          </div>
          <div className={cx('mobile-block', `defect-${name}`)}>
            <div className={cx('block-content')}>
              {!!data.total && (
                <DefectLink {...defaultColumnProps} defects={Object.keys(data)}>
                  {data.total}
                </DefectLink>
              )}
              <span className={cx('message')}>{defaultDefectsMessages[name]}</span>
            </div>
          </div>
        </Fragment>
      ) : (
        <span className={cx('total-item')}>{data.total}</span>
      )}
    </div>
  );
};
DefectsColumn.propTypes = {
  value: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
};
