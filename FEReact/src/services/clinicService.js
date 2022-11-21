import axios from "../axios";

const createClinicService = async (data) => {
    return axios.post('/api/create-clinic', data);
}

const getAllClinicService = async () => {
    return axios.get('/api/get-all-clinic');
}

const getClinicByIdService = async (data) => {
    return axios.get(`/api/get-clinic-by-id?id=${data.id}&location=${data.location}`)
}

export {
    createClinicService,
    getAllClinicService,
    getClinicByIdService
}
