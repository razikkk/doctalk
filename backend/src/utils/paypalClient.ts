import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID as string
const PAYPAL_SECRET = process.env.PAYPAL_SECRET as string
const base = process.env.SANDBOX_BASE_URL //for production vere chang it

 const getAccessToken = async():Promise<string>=>{
    const response = await axios.post(
        `${base}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            auth:{
                username:PAYPAL_CLIENT,
                password:PAYPAL_SECRET
            },
            headers:{
                "Content-Type":'application/x-www-form-urlencoded'
            }
        }
    )
    return response.data.access_token
}

 const createOrder = async(amount:string,paypalAccessToken:string):Promise<string>=>{
    const response = await axios.post(
        `${base}/v2/checkout/orders`,
        {
            intent:'CAPTURE',
            purchase_units:[
                {
                    amount:{
                        currency_code:'USD',
                        value:amount
                    }
                }
            ]
        },
        {
            headers:{
                Authorization:`Bearer ${paypalAccessToken}`,
                'Content-Type':'application/json'
            }
        }
    )
    return response.data.id
}

 const captureOrder = async(orderID:string,paypalAccessToken:string):Promise<any>=>{
    const response = await axios.post(
        `${base}/v2/checkout/orders/${orderID}/capture`,
        {},
        {
            headers:{
                Authorization:`Bearer ${paypalAccessToken}`,
                'Content-Type':'application/json'
            }
        }
    )
    return response.data
}

export default{
    getAccessToken,
    createOrder,
    captureOrder
}