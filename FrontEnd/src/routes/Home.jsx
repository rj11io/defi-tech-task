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
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';

import Api from '../helpers/core/Api';
import ContentPanel from '../components/core/layout/ContentPanel';

const { Paragraph, Text, Title } = Typography;
const currencyFormatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

const formatAmount = (amount, type) => `${type === 'income' ? '+' : '-'}${currencyFormatter.format(amount)}`;

const emptyForm = {
  type: 'expense',
  amount: undefined,
  description: '',
  category: 'Other',
  date: dayjs(),
  currency: 'EUR'
};

const Home = () => {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await Api.get('/transactions');
      setTransactions(response.data || []);
    } catch (err) {
      setError('We could not load your diary. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    if (!modalOpen) return;
    if (editingTransaction) form.setFieldsValue({ ...editingTransaction, date: dayjs(editingTransaction.date) });
    else form.resetFields();
  }, [editingTransaction, form, modalOpen]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return transactions.filter(transaction => {
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesSearch =
        !normalizedSearch ||
        `${transaction.description} ${transaction.category}`.toLowerCase().includes(normalizedSearch);
      return matchesType && matchesSearch;
    });
  }, [filterType, search, transactions]);

  const totals = useMemo(() => {
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const openCreate = () => {
    setEditingId(null);
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEdit = transaction => {
    setEditingId(transaction._id);
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    form.resetFields();
  };

  const saveTransaction = async values => {
    setSaving(true);
    try {
      const payload = { ...values, date: values.date.toISOString() };
      if (editingId) await Api.patch(`/transactions/${editingId}`, payload);
      else await Api.post('/transactions', payload);
      message.success(editingId ? 'Entry updated' : 'Entry added');
      closeModal();
      await loadTransactions();
    } catch (err) {
      setError('The entry could not be saved. Please review it and try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteTransaction = async id => {
    try {
      await Api.delete(`/transactions/${id}`);
      message.success('Entry deleted');
      await loadTransactions();
    } catch (err) {
      setError('The entry could not be deleted. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      render: date => dayjs(date).locale('en').format('DD MMM YYYY')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary">{record.category}</Text>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: type => (
        <Tag
          icon={type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          color={type === 'income' ? 'success' : 'error'}
        >
          {type === 'income' ? 'Income' : 'Expense'}
        </Tag>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 140,
      render: (amount, record) => (
        <Text strong type={record.type === 'income' ? 'success' : 'danger'}>
          {formatAmount(amount, record.type)}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            aria-label={`Edit ${record.description}`}
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Button
            aria-label={`Delete ${record.description}`}
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              modal.confirm({
                title: 'Delete this entry?',
                content: 'This action cannot be undone.',
                okText: 'Delete',
                okButtonProps: { danger: true },
                cancelText: 'Keep entry',
                onOk: () => deleteTransaction(record._id)
              })
            }
          />
        </Space>
      )
    }
  ];

  return (
    <ContentPanel
      title="Money diary"
      subtitle="A clear view of what came in, what went out, and where your month is heading."
      titleAction={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add entry
        </Button>
      }
      loading={false}
    >
      <div className="diary-page">
        {error && (
          <Alert
            className="diary-alert"
            type="error"
            showIcon
            message={error}
            action={
              <Button size="small" icon={<ReloadOutlined />} onClick={loadTransactions}>
                Retry
              </Button>
            }
            closable
            onClose={() => setError('')}
          />
        )}

        <Row gutter={[16, 16]} className="diary-stats">
          <Col xs={24} sm={8}>
            <Card bordered={false} className="diary-stat-card">
              <Statistic
                title="Balance"
                value={totals.balance}
                precision={2}
                prefix="€"
                valueStyle={{ color: totals.balance >= 0 ? undefined : '#cf1322' }}
              />
              <Text type="secondary">Income less expenses</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="diary-stat-card">
              <Statistic
                title="Income"
                value={totals.income}
                precision={2}
                prefix={<ArrowUpOutlined />}
                suffix="€"
                valueStyle={{ color: '#389e0d' }}
              />
              <Text type="secondary">Total received</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="diary-stat-card">
              <Statistic
                title="Expenses"
                value={totals.expenses}
                precision={2}
                prefix={<ArrowDownOutlined />}
                suffix="€"
                valueStyle={{ color: '#cf1322' }}
              />
              <Text type="secondary">Total spent</Text>
            </Card>
          </Col>
        </Row>

        <Card
          bordered={false}
          className="diary-table-card"
          title={
            <div>
              <Title level={4} className="diary-section-title">
                Recent entries
              </Title>
              <Paragraph type="secondary" className="diary-section-subtitle">
                {transactions.length
                  ? `${transactions.length} ${transactions.length === 1 ? 'entry' : 'entries'} in your diary`
                  : 'Your saved entries will appear here'}
              </Paragraph>
            </div>
          }
          extra={
            <Space wrap>
              <Input
                allowClear
                aria-label="Search entries"
                prefix={<SearchOutlined />}
                placeholder="Search entries"
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
              <Select
                aria-label="Filter by type"
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: 'all', label: 'All types' },
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expenses' }
                ]}
              />
            </Space>
          }
        >
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={filteredTransactions}
            pagination={{ pageSize: 8, hideOnSinglePage: true, showSizeChanger: false }}
            scroll={{ x: 720 }}
            locale={{
              emptyText: loading ? undefined : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={transactions.length ? 'No entries match these filters' : 'No entries yet'}
                >
                  {!transactions.length && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                      Add your first entry
                    </Button>
                  )}
                </Empty>
              )
            }}
          />
        </Card>

        <Modal
          title={editingId ? 'Edit entry' : 'Add entry'}
          open={modalOpen}
          onCancel={closeModal}
          destroyOnClose
          footer={null}
          width={560}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={emptyForm}
            onFinish={saveTransaction}
            className="diary-form"
          >
            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Choose income or expense' }]}>
              <Select
                options={[
                  { value: 'expense', label: 'Expense' },
                  { value: 'income', label: 'Income' }
                ]}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[
                    { required: true, message: 'Enter an amount' },
                    { type: 'number', min: 0.01, message: 'Amount must be greater than zero' }
                  ]}
                >
                  <InputNumber
                    min={0.01}
                    precision={2}
                    decimalSeparator=","
                    addonAfter="EUR"
                    className="w-full"
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Choose a date' }]}>
                  <DatePicker className="w-full" format="DD MMM YYYY" inputReadOnly={false} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, whitespace: true, max: 160, message: 'Add a short description' }]}
            >
              <Input placeholder="e.g. Groceries, salary, rent" maxLength={160} />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, whitespace: true, max: 64, message: 'Add a category' }]}
            >
              <Input placeholder="e.g. Food, Housing, Work" maxLength={64} />
            </Form.Item>
            <div className="diary-form-footer">
              <Button onClick={closeModal} disabled={saving}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editingId ? 'Save changes' : 'Save entry'}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </ContentPanel>
  );
};

export default Home;
