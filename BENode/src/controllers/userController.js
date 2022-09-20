import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input params'
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetUser = async (req, res) => {
    let id = req.query.id; //ALL, id
    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'id is not exist'
        })
    }
    let users = await userService.getUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let data = req.body;
    if(!data) {
        return res.status(200).json({
            errCode: '1',
            errMessage: 'Missing params'
        })
    }
    let message = await userService.createNewUser(data);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    if(!data) {
        return res.status(200).json({
            errCode: '1',
            errMessage: 'Missing params'
        })
    }
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing params"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

module.exports = {
    handleLogin: handleLogin,
    handleGetUser: handleGetUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
}
