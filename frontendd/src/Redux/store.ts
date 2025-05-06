import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./userSlice/userAuthSlice";
import adminAuthReducer from "./adminSlice/adminAuthSlice";
import specialityReducer from "./adminSlice/specialitySlice";
import doctorReducer from "./doctorSlice/doctorSlice";
import doctorFormSlice from "./doctorSlice/doctorFormSlice";
import doctorFormSectionTwoSlice from "./doctorSlice/doctorFormSectionTwoSlice";

import { persistReducer,persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key:"root",
    storage,
    whitelist:["doctorForm","doctorFormSectionTwo"]
}

const persistedDoctorFormSlice = persistReducer(persistConfig,doctorFormSlice)
const persistedDoctorFormSectionTwoSlice = persistReducer(persistConfig,doctorFormSectionTwoSlice)

export const store = configureStore({
    reducer:{
        auth : authReducer,
        adminAuth:adminAuthReducer,
        speciality:specialityReducer,
        doctorAuth:doctorReducer,
        doctorForm:persistedDoctorFormSlice,
        doctorFormSectionTwo:persistedDoctorFormSectionTwoSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore these action types
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            // Ignore these paths in the state
            ignoredPaths: ["register", "rehydrate","doctorFormSectionTwo.imageUrl", "doctorFormSectionTwo.identityProofUrl", "doctorFormSectionTwo.medicalCertificateUrl"],
          },
        }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export default store
    
