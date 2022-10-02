import db from '../models/index';
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
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.id
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
                let markdown = await db.Markdown.findOne({
                    where: {doctorId: inputData.id},
                    raw: false
                });
                if(markdown){
                    markdown.contentHTML = inputData.contentHTML;
                    markdown.contentMarkdown = inputData.contentMarkdown;
                    markdown.description = inputData.description;
                    await markdown.save();
                    resolve({
                        errCode: 0,
                        message: 'Update success'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Markdown not found!' 
                    });
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
    updateInforDoctor: updateInforDoctor
}
