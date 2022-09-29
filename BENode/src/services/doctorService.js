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

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}
