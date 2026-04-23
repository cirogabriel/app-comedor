import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            window.location.href = '/admin';
        }
        return Promise.reject(error);
    }
);

export const loginRequest = async (user) => instance.post('/auth/login', user);
export const bookRequest = async (data) => instance.post('/book', data);
export const cancelBookRequest = async (bookingId) => instance.patch(`/book/cancel/${bookingId}`);
export const resetBooked = async () => instance.post('/auth/reset');

// Bookings
export const getBookingsToday = async () => instance.get('/bookings/today');
export const getBookingsByDay = async (date) => instance.get('/bookings', { params: { date } });
export const getBookings = async (filters = {}) => instance.get('/bookings', { params: filters });
export const cancelBookingAdmin = async (bookingId) => instance.patch(`/bookings/${bookingId}/cancel`);

// DiningDay
export const getDiningDays = async () => instance.get('/dining-days');
export const getDiningDayToday = async () => instance.get('/dining-days/today');
export const createDiningDay = async (data) => instance.post('/dining-days', data);
export const updateDiningDay = async (id, data) => instance.patch(`/dining-days/${id}`, data);
export const deleteDiningDay = async (id) => instance.delete(`/dining-days/${id}`);

// Students
export const getStudents = async () => instance.get('/students');