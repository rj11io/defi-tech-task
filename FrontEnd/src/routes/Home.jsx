import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Skeleton,
  Statistic,
  Table,
  Tag,
  theme,
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
const PAGE_SIZE = 20;

const formatAmount = (amount, type, locale) =>
  `${type === 'income' ? '+' : '-'}${new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount)}`;

const emptyForm = {
  type: 'expense',
  amount: undefined,
  description: '',
  category: 'Other',
  date: dayjs(),
  currency: 'EUR'
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const requestSequence = useRef(0);
  const locale = i18n.language === 'it' ? 'it-IT' : 'en-IE';

  const loadTransactions = useCallback(
    async (requestedPage = page) => {
      const sequence = requestSequence.current + 1;
      requestSequence.current = sequence;
      setLoading(true);
      setError('');
      try {
        const params = { page: requestedPage, limit: PAGE_SIZE };
        if (filterType !== 'all') params.type = filterType;
        if (search.trim()) params.search = search.trim();
        const response = await Api.get('/transactions', { params });
        if (sequence !== requestSequence.current) return;
        setTransactions(response.data || []);
        setTotalCount(Number(response.headers['x-total-count'] || 0));
        setSummary({
          income: Number(response.headers['x-total-income'] || 0),
          expense: Number(response.headers['x-total-expense'] || 0)
        });
      } catch (err) {
        if (sequence !== requestSequence.current) return;
        setError(t('diary.loadError'));
      } finally {
        if (sequence === requestSequence.current) setLoading(false);
      }
    },
    [filterType, page, search, t]
  );

  useEffect(() => {
    loadTransactions(page);
  }, [loadTransactions, page]);

  useEffect(() => {
    if (!modalOpen) return;
    if (editingTransaction) form.setFieldsValue({ ...editingTransaction, date: dayjs(editingTransaction.date) });
    else form.resetFields();
  }, [editingTransaction, form, modalOpen]);

  const totals = { income: summary.income, expenses: summary.expense, balance: summary.income - summary.expense };

  const openCreate = () => {
    setEditingId(null);
    setEditingTransaction(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = transaction => {
    setEditingId(transaction._id);
    setEditingTransaction(transaction);
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    form.resetFields();
    setFormError('');
  };

  const saveTransaction = async values => {
    setSaving(true);
    try {
      const payload = { ...values, date: values.date.format('YYYY-MM-DD') };
      if (editingId) await Api.patch(`/transactions/${editingId}`, payload);
      else await Api.post('/transactions', payload);
      message.success(editingId ? t('diary.entryUpdated') : t('diary.entryAdded'));
      closeModal();
      const nextPage = editingId ? page : 1;
      if (!editingId) setPage(1);
      await loadTransactions(nextPage);
    } catch (err) {
      setFormError(t('diary.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const deleteTransaction = async id => {
    try {
      await Api.delete(`/transactions/${id}`);
      message.success(t('diary.entryDeleted'));
      await loadTransactions(page);
    } catch (err) {
      setError(t('diary.deleteError'));
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      render: date => dayjs(date).locale(i18n.language).format('DD MMM YYYY')
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
          {type === 'income' ? t('diary.income') : t('diary.expense')}
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
          {formatAmount(amount, record.type, locale)}
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
                title: t('diary.deleteTitle'),
                content: t('diary.deleteDescription'),
                okText: t('diary.delete'),
                okButtonProps: { danger: true },
                cancelText: t('diary.keepEntry'),
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
      title={t('diary.title')}
      subtitle={t('diary.subtitle')}
      titleAction={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t('diary.addEntry')}
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
                {t('diary.retry')}
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
                title={t('diary.balance')}
                value={loading ? 0 : totals.balance}
                precision={2}
                prefix="€"
                valueStyle={{ color: totals.balance >= 0 ? undefined : token.colorError }}
              />
              {loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <Text type="secondary">{t('diary.balanceHint')}</Text>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="diary-stat-card">
              <Statistic
                title={t('diary.income')}
                value={loading ? 0 : totals.income}
                precision={2}
                prefix={<ArrowUpOutlined />}
                suffix="€"
                valueStyle={{ color: token.colorSuccess }}
              />
              {loading ? <Skeleton.Input active size="small" /> : <Text type="secondary">{t('diary.incomeHint')}</Text>}
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} className="diary-stat-card">
              <Statistic
                title={t('diary.expenses')}
                value={loading ? 0 : totals.expenses}
                precision={2}
                prefix={<ArrowDownOutlined />}
                suffix="€"
                valueStyle={{ color: token.colorError }}
              />
              {loading ? (
                <Skeleton.Input active size="small" />
              ) : (
                <Text type="secondary">{t('diary.expensesHint')}</Text>
              )}
            </Card>
          </Col>
        </Row>

        <Card
          bordered={false}
          className="diary-table-card"
          title={
            <div>
              <Title level={4} className="diary-section-title">
                {t('diary.recentEntries')}
              </Title>
              <Paragraph type="secondary" className="diary-section-subtitle">
                {totalCount ? t('diary.entriesCount', { count: totalCount }) : t('diary.savedEntries')}
              </Paragraph>
            </div>
          }
          extra={
            <Space wrap>
              <Input
                allowClear
                aria-label={t('diary.search')}
                prefix={<SearchOutlined />}
                placeholder={t('diary.search')}
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
              <Select
                aria-label={t('diary.filterByType')}
                value={filterType}
                onChange={value => {
                  setFilterType(value);
                  setPage(1);
                }}
                options={[
                  { value: 'all', label: t('diary.allTypes') },
                  { value: 'income', label: t('diary.income') },
                  { value: 'expense', label: t('diary.expenses') }
                ]}
              />
            </Space>
          }
        >
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={transactions}
            pagination={{
              current: page,
              pageSize: PAGE_SIZE,
              total: totalCount,
              hideOnSinglePage: true,
              showSizeChanger: false,
              onChange: setPage
            }}
            scroll={{ x: 720 }}
            locale={{
              emptyText: loading ? undefined : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={totalCount ? t('diary.noMatching') : t('diary.noEntries')}
                >
                  {!totalCount && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                      {t('diary.addFirst')}
                    </Button>
                  )}
                </Empty>
              )
            }}
          />
        </Card>

        <Modal
          title={editingId ? t('diary.editEntry') : t('diary.addEntry')}
          open={modalOpen}
          onCancel={closeModal}
          destroyOnClose
          footer={null}
          width={560}
        >
          {formError && (
            <Alert
              className="diary-form-alert"
              type="error"
              showIcon
              message={formError}
              closable
              onClose={() => setFormError('')}
            />
          )}
          <Form
            form={form}
            layout="vertical"
            initialValues={emptyForm}
            onFinish={saveTransaction}
            className="diary-form"
          >
            <Form.Item
              label={t('diary.type')}
              name="type"
              rules={[{ required: true, message: t('diary.typeRequired') }]}
            >
              <Select
                options={[
                  { value: 'expense', label: t('diary.expense') },
                  { value: 'income', label: t('diary.income') }
                ]}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={t('diary.amount')}
                  name="amount"
                  rules={[
                    { required: true, message: t('diary.amountRequired') },
                    { type: 'number', min: 0.01, message: t('diary.amountPositive') }
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
                <Form.Item
                  label={t('diary.date')}
                  name="date"
                  rules={[{ required: true, message: t('diary.dateRequired') }]}
                >
                  <DatePicker className="w-full" format="DD MMM YYYY" inputReadOnly={false} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label={t('diary.description')}
              name="description"
              rules={[{ required: true, whitespace: true, max: 160, message: t('diary.descriptionRequired') }]}
            >
              <Input placeholder="e.g. Groceries, salary, rent" maxLength={160} />
            </Form.Item>
            <Form.Item
              label={t('diary.category')}
              name="category"
              rules={[{ required: true, whitespace: true, max: 64, message: t('diary.categoryRequired') }]}
            >
              <Input placeholder="e.g. Food, Housing, Work" maxLength={64} />
            </Form.Item>
            <div className="diary-form-footer">
              <Button onClick={closeModal} disabled={saving}>
                {t('diary.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                {editingId ? t('diary.saveChanges') : t('diary.saveEntry')}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </ContentPanel>
  );
};

export default Home;
