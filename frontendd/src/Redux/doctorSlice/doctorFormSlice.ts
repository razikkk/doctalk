import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface doctorForm {
    registrationId : string,
    registrationYear :string,
    language : string,
    age : string,
    gender : string,
    hospital : string,
    experience : string
}

const initialState : doctorForm = {
    registrationId: '',
    registrationYear: '',
    language: 'english',
    age: '',
    gender: 'male',
    hospital: '',
    experience: '',
    
}

const doctorFormSlice = createSlice({
    name:"doctorForm",
    initialState,
    reducers:{
        updateFormData:(state,action:PayloadAction<Partial<doctorForm>>)=>{
            return {...state,...action.payload}
        },
        resetFormData:(state)=>{
            return initialState
        }
    }
})

export const {updateFormData,resetFormData} = doctorFormSlice.actions
export default doctorFormSlice.reducer