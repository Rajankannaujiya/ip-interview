import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../state/hook";

import sideImage from "../../assets/2.jpg";
import EmailAuth from "./LoginEmail";
import SignupEmail from "./SignupEmail";
import OtpToEmail from "./OtpToEmail";

type AuthPageProps = {
  headingText: string;
};

const AuthPage = ({ headingText}: AuthPageProps) => {
  const isotpSent = useAppSelector((state) => state.otpVerify.isotpSent);
  const { pathname } = useLocation();

  return (
<div className="h-screen overflow-y-auto scrollbar-hide w-full grid grid-cols-1 lg:grid-cols-2 pb-10 bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 space-y-8 backdrop-blur-md transition-all">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-slate-100">
            {headingText}
          </h1>

        
          {/* AUTH FORMS */}
          {!isotpSent && (
            <div className="mt-6 space-y-6">
              {(pathname === "/login" || pathname === "/interviewer/login") && (
                <>
                   <EmailAuth />
                </>
              )}

              {(pathname === "/signup" || pathname === "/" || pathname === "/interviewer/signup") && (
                <>
                  <SignupEmail />
                </>
              )}
            </div>
          )}

          {/* OTP SECTION */}
          {isotpSent && (
            <div className="flex flex-col items-center justify-center gap-6 mt-6">
              <OtpToEmail />
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center px-6">
        <div className="relative w-full h-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={sideImage}
            alt="Authentication background"
            className="w-full h-full object-cover rounded-3xl transition-transform hover:scale-105"
          />
        </div>
      </div>

    </div>
  );
};

export default AuthPage;
