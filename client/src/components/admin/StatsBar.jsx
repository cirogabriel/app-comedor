import PropTypes from "prop-types";
import { Users, CheckCircle2, XCircle, Percent } from "lucide-react";

const StatsBar = ({ stats, capacity }) => {
    const occupancy = capacity ? Math.round((stats.confirmed / capacity) * 100) : 0;

    const items = [
        { label: 'Total',      value: stats.total,     icon: Users,        bg: 'bg-[#f5f5f0]', text: 'text-[#1a1a1a]' },
        { label: 'Confirmadas',value: stats.confirmed, icon: CheckCircle2, bg: 'bg-green-50',  text: 'text-green-700' },
        { label: 'Canceladas', value: stats.cancelled, icon: XCircle,      bg: 'bg-[#f5f5f0]', text: 'text-[#888]' },
        { label: `Capacidad ${capacity || '—'}`, value: `${occupancy}%`, icon: Percent, bg: 'bg-[#f5f5f0]', text: 'text-[#1a1a1a]' },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {items.map(({ label, value, icon: Icon, bg, text }) => (
                <div key={label} className={`${bg} rounded-2xl border border-[#e8e8e8] p-4`}>
                    <div className="flex items-center gap-3">
                        <Icon className={`${text} h-5 w-5 flex-shrink-0`} strokeWidth={1.5} />
                        <div>
                            <p className="text-xs text-[#999]">{label}</p>
                            <p className={`text-xl font-semibold ${text}`}>{value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

StatsBar.propTypes = {
    stats: PropTypes.shape({
        total: PropTypes.number,
        confirmed: PropTypes.number,
        cancelled: PropTypes.number,
    }).isRequired,
    capacity: PropTypes.number,
};

export default StatsBar;