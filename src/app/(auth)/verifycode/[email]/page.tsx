"use client";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Smartphone } from "lucide-react"; 
import { apiPublic } from "@/libs/api";
import { fi } from "zod/locales";

type Props = {
  params: Promise<{ email: string }>;
}

export default function Page({params}: Props) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const unwrapedParams = React.use(params);
  const email = unwrapedParams.email

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting OTP And Email:", otp, email);
    try {
      setIsLoading(true);
      const response = await apiPublic.post("/verify-code", { email, otp });
      console.log("OTP verified successfully:", response.data);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    // Add resend logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Floating decoration */}
        <div className="absolute top-20 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-30 blur-lg animate-pulse delay-1000"></div>
        
        <Card className="relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl opacity-10"></div>
          
          <CardHeader className="relative text-center pt-8 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Verify Your Identity
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2 flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" />
              Enter the 6-digit code sent to your device
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="relative px-8 pb-2">
              <div className="flex flex-col items-center space-y-6">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  shouldAutoFocus
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{ width: '60px' }} // Using inline style for width
                      className="h-16 rounded-2xl border-2 border-gray-200 shadow-lg
                                text-center text-2xl font-bold tracking-wider
                                bg-white/90 backdrop-blur-sm
                                focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20
                                transition-all duration-300 ease-out
                                hover:border-blue-300 hover:shadow-xl hover:scale-105
                                focus:scale-110 focus:bg-white
                                placeholder-gray-300"
                    />
                  )}
                  containerStyle="flex justify-center gap-3"
                />
                
                {/* Progress indicator */}
                <div className="flex space-x-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index < otp.length 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-110' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="relative px-8 pb-8 pt-6 flex flex-col gap-4">
              <Button
                type="submit"
                disabled={otp.length < 6 || isLoading}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 
                          hover:from-blue-700 hover:to-indigo-700 
                          shadow-lg hover:shadow-xl transform hover:scale-[1.02] 
                          transition-all duration-200 font-semibold text-white
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                          focus:ring-4 focus:ring-blue-500/30"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Didn't receive the code?</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
                  className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 
                            hover:bg-transparent underline-offset-4 hover:underline"
                >
                  Resend OTP
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                Code expires in 5 minutes
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}