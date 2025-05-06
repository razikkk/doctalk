import { createSlice } from "@reduxjs/toolkit";

interface SpecialityState{
    specialities:any[]
}

const initialState :SpecialityState={
    specialities:[]
}

const specialitySlice = createSlice({
    name:"speciality",
    initialState,
    reducers:{
        setSpecialities:(state,action)=>{
            state.specialities = action.payload
        },
        addSpeciality:(state,action)=>{
            console.log("addding ",action.payload)
            state.specialities = [...state.specialities,action.payload]
            console.log('updatedaadd',state.specialities)
        },
        updateSpeciality:(state,action)=>{
            console.log(action.payload,'reducxx payy')
            const {id,name,image} = action.payload
            state.specialities = state.specialities.map((spec)=>
                spec._id === id ? {...spec,name,image} : spec
            )
        },
        deleteSpeciality: (state, action) => {
            state.specialities = state.specialities.map((spec) =>
                spec._id === action.payload ? { ...spec, isDelete: true } : spec
            );
        },
        
        restoreSpeciality:(state,acion)=>{
            state.specialities = state.specialities.map((spec)=>
                spec._id === acion.payload ? {...spec,isDelete:false} : spec
            )
        }
    }
})
 
export const {setSpecialities,addSpeciality,updateSpeciality,deleteSpeciality,restoreSpeciality} = specialitySlice.actions
export default specialitySlice.reducer