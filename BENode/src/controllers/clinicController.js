import clinicService from '../services/clinicService'
         
let createClinic = async (req, res) => {
    try {
        let message = await clinicService.createClinic(req.body);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let message = await clinicService.getAllClinic();
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getClinicById = async (req, res) => {
    try {
        let message = await clinicService.getClinicById(req.query.id, req.query.location);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById
}
