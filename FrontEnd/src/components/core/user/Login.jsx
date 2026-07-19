import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';

import Api from '../../../helpers/core/Api';
import AuthContext from '../../../helpers/core/AuthContext';

const { Paragraph, Text, Title } = Typography;

const Login = () => {
  const { t } = useTranslation();
  const { signIn } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setForgotPasswordSent(false);
    form.resetFields();
  }, [form, mode]);

  const handleSubmit = async ({ email = '', password = '' }) => {
    setSubmitting(true);
    setEmailError('');
    setPasswordError('');

    try {
      if (mode === 'login') {
        await signIn(email, password);
        return;
      }

      await Api.post('/auth/forgotPassword', { email });
      setForgotPasswordSent(true);
    } catch (error) {
      const errorCode = error.response?.data?.error;
      if (errorCode === 300 || errorCode === 404)
        setEmailError(t(`core:errors.${errorCode === 404 ? 210 : errorCode}`));
      else if (errorCode === 301) setPasswordError(t(`core:errors.${errorCode}`));
      else error?.globalHandler?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (!navigator.cookieEnabled) {
    return (
      <div className="auth-shell">
        <Alert
          type="error"
          showIcon
          message="Cookies are required"
          description="Enable cookies in your browser to sign in securely, then refresh this page."
        />
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <section className="auth-intro" aria-labelledby="auth-heading">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <Text strong>Daybook</Text>
        </div>
        <Text className="eyebrow">Personal finance, simplified</Text>
        <Title id="auth-heading">Know where your money goes.</Title>
        <Paragraph>
          A focused diary for daily income and expenses, with a clear monthly picture whenever you need it.
        </Paragraph>
        <div className="auth-proof">
          <Text strong>One calm view</Text>
          <Text type="secondary">Monthly totals, spending categories, and every entry together.</Text>
        </div>
      </section>

      <Card className="auth-card">
        <Title level={2}>{mode === 'login' ? 'Welcome back' : 'Reset your password'}</Title>
        <Paragraph type="secondary">
          {mode === 'login' ? 'Sign in to continue to your diary.' : 'We’ll email you a secure reset link.'}
        </Paragraph>

        {mode === 'login' && (
          <Alert
            type="info"
            showIcon
            className="auth-demo-alert"
            message="Demo account"
            description={
              <span>
                Use <strong>test@meblabs.com</strong> with password <strong>testtest</strong>.
              </span>
            }
          />
        )}

        {forgotPasswordSent && (
          <Alert
            message="Reset email sent"
            description="If an account matches that address, check its inbox for the next step."
            type="success"
            showIcon
            className="auth-demo-alert"
          />
        )}

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} disabled={submitting}>
          <Form.Item
            name="email"
            label="Email address"
            validateStatus={emailError ? 'error' : undefined}
            help={emailError || undefined}
            rules={[{ required: true, type: 'email', message: 'Enter a valid email address' }]}
          >
            <Input
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              onChange={() => setEmailError('')}
              disabled={forgotPasswordSent}
            />
          </Form.Item>

          {mode === 'login' && (
            <Form.Item
              name="password"
              label="Password"
              validateStatus={passwordError ? 'error' : undefined}
              help={passwordError || undefined}
              rules={[{ required: true, message: 'Enter your password' }]}
            >
              <Input.Password
                autoComplete="current-password"
                placeholder="Your password"
                onChange={() => setPasswordError('')}
              />
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit" block loading={submitting} disabled={forgotPasswordSent}>
            {mode === 'login' ? 'Sign in' : 'Send reset link'}
          </Button>
        </Form>

        <Button
          type="link"
          block
          className="auth-mode-button"
          onClick={() => setMode(currentMode => (currentMode === 'login' ? 'forgot' : 'login'))}
          disabled={submitting}
        >
          {mode === 'login' ? 'Forgot your password?' : 'Back to sign in'}
        </Button>
      </Card>
    </div>
  );
};

export default Login;
