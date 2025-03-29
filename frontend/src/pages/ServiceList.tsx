import AllServiceList from "../components/AllServiceList";

interface ServiceListProps {
    className?: string; // Позволяет передавать стили
}

const ServiceList = ({ className = "" }: ServiceListProps) => {
    return (
        <>
            <div className={`service-list-container ${className}`}>
                <AllServiceList /> {/* ✅ Подключаем список сервисов */}
            </div>
        </>
    );
};

export default ServiceList;