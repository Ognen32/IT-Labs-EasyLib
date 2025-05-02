import Transcation from '../models/transcationModel';

export const createTranscation = async function (userid, issueDate, expirationDate) {
    try {
    const transcation = await Transcation.create( {
        userid: userid,
        issueDate: issueDate,
        expirationDate: expirationDate
    });
    return transcation;
} catch (err) {
    throw new Error(err.message);
}

};