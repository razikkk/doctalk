import { PayPalButtons } from '@paypal/react-paypal-js'
import { I } from 'framer-motion/dist/types.d-B50aGbjN'
import React, { useEffect } from 'react'
import { capturePaypalOrder, createPaypalOrder } from '../utils/auth'

interface IPayment {
    amount:number,
    onClose:()=>void,
    onSuccess:()=>void
}
const PaymentModal:React.FC<IPayment> = ({amount,onClose,onSuccess}) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Clean up and restore scroll when the modal is closed
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
  return (
    <div className='fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-500'>
        <div className='bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center overflow-y-auto'>
                <h2 className='text-2xl font-semibold mb-2'>Complete Your Payment</h2>
                <p className='mb-4 text-gray-600'>Click below to pay with PayPal</p>
                <div className='my-4'>
                    <PayPalButtons
                    style={{layout:'vertical',label:'paypal',shape:'pill',color:'gold'}}
                    createOrder={async()=>{
                        try {
                            const response = await createPaypalOrder(amount.toString())
                            return response.orderID
                        } catch (error:any) {
                            console.log(error.message)
                        }
                    }}
                   onApprove={async(data)=>{
                    try {
                        const response = await capturePaypalOrder(data.orderID)
                        if(response.success){
                            alert(`Transaction completed by ${response.result?.payer?.name?.given_name}`)
                            onClose()
                            onSuccess()
                        }else{
                            alert("Transaction failed or not captured")
                        }
                    } catch (error:any) {
                        console.log(error.message)
                    }
                   }}
                    />
                </div>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                    Close
                </button>
        </div>
    </div>
  )
}

export default PaymentModal