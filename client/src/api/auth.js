import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://restbook-8e57.onrender.com/api/v1',
    baseURL: "http://localhost:3000/api/v1",
});

export const loginRequest = async (user) => {
    try {
        const response = await instance.post('/auth/login', user);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// enviar codigo de estudiante
export const bookRequest = async (code) => {
    try {
        const response = await instance.post('/book', code);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const resetBooked = async () => {
    try {
        const response = await instance.post('/auth/reset');
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getDiners = async () => {
    try {
        const response = await instance.get('/students/diner');
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

