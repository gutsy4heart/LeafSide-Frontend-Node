"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CountrySelect from "../components/CountrySelect";
import { useAuth } from "../auth-context";
import { useTranslations } from "../../lib/translations";

export default function RegisterPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const { t } = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("KZ");
  const [phoneCode, setPhoneCode] = useState("+7");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!firstName.trim()) errors.firstName = t('auth.firstNameRequired');
    if (!lastName.trim()) errors.lastName = t('auth.lastNameRequired');
    if (!email.trim()) errors.email = t('auth.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = t('auth.invalidEmail');
    if (!phoneNumber.trim()) errors.phoneNumber = t('auth.phoneRequired');
    else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) errors.phoneNumber = t('auth.invalidPhone');
    if (!gender) errors.gender = t('auth.genderRequired');
    if (!password) errors.password = t('auth.passwordRequired');
    else if (password.length < 6) errors.password = t('auth.passwordMinLength');
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form completion progress
  const getFormProgress = () => {
    const fields = [firstName, lastName, email, phoneNumber, gender, password];
    const filledFields = fields.filter(field => field.trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);
    setValidationErrors({});
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch("/api/account/register", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          FirstName: firstName,
          LastName: lastName,
          PhoneNumber: phoneNumber,
          CountryCode: countryCode,
          Gender: gender
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = t('auth.registerError');
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      setOk(true);
      
      // Store registration data in localStorage for use after login
      const registrationData = {
        firstName,
        lastName,
        phoneNumber,
        countryCode,
        gender,
        email
      };
      localStorage.setItem('leafside_registration_data', JSON.stringify(registrationData));
      
      // Automatically log in the user after successful registration
      try {
        console.log('Registration successful, attempting to log in...');
        
        const loginResponse = await fetch('/api/account/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Email: email,
            Password: password
          }),
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('Auto-login successful:', loginData);
          
          if (loginData.token) {
            // Set the token in auth context
            await setToken(loginData.token);
            
            // Try to update the profile with the registration data
            const profileUpdateResponse = await fetch('/api/account/profile', {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                FirstName: firstName,
                LastName: lastName,
                PhoneNumber: phoneNumber,
                CountryCode: countryCode,
                Gender: gender
              }),
            });
            
            if (profileUpdateResponse.ok) {
              console.log('Profile updated successfully after registration');
            } else {
              console.log('Failed to update profile after registration, will use localStorage fallback');
            }
            
            // Redirect to profile page
            setTimeout(() => {
              router.push("/profile");
            }, 1000);
            return;
          }
        } else {
          console.log('Auto-login failed, will redirect to login page');
        }
      } catch (error) {
        console.log('Error during auto-login:', error);
      }
      
      // Fallback: redirect to login page if auto-login fails
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Handle specific error types
      if (err?.message === "Backend unreachable") {
        setError(t('auth.serverUnavailableDetails'));
      } else if (err?.message?.includes("fetch")) {
        setError(t('auth.loginErrorDetails'));
      } else {
        setError(err?.message ?? t('auth.loginErrorDetails'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-[var(--muted)] text-lg">{t('auth.welcome')}</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6 card p-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">{t('auth.progress')}</span>
              <span className="text-[var(--foreground)] font-medium">{getFormProgress()}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getFormProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Personal information */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
{t('auth.personalInfo')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-[var(--foreground)]">
                  {t('auth.firstName')} <span className="text-red-500">*</span>
                </label>
                <input 
                  id="firstName"
                  className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    validationErrors.firstName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20'
                  }`}
                  placeholder={t('auth.firstNamePlaceholder')} 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  disabled={loading}
                />
                {validationErrors.firstName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-[var(--foreground)]">
                  {t('auth.lastName')} <span className="text-red-500">*</span>
                </label>
                <input 
                  id="lastName"
                  className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    validationErrors.lastName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20'
                  }`}
                  placeholder={t('auth.lastNamePlaceholder')} 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
                  disabled={loading}
                />
                {validationErrors.lastName && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                {t('auth.email')} <span className="text-red-500">*</span>
              </label>
              <input 
                id="email"
                className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                  validationErrors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20'
                }`}
                placeholder={t('auth.emailPlaceholder')} 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Contact information */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('auth.contactInfo')}
              </h3>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('auth.phone')} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-40">
                  <CountrySelect
                    value={countryCode}
                    onChange={(code, phone) => {
                      setCountryCode(code);
                      setPhoneCode(phone);
                    }}
                    disabled={loading}
                  />
                </div>
                <input 
                  className={`flex-1 h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                    validationErrors.phoneNumber 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20'
                  }`}
                  placeholder={t('auth.phonePlaceholder')} 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  required 
                  disabled={loading}
                />
              </div>
              {validationErrors.phoneNumber ? (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.phoneNumber}
                </p>
              ) : (
                <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('auth.selectedCountryCode')}: <span className="font-medium text-[var(--foreground)]">{phoneCode}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                {t('auth.gender')} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "Male", label: t('auth.male'), icon: "👨" },
                  { value: "Female", label: t('auth.female'), icon: "👩" },
                  { value: "Other", label: t('auth.other'), icon: "👤" }
                ].map((option) => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={gender === option.value}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={loading}
                      className="sr-only"
                    />
                    <div className={`w-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      gender === option.value 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : validationErrors.gender
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-white/20 bg-[var(--card)] hover:border-white/40 hover:bg-[var(--card)]/80'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-xs font-medium text-[var(--foreground)] text-center">{option.label}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {validationErrors.gender && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('auth.security')}
              </h3>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <input 
                id="password"
                className={`w-full h-10 rounded-lg bg-[var(--card)] border px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-white/30 ${
                  validationErrors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-white/20'
                }`}
                placeholder={t('auth.passwordPlaceholder')} 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
              {validationErrors.password ? (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.password}
                </p>
              ) : password ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          password.length >= 8 ? 'bg-green-500' : 
                          password.length >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((password.length / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      {password.length >= 8 ? t('auth.passwordStrength.strong') : password.length >= 6 ? t('auth.passwordStrength.medium') : t('auth.passwordStrength.weak')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    {t('auth.passwordMinLength')}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">
                  {t('auth.passwordMinLength')}
                </p>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-500 mb-1">
                    {t('auth.registerError')}
                  </h3>
                  <p className="text-sm text-red-400 mb-3">{error}</p>
                  {error.includes(t('auth.serverUnavailableDetails')) && (
                    <button
                      onClick={() => {
                        setError("");
                        onSubmit({} as React.FormEvent);
                      }}
                      disabled={loading}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-md hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 transition-colors"
                    >
                      {loading ? t('auth.attempting') : t('auth.tryAgain')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {ok && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-500 mb-1">
                    {t('auth.registerSuccess')}
                  </h3>
                  <p className="text-sm text-green-400">{t('auth.accountCreated')}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Registration button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading || ok}
              className="w-full h-11 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('auth.creatingAccount')}</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>{t('auth.createAccount')}</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">
              {t('auth.alreadyHaveAccount')}{" "}
              <a 
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors" 
                href="/login"
              >
                {t('auth.loginHere')}
              </a>
            </p>
          </div>
      </form>
      </div>
    </div>
  );
}


