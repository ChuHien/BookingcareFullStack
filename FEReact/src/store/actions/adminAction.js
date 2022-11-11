import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUsers, deleteUserService, editUserService, getAllDoctorsService, saveInforDoctorService, updateInforDoctorService, getExtrainforDoctorService } from '../../services/userService';
import { toast } from 'react-toastify';
import { getTopDoctorHome } from '../../services/userService';
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: actionTypes.FETCH_GENDER_START})
            let res = await getAllCodeService("GENDER");
            if(res && res.errCode ===0) {
                dispatch(fetchGenderSuccess(res.allcodes))
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed())
            console.log('fetchGenderStart error', e)
        }
    }
}
// start doing end
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})
export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

//position
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("POSITION");
            if(res && res.errCode ===0) {
                dispatch(fetchPositionSuccess(res.allcodes))
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed())
            console.log('fetchPositionStart error', e)
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

//role
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.allcodes))
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed())
            console.log('fetchRoleStart error', e)
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

// create user
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            console.log('check create user data', res)
            if(res && res.errCode === 0) {
                toast.success("Create user success !");
                dispatch(saveUserSuccess());
                dispatch(getAllUser());
            } else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed())
            console.log('fetchRoleStart error', e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const getAllUser = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if(res && res.errCode === 0) {
                let users = res.users.reverse();
                dispatch(getAllUserSuccess(users))
            } else {
                dispatch(getAllUserFailed());
            }
        } catch (e) {
            dispatch(getAllUserFailed())
            console.log('get All user error', e)
        }
    }
}

//get all
export const getAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    data: data
})

export const getAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

//edit
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            console.log('check edit user data', res)
            if(res && res.errCode === 0) {
                toast.success("Update user success !");
                dispatch(editUserSuccess())
                dispatch(getAllUser());
            } else {
                dispatch(editUserFailed());
            }
        } catch (e) {
            dispatch(editUserFailed())
            console.log('Edit error', e)
        }
    }
}

export const editUserSuccess = (data) => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
})

//delete
export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            console.log('check get user data res', res)
            if(res && res.errCode === 0) {
                toast.success("Delete user success !");
                dispatch(deleteUserSuccess())
                dispatch(getAllUser());
            } else {
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            dispatch(deleteUserFailed())
            console.log('Delete error', e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
})

export const fetchTopDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHome(6);
            if(res && res.errCode === 0) {
                dispatch(getTopDoctorsSuccess(res.data))
            } else {
                dispatch(getTopDoctorsFailed());
            }
        } catch (e) {
            dispatch(getTopDoctorsFailed())
            console.log('get All user error', e)
        }
    }
}

export const getTopDoctorsSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    data
})

export const getTopDoctorsFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
})

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            if(res && res.errCode === 0) {
                dispatch(fetchAllDoctorsSuccess(res.data))
            } else {
                dispatch(fetchAllDoctorsFailed());
            }
        } catch (e) {
            dispatch(fetchAllDoctorsFailed())
            console.log('get All user error', e)
        }
    }
}

export const fetchAllDoctorsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
    data
})

export const fetchAllDoctorsFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
})

export const saveInforDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveInforDoctorService(data);
            console.log('check Save infor doctor', res)
            if(res && res.errCode === 0) {
                toast.success("Save infor doctor success !");
                dispatch(saveInforDoctorSuccess());
                dispatch(getAllUser());
            } else {
                dispatch(saveInforDoctorFailed());
            }
        } catch (e) {
            dispatch(saveInforDoctorFailed())
            console.log('fetchRoleStart error', e)
        }
    }
}

export const saveInforDoctorSuccess = () => ({
    type: actionTypes.SAVE_INFOR_DOCTOR_SUCCESS
})

export const saveInforDoctorFailed = () => ({
    type: actionTypes.SAVE_INFOR_DOCTOR_FAILED
})

export const updateInforDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await updateInforDoctorService(data);
            console.log('check update infor doctor', res)
            if(res && res.errCode === 0) {
                toast.success("Update infor doctor success !");
                dispatch(updateInforDoctorSuccess());
                dispatch(getAllUser());
            } else {
                dispatch(updateInforDoctorFailed());
            }
        } catch (e) {
            dispatch(updateInforDoctorFailed())
            console.log('fetchRoleStart error', e)
        }
    }
}

export const updateInforDoctorSuccess = () => ({
    type: actionTypes.UPDATE_INFOR_DOCTOR_SUCCESS
})

export const updateInforDoctorFailed = () => ({
    type: actionTypes.UPDATE_INFOR_DOCTOR_FAILED
})

export const fetchAllScheduleHours = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if(res && res.errCode ===0) {
                dispatch(fetchAllScheduleHoursSuccess(res.allcodes))
            } else {
                dispatch(fetchAllScheduleHoursFailed());
            }
        } catch (e) {
            dispatch(fetchAllScheduleHoursFailed())
            console.log('fetchPositionStart error', e)
        }
    }
}

export const fetchAllScheduleHoursSuccess = (timeData) => ({
    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS,
    data: timeData
})
export const fetchAllScheduleHoursFailed = () => ({
    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAILED
})

//doctor Price
export const getDoctorPrices = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("PRICE");
            if(res && res.errCode === 0) {
                dispatch(getDoctorPriceSuccess(res.allcodes))
            } else {
                dispatch(getDoctorPriceFailed());
            }
        } catch (e) {
            dispatch(getDoctorPriceFailed())
            console.log('fetchDoctorStart error', e)
        }
    }
}

export const getDoctorPriceSuccess = (priceData) => ({
    type: actionTypes.GET_DOCTOR_PRICE_SUCCESS,
    data: priceData
})
export const getDoctorPriceFailed = () => ({
    type: actionTypes.GET_DOCTOR_PRICE_FAILED
})

// payment

export const getPayments = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("PAYMENT");
            if(res && res.errCode === 0) {
                dispatch(getPaymentSuccess(res.allcodes))
            } else {
                dispatch(getPaymentFailed());
            }
        } catch (e) {
            dispatch(getPaymentFailed())
            console.log('fetch Payment error', e)
        }
    }
}

export const getPaymentSuccess = (paymentData) => ({
    type: actionTypes.GET_PAYMENT_SUCCESS,
    data: paymentData
})
export const getPaymentFailed = () => ({
    type: actionTypes.GET_PAYMENT_FAILED
})

//province

export const getProvinces = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("PROVINCE");
            if(res && res.errCode === 0) {
                dispatch(getProvinceSuccess(res.allcodes))
            } else {
                dispatch(getProvinceFailed());
            }
        } catch (e) {
            dispatch(getProvinceFailed())
            console.log('fetch Payment error', e)
        }
    }
}

export const getProvinceSuccess = (provinceData) => ({
    type: actionTypes.GET_PROVINCE_SUCCESS,
    data: provinceData
})
export const getProvinceFailed = () => ({
    type: actionTypes.GET_PROVINCE_FAILED
})


//extra infor doctor
export const getExtrainforDoctor = (doctorId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getExtrainforDoctorService(doctorId)
            if(res && res.errCode === 0) {
                dispatch(getExtrainforDoctorSuccess(res.data))
            } else {
                dispatch(getExtrainforDoctorFailed());
            }
        } catch (e) {
            dispatch(getExtrainforDoctorFailed())
            console.log('fetch Payment error', e)
        }
    }
}

export const getExtrainforDoctorSuccess = (extrainforData) => ({
    type: actionTypes.GET_EXTRAINFOR_DOCTOR_SUCCESS,
    data: extrainforData
})
export const getExtrainforDoctorFailed = () => ({
    type: actionTypes.GET_EXTRAINFOR_DOCTOR_FAILED
})
