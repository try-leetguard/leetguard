"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailVerificationSchema,
  EmailVerificationFormData,
} from "@/lib/validation";

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerificationCode } = useAuth();

  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const watchedCode = watch("code");

  const onSubmit = async (data: EmailVerificationFormData) => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await verifyEmail(email, data.code);
      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message);
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage("Email address is required to resend verification code.");
      return;
    }

    setIsResending(true);
    setMessage("");

    try {
      const result = await resendVerificationCode(email, "");
      setMessage(result.message);
    } catch (error) {
      setMessage("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/leetguard-logo-black.svg"
                alt="LeetGuard Logo"
                width={40}
                height={40}
              />
              <span className="text-3xl font-normal text-black">LeetGuard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center px-6 pt-8">
        <div className="w-full max-w-sm">


          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-medium text-black mb-2">
              Verify Your Email
            </h1>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to your email address
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-4 p-3 rounded text-sm ${
                isSuccess
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Verification Code Field */}
            <div className="space-y-2">
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...register("code")}
                className="w-full border-gray-300 focus:border-black focus:ring-black text-base h-11 text-black placeholder:text-gray-500 rounded-none text-center text-lg tracking-widest"
              />
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || watchedCode.length !== 6}
              className={`w-full h-12 rounded-none font-medium text-base ${
                isLoading || watchedCode.length !== 6
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Verify Email</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black h-10 rounded-none font-medium text-sm"
            >
              {isResending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Resend Code
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Check your spam folder if you don't see the email in your inbox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
