import axios from "../axios";

const handleLoginAPI = async (email, password) => {
    return axios.post('/api/login', {email, password});
}

const getAllUsers = async (id) => {
    return axios.get(`/api/get-user?id=${id}`)
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
          id: userId
        }
      });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHome = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
export { 
    handleLoginAPI, 
    getAllUsers, 
    createNewUserService, 
    deleteUserService, 
    editUserService, 
    getAllCodeService,
    getTopDoctorHome
};
