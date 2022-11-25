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

const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveInforDoctorService = (data) => {
    return axios.post('/api/save-infor-doctor', data);
}

const getDetailDoctorService = async (id) => {
    return axios.get(`/api/get-detail-doctor?id=${id}`)
}

const updateInforDoctorService = async (data) => {
    return axios.post('/api/edit-infor-doctor', data);
}

const bulkCreateScheduleService = async (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorService = async (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtrainforDoctorService = async (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorService = async (doctorId) => {
    return axios.get(`/api/get-profile-doctor?doctorId=${doctorId}`)
}

const bookAppointmentService = async (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}

const postVerifyBookAppointmentService = async (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}

const getListPatientForDoctorService = async (doctorId, date) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}`)
}

const sendRemedyService = async (data) => {
    return axios.post(`/api/send-remedy`, data)
}

export { 
    handleLoginAPI, 
    getAllUsers, 
    createNewUserService, 
    deleteUserService, 
    editUserService, 
    getAllCodeService,
    getTopDoctorHome,
    getAllDoctorsService,
    saveInforDoctorService,
    getDetailDoctorService,
    updateInforDoctorService,
    bulkCreateScheduleService,
    getScheduleDoctorService,
    getExtrainforDoctorService,
    getProfileDoctorService,
    bookAppointmentService,
    postVerifyBookAppointmentService,
    getListPatientForDoctorService,
    sendRemedyService
};
