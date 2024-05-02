import axios from "axios";

export function passwordForgot(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.post("http://localhost:8000/api/auth/forgotPassword", data, { withCredentials: true });
            const result = await response.data;
            resolve(result);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export function passwordReset(data, token) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.patch(`http://localhost:8000/api/auth/resetPassword/${token}`, data);
            const result = await response.data;
            resolve(result);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}