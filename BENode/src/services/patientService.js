import db from '../models/index';

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });

                if(user && user[0]) {
                    await db.User.findOrCreate({
                    where: { patientId: user[0].id},
                    default: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType
                    }
                })
                }
                //create a booking record
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient success'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment
}
