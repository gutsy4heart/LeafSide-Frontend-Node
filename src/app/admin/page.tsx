"use client";

import { useAuth } from "../auth-context";
import { useTranslations } from "../../lib/translations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserWithRole, UserRole, UpdateUserRoleRequest } from "../../types/user";
import { Book, CreateBookRequest, UpdateBookRequest, BOOK_GENRES, BOOK_LANGUAGES } from "../../types/book";
import { Order, OrderStatus, ORDER_STATUSES } from "../../types/order";
import { AdminCart } from "../../types/cart";

// Импорт компонентов
import Toast from "../components/admin/Toast";
import { useToast } from "../components/admin/useToast";
import TabNavigation from "../components/admin/TabNavigation";
import Stats from "../components/admin/Stats";
import UserManagement from "../components/admin/UserManagement";
import BookManagement from "../components/admin/BookManagement";
import OrderManagement from "../components/admin/OrderManagement";
import CartManagement from "../components/admin/CartManagement";
import ActionButtons from "../components/admin/ActionButtons";
import AddUserModal from "../components/admin/AddUserModal";
import AddBookModal from "../components/admin/AddBookModal";
import EditBookModal from "../components/admin/EditBookModal";
import DeleteConfirmModal from "../components/admin/DeleteConfirmModal";

export default function AdminPage() {
  const { isAuthenticated, isAdmin, userInfo, token } = useAuth();
  const { t } = useTranslations();
  const router = useRouter();
  const { toasts, showToast } = useToast();

  // Универсальная функция для безопасного парсинга JSON ответов
  const safeJsonParse = async (response: Response) => {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        return text ? { message: text } : { success: true };
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }
  };

  // Состояние для пользователей
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: UserWithRole | null }>({
    isOpen: false,
    user: null
  });
  const [deleting, setDeleting] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    countryCode: 'PL',
    gender: 'Male'
  });
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentUsers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  
  // Состояние для книг
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'books' | 'orders' | 'carts'>('users');
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookDeleteDialog, setBookDeleteDialog] = useState<{ isOpen: boolean; book: Book | null }>({
    isOpen: false,
    book: null
  });
  const [deletingBook, setDeletingBook] = useState(false);
  const [creatingBook, setCreatingBook] = useState(false);
  const [updatingBook, setUpdatingBook] = useState(false);
  const [newBook, setNewBook] = useState<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    language: 'Russian',
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
    price: 0,
    description: '',
    imageUrl: '',
    isAvailable: true
  });
  const [newBookPublishedYearInput, setNewBookPublishedYearInput] = useState<string>(String(newBook.publishedYear));
  const [newBookPageCountInput, setNewBookPageCountInput] = useState<string>('');
  const [newBookPriceInput, setNewBookPriceInput] = useState<string>('');
  const [editingBookPublishedYearInput, setEditingBookPublishedYearInput] = useState<string>('');
  const [editingBookPageCountInput, setEditingBookPageCountInput] = useState<string>('');
  const [editingBookPriceInput, setEditingBookPriceInput] = useState<string>('');
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [bookGenreFilter, setBookGenreFilter] = useState('all');
  const [bookAvailabilityFilter, setBookAvailabilityFilter] = useState('all');
  
  // Состояние для заказов
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<string | null>(null);
  
  // Состояние для корзин
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [cartsLoading, setCartsLoading] = useState(false);
  const [cartsError, setCartsError] = useState<string | null>(null);

  // Состояние для валидации
  const [newBookErrors, setNewBookErrors] = useState<Record<string, string>>({});
  const [editingBookErrors, setEditingBookErrors] = useState<Record<string, string>>({});
  const [newUserErrors, setNewUserErrors] = useState<Record<string, string>>({});

  // Валидация
  const validateBook = (b: { title?: string; author?: string; publishedYear?: number; pageCount?: number; price?: number; }) => {
    const errors: Record<string, string> = {};
    if (!b.title || b.title.trim().length === 0) errors.title = 'Название обязательно';
    if (!b.author || b.author.trim().length === 0) errors.author = 'Автор обязателен';
    if (!b.publishedYear || b.publishedYear < 1000 || b.publishedYear > new Date().getFullYear()) {
      errors.publishedYear = 'Год издания должен быть между 1000 и ' + new Date().getFullYear();
    }
    if (!b.pageCount || b.pageCount < 1) errors.pageCount = 'Количество страниц должно быть больше 0';
    if (!b.price || b.price < 0) errors.price = 'Цена должна быть больше или равна 0';
    return errors;
  };

  const validateNewUser = (u: { email: string; password: string; firstName: string; lastName: string; phoneNumber: string; gender: string; }) => {
    const errors: Record<string, string> = {};
    if (!u.email || u.email.trim().length === 0) errors.email = 'Email обязателен';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)) errors.email = 'Некорректный email';
    if (!u.password || u.password.length < 6) errors.password = 'Пароль должен содержать минимум 6 символов';
    if (!u.firstName || u.firstName.trim().length === 0) errors.firstName = 'Имя обязательно';
    if (!u.lastName || u.lastName.trim().length === 0) errors.lastName = 'Фамилия обязательна';
    if (!u.phoneNumber || u.phoneNumber.trim().length === 0) errors.phoneNumber = 'Номер телефона обязателен';
    else if (!/^\d{10,15}$/.test(u.phoneNumber.replace(/\D/g, ''))) errors.phoneNumber = 'Неверный формат номера';
    if (!u.gender) errors.gender = 'Выберите пол';
    return errors;
  };

  // API функции
  const fetchUsers = async () => {
    if (!token) {
      console.log('Admin: No token available for fetching users');
      setError('Токен не найден');
      setLoading(false);
      return;
    }

    try {
      console.log('Admin: Fetching users with token:', token.substring(0, 20) + '...');
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/users", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Ошибка при загрузке пользователей');
      }
      
      const data = await safeJsonParse(response);
      console.log('Admin: Users data received:', data);
      setUsers(data);
      
      // Рассчитываем статистику
      const totalUsers = data.length;
      const adminUsers = data.filter((user: any) => 
        user.roles && Array.isArray(user.roles) && 
        (user.roles.includes('Admin') || user.roles.includes('SuperAdmin'))
      ).length;
      const regularUsers = totalUsers - adminUsers;
      const recentUsers = data.filter((user: any) => {
        const createdAt = new Date(user.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length;
      
      setStats({
        totalUsers,
        adminUsers,
        regularUsers,
        recentUsers
      });
    } catch (err) {
      console.error('Admin: Error fetching users:', err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    if (!token) {
      console.log('Admin: No token available for fetching books');
      setBooksError('Токен не найден');
      setBooksLoading(false);
      return;
    }

    try {
      console.log('Admin: Fetching books with token:', token.substring(0, 20) + '...');
      setBooksLoading(true);
      setBooksError(null);
      
      const response = await fetch("/api/admin/books", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Books error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Ошибка при загрузке книг');
      }
      
      const data = await safeJsonParse(response);
      console.log('Admin: Books data received:', data);
      if (Array.isArray(data) && data.length > 0) {
        console.log('Admin: First book publishedYear:', data[0].publishedYear, 'type:', typeof data[0].publishedYear);
      }
      setBooks(data);
    } catch (err) {
      console.error('Admin: Error fetching books:', err);
      setBooksError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBooksLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!token) {
      console.log('Admin: No token available for fetching orders');
      setOrdersError('Токен не найден');
      setOrdersLoading(false);
      return;
    }

    try {
      console.log('Admin: Fetching orders with token:', token.substring(0, 20) + '...');
      setOrdersLoading(true);
      setOrdersError(null);
      
      const response = await fetch("/api/admin/orders", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Orders error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Ошибка при загрузке заказов');
      }
      
      const data = await safeJsonParse(response);
      console.log('Admin: Orders data received:', data);
      setOrders(data);
    } catch (err) {
      console.error('Admin: Error fetching orders:', err);
      setOrdersError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCarts = async () => {
    if (!token) {
      console.log('Admin: No token available for fetching carts');
      setCartsError('Токен не найден');
      setCartsLoading(false);
      return;
    }

    try {
      console.log('Admin: Fetching carts with token:', token.substring(0, 20) + '...');
      setCartsLoading(true);
      setCartsError(null);
      
      const response = await fetch("/api/admin/carts", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Carts error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Ошибка при загрузке корзин');
      }
      
      const data = await safeJsonParse(response);
      console.log('Admin: Carts data received:', data);
      
      // Обогащаем данные корзин информацией о пользователях
      const enrichedCarts = data.map((cart: any) => {
        const user = users.find(u => u.id === cart.userId);
        return {
          ...cart,
          userEmail: user?.email || 'Неизвестно',
          userName: user?.userName || 'Неизвестно'
        };
      });
      
      setCarts(enrichedCarts);
    } catch (err) {
      console.error('Admin: Error fetching carts:', err);
      setCartsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCartsLoading(false);
    }
  };

  // Обработчики событий
  const handleRefresh = () => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'books') fetchBooks();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'carts') fetchCarts();
  };

  const handleCheckBackend = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        showToast('Бэкенд работает корректно', 'success');
      } else {
        showToast('Проблема с бэкендом', 'error');
      }
    } catch (error) {
      showToast('Не удалось подключиться к бэкенду', 'error');
    }
  };

  // Фильтрация данных
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const isAdminOrSuperAdmin = user.roles && Array.isArray(user.roles) && 
                                (user.roles.includes('Admin') || user.roles.includes('SuperAdmin'));
    const matchesRole = roleFilter === 'all' || 
                       (roleFilter === 'admin' && isAdminOrSuperAdmin) ||
                       (roleFilter === 'user' && !isAdminOrSuperAdmin);
    return matchesSearch && matchesRole;
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(bookSearchTerm.toLowerCase());
    const matchesGenre = bookGenreFilter === 'all' || book.genre === bookGenreFilter;
    const matchesAvailability = bookAvailabilityFilter === 'all' || 
                               (bookAvailabilityFilter === 'available' && book.isAvailable) ||
                               (bookAvailabilityFilter === 'unavailable' && !book.isAvailable);
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(orderSearchTerm.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Обработчики для пользователей
  const updateUserRole = async (userId: string, role: UserRole | string) => {
    try {
      setUpdatingRole(userId);
      
      // Ensure role is a string - handle enum, string, or any other type
      let roleString: string;
      if (typeof role === 'string') {
        roleString = role;
      } else if (role === UserRole.Admin) {
        roleString = 'Admin';
      } else if (role === UserRole.User) {
        roleString = 'User';
      } else {
        roleString = String(role);
      }
      
      // Validate that role is either "Admin" or "User"
      if (roleString !== 'Admin' && roleString !== 'User') {
        console.error('Admin: Invalid role value:', { role, roleString, userId });
        showToast('Неверное значение роли', 'error');
        return;
      }
      
      console.log('Admin: Updating user role:', { userId, role, roleString, roleType: typeof role });
      
      // Backend expects role as a string (e.g., "Admin" or "User")
      const request = { 
        role: roleString
      };
      
      console.log('Admin: Sending request:', request);
      
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Error updating user role:', errorData);
        throw new Error(errorData.error || errorData.message || "Failed to update user role");
      }
      
      const result = await safeJsonParse(response);
      console.log('Admin: Role updated successfully:', result);
      
      // Обновляем локальное состояние
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, roles: [role] }
            : user
        )
      );
      
      showToast('Роль пользователя обновлена', 'success');
    } catch (err) {
      console.error('Admin: Error updating user role:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при обновлении роли', 'error');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = (user: UserWithRole) => {
    setDeleteDialog({ isOpen: true, user });
  };

  const confirmDeleteUser = async () => {
    if (!deleteDialog.user || !deleteDialog.user.id) {
      showToast('ID пользователя не указан', 'error');
      return;
    }
    
    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/users/${deleteDialog.user.id}/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        const errorMessage = errorData?.error || errorData?.message || `HTTP ${response.status}: ${response.statusText}` || "Failed to delete user";
        throw new Error(errorMessage);
      }
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteDialog.user!.id));
      setDeleteDialog({ isOpen: false, user: null });
      showToast('Пользователь удален', 'success');
    } catch (err) {
      console.error('Admin: Error deleting user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении пользователя';
      showToast(errorMessage, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteDialog({ isOpen: false, user: null });
  };

  const createUser = async (userData: typeof newUser) => {
    try {
      setCreating(true);
      setNewUserErrors({});
      
      const errors = validateNewUser(userData);
      if (Object.keys(errors).length > 0) {
        setNewUserErrors(errors);
        return;
      }

      console.log('Admin: Creating user with data:', userData);
      console.log('Admin: User data JSON:', JSON.stringify(userData, null, 2));

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.log('Admin: User creation failed - Response status:', response.status, response.statusText);
        console.log('Admin: Response headers:', Object.fromEntries(response.headers.entries()));
        
        const errorData = await safeJsonParse(response);
        console.log('Admin: Parsed error data:', errorData);
        
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        console.log('Admin: Final error message:', errorMessage);
        
        throw new Error(errorMessage);
      }

      const result = await safeJsonParse(response);
      console.log('Admin: User created successfully:', result);
      
      setShowAddUserForm(false);
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        countryCode: 'KZ',
        gender: 'Male'
      });
      showToast('Пользователь создан', 'success');
      
      // Обновляем список пользователей после создания
      fetchUsers();
    } catch (err) {
      console.error('Admin: Error creating user:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при создании пользователя', 'error');
    } finally {
      setCreating(false);
    }
  };

  // Обработчики для книг
  const handleEditBook = (book: Book) => {
    console.log('Admin: handleEditBook - book.publishedYear:', book.publishedYear, 'type:', typeof book.publishedYear);
    // Если publishedYear равен 0 или невалидный, используем текущий год
    const validPublishedYear = (book.publishedYear && book.publishedYear > 0) ? book.publishedYear : new Date().getFullYear();
    const bookWithValidYear = { ...book, publishedYear: validPublishedYear };
    setEditingBook(bookWithValidYear);
    setEditingBookPublishedYearInput(String(validPublishedYear));
    setEditingBookPageCountInput(String(book.pageCount));
    setEditingBookPriceInput(String(book.price));
    setShowEditBookForm(true);
  };

  const handleDeleteBook = (book: Book) => {
    setBookDeleteDialog({ isOpen: true, book });
  };

  const cancelBookDelete = () => {
    setBookDeleteDialog({ isOpen: false, book: null });
  };

  const cancelCreateBook = () => {
    setShowAddBookForm(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      genre: 'Fiction',
      language: 'Russian',
      publishedYear: new Date().getFullYear(),
      pageCount: 0,
      price: 0,
      description: '',
      imageUrl: '',
      isAvailable: true
    });
    setNewBookPublishedYearInput(String(new Date().getFullYear()));
    setNewBookPageCountInput('');
    setNewBookPriceInput('');
    setNewBookErrors({});
  };

  const cancelEditBook = () => {
    setShowEditBookForm(false);
    setEditingBook(null);
    setEditingBookPublishedYearInput('');
    setEditingBookPageCountInput('');
    setEditingBookPriceInput('');
    setEditingBookErrors({});
  };

  const createBook = async (bookData: CreateBookRequest) => {
    try {
      setCreatingBook(true);
      setBooksError(null);
      
      // Логирование входящих данных
      console.log('Admin page: Received bookData from form:', bookData);
      console.log('Admin page: Title value:', bookData?.title);
      console.log('Admin page: Title type:', typeof bookData?.title);
      
      // Дополнительная проверка обязательных полей
      if (!bookData.title || (typeof bookData.title === 'string' && !bookData.title.trim())) {
        console.error('Admin page: Validation failed - title is missing or empty');
        setNewBookErrors({ title: 'Название обязательно' });
        setCreatingBook(false);
        return;
      }
      if (!bookData.author || (typeof bookData.author === 'string' && !bookData.author.trim())) {
        console.error('Admin page: Validation failed - author is missing or empty');
        setNewBookErrors({ author: 'Автор обязателен' });
        setCreatingBook(false);
        return;
      }
      
      const errors = validateBook(bookData);
      if (Object.keys(errors).length > 0) {
        setNewBookErrors(errors);
        setCreatingBook(false);
        return;
      }

      // Преобразуем данные для бэкенда (маппинг полей)
      const requestData = {
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        description: bookData.description || '',
        genre: bookData.genre || '',
        publishing: '', // Поле publishing на бэкенде
        created: (bookData.publishedYear !== undefined && bookData.publishedYear !== null && bookData.publishedYear > 0) ? String(bookData.publishedYear) : String(new Date().getFullYear()),
        imageUrl: bookData.imageUrl || '',
        price: bookData.price || 0,
        isbn: bookData.isbn || '',
        language: bookData.language || 'Russian',
        pageCount: bookData.pageCount || 0,
        isAvailable: bookData.isAvailable !== false,
      };

      // Логирование для отладки
      console.log('Admin: Creating book with data:', requestData);
      console.log('Admin: Title value:', requestData.title);
      console.log('Admin: Title type:', typeof requestData.title);
      console.log('Admin: Title length:', requestData.title?.length);
      console.log('Admin: JSON stringified:', JSON.stringify(requestData));

      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Admin: Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || errorData.message || 'Ошибка при создании книги');
      }

      const result = await safeJsonParse(response);
      console.log('Admin: Book created successfully:', result);
      
      setShowAddBookForm(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        genre: 'Fiction',
        language: 'Russian',
        publishedYear: new Date().getFullYear(),
        pageCount: 0,
        price: 0,
        description: '',
        imageUrl: '',
        isAvailable: true
      });
      setNewBookPublishedYearInput(String(new Date().getFullYear()));
      setNewBookPageCountInput('');
      setNewBookPriceInput('');
      setNewBookErrors({});
      showToast('Книга создана', 'success');
      fetchBooks();
    } catch (err) {
      console.error('Admin: Error creating book:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при создании книги', 'error');
    } finally {
      setCreatingBook(false);
    }
  };

  const updateBook = async (bookData: UpdateBookRequest) => {
    if (!editingBook) return;
    
    console.log('Admin: updateBook called with bookData:', bookData);
    console.log('Admin: updateBook - bookData.publishedYear:', bookData.publishedYear, 'type:', typeof bookData.publishedYear);
    
    try {
      setUpdatingBook(true);
      setBooksError(null);
      
      // Валидация обязательных полей
      if (!bookData.title || !bookData.title.trim()) {
        setEditingBookErrors({ title: 'Название обязательно' });
        setUpdatingBook(false);
        return;
      }
      if (!bookData.author || !bookData.author.trim()) {
        setEditingBookErrors({ author: 'Автор обязателен' });
        setUpdatingBook(false);
        return;
      }
      
      const errors = validateBook(bookData);
      if (Object.keys(errors).length > 0) {
        setEditingBookErrors(errors);
        setUpdatingBook(false);
        return;
      }
      
      // Преобразуем данные для бэкенда (маппинг полей)
      // Для publishedYear: если значение есть и не равно 0, используем его, иначе текущий год
      const publishedYear = (bookData.publishedYear !== undefined && bookData.publishedYear !== null && bookData.publishedYear > 0) 
        ? bookData.publishedYear 
        : new Date().getFullYear();
      
      const requestData = {
        title: bookData.title!,
        author: bookData.author!,
        description: bookData.description || '',
        genre: bookData.genre || '',
        publishing: '', // Поле publishing на бэкенде
        created: String(publishedYear),
        imageUrl: bookData.imageUrl || '',
        price: bookData.price || 0,
        isbn: bookData.isbn || '',
        language: bookData.language || 'Russian',
        pageCount: bookData.pageCount || 0,
        isAvailable: bookData.isAvailable !== false,
      };
      
      console.log('Admin: updateBook - requestData.created:', requestData.created, 'publishedYear:', publishedYear);
      
      const response = await fetch(`/api/admin/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData.error || errorData.message || 'Ошибка при обновлении книги');
      }

      const result = await safeJsonParse(response);
      console.log('Admin: Book updated successfully:', result);
      console.log('Admin: Result publishedYear:', result.publishedYear, 'type:', typeof result.publishedYear);
      console.log('Admin: Request publishedYear was:', publishedYear, 'requestData.created:', requestData.created);
      
      setShowEditBookForm(false);
      setEditingBook(null);
      setEditingBookPublishedYearInput('');
      setEditingBookPageCountInput('');
      setEditingBookPriceInput('');
      setEditingBookErrors({});
      showToast('Книга обновлена', 'success');
      fetchBooks();
    } catch (err) {
      console.error('Admin: Error updating book:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при обновлении книги', 'error');
    } finally {
      setUpdatingBook(false);
    }
  };

  const deleteBook = async () => {
    if (!bookDeleteDialog.book) return;
    
    try {
      setDeletingBook(true);
      const response = await fetch(`/api/admin/books/${bookDeleteDialog.book.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('Admin: Delete response status:', response.status, 'ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Delete error response:', errorData);
        const errorMessage = errorData.error || errorData.message || "Ошибка при удалении книги";
        throw new Error(errorMessage);
      }
      
      // Проверяем, что удаление прошло успешно
      const result = await safeJsonParse(response);
      console.log('Admin: Book deleted successfully:', result);
      
      // Удаляем книгу из списка только если ответ успешный
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookDeleteDialog.book!.id));
      setBookDeleteDialog({ isOpen: false, book: null });
      showToast('Книга удалена', 'success');
    } catch (err) {
      console.error('Admin: Error deleting book:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при удалении книги', 'error');
    } finally {
      setDeletingBook(false);
    }
  };

  // Обработчики для заказов
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingOrderStatus(orderId);
      
      console.log('Admin: Updating order status:', orderId, 'to:', status);
      console.log('Admin: Token:', token?.substring(0, 20) + '...');
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Admin: Response status:', response.status, response.statusText);
      console.log('Admin: Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorData = await safeJsonParse(response);
        console.error('Admin: Error data:', errorData);
        throw new Error(errorData.error || errorData.message || 'Ошибка при обновлении статуса заказа');
      }

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      showToast('Статус заказа обновлен', 'success');
    } catch (err) {
      console.error('Admin: Error updating order status:', err);
      showToast(err instanceof Error ? err.message : 'Ошибка при обновлении статуса заказа', 'error');
    } finally {
      setUpdatingOrderStatus(null);
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    if (isAuthenticated && isAdmin && token) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, token]);

  // Загрузка данных при смене вкладки
  useEffect(() => {
    if (isAuthenticated && isAdmin && token) {
      if (activeTab === 'books' && books.length === 0) {
        fetchBooks();
      } else if (activeTab === 'orders' && orders.length === 0) {
        fetchOrders();
      } else if (activeTab === 'carts' && carts.length === 0 && users.length > 0) {
        fetchCarts();
      }
    }
  }, [activeTab, isAuthenticated, isAdmin, token, users.length]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Toast toasts={toasts} />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2">
                {t('admin.title')}
              </h1>
              <p className="text-[var(--muted)] text-sm sm:text-base">
                {t('admin.welcome')}, {userInfo?.name || t('admin.admin')}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <ActionButtons
                activeTab={activeTab}
                loading={loading}
                booksLoading={booksLoading}
                ordersLoading={ordersLoading}
                cartsLoading={cartsLoading}
                onRefresh={handleRefresh}
                onAddUser={() => setShowAddUserForm(true)}
                onAddBook={() => setShowAddBookForm(true)}
                onCheckBackend={handleCheckBackend}
              />
            </div>
          </div>
        </div>

        <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={users.length}
        booksCount={books.length}
        ordersCount={orders.length}
        cartsCount={carts.length}
      />

      <Stats
        activeTab={activeTab}
        stats={stats}
        booksCount={books.length}
        ordersCount={orders.length}
        cartsCount={carts.length}
      />

      {activeTab === 'users' && (
        <UserManagement
          users={users}
          filteredUsers={filteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          updatingRole={updatingRole}
          updateUserRole={updateUserRole}
          handleDeleteUser={handleDeleteUser}
          setShowAddUserForm={setShowAddUserForm}
        />
      )}

      {activeTab === 'books' && (
        <BookManagement
          books={books}
          filteredBooks={filteredBooks}
          bookSearchTerm={bookSearchTerm}
          setBookSearchTerm={setBookSearchTerm}
          bookGenreFilter={bookGenreFilter}
          setBookGenreFilter={setBookGenreFilter}
          bookAvailabilityFilter={bookAvailabilityFilter}
          setBookAvailabilityFilter={setBookAvailabilityFilter}
          handleEditBook={handleEditBook}
          handleDeleteBook={handleDeleteBook}
          setShowAddBookForm={setShowAddBookForm}
        />
      )}

      {activeTab === 'orders' && (
        <OrderManagement
          orders={orders}
          filteredOrders={filteredOrders}
          orderSearchTerm={orderSearchTerm}
          setOrderSearchTerm={setOrderSearchTerm}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          updatingOrderStatus={updatingOrderStatus}
          updateOrderStatus={updateOrderStatus}
        />
      )}

      {activeTab === 'carts' && (
        <CartManagement
          carts={carts}
        />
      )}

      {/* Модальные окна */}
      <AddUserModal
        isOpen={showAddUserForm}
        onClose={() => setShowAddUserForm(false)}
        onSubmit={createUser}
        creating={creating}
        errors={newUserErrors}
      />

      <DeleteConfirmModal
        isOpen={deleteDialog.isOpen}
        onClose={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
        title="Удалить пользователя"
        message="Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить."
        itemName={deleteDialog.user?.email}
        deleting={deleting}
      />

      <AddBookModal
        isOpen={showAddBookForm}
        onClose={cancelCreateBook}
        onSubmit={createBook}
        creating={creatingBook}
        errors={newBookErrors}
      />

      <EditBookModal
        isOpen={showEditBookForm}
        onClose={cancelEditBook}
        onSubmit={updateBook}
        book={editingBook}
        updating={updatingBook}
        errors={editingBookErrors}
      />

      <DeleteConfirmModal
        isOpen={bookDeleteDialog.isOpen}
        onClose={cancelBookDelete}
        onConfirm={deleteBook}
        title="Удалить книгу"
        message="Вы уверены, что хотите удалить эту книгу? Это действие нельзя отменить."
        itemName={bookDeleteDialog.book?.title}
        deleting={deletingBook}
      />
      </div>
    </div>
  );
}
