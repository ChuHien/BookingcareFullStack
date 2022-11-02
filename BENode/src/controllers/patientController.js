import patientService from '../services/patientService'
         
let postBookAppointment = async (req, res) => {
    try {
        console.log(req.body)
        let message = await patientService.postBookAppointment(req.body);
        return res.status(200).json(message);
    } catch (e) {
        console.log('get all code error', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment
}
