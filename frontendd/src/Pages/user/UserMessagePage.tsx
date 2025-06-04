import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MessagesPage from '../../Components/MessagePage'; 
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const UserMessages = () => {
    const { doctorId: paramDoctorId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const doctorId = paramDoctorId || location.state?.doctorId || location.state?.doctorMongoId;
    
    console.log('UserMessages - Sources check:', {
      paramDoctorId,
      locationState: location.state,
      finalDoctorId: doctorId
    });
  
    const [currentUser, setCurrentUser] = useState(null);
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!doctorId) {
        console.error('No doctor ID provided');
        setError('No doctor selected for messaging');
        setLoading(false);
        return;
      }
  
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log('No authenticated user found');
          setCurrentUser(null);
          setLoading(false);
          return;
        }
    
        try {
          // Fetch logged-in user data - CHECK ROLE FROM DATABASE
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let currentUserData = null;
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // Use the actual role from database, fallback to 'user'
            const userRole = userData.role || 'user';
            
            // Only proceed if this is actually a user/patient
            if (userRole !== 'user' && userRole !== 'patient') {
              setError('This page is only accessible to patients');
              setLoading(false);
              return;
            }
    
            currentUserData = {
              uid: user.uid,
              role: userRole, // Use actual role from database
              name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
              avatar: userData.profilePicture || userData.profileImage || '',
              firstName: userData.firstName,
              lastName: userData.lastName
            };
          } else {
            // Check if user exists in doctors collection (shouldn't for UserMessages)
            const doctorDocRef = doc(db, 'doctors', user.uid);
            const doctorDocSnap = await getDoc(doctorDocRef);
            
            if (doctorDocSnap.exists()) {
              setError('Doctors should use the doctor messaging interface');
              setLoading(false);
              return;
            }
            
            // Fallback user data
            currentUserData = {
              uid: user.uid,
              role: 'user',
              name: user.displayName || 'User',
              avatar: user.photoURL || '',
            };
          }
          
          setCurrentUser(currentUserData);
    
          // Handle doctor data from mongoId
          console.log('Searching for doctor with ID:', doctorId);
          
          // First try doctors collection
          const doctorsRef = collection(db, 'doctors');
          const doctorQuery = query(doctorsRef, where('mongoId', '==', doctorId));
          const doctorSnapshot = await getDocs(doctorQuery);
          
          if (!doctorSnapshot.empty) {
            const doctorDoc = doctorSnapshot.docs[0];
            const docData = doctorDoc.data();
            
            console.log('Doctor found in doctors collection:', docData);
            
            setDoctorData({
              uid: doctorDoc.id,
              mongoId: doctorId,
              name: docData.name || `${docData.firstName || ''} ${docData.lastName || ''}`.trim() || 'Doctor',
              avatar: docData.profilePicture || docData.profileImage || '',
              role: 'doctor' // Ensure doctor role
            });
          } else {
            // Try users collection but filter by role
            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('mongoId', '==', doctorId));
            const userSnapshot = await getDocs(userQuery);
            
            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0];
              const userData = userDoc.data();
              
              // Check if this user is actually a doctor
              if (userData.role === 'doctor') {
                console.log('Doctor found in users collection:', userData);
                
                setDoctorData({
                  uid: userDoc.id,
                  mongoId: doctorId,
                  name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Doctor',
                  avatar: userData.profilePicture || userData.profileImage || '',
                  role: 'doctor'
                });
              } else {
                console.log('User found but not a doctor:', userData);
                setError(`Selected user is not a doctor`);
              }
            } else {
              console.log('No doctor found with this MongoDB ID:', doctorId);
              setError(`Doctor not found with ID: ${doctorId}`);
              
              setDoctorData({
                uid: null,
                mongoId: doctorId,
                name: 'Unknown Doctor',
                avatar: '',
                role: 'doctor'
              });
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error loading doctor information');
        }
    
        setLoading(false);
      });
    
      return () => unsubscribe();
    }, [doctorId]);
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  
    if (!currentUser) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please log in to continue</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      );
    }

  return (
    <MessagesPage 
      currentUser={currentUser}
      specificDoctorId={doctorId}
      doctorInfo={doctorData}
      onBack={() => navigate(-1)}
    />
  );
};

export default UserMessages;