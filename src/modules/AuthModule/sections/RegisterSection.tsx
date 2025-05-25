'use client';

import React, { useState, FormEvent } from 'react';
import { appColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import RegisterRequest from '@/types/requests/RegisterRequest';


// This interface is for the form's state, including confirmPassword
interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
  general?: string;
}

const RegisterSection = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
    if (name === 'password' && formErrors.confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const { name, email, password, confirmPassword, phoneNumber, bio, profilePictureUrl } = formData;

    // Name validation
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    } else if (name.trim().length > 100) {
      errors.name = 'Full name cannot exceed 100 characters.';
    }

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*[a-z])/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter.';
    }

    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password && confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // Phone Number validation (optional field, but validate if provided)
    if (phoneNumber && phoneNumber.trim() && !/^\+?[0-9\s-()]{7,20}$/.test(phoneNumber.trim())) {
        errors.phoneNumber = 'Please enter a valid phone number.';
    }

    // Bio validation (optional field, but validate if provided)
    if (bio && bio.trim() && bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters.';
    } else if (bio && bio.trim() && !/^[a-zA-Z0-9\s.,!?'"-]+$/.test(bio.trim())) {
      errors.bio = 'Bio can only contain letters, numbers, spaces, and basic punctuation.';
    } else if (bio && bio.trim() && bio.length < 10) {
      errors.bio = 'Bio must be at least 10 characters long.';
    }
    // Profile Picture URL validation (optional field, but validate if provided)
    if (profilePictureUrl && profilePictureUrl.trim() && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(profilePictureUrl.trim())) {
      errors.profilePictureUrl = 'Please enter a valid image URL (jpg, jpeg, png, gif).';
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

    // Prepare data matching AuthContext's RegisterRequest type
    const payload: RegisterRequest = { ...formData };
    delete (payload as Partial<RegisterFormData>).confirmPassword;
    if (payload.phoneNumber && !payload.phoneNumber.trim()) {
      delete payload.phoneNumber;
    }
    if (payload.bio && !payload.bio.trim()) {
      delete payload.bio;
    }
    if (payload.profilePictureUrl && !payload.profilePictureUrl.trim()) {
      delete payload.profilePictureUrl;
    }

    try {
      await register(payload);
      alert('Registration successful! You will be redirected to the login page.');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setFormErrors({ general: (err.response as { data: { message?: string } }).data.message || 'Registration failed. Please try again.' });
      } else if (err instanceof Error) {
        setFormErrors({ general: err.message || 'Registration failed. Please try again.' });
      } else {
        setFormErrors({ general: 'An unexpected error occurred during registration.' });
      }
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: appColors.babyPinkLight }}
    >
      {/* Animated Blobs */}
      <div
        className="absolute top-0 -left-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse"
        style={{ backgroundColor: appColors.babyTurquoiseLight }}
      ></div>
      <div
        className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 rounded-full opacity-30 filter blur-3xl animate-blob-pulse-reverse"
        style={{ backgroundColor: appColors.babyPinkAccent }}
      ></div>

      {/* Registration Form Card */}
      <div className="relative z-10 w-full max-w-lg space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-3xl sm:text-4xl font-extrabold"
            style={{ color: appColors.textDark }}
          >
            Create your GatherLove Account
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 p-6 sm:p-8 rounded-xl shadow-2xl"
          style={{ backgroundColor: appColors.white }}
          noValidate
        >
          {formErrors.general && (
            <p
              className="text-center text-sm p-3 rounded-md mb-4"
              style={{ color: appColors.white, backgroundColor: appColors.babyPinkAccent }}
            >
              {formErrors.general}
            </p>
          )}
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.name ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.name ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark,
                }}
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? "name-error" : undefined}
                disabled={isLoading}
              />
              {formErrors.name && <p id="name-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.name}</p>}
            </div>

            {/* Email Address */}
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
                  color: appColors.textDark,
                }}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              {formErrors.email && <p id="email-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.password ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.password ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark,
                }}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.password}
                aria-describedby={formErrors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 mt-7 pr-3 flex items-center text-sm leading-5"
                style={{ color: appColors.textDarkMuted }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {formErrors.password && <p id="password-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.confirmPassword ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.confirmPassword ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark,
                }}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.confirmPassword}
                aria-describedby={formErrors.confirmPassword ? "confirmPassword-error" : undefined}
                disabled={isLoading}
              />
               <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 mt-7 pr-3 flex items-center text-sm leading-5"
                style={{ color: appColors.textDarkMuted }}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {formErrors.confirmPassword && <p id="confirmPassword-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.confirmPassword}</p>}
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
                Phone Number <span className="text-xs" style={{color: appColors.textDarkMuted}}>(Optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.phoneNumber ? 'ring-1' : ''}`}
                style={{
                  borderColor: formErrors.phoneNumber ? appColors.babyPinkAccent : appColors.lightGrayBg,
                  color: appColors.textDark,
                }}
                placeholder="e.g., 628123456789"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                aria-invalid={!!formErrors.phoneNumber}
                aria-describedby={formErrors.phoneNumber ? "phoneNumber-error" : undefined}
                disabled={isLoading}
              />
              {formErrors.phoneNumber && <p id="phoneNumber-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.phoneNumber}</p>}
            </div>
          </div>

          {/* {* Bio (Optional) */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
              Bio <span className="text-xs" style={{color: appColors.textDarkMuted}}>(Optional)</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.bio ? 'ring-1' : ''}`}
              style={{
                borderColor: formErrors.bio ? appColors.babyPinkAccent : appColors.lightGrayBg,
                color: appColors.textDark,
              }}
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
              aria-invalid={!!formErrors.bio}
              aria-describedby={formErrors.bio ? "bio-error" : undefined}
              disabled={isLoading}
            />
            {formErrors.bio && <p id="bio-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.bio}</p>}
            </div>

        {/* Profile Picture URL (Optional) */}
        <div>
            <label htmlFor="profilePictureUrl" className="block text-sm font-medium mb-1" style={{color: appColors.textDarkMuted}}>
            Profile Picture URL <span className="text-xs" style={{color: appColors.textDarkMuted}}>(Optional)</span>
            </label>
            <input
            id="profilePictureUrl"
            name="profilePictureUrl"
            type="url"
            className={`appearance-none block w-full px-3 py-2.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${formErrors.profilePictureUrl ? 'ring-1' : ''}`}
            style={{
                borderColor: formErrors.profilePictureUrl ? appColors.babyPinkAccent : appColors.lightGrayBg,
                color: appColors.textDark,
            }}
            placeholder="https://example.com/profile.jpg"
            value={formData.profilePictureUrl}
            onChange={handleInputChange}
            aria-invalid={!!formErrors.profilePictureUrl}
            aria-describedby={formErrors.profilePictureUrl ? "profilePictureUrl-error" : undefined}
            disabled={isLoading}
            />
            {formErrors.profilePictureUrl && <p id="profilePictureUrl-error" className="text-xs mt-1" style={{ color: appColors.babyPinkAccent }}>{formErrors.profilePictureUrl}</p>}
        </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading} // Using isLoading from AuthContext
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-150"
              style={{
                backgroundColor: appColors.babyTurquoiseAccent,
                color: appColors.white,
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm" style={{color: appColors.textDarkMuted}}>
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium hover:opacity-80" style={{color: appColors.babyTurquoiseAccent}}>
            Sign In
          </a>
        </p>
      </div>
    </section>
  );
};

export default RegisterSection;