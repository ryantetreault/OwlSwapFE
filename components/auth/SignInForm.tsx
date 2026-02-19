"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { SignInRequest } from "@/types/auth.types";

export function SignInForm() {
  const { signIn, error, clearError, loading } = useAuth();
  const [formData, setFormData] = useState<SignInRequest>({
    username: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<SignInRequest>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<SignInRequest> = {};

    if (!formData.username) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await signIn(formData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Error handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name as keyof SignInRequest]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      <Input
        label="Username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={validationErrors.username}
        placeholder="your_username"
        autoComplete="username"
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
        autoComplete="current-password"
        required
      />

      <Button type="submit" isLoading={loading} className="w-full">
        Sign In
      </Button>

      <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-semibold text-[#232C64] hover:underline dark:text-blue-400"
        >
          Create Account
        </a>
      </p>
    </form>
  );
}
