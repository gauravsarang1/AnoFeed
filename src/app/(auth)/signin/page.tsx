"use client"
import React from 'react'
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
import { set } from 'mongoose';

function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    setIsLoading(true);
    apiPublic.post('/sign-in', {
      email: data.email,
      password: data.password,
    }).then(response => {
      console.log('Sign-in successful:', response?.data?.user ?? response?.data ?? response);
    }).catch(error => {
      console.error('Sign-in error:', error?.response?.data?.message ?? error?.response?.data ?? error);
    }).finally(() => { 
      setIsLoading(false);
    })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Sign In
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Welcome back! Please enter your details.
      </p>

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
                placeholder="••••••••"
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
        {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  'Sign in'
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
      

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <a href="/forgot-password" className="hover:underline">
          Forgot password?
        </a>
        <a href="/signup" className="text-indigo-600 hover:underline">
          Create account
        </a>
      </div>
    </form>
  </Form>
</div>

  )
}

export default Page
