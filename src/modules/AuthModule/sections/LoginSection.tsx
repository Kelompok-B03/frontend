'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { appColors } from '@/constants/colors';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const currentErrors = validateForm();
    if (Object.keys(currentErrors).length > 0) {
      setFormErrors(currentErrors);
      return;
    }

    try {
      await login({ email, password });
      router.push('/')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setFormErrors({ general: (err.response as { data: { message?: string } }).data.message || 'Login failed. Please check your credentials.' });
      } else if (err instanceof Error) {
        setFormErrors({ general: err.message || 'Login failed. Please check your credentials.' });
      } else {
        setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  if (isLoading && !Object.keys(formErrors).length) { // Show loading if not displaying validation errors
    return (
      <section
        style={{ backgroundColor: appColors.babyPinkLight }}
        className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div
          className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse"
          style={{ backgroundColor: appColors.babyTurquoiseLight }}
        ></div>
        <div
          className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse"
          style={{ backgroundColor: appColors.babyPinkAccent }}
        ></div>
        <div style={{ color: appColors.textDark }} className="text-xl font-semibold relative z-10">
          Signing in...
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyPinkLight }}
    >
      <div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse"
        style={{ backgroundColor: appColors.babyTurquoiseLight }}
      ></div>
      <div
        className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse"
        style={{ backgroundColor: appColors.babyPinkAccent }}
      ></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-3xl sm:text-4xl font-extrabold"
            style={{ color: appColors.textDark }}
          >
            Sign in to GatherLove
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 p-6 sm:p-8 rounded-xl shadow-2xl"
          style={{ backgroundColor: appColors.white }}
          noValidate // Disable browser's default validation UI to use custom messages
        >
          {formErrors.general && (
            <p
              className="text-center text-sm p-3 rounded-md mb-4" // Added mb-4
              style={{ color: appColors.white, backgroundColor: appColors.babyPinkAccent }}
            >
              {formErrors.general}
            </p>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.email ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.email ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark
                }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) setFormErrors(prev => ({...prev, email: undefined}));
                }}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email && <p id="email-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                minLength={8}
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.password ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.password ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors(prev => ({...prev, password: undefined}));
                }}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 mt-7 pr-3 flex items-center text-sm leading-5" // Adjust mt if label position changes
                style={{ color: appColors.textDarkMuted }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {formErrors.password && <p id="password-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.password}</p>}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-150"
              style={{
                backgroundColor: appColors.babyTurquoiseAccent,
                color: appColors.white
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm" style={{color: appColors.textDarkMuted}}>
          Don&#39;t have an account?{' '}
          <a href="/auth/register" className="font-medium hover:opacity-80" style={{color: appColors.babyTurquoiseAccent}}>
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
};

export default LoginSection;