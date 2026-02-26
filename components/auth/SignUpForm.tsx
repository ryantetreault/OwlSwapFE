"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { SignUpRequest } from "@/types/auth.types";

export function SignUpForm() {
  const { signUp, error, clearError, loading } = useAuth();
  const [formData, setFormData] = useState<
    SignUpRequest & { confirmPassword: string }
  >({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<typeof formData>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<typeof formData> = {};

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!formData.username) {
      errors.username = "Username is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    } else if (!formData.email.endsWith("@westfield.ma.edu")) {
      errors.email = "Email must be a Westfield State University address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...signUpData } = formData;
      await signUp(signUpData);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof typeof formData]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-0">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={validationErrors.firstName}
            placeholder="John"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="mb-0">
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={validationErrors.lastName}
            placeholder="Owl"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={validationErrors.username}
        placeholder="john_owl"
        autoComplete="username"
        required
      />

      <Input
        label="Email (must be @westfield.ma.edu)"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        placeholder="your.email@westfield.ma.edu"
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={validationErrors.confirmPassword}
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />

      <Button type="submit" isLoading={loading} className="w-full">
        Create Account
      </Button>

      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <a
          href="/signin"
          className="font-semibold text-[#232C64] hover:underline dark:text-blue-400"
        >
          Sign In
        </a>
      </p>
    </form>
  );
}
