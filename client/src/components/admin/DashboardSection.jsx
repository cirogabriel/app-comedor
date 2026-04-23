import { useEffect } from "react";
import { useAdmin } from "../../context/adminContext.jsx";
import StatsBar from "./StatsBar.jsx";
import DiningDayCard from "./DiningDayCard.jsx";

const DashboardSection = () => {
    const { bookingsToday, diningDayToday, fetchBookingsToday, fetchDiningDayToday, loading } = useAdmin();

    useEffect(() => {
        fetchBookingsToday();
        fetchDiningDayToday();
    }, [fetchBookingsToday, fetchDiningDayToday]);

    const stats = {
        total: bookingsToday?.total ?? 0,
        confirmed: bookingsToday?.confirmed ?? 0,
        cancelled: bookingsToday?.cancelled ?? 0,
    };

    const available = diningDayToday
        ? Math.max(0, diningDayToday.capacity - (stats.confirmed))
        : null;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Dashboard</h2>
                <p className="text-sm text-[#888]">Resumen general de hoy</p>
            </div>

            <DiningDayCard diningDay={diningDayToday} available={available} />

            {loading ? (
                <p className="text-sm text-[#aaa]">Cargando estadísticas...</p>
            ) : (
                <StatsBar stats={stats} capacity={diningDayToday?.capacity ?? null} />
            )}
        </div>
    );
};

export default DashboardSection;