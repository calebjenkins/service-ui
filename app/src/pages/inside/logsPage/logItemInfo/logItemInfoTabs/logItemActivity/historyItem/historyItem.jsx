import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Link from 'redux-first-router-link';
import Parser from 'html-react-parser';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { logActivitySelector } from 'controllers/log/index';
import { projectIdSelector, filterIdSelector, PROJECT_LOG_PAGE } from 'controllers/pages/index';
import { getTicketUrlId } from 'common/utils/index';
import RightArrowIcon from 'common/img/arrow-right-small-inline.svg';
import { normalizeAndParse } from './utils';
import styles from './historyItem.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  basedOn: {
    id: 'LogItemInfo.basedOn',
    defaultMessage: 'Based on',
  },
  item: {
    id: 'LogItemInfo.item',
    defaultMessage: 'item',
  },
  ignoreAA: {
    id: 'LogItemInfo.ignoreAA',
    defaultMessage: 'Ignore in Auto Analysis',
  },
});

@injectIntl
@connect((state) => ({
  projectId: projectIdSelector(state),
  activity: logActivitySelector(state),
  filterId: filterIdSelector(state),
}))
export class HistoryItem extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    historyItem: PropTypes.shape({
      oldValue: PropTypes.string,
      newValue: PropTypes.string,
      field: PropTypes.string.isRequired,
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    activity: PropTypes.array.isRequired,
    filterId: PropTypes.string.isRequired,
  };

  isValueEmpty = (value) => value === '';

  renderAnalyzerIgnore = (value) =>
    value === 'true' ? this.props.intl.formatMessage(messages.ignoreAA) : null;

  renderValue(value) {
    const { historyItem } = this.props;

    switch (historyItem.field) {
      case 'relevantItem':
        return this.renderRelevantValue(value);
      case 'ticketId':
        return this.renderTicketValue(value);
      case 'ignoreAnalyzer':
        return this.renderAnalyzerIgnore(value);
      default:
        return value;
    }
  }

  renderRelevantValue(value) {
    const { projectId, filterId, intl } = this.props;

    try {
      const relevantItem = normalizeAndParse(value);
      const itemLink = {
        type: PROJECT_LOG_PAGE,
        payload: {
          projectId,
          filterId,
          testItemIds: [relevantItem.launchId, ...relevantItem.path.split('.')].join('/'),
        },
      };

      return (
        <Fragment>
          {intl.formatMessage(messages.basedOn)}{' '}
          <Link className={cx('link')} to={itemLink}>
            {intl.formatMessage(messages.item)}
          </Link>
        </Fragment>
      );
    } catch (error) {
      return value;
    }
  }

  renderTicketValue = (value) => {
    const ticket = getTicketUrlId(value);

    return ticket ? (
      <Link className={cx('link')} to={ticket.url} target="_blank">
        {ticket.id}
      </Link>
    ) : (
      value
    );
  };

  render() {
    const { historyItem } = this.props;

    return (
      <div className={cx('container')}>
        <div className={cx('content', 'old', { empty: this.isValueEmpty(historyItem.oldValue) })}>
          <div className={cx('value')}>{this.renderValue(historyItem.oldValue)}</div>
        </div>
        <div className={cx('content', 'new')}>
          <div className={cx('new-icon')}>{Parser(RightArrowIcon)}</div>
          <div className={cx('value')}>{this.renderValue(historyItem.newValue)}</div>
        </div>
      </div>
    );
  }
}
