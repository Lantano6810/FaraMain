import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Импортируем контекст
import AdOne from "../components/AdOne"; // ✅ Импортируем AdOne
import "../styles/Login.css"; // Подключаем стили

const Login = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext); // Используем контекст авторизации

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка авторизации");
            }

            const data = await response.json();

            // ✅ Сохраняем токен, роль и user_id
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user_id", data.user.id);

            // ✅ Если автосервис — получаем и сохраняем service_id + data_filled
            if (data.user.role === "service") {
                const serviceRes = await fetch(`http://localhost:3001/services/user/${data.user.id}`);
                if (serviceRes.ok) {
                    const serviceData = await serviceRes.json();
                    localStorage.setItem("service_id", serviceData.service_id);
                    localStorage.setItem("data_filled", serviceData.data_filled.toString());
                }
            }

            auth?.login(data.token); // Авторизуем пользователя через контекст

            // ✅ Перенаправление в зависимости от роли
            if (data.user.role === "service") {
                navigate("/service");
            } else if (data.user.role === "car_owner") {
                navigate("/cabinet");
            } else {
                navigate("/"); // На всякий случай
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="login-wrapper">
                <div className="login-text">
                    <h2 className="login-title">Первый шаг сделан — осталось совсем немного!</h2>
                    <p className="login-description">
                        Войдите в аккаунт или зарегистрируйтесь, чтобы начать пользоваться всеми возможностями сервиса: бронируйте очередь в автосервис быстро и удобно.
                    </p>
                </div>

                <div className="login-container">
                    <div className="login-card">
                        <h2 className="text-center login-header">Вход</h2>
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

                            <div className="text-center mt-3 small-text">
                                <span>Нет аккаунта на FixMyCar? </span>
                                <Link to="/register" className="register-link">
                                    Зарегистрироваться
                                </Link>
                            </div>

                            <div className="d-flex justify-content-center mt-4">
                                <button type="submit" className="btn login-button">
                                    Войти
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

export default Login;