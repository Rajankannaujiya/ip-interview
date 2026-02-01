import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../state/hook";

import sideImage from "../../assets/2.jpg";
import EmailAuth from "./LoginEmail";
import MobileAuth from "./LoginMobile";
import SignupEmail from "./SignupEmail";
import SignupMobile from "./SignupMobile";
import OtpToMobile from "./OtpToMobile";
import OtpToEmail from "./OtpToEmail";

type AuthPageProps = {
  headingText: string;
  formHeadEmail: string;
  formHeadMobile: string;
};

const AuthPage = ({ headingText, formHeadEmail, formHeadMobile }: AuthPageProps) => {
  const [verifyMode, setVerifyMode] = useState<"email" | "mobile">("email");
  const isotpSent = useAppSelector((state) => state.otpVerify.isotpSent);
  const { pathname } = useLocation();

  return (
<div className="h-screen overflow-y-auto scrollbar-hide w-full grid grid-cols-1 lg:grid-cols-2 pb-10 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 space-y-8 backdrop-blur-sm transition-all">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-slate-100">
            {headingText}
          </h1>

          {/* EMAIL / MOBILE TOGGLE */}
          {!isotpSent && (
            <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 gap-1">
              {["email", "mobile"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setVerifyMode(mode as any)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all text-sm md:text-base
                    ${
                      verifyMode === mode
                        ? "bg-bahia-500 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                >
                  {mode === "email" ? formHeadEmail : formHeadMobile}
                </button>
              ))}
            </div>
          )}

          {/* AUTH FORMS */}
          {!isotpSent && (
            <div className="mt-6 space-y-6">
              {(pathname === "/login" || pathname === "/interviewer/login") && (
                <>
                  {verifyMode === "email" && <EmailAuth setVerifyMode={setVerifyMode} />}
                  {verifyMode === "mobile" && <MobileAuth setVerifyMode={setVerifyMode} />}
                </>
              )}

              {(pathname === "/signup" || pathname === "/" || pathname === "/interviewer/signup") && (
                <>
                  {verifyMode === "email" && <SignupEmail setVerifyMode={setVerifyMode} />}
                  {verifyMode === "mobile" && <SignupMobile setVerifyMode={setVerifyMode} />}
                </>
              )}
            </div>
          )}

          {/* OTP SECTION */}
          {isotpSent && (
            <div className="flex flex-col items-center justify-center gap-6 mt-6">
              {verifyMode === "mobile" && <OtpToMobile />}
              {verifyMode === "email" && <OtpToEmail />}
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
