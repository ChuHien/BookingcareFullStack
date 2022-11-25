import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
    return new Promise( async (resolve, reject) =>{
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                ],
                raw: true,
                nest: true
            })
            if(doctors) {
                resolve({
                    errCode: 0,
                    data: doctors
                })
            }
            if(!doctors) {
                resolve({
                    errCode: 1,
                    data: []
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            if(doctors) {
                resolve({
                    errCode: 0,
                    data: doctors
                })
            }
            if(!doctors) {
                resolve({
                    errCode: 1,
                    data: []
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputData.id || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errCode: "Missing params"
                })
            } else {

                //upset to markdown
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.id
                })
                

                //upset to doctor_infor_table

                await db.Doctor_Infor.create({
                    doctorId: inputData.id,
                    priceId: inputData.priceId,
                    provinceId: inputData.provinceId,
                    paymentId: inputData.paymentId,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                    clinicId: inputData.clinicId,
                    specialtyId: inputData.specialtyId
                })

                resolve({
                    errCode: 0,
                    errMessage: "Save doctor success"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctor = (inputId) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['contentMarkdown', 'contentHTML', 'description']},
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        { 
                            model: db.Doctor_Infor, 
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            ],
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if(!data) {
                    resolve({
                        errCode: 2,
                        data: {}
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateInforDoctor = (inputData) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputData.id || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errCode: "Missing params"
                })
            } else {
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.id
                    },
                    raw: false
                })
                let markdown = await db.Markdown.findOne({
                    where: {doctorId: inputData.id},
                    raw: false
                });
                if(doctorInfor){
                    doctorInfor.doctorId = inputData.id;
                    doctorInfor.priceId = inputData.priceId;
                    doctorInfor.provinceId = inputData.provinceId;
                    doctorInfor.paymentId = inputData.paymentId;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note,
                    doctorInfor.clinicId = inputData.clinicId,
                    doctorInfor.specialtyId = inputData.specialtyId
                    await doctorInfor.save();
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.id,
                        priceId: inputData.priceId,
                        provinceId: inputData.provinceId,
                        paymentId: inputData.paymentId,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note
                    })
                }
                if(markdown){
                    markdown.contentHTML = inputData.contentHTML;
                    markdown.contentMarkdown = inputData.contentMarkdown;
                    markdown.description = inputData.description;
                    await markdown.save();
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Markdown not found!' 
                    });
                }

                resolve({
                    errCode: 0,
                    message: 'Update success'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = async(data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                })
            } else {
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = async(doctorId, date) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errCode: "Missing params"
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName']}
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtrainforDoctor = async(inputId) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputId
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: false,
                    nest: true
                })
                if(!data) {
                    resolve({
                        errCode: 2,
                        data: {}
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctor = async(inputId) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description']},
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        { 
                            model: db.Doctor_Infor, 
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']},
                            ],
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if(!data) {
                    resolve({
                        errCode: 2,
                        data: {}
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = async(inputId, inputDate) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!inputId || !inputDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: inputId,
                        statusId: 'S2',
                        date: inputDate
                    },
                    attributes: {
                        exclude: ['token']
                    },
                    include: [
                        { 
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'gender', 'address', 'firstName'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                            ],
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }

                if(!data) {
                    resolve({
                        errCode: 2,
                        data: {}
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = async(data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if(appointment){
                    appointment.statusId = 'S3'
                    await appointment.save();
                    //send email remedy
                    await emailService.sendAttachmentsEmail(data)
                    resolve({
                        errCode: 0,
                        message: 'oke'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        message: 'not found'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctor: getDetailDoctor,
    updateInforDoctor: updateInforDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtrainforDoctor: getExtrainforDoctor,
    getProfileDoctor: getProfileDoctor,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy
}
