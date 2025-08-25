"use client";
import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { apiPublic } from '@/libs/api';
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (creating) return;
    setCreating(true);
    apiPublic.post('/sign-up', {
      username: data.username,
      email: data.email,
      password: data.password,
    }).then(response => {
      console.log('Sign-up successful:', response?.data?.message ?? response.data ?? response);
      // Redirect to a welcome or verification page
      router.push(`/verifycode/${data.email}`);
    }).catch(error => {
      console.error('Sign-up error:', error.response?.data?.message ?? error.message ?? error);
    }).finally(() => {
      setCreating(false);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Create an Account
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Join us today! Fill in the details below.
      </p>

      {/* Username */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Username</FormLabel>
            <FormControl>
              <Input
                placeholder="shadcn"
                {...field}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="you@example.com"
                {...field}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="******"
                {...field}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />

      {/* Confirm Password */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="******"
                {...field}
                className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md"
      >
        {creating? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Sign up'
                )}
      </Button>

      {/* OR Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-400 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In */}
      <Button
        type="button"
        variant="outline"
        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 transition"
      >
        <FcGoogle size={22} />
        <span className="font-medium">Sign in with Google</span>
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/signin" className="text-indigo-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  </Form>
</div>

  )
}

export default Page