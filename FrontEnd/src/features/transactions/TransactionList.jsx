import { Button, Empty, Grid, List, Popconfirm, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { CATEGORY_LABELS } from './constants';
import { formatCurrency, formatEntryDate } from './utils';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const EntryActions = ({ entry, deletingId, onEdit, onDelete }) => (
  <Space size={4}>
    <Tooltip title="Edit entry">
      <Button
        type="text"
        aria-label={`Edit ${entry.description}`}
        icon={<FontAwesomeIcon icon={faPen} />}
        onClick={() => onEdit(entry)}
      />
    </Tooltip>
    <Popconfirm
      title="Delete this entry?"
      description="This action cannot be undone."
      okText="Delete"
      okButtonProps={{ danger: true, loading: deletingId === entry._id }}
      cancelText="Keep entry"
      onConfirm={() => onDelete(entry._id)}
    >
      <Tooltip title="Delete entry">
        <Button
          type="text"
          danger
          aria-label={`Delete ${entry.description}`}
          icon={<FontAwesomeIcon icon={faTrash} />}
        />
      </Tooltip>
    </Popconfirm>
  </Space>
);

const TransactionList = ({ entries, loading, deletingId, onEdit, onDelete, emptyAction }) => {
  const screens = useBreakpoint();

  const empty = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span>
          No entries match this view.
          <br />
          Add one or adjust your filters.
        </span>
      }
    >
      <Button type="primary" onClick={emptyAction}>
        Add first entry
      </Button>
    </Empty>
  );

  if (!screens.md) {
    return (
      <List
        className="entry-list"
        loading={loading}
        locale={{ emptyText: empty }}
        dataSource={entries}
        renderItem={entry => (
          <List.Item
            actions={[
              <EntryActions key="actions" entry={entry} deletingId={deletingId} onEdit={onEdit} onDelete={onDelete} />
            ]}
          >
            <List.Item.Meta
              title={entry.description}
              description={
                <Space size={8} wrap>
                  <span>{formatEntryDate(entry.date)}</span>
                  <Tag bordered={false}>{CATEGORY_LABELS[entry.category] || entry.category}</Tag>
                </Space>
              }
            />
            <Text className={`entry-amount ${entry.type}`} strong>
              {entry.type === 'income' ? '+' : '−'}
              {formatCurrency(entry.amount)}
            </Text>
          </List.Item>
        )}
      />
    );
  }

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description, entry) => (
        <div>
          <Text strong>{description}</Text>
          {entry.note && (
            <Text type="secondary" className="entry-note" ellipsis={{ tooltip: entry.note }}>
              {entry.note}
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: category => <Tag bordered={false}>{CATEGORY_LABELS[category] || category}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      render: formatEntryDate
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 150,
      render: (amount, entry) => (
        <Text className={`entry-amount ${entry.type}`} strong>
          {entry.type === 'income' ? '+' : '−'}
          {formatCurrency(amount)}
        </Text>
      )
    },
    {
      title: <span className="sr-only">Actions</span>,
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, entry) => <EntryActions entry={entry} deletingId={deletingId} onEdit={onEdit} onDelete={onDelete} />
    }
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={entries}
      loading={loading}
      locale={{ emptyText: empty }}
      pagination={entries.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
      scroll={{ x: 760 }}
    />
  );
};

export default TransactionList;
