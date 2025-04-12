import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {persistor, store} from '../src/Redux/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PersistGate } from 'redux-persist/integration/react'
// import dotenv from 'dotenv'


// dotenv.config()

const CLIENT_ID  = import.meta.env.VITE_CLIENT_ID as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <PersistGate loading={null} persistor={persistor}>
     <App />
    </PersistGate>

    </GoogleOAuthProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>
)
