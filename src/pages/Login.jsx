import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/layout/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Lock, Mail } from '../components/ui/icons';
import { authApi } from '../api/auth';
import { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await authApi.login(form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}`);
      const redirectTo = location.state?.from?.pathname || `/${res.data.user.role}`;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Enter your credentials to access your dashboard."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={Lock}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/55">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-pine-700 hover:text-pine-800">
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-[8px] bg-mint border border-pine-100 px-4 py-3 text-xs text-pine-800 leading-relaxed">
        <strong className="font-semibold">Demo tip:</strong> Sign up as a Patient, Doctor, or
        Admin to explore role-specific dashboards.
      </div>
    </AuthShell>
  );
}
