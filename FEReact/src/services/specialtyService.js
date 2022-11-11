import axios from "../axios";
import Specialty from "../containers/HomePage/Section/Specialty";

const createSpecialtyService = async (data) => {
    return axios.post('/api/create-specialty', data);
}

const getAllSpecialtyService = async () => {
    return axios.get('/api/get-all-specialty');
}

const getSpecialtyByIdService = async (data) => {
    return axios.get(`/api/get-specialty-by-id?id=${data.id}&location=${data.location}`)
}

export {
    createSpecialtyService,
    getAllSpecialtyService,
    getSpecialtyByIdService
}
