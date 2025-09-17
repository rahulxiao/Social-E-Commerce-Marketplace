"use client";
//CSR
import { useState } from "react";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Validation functions
const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required.';
  }
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return 'Name must contain only letters and spaces.';
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required.';
  }
  if (!/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return null;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

const validateSignupForm = (formData: SignupFormData): SignupValidationErrors => {
  const errors: SignupValidationErrors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return errors;
};

const isSignupFormValid = (formData: SignupFormData): boolean => {
  const errors = validateSignupForm(formData);
  return Object.keys(errors).length === 0;
};

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [validationErrors, setValidationErrors] = useState<SignupValidationErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using vanilla JS
    const validationErrors = validateSignupForm(formData);
    setValidationErrors(validationErrors);
    
    if (!isSignupFormValid(formData)) {
      return;
    }

    console.log("Name:", formData.name);
    console.log("Email:", formData.email);
    console.log("Password:", formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Account
        </button>
      </form>
      
      <p className="text-center mt-6">
        Already have an account? <a href="/buyers/login" className="text-blue-500 hover:underline">Login here</a>
      </p>
    </div>
  );
}

// Named exports for convenience
export { validateName, validateEmail, validatePassword, validateConfirmPassword, validateSignupForm, isSignupFormValid };