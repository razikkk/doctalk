import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {persistor, store} from '../src/Redux/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PersistGate } from 'redux-persist/integration/react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'


const CLIENT_ID  = import.meta.env.VITE_CLIENT_ID as string
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <PersistGate loading={null} persistor={persistor}>
      <PayPalScriptProvider options={{clientId:PAYPAL_CLIENT_ID,currency:"USD",}}>

     <App />
      </PayPalScriptProvider>
    </PersistGate>

    </GoogleOAuthProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>
)
