"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth-context";
import { useTranslations } from "../../lib/translations";

export default function LoginPage() {
  const { setToken } = useAuth();
  const { t } = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/account/login", { 
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = t('auth.loginError');
        let errorDetails = "";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData.details || "";
        } catch {
          // Если не удалось распарсить JSON, используем текст ошибки
          errorMessage = errorText || errorMessage;
        }
        
        // Специальная обработка для ошибок
        if (res.status === 401 || res.status === 403) {
          // Неправильные учетные данные - показываем простое сообщение
          errorMessage = t('auth.invalidCredentials');
          errorDetails = "";
        } else if (res.status === 502) {
          // Ошибка подключения к бэкенду - показываем простое сообщение
          errorMessage = t('auth.invalidCredentials');
          errorDetails = "";
        } else if (res.status >= 400 && res.status < 500) {
          // Другие клиентские ошибки - возможно неправильные учетные данные
          errorMessage = t('auth.invalidCredentials');
          errorDetails = "";
        }
        
        const fullError = errorDetails ? `${errorMessage}\n\n${errorDetails}` : errorMessage;
        throw new Error(fullError);
      }
      
      const data = await res.json();
      
      if (!data.token) {
        throw new Error(t('auth.noToken'));
      }
      
      // Сохраняем токен и перенаправляем на главную страницу
      await setToken(data.token);
      router.push("/");
      
    } catch (err: any) {
      console.error("Ошибка авторизации:", err);
      setError(err?.message ?? t('auth.loginErrorDetails'));
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    setCheckingConnection(true);
    setError(null);
    
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "test"
        })
      });
      
      if (res.status === 502) {
        setError(t('auth.invalidCredentials'));
      } else {
        setError(t('auth.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setCheckingConnection(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{t('auth.welcome')}</h1>
          <p className="text-[var(--muted)]">{t('auth.loginTitle')}</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6 card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                {t('auth.email')}
              </label>
              <input 
                id="email"
                className="w-full rounded-md bg-[var(--card)] border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                placeholder={t('auth.emailPlaceholder')} 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                {t('auth.password')}
              </label>
              <input 
                id="password"
                className="w-full rounded-md bg-[var(--card)] border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                placeholder={t('auth.passwordPlaceholder')} 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-sm text-red-800 whitespace-pre-line">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            className="btn-accent w-full flex items-center justify-center gap-2 py-3 text-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('auth.loginInProgress')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {t('auth.loginButton')}
              </>
            )}
          </button>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-[var(--muted)]">
                {t('auth.noAccount')}{" "}
                <a 
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors" 
                  href="/register"
                >
                  {t('auth.register')}
                </a>
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={checkConnection}
                disabled={checkingConnection}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                {checkingConnection ? (
                  <>
                    <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('auth.checkingConnection')}
                  </>
                ) : (
                  "🔍 " + t('auth.checkConnection')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


