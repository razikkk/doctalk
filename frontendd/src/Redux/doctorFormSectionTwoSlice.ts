import { createSlice , PayloadAction} from "@reduxjs/toolkit";

interface doctorFormSectionTwo{
    specialization:string,
    about:string,
    university:string,
}



const initialState:doctorFormSectionTwo={
    specialization:"",
    about:"",
    university:"",
}

const doctorFormSectionTwoSlice = createSlice({
    name:"doctorFormSectionTwo",
    initialState,
    reducers:{
        updateFormData:(state,action:PayloadAction<Partial<doctorFormSectionTwo>>)=>{
            return {...state,...action.payload}
        },
        resetFormData:(state)=>{
            return initialState
        }
    }
})

export const {updateFormData,resetFormData} = doctorFormSectionTwoSlice.actions
export default doctorFormSectionTwoSlice.reducer