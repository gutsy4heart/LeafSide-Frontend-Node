"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type UserInfo = {
  email: string;
  name?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
  gender?: string;
  roles?: string[];
  role?: string;
  createdAt?: string;
  exp?: number;
};

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  isAdmin: boolean;
  isLoading: boolean;
  setToken: (t: string | null) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  checkAndRefreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "leafside_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearAuth = () => {
    setTokenState(null);
    setUserInfo(null);
    try { 
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('leafside_registration_data');
    } catch {}
  };

  // Функция для загрузки профиля пользователя с бэкенда
  const fetchUserProfile = async (token: string): Promise<UserInfo | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/account/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.log('fetchUserProfile - Unauthorized, but not clearing auth');
        return null;
      }

      if (!response.ok) {
        console.log('fetchUserProfile - Response not ok:', response.status);
        return null;
      }

      const profile = await response.json();
      console.log('fetchUserProfile - Raw profile data:', profile);
      
      return {
        id: profile.id || profile.Id,
        email: profile.email || profile.Email,
        name: (profile.firstName || profile.FirstName || '') + ' ' + (profile.lastName || profile.LastName || ''),
        firstName: profile.firstName || profile.FirstName,
        lastName: profile.lastName || profile.LastName,
        phoneNumber: profile.phoneNumber || profile.PhoneNumber,
        countryCode: profile.countryCode || profile.CountryCode,
        gender: profile.gender || profile.Gender,
        roles: profile.roles || profile.Roles || [],
        createdAt: profile.createdAt || profile.CreatedAt
      };
    } catch (error) {
      console.log('fetchUserProfile - Error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения данных регистрации из localStorage
  const getRegistrationData = (): UserInfo | null => {
    try {
      const data = localStorage.getItem('leafside_registration_data');
      if (data) {
        const registrationData = JSON.parse(data);
        console.log('AuthContext - Found registration data:', registrationData);
        return {
          email: registrationData.email,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          phoneNumber: registrationData.phoneNumber,
          countryCode: registrationData.countryCode,
          gender: registrationData.gender,
          name: `${registrationData.firstName} ${registrationData.lastName}`.trim()
        };
      }
    } catch (error) {
      console.log('AuthContext - Error parsing registration data:', error);
    }
    return null;
  };

  // Проверка истечения срока действия токена (exp)
  const isTokenExpired = (t: string): boolean => {
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload?.exp) return false;
      const nowSeconds = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp <= nowSeconds;
      console.log('Token expiration check:', { exp: payload.exp, now: nowSeconds, isExpired });
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Если не можем декодировать токен, считаем его истекшим
    }
  };

  // Функция для декодирования токена и получения информации о пользователе
  const decodeToken = (token: string): UserInfo | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userId = payload.sub || payload.id;
      
      // Обрабатываем роли правильно
      let userRoles: string[] = [];
      if (roles) {
        if (Array.isArray(roles)) {
          userRoles = roles;
        } else if (typeof roles === 'string') {
          userRoles = [roles];
        }
      }
      
      console.log('DecodeToken - Raw roles from JWT:', roles);
      console.log('DecodeToken - Processed roles:', userRoles);
      
      return {
        email: payload.email || payload.sub || "Пользователь",
        name: payload.name || payload.given_name || "Пользователь",
        id: userId || "Неизвестно",
        firstName: payload.firstName || payload.given_name,
        lastName: payload.lastName || payload.family_name,
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
        gender: payload.gender,
        roles: userRoles,
        role: userRoles[0] || payload.role,
        createdAt: payload.createdAt,
        exp: payload.exp,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const t = localStorage.getItem(STORAGE_KEY);
        if (t) {
          if (isTokenExpired(t)) { 
            clearAuth(); 
            setIsLoading(false);
            return; 
          }
          setTokenState(t);
          
          // Сначала декодируем токен для получения ролей
          const user = decodeToken(t);
          if (user) {
            setUserInfo(user);
          }
          
          // Затем пытаемся получить полный профиль с сервера (не критично)
          try {
            const userProfile = await fetchUserProfile(t);
            if (userProfile) {
              setUserInfo(userProfile);
            }
          } catch (error) {
            console.log('Failed to fetch user profile, using token data:', error);
            // Не очищаем авторизацию, если не удалось получить профиль
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setToken = async (t: string | null) => {
    console.log('AuthContext - Setting token:', t ? t.substring(0, 20) + '...' : 'null');
    setTokenState(t);
    if (t) {
      if (isTokenExpired(t)) { 
        console.log('AuthContext - Token expired, clearing auth');
        clearAuth(); 
        return; 
      }
      
      // Сначала сохраняем токен в localStorage
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {}
      
      // Декодируем токен для получения ролей
      const user = decodeToken(t);
      if (user) {
        console.log('AuthContext - Decoded user from token:', user);
        setUserInfo(user);
      }
      
      // Затем пытаемся получить полный профиль с сервера (не критично для авторизации)
      try {
        const userProfile = await fetchUserProfile(t);
        if (userProfile) {
          console.log('AuthContext - Fetched user profile from server:', userProfile);
          setUserInfo(userProfile);
        } else {
          // Если профиль с сервера недоступен, попробуем использовать данные регистрации
          const registrationData = getRegistrationData();
          if (registrationData && registrationData.email === user?.email) {
            console.log('AuthContext - Using registration data as fallback:', registrationData);
            setUserInfo({
              ...user,
              ...registrationData
            });
            // Очищаем данные регистрации после использования
            localStorage.removeItem('leafside_registration_data');
          }
        }
      } catch (error) {
        console.log('AuthContext - Failed to fetch user profile, using token data:', error);
        // Если профиль с сервера недоступен, попробуем использовать данные регистрации
        const registrationData = getRegistrationData();
        if (registrationData && registrationData.email === user?.email) {
          console.log('AuthContext - Using registration data as fallback after error:', registrationData);
          setUserInfo({
            ...user,
            ...registrationData
          });
          // Очищаем данные регистрации после использования
          localStorage.removeItem('leafside_registration_data');
        }
      }
    } else {
      console.log('AuthContext - Clearing auth (no token)');
      clearAuth();
    }
  };

  const logout = () => {
    clearAuth();
  };

  // Функция для проверки и обновления токена при необходимости
  const checkAndRefreshToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    // Проверяем, истек ли токен
    if (isTokenExpired(token)) {
      console.log('AuthContext - Token expired, attempting refresh');
      return await refreshToken();
    }
    
    return true;
  };

  // Функция для обновления токена
  const refreshToken = async (): Promise<boolean> => {
    try {
      console.log('AuthContext - Attempting to refresh token');
      const response = await fetch('/api/account/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          console.log('AuthContext - Token refreshed successfully');
          // Используем setToken для полного обновления состояния
          await setToken(data.token);
          return true;
        }
      } else {
        console.log('AuthContext - Token refresh failed:', response.status);
      }
    } catch (error) {
      console.error('AuthContext - Error refreshing token:', error);
    }
    
    // Если обновление не удалось, выходим из системы
    console.log('AuthContext - Token refresh failed, logging out');
    clearAuth();
    return false;
  };

  const isAdmin = useMemo(() => {
    // Проверяем роль в массиве roles или в поле role из JWT токена
    // Суперадмин и админ имеют доступ к админ-панели
    const hasAdminRole = userInfo?.roles?.includes("Admin") || 
                        userInfo?.roles?.includes("admin") ||
                        userInfo?.roles?.includes("SuperAdmin") ||
                        userInfo?.roles?.includes("superadmin") ||
                        userInfo?.role === "Admin" ||
                        userInfo?.role === "admin" ||
                        userInfo?.role === "SuperAdmin" ||
                        userInfo?.role === "superadmin" ||
                        false;
    console.log('Auth Context - User roles:', userInfo?.roles);
    console.log('Auth Context - User role:', userInfo?.role);
    console.log('Auth Context - Is admin:', hasAdminRole);
    return hasAdminRole;
  }, [userInfo?.roles, userInfo?.role]);

  const value = useMemo<AuthContextType>(() => {
    // Простая проверка - если есть токен и не загружается, то авторизован
    const authenticated = Boolean(token) && !isLoading;
    
    console.log('AuthContext - Computing value:', {
      hasToken: !!token,
      isLoading,
      authenticated,
      userInfo: !!userInfo
    });
    
    return { 
      token, 
      isAuthenticated: authenticated, 
      userInfo,
      isAdmin,
      isLoading,
      setToken, 
      logout,
      refreshToken,
      checkAndRefreshToken
    };
  }, [token, userInfo, isAdmin, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


