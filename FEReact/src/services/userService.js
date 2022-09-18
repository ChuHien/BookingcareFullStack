import axios from "../axios";

const handleLoginAPI = async (email, password) => {
    return axios.post('/api/login', {email, password});
}

export { handleLoginAPI };
