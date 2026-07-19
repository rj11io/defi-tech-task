import { useEffect } from 'react';
import dayjs from 'dayjs';
import { Alert, Button, DatePicker, Drawer, Form, Input, InputNumber, Segmented, Select, Space } from 'antd';

import { CATEGORIES, TYPE_OPTIONS } from './constants';

const TransactionDrawer = ({ open, entry, defaultDate, saving, saveError, onClose, onSave }) => {
  const [form] = Form.useForm();
  const editing = Boolean(entry);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue(
      entry
        ? {
            ...entry,
            amount: entry.amount / 100,
            date: dayjs(entry.date)
          }
        : {
            type: 'expense',
            amount: undefined,
            category: undefined,
            description: '',
            note: '',
            date: defaultDate || dayjs()
          }
    );
  }, [defaultDate, entry, form, open]);

  const submit = values =>
    onSave({
      ...values,
      amount: Math.round(values.amount * 100),
      date: values.date.toISOString(),
      note: values.note || ''
    });

  const focusFirstError = ({ errorFields }) => {
    const firstField = errorFields[0]?.name;
    if (!firstField) return;
    form.scrollToField(firstField, { behavior: 'smooth', block: 'center' });
    requestAnimationFrame(() => form.getFieldInstance(firstField)?.focus?.());
  };

  return (
    <Drawer
      title={editing ? 'Edit entry' : 'Add an entry'}
      width={440}
      open={open}
      onClose={onClose}
      destroyOnClose
      maskClosable={!saving}
      closable={!saving}
      footer={
        <Space className="drawer-actions">
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="primary" onClick={() => form.submit()} loading={saving}>
            {editing ? 'Save changes' : 'Add entry'}
          </Button>
        </Space>
      }
    >
      <p className="drawer-intro">Record money coming in or going out. All amounts are saved in euro.</p>
      {saveError && (
        <Alert type="error" showIcon message="Entry not saved" description={saveError} className="drawer-alert" />
      )}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={submit}
        onFinishFailed={focusFirstError}
        disabled={saving}
      >
        <Form.Item name="type" label="Entry type" rules={[{ required: true, message: 'Choose an entry type' }]}>
          <Segmented block options={TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Enter an amount' },
            { type: 'number', min: 0.01, max: 1000000000, message: 'Enter an amount between €0.01 and €1 billion' }
          ]}
        >
          <InputNumber
            prefix="€"
            precision={2}
            step={0.01}
            min={0.01}
            max={1000000000}
            className="full-width"
            inputMode="decimal"
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Choose a category' }]}>
          <Select options={CATEGORIES} showSearch optionFilterProp="label" placeholder="Select a category" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, whitespace: true, message: 'Add a short description' },
            { max: 100, message: 'Keep the description under 100 characters' }
          ]}
        >
          <Input placeholder="e.g. Weekly groceries" maxLength={100} showCount />
        </Form.Item>

        <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Choose a date' }]}>
          <DatePicker className="full-width" format="D MMM YYYY" allowClear={false} />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note (optional)"
          rules={[{ max: 500, message: 'Keep the note under 500 characters' }]}
        >
          <Input.TextArea rows={3} placeholder="Anything useful to remember" maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TransactionDrawer;
