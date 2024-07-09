const crypto = require('crypto');
const axios = require('axios');

async function verifyEsewaPayment(encodedData) {
    console.log("i am in verifyEsewaPayment");
    try {
        let decodedData = atob(encodedData);
        decodedData = await JSON.parse(decodedData);
        let headersList = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

        const secretKey = process.env.ESEWA_SECRET_KEY;
        const hash = crypto
            .createHmac("sha256", secretKey)
            .update(data)
            .digest("base64");

        console.log(hash);
        console.log(decodedData.signature);
        let reqOptions = {
            url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
            method: "GET",
            headers: headersList,
        };
        if (hash !== decodedData.signature) {
            throw { message: "Invalid Info", decodedData };
        }
        let response = await axios.request(reqOptions);
        if (
            response.data.status !== "COMPLETE" ||
            response.data.transaction_uuid !== decodedData.transaction_uuid ||
            Number(response.data.total_amount) !== Number(decodedData.total_amount)
        ) {
            throw { message: "Invalid Info", decodedData };
        }
        return { response: response.data, decodedData };
    } catch (error) {
        throw error;
    }
}

module.exports = verifyEsewaPayment;
