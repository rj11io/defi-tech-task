import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Flex,
  Input,
  Progress,
  Row,
  Segmented,
  Space,
  Typography
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import Api from '../helpers/core/Api';
import SummaryCards from '../features/transactions/SummaryCards';
import TransactionDrawer from '../features/transactions/TransactionDrawer';
import TransactionList from '../features/transactions/TransactionList';
import { formatCurrency, getExpenseBreakdown, getSummary } from '../features/transactions/utils';

const { Paragraph, Text, Title } = Typography;

const Home = () => {
  const { message } = App.useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadEntries = useCallback(
    async signal => {
      setLoading(true);
      setError('');

      try {
        const response = await Api.get('/transactions', {
          params: {
            from: selectedMonth.startOf('month').toISOString(),
            to: selectedMonth.endOf('month').toISOString()
          },
          signal
        });
        setEntries(response.data);
      } catch (requestError) {
        if (requestError.code !== 'ERR_CANCELED')
          setError('We could not load your entries. Check the connection and try again.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [selectedMonth]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadEntries(controller.signal);
    return () => controller.abort();
  }, [loadEntries]);

  const visibleEntries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return entries.filter(entry => {
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;
      const matchesSearch =
        !normalizedSearch ||
        entry.description.toLowerCase().includes(normalizedSearch) ||
        entry.note?.toLowerCase().includes(normalizedSearch) ||
        entry.category.toLowerCase().includes(normalizedSearch);
      return matchesType && matchesSearch;
    });
  }, [entries, search, typeFilter]);

  const summary = useMemo(() => getSummary(entries), [entries]);
  const expenseBreakdown = useMemo(() => getExpenseBreakdown(entries), [entries]);

  const openCreate = () => {
    setEditingEntry(null);
    setDrawerOpen(true);
  };

  const openEdit = entry => {
    setEditingEntry(entry);
    setDrawerOpen(true);
  };

  const saveEntry = async values => {
    setSaving(true);
    try {
      if (editingEntry) await Api.patch(`/transactions/${editingEntry._id}`, values);
      else await Api.post('/transactions', values);
      setDrawerOpen(false);
      setEditingEntry(null);
      message.success(editingEntry ? 'Entry updated' : 'Entry added');
      await loadEntries();
    } catch (requestError) {
      setError('The entry could not be saved. Review the details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async id => {
    setDeletingId(id);
    try {
      await Api.delete(`/transactions/${id}`);
      setEntries(currentEntries => currentEntries.filter(entry => entry._id !== id));
      message.success('Entry deleted');
    } catch (requestError) {
      message.error('The entry could not be deleted. Try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderExpenseBreakdown = () => {
    if (loading) {
      return (
        <Space direction="vertical" size="large" className="full-width">
          {[1, 2, 3].map(item => (
            <Progress key={item} percent={0} status="active" showInfo={false} />
          ))}
        </Space>
      );
    }

    if (!expenseBreakdown.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No expenses recorded this month" />;
    }

    return (
      <Space direction="vertical" size="large" className="full-width">
        {expenseBreakdown.slice(0, 6).map(item => (
          <div key={item.category} className="category-row">
            <Flex justify="space-between" gap={16}>
              <Text>{item.label}</Text>
              <Text strong>{formatCurrency(item.amount)}</Text>
            </Flex>
            <Progress percent={item.percentage} showInfo={false} size="small" />
          </div>
        ))}
      </Space>
    );
  };

  return (
    <main className="dashboard-shell">
      <div className="dashboard-container">
        <Flex className="page-heading" align="flex-start" justify="space-between" gap={16} wrap>
          <div>
            <Text className="eyebrow">Expense & income diary</Text>
            <Title level={1}>Your money, clearly.</Title>
            <Paragraph type="secondary">Track the month at a glance and keep every entry in order.</Paragraph>
          </div>
          <Space wrap>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={value => value && setSelectedMonth(value)}
              allowClear={false}
              format="MMMM YYYY"
              aria-label="Choose month"
            />
            <Button type="primary" icon={<FontAwesomeIcon icon={faPlus} />} onClick={openCreate}>
              Add entry
            </Button>
          </Space>
        </Flex>

        {error && (
          <Alert
            type="error"
            showIcon
            closable
            message="Something went wrong"
            description={error}
            action={
              <Button size="small" icon={<FontAwesomeIcon icon={faArrowRotateRight} />} onClick={() => loadEntries()}>
                Retry
              </Button>
            }
            onClose={() => setError('')}
            className="section-block"
          />
        )}

        <section aria-label="Monthly summary" className="section-block">
          <SummaryCards summary={summary} loading={loading} />
        </section>

        <Row gutter={[16, 16]} className="section-block" align="stretch">
          <Col xs={24} xl={16}>
            <Card
              className="entries-card"
              title={
                <div>
                  <Title level={2}>Entries</Title>
                  <Text type="secondary">{visibleEntries.length} shown this month</Text>
                </div>
              }
              extra={
                <Space wrap className="entry-filters">
                  <Input
                    allowClear
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    prefix={<FontAwesomeIcon icon={faSearch} />}
                    placeholder="Search entries"
                    aria-label="Search entries"
                  />
                  <Segmented
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'income', label: 'Income' },
                      { value: 'expense', label: 'Expenses' }
                    ]}
                    aria-label="Filter entries by type"
                  />
                </Space>
              }
            >
              <TransactionList
                entries={visibleEntries}
                loading={loading}
                deletingId={deletingId}
                onEdit={openEdit}
                onDelete={deleteEntry}
                emptyAction={openCreate}
              />
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card
              className="spending-card"
              title={
                <div>
                  <Title level={2}>Spending by category</Title>
                  <Text type="secondary">Where this month’s expenses went</Text>
                </div>
              }
            >
              {renderExpenseBreakdown()}
            </Card>
          </Col>
        </Row>
      </div>

      <TransactionDrawer
        open={drawerOpen}
        entry={editingEntry}
        saving={saving}
        onClose={() => !saving && setDrawerOpen(false)}
        onSave={saveEntry}
      />
    </main>
  );
};

export default Home;
