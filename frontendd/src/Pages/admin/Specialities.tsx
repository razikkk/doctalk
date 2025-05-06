import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSpecialities,
  addSpeciality,
  updateSpeciality,
  deleteSpeciality,
  restoreSpeciality,
} from "../../Redux/adminSlice/specialitySlice";
import {
  specialities as fetchSpecialities,
  addSpecialities,
  updateSpecialities,
  deleteSpecialities,
  restoreSpecialities,
} from "../../utils/adminAuth";
import { Modal, Typography, Button, TextField, Box,IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon for closing modal
import { RootState } from "../../Redux/store";

type Speciality = {
  _id:string,
  name:string,
  image:string,
  isDelete:boolean
}

const Specialities = () => {
  const dispatch = useDispatch();
  const specialities = useSelector((state: RootState) => state.speciality.specialities);
  

  const [newSpeciality, setNewSpeciality] = useState<{name:string,image?:File | null}>({name:"" , image:null});
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage,setEditImage] = useState<File | null>(null)
  const [showModal,setShowModal] = useState(false)
  const [error,setErrors] = useState<{name?: string ; image?: string}>({})
  const[preview,setPreview] = useState<string | null>(null)

  const isValidName = (name:string):boolean=>{
    return /^[A-Za-z\s]+$/.test(name)
  }

  const isNameUnique = (name:string):boolean =>{
    return !specialities.some((spec:any)=> spec.name.toLowerCase() === name.toLocaleLowerCase())
  }

  const isImageProvided = (image:File | null):boolean=>{
    return !!image
  }

  useEffect(() => {
    fetchSpecialities().then((data) => {
      dispatch(setSpecialities(data)); // Ensure data is properly stored in Redux
    });
  }, [dispatch]);

  const handleAdd = async () => {
    const trimmedName = newSpeciality.name.trim();
    setErrors({});

 
  if (!trimmedName) {
    setErrors({ name: "Please provide a name for the speciality." });
    return;
  }

  if (!isValidName(trimmedName)) {
    setErrors({ name: "Speciality name can only contain alphabets and spaces." });
    return;
  }

  if (!isNameUnique(trimmedName)) {
    setErrors({ name: "Speciality name already exists." });
    return;
  }

  if (!isImageProvided(newSpeciality.image ?? null)) {
    setErrors({ image: "Please provide an image for the speciality." });
    return;
  }
    try {
      const data = await addSpecialities(newSpeciality);
      if (data && data.success) {
        dispatch(addSpeciality(data.speciality));
      }
      setNewSpeciality({name:"",image:null})
    } catch (error:any) {
      console.log(error.message)
    }
     
    
  };

  const handleUpdate = async (id: string) => {
    const trimmedName = editName.trim();

  if (!trimmedName) {
    alert("Please provide a name for the speciality.");
    return;
  }

  if (!isValidName(trimmedName)) {
    alert("Speciality name can only contain alphabets and spaces.");
    return;
  }

  if (!isNameUnique(trimmedName)) {
    alert("Speciality name already exists.");
    return;
  }

  if (editImage && !isImageProvided(editImage)) {
    alert("Please provide a valid image for the speciality.");
    return;
  }


   
    try {
      const formData= new FormData()
      formData.append("name",editName)
      if(editImage) formData.append("image",editImage)
      const data = await updateSpecialities(id, { name: editName, image:editImage });

      if (data) {
        dispatch(updateSpeciality({ id, name: editName,image:data.speciality.image }));
        setEditId(null);
        setEditName("");
        setEditImage(null)
      }
    } catch (error) {
      console.error("Error updating speciality:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      const data = await deleteSpecialities(id);
      if (data && data.success) {
     
        dispatch(deleteSpeciality(id));
      }
    } catch (error) {
      console.error("Error deleting speciality:", error);
    }
  };
  

  const handleRestore = async (id: string) => {
    if (!id) return;
    try {
      await restoreSpecialities(id);
      dispatch(restoreSpeciality(id));
    } catch (error) {
      console.error("Error restoring speciality:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#157B7B]">Manage Specialities</h2>

      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
  <h3 className="text-xl font-semibold mb-4 text-[#157B7B]">Add New Speciality</h3>
  <div className="flex flex-col md:flex-row gap-4 items-center">
    <input
      type="text"
      value={newSpeciality.name}
      onChange={(e) => setNewSpeciality({ ...newSpeciality, name: e.target.value })}
      placeholder="Enter speciality name"
      className="p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#157B7B] w-full"
    />

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setNewSpeciality((prev) => ({ ...prev, image: file }));
        setPreview(file ? URL.createObjectURL(file) : null);
      }}
      className="p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#157B7B]"
      />
  </div>
    {error && <span className="error text-red-500">{error.image}</span>}
      {error && <span className="error text-red-500">{error.name}</span>}
  {preview && (
    <div className="mt-4 flex justify-center">
      <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-full shadow-md" />
    </div>
  )}
  <button
    onClick={handleAdd}
    className="bg-[#157B7B] text-white px-6 py-3 rounded-lg mt-4 w-full hover:bg-[#0f5e5e] shadow-md"
  >
    Add Speciality
  </button>
</div>


      <h3 className="text-xl font-semibold mt-6 mb-4 text-[#157B7B]">Active Specialities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {specialities.filter((spec) => !spec.isDelete).map((spec) => (
    <div key={spec._id} className="rounded-[30%] p-6 shadow-md flex flex-col items-center bg-white">
      {spec.image && (
        <img
          src={spec.image}
          alt={spec.name}
          className="w-24 h-24 object-cover rounded-full shadow-md"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <span className="text-lg font-semibold mt-2">{spec.name}</span>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleDelete(spec._id)}
          className="bg-[#E63946] text-white px-4 py-2 rounded-lg hover:bg-[#B71C1C] shadow-md"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


      <h3 className="text-xl font-semibold mt-6 mb-4 text-[#157B7B]">Deleted Specialities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialities.filter((spec) => spec.isDelete).map((spec) => (
          <div key={spec._id} className="border rounded-lg p-4 shadow-md flex justify-between items-center bg-gray-100">
            <span className="text-lg line-through text-gray-500">{spec.name}</span>
            <button
              onClick={() => handleRestore(spec._id)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 shadow-md"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
   
  

      

{/* <Modal open={showModal} onClose={() => setShowModal(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
    }}
  >
    {/* Close Button */}
    {/* <IconButton
      onClick={() => setShowModal(false)}
      sx={{ position: "absolute", top: 8, right: 8 }}
    >
      <CloseIcon />
    </IconButton>

    <Typography variant="h6" gutterBottom>
      Edit Speciality
    </Typography>

    <TextField
      fullWidth
      label="Speciality Name"
      variant="outlined"
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      sx={{ mb: 2 }}
    />

    <input type="file" onChange={(e) => setEditImage(e.target.files?.[0] || null)} className="mb-4" />

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
      <Button variant="contained" color="success" onClick={() => { editId &&  handleUpdate(editId); setShowModal(false); }}> 
      {/* ivde nmll editId&& handleUpdte vilicheile adym ivde editId&& llyayirn so appo editIdme error vann ith state appo nj statil onnengil null | string ennan kodthe appo handlupdate expect cheyne oru string aan but typin risk edkan veyya 
      null aayol appo edit&& ingane kodthappo ntha vechal editId&& vechal ath null allengil mathre handlupdate vilikollu */}
        {/* Save
      </Button>
    </div>
  </Box>
// </Modal> */} 

    </div>
  );





};

export default Specialities;