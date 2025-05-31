import axios from "axios";
const URL = import.meta.env.VITE_API_BASE_URL;

export const getItem = async (collection, id) => {
    try {
        const res = await axios.get(`${URL}/api/${collection}/${id}`);
        return res.data;
    } catch (err){
        console.error('Get Error', err.message);
        return null;
    }
}

export const getAll = async (collection) => {
    try {
        const res = await axios.get(`${URL}/api/${collection}`);
        return res.data
    } catch (err) {
        console.error('Get All error: ', err.message);
        return null;
    }
}

export const createItem = async (collection, data) => {
    try {
        const res = await axios.post(`${URL}/api/${collection}`, data);
        return res.data
    } catch (err) {
        console.error('CREATE error: ', err.message);
        return null;
    }
};

export const updateItem = async (collection, id, data) => {
    try {
        const res = await axios.put(`${URL}/api/${collection}/${id}`, data);
        return res.data;
    } catch (err) {
        console.error('UPDATE error: ', err.message);
        return null
    }
};

export const patchItem = async (collection, id, data) => {
    try {
        const res = await axios.patch(`${URL}/api/${collection}/${id}`, data);
        return res.data;
    } catch (err) {
        console.error(`PATCH error: `, err.message);
        return null;
    }
};

export const deleteItem = async (collection, id) => {
    try {
        const res = await axios.delete(`${URL}/api/${collection}/${id}`);
        return res.data;
    } catch (err) {
        console.error(`DELETE error: `, err.message);
        return null;
    }
};