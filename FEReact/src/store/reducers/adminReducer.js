import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
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
        default:
            return state;
    }
}

export default adminReducer;
