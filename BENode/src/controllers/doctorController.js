import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;
    try {
        let message = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let message = await doctorService.getAllDoctors();
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: 1,
            errMessage: "Error from the server"
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let message = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let message = await doctorService.getDetailDoctor(req.query.id);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let updateInforDoctor = async (req, res) => {
    try {
        let message = await doctorService.updateInforDoctor(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let message = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let message = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getExtrainforDoctor = async (req, res) => {
    try {
        let message = await doctorService.getExtrainforDoctor(req.query.doctorId);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctor: getDetailDoctor,
    updateInforDoctor: updateInforDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtrainforDoctor: getExtrainforDoctor
}
