// Hoy en formato "YYYY-MM-DD" 
export const todayLocalStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// ISO de BD 
export const isoToLocalStr = (isoStr) => {
    return isoStr.slice(0, 10);
};

// "YYYY-MM-DD" → Date local al mediodía 
export const localStrToDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
};

// ISO → fecha corta legible local
export const toPeruDateStr = (isoStr) => {
    const date = new Date(isoStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
        .toLocaleDateString('es-PE', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
};

// ISO → fecha larga legible local
export const toPeruDateLong = (isoStr) => {
    const date = new Date(isoStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
        .toLocaleDateString('es-PE', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
};