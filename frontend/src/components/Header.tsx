import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ Добавлен useNavigate
import logo from "../assets/logo.png"; // ✅ Импортируем логотип

interface HeaderProps {
    className?: string; // Позволяет передавать стили (например, для ServicePage)
}

const Header = ({ className = "" }: HeaderProps) => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate(); // ✅ Используем для редиректа

    const [userRole, setUserRole] = useState<string | null>(null);

    if (!auth) return null; // Если контекста нет, не рендерим хедер

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) setUserRole(storedRole);
    }, [auth.isAuthenticated]);

    // ✅ Обработчик выхода (Очищает данные и редиректит на логин)
    const handleLogout = () => {
        auth.logout(); // Выход из системы
        localStorage.removeItem("user_id"); // Очистка user_id
        localStorage.removeItem("role"); // Очистка роли
        navigate("/login"); // ✅ Перенаправляем на страницу входа
    };

    return (
        <nav
            className={`navbar navbar-expand-lg w-100 py-3 ${className}`}
            style={{
                backgroundColor: "#132043", // ✅ Цвет фона
                boxShadow: "0px 7px 10px rgba(0, 0, 0, 0.3)", // ✅ Тень для Header
            }}
        >
            <div className="container d-flex align-items-center">
                {/* Лого */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="Лого СТО" width="170" height="40" className="me-2" />
                </Link>

                <div className="d-flex ms-auto">
                    {auth.isAuthenticated ? (
                        <>
                            {userRole === "service" && (
                                <Link className="btn custom-btn me-2" to="/service">Мой сервис</Link>
                            )}
                            {userRole === "car_owner" && (
                                <Link className="btn custom-btn me-2" to="/cabinet">Моя сервисная книжка</Link>
                            )}
                            <button className="btn custom-btn me-2" onClick={handleLogout}>Выйти</button> {/* ✅ Редирект после выхода */}
                        </>
                    ) : (
                        <>
                            {!location.pathname.includes("/login") && <Link className="btn custom-btn me-2" to="/login">Войти</Link>}
                            {!location.pathname.includes("/register") && <Link className="btn custom-btn" to="/register">Регистрация</Link>}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;