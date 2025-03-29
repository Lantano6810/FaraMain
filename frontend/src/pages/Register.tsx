import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст
import AdOne from "../components/AdOne"; // ✅ Импортируем AdOne
import "../styles/Login.css"; // Подключаем стили

const Register = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext); // Используем контекст авторизации

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка авторизации");
            }

            const data = await response.json();
            auth?.login(data.token); // Авторизуем пользователя через контекст
            navigate("/"); // Перенаправляем на главную страницу
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.role) {
            setError("Выберите роль!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password, // Отправляем пароль в чистом виде
                    name: formData.name,
                    role: formData.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка регистрации");
            }

            await handleLogin(formData.email, formData.password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="login-wrapper">
                {/* ✅ Блок с текстами слева */}
                <div className="login-text">
                    <h2 className="login-title">Первый шаг сделан — осталось совсем немного!</h2>
                    <p className="login-description">
                        Зарегистрируйтесь, чтобы получить полный доступ к возможностям сервиса: бронируйте очередь в автосервис быстро и удобно.
                    </p>
                </div>

                {/* ✅ Форма регистрации справа */}
                <div className="login-container">
                    <div className="login-card">
                        <h2 className="text-center login-header">Регистрация</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control rounded-input"
                                    placeholder="Введите email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Пароль</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control rounded-input"
                                    placeholder="Введите пароль"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Подтверждение пароля</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control rounded-input"
                                    placeholder="Повторите пароль"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Имя</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control rounded-input"
                                    placeholder="Введите ваше имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Выберите роль</label>
                                <select
                                    name="role"
                                    className="form-select rounded-input"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите...</option>
                                    <option value="car_owner">Автовладелец</option>
                                    <option value="service">Автосервис</option>
                                </select>
                            </div>

                            {/* ✅ Ссылка на вход */}
                            <div className="text-center mt-3 small-text">
                                <span>Уже есть аккаунт на FixMyCar? </span>
                                <Link to="/login" className="register-link">
                                    Войти
                                </Link>
                            </div>

                            {/* ✅ Центрированная кнопка */}
                            <div className="d-flex justify-content-center mt-4">
                                <button type="submit" className="btn login-button">
                                    Зарегистрироваться
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <AdOne />
        </>
    );
};

export default Register;