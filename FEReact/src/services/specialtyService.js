import axios from "../axios";

const createSpecialtyService = async (data) => {
    return axios.post('/api/create-specialty', data);
}

const getAllSpecialtyService = async () => {
    return axios.get('/api/get-all-specialty');
}

export {
    createSpecialtyService,
    getAllSpecialtyService
}
