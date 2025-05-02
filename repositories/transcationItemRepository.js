import TranscationItem from '../models/transactionItemModel';

export const createTranscationItem = async function (transactionid, bookid) {
    try {
    const transcationItem = await TranscationItem.create( {
        transactionid: transactionid,
        bookid: bookid
    });
    return transcationItem;
} catch (err) {
    throw new Error(err.message);
}

};