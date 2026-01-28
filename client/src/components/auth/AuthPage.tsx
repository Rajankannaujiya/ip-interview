import { useState } from 'react';
import sideImage from "../../assets/2.jpg";
import EmailAuth from './LoginEmail';
import MobileAuth from './LoginMobile';
import { useLocation } from 'react-router-dom';
import SignupEmail from './SignupEmail';
import SignupMobile from './SignupMobile';
import { useAppSelector } from '../../state/hook';
import OtpToMobile from './OtpToMobile';
import OtpToEmail from './OtpToEmail';

type LoginPage = {
    headingText: string;
    formHeadEmail: string;
    formHeadMobile: string;
}


const AuthPage = ({ headingText, formHeadEmail, formHeadMobile }: LoginPage) => {
  const [verifyMode, setVerifyMode] = useState<"email" | "mobile">("email");
  const isotpSent = useAppSelector(state => state.otpVerify.isotpSent);
  const { pathname } = useLocation();

  return (
    <div className="h-screen overflow-y-auto scrollbar-thin w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      
      {/* LEFT SECTION */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 transition-all">
          
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-blue-700 dark:text-blue-300 font-serif">
            {headingText}
          </h1>

          {/* EMAIL / MOBILE TOGGLE */}
          {!isotpSent && (
            <div className="hidden md:grid grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {["email", "mobile"].map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setVerifyMode(mode as any)}
                  className={`py-2 rounded-md font-semibold text-lg transition-all
                    ${
                      verifyMode === mode
                        ? "bg-blue-600 text-white shadow"
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
            <>
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
            </>
          )}

          {/* OTP SECTION */}
          {isotpSent && (
            <div className="flex flex-col items-center justify-center gap-6">
              {verifyMode === "mobile" && <OtpToMobile />}
              {verifyMode === "email" && <OtpToEmail />}
            </div>
          )}

        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div className="hidden lg:flex items-center justify-center p-6">
        <img
          src={sideImage}
          alt="Authentication background"
          className="rounded-2xl shadow-2xl object-cover w-full h-full max-h-[90vh]"
        />
      </div>

    </div>
  );
};


export default AuthPage