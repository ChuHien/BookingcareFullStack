const db = require("../models");
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try{
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e){
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCrud = (req, res) => {
    return res.render('crud.ejs');
}

let postCrud = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    return res.redirect('/get-crud');
}

let displayGetCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCrud = async (req, res) => {
    let userId = req.query.id;
    console.log(req.query.id);
    if(userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // check user data not found
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send('user not found')
    }
}

let putCrud = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUser(data);
    return res.redirect('/get-crud');
}

let deleteCrud = async (req, res) => {
    let id = req.query.id;
    if(id) {
        console.log(req.query.id)
        await CRUDService.deleteUserById(id);
        return res.redirect('/get-crud');
    } else {
        return res.send('can not find user');
    }
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCrud: getCrud,
    postCrud: postCrud,
    displayGetCrud: displayGetCrud,
    getEditCrud: getEditCrud,
    putCrud: putCrud,
    deleteCrud: deleteCrud
}
