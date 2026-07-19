import { Card, Col, Progress, Row, Skeleton, Statistic, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowTrendUp, faArrowUp, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

import { formatCurrency } from './utils';

const { Text } = Typography;

const SummaryCards = ({ summary, loading }) => {
  const cards = [
    {
      key: 'balance',
      label: 'Net balance',
      value: summary.balance,
      icon: faScaleBalanced,
      className: summary.balance >= 0 ? 'positive' : 'negative'
    },
    { key: 'income', label: 'Income', value: summary.income, icon: faArrowDown, className: 'positive' },
    { key: 'expenses', label: 'Expenses', value: summary.expenses, icon: faArrowUp, className: 'negative' }
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map(card => (
        <Col xs={12} sm={12} xl={6} key={card.key}>
          <Card className="summary-card" bordered>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            ) : (
              <>
                <div className={`summary-icon ${card.className}`} aria-hidden="true">
                  <FontAwesomeIcon icon={card.icon} />
                </div>
                <Statistic title={card.label} value={formatCurrency(card.value)} />
              </>
            )}
          </Card>
        </Col>
      ))}
      <Col xs={12} sm={12} xl={6}>
        <Card className="summary-card" bordered>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          ) : (
            <>
              <div className="summary-icon neutral" aria-hidden="true">
                <FontAwesomeIcon icon={faArrowTrendUp} />
              </div>
              <div className="savings-row">
                <Text type="secondary">Savings rate</Text>
                <span className="savings-value">{summary.savingsRate}%</span>
                <Progress
                  percent={Math.max(0, Math.min(100, summary.savingsRate))}
                  showInfo={false}
                  size="small"
                  aria-label={`Savings rate ${summary.savingsRate}%`}
                />
              </div>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
