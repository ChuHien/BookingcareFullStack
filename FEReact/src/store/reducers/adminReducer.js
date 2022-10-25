import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allTimeHours: [],
    allDoctorPrices: [],
    allPayments: [],
    allProvinces: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGender = true;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.data
            return {
                ...state
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS:
            state.allTimeHours = action.data
            return {
                ...state
            }
        case actionTypes.GET_DOCTOR_PRICE_SUCCESS:
            state.allDoctorPrices = action.data
            return {
                ...state
            }
        case actionTypes.GET_PAYMENT_SUCCESS:
            state.allPayments = action.data
            return {
                ...state
            }
        case actionTypes.GET_PROVINCE_SUCCESS:
            state.allProvinces = action.data
            return {
                ...state
            }    
        default:
            return state;
    }
}

export default adminReducer;
