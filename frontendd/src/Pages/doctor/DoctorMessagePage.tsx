import { useParams, useNavigate } from 'react-router-dom';
import MessagesPage from '../../Components/MessagePage'; 
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const DoctorMessages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user, 'dddsdfasfa');
  
      if (!user) {
        console.log('No authenticated user found');
        setCurrentUser(null);
        setLoading(false);
        return;
      }
  
      try {
        // Try 'doctors' collection first
        let docRef = doc(db, 'doctors', user.uid);
        let docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          // Fallback to 'users' collection
          docRef = doc(db, 'users', user.uid);
          docSnap = await getDoc(docRef);
        }
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentUser({
            uid: user.uid,
            role: 'doctor',
            name: data.name || `${data.firstName || ''} ${data.lastName || ''}` || 'Doctor',
            avatar: data.profilePicture || '',
          });
        } else {
          console.log('Doctor document does not exist, setting default doctor role');
          setCurrentUser({
            uid: user.uid,
            role: 'doctor',
            name: user.displayName || 'Doctor',
            avatar: user.photoURL || '',
          });
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setCurrentUser({
          uid: user.uid,
          role: 'doctor',
          name: user.displayName || 'Doctor',
          avatar: user.photoURL || '',
        });
      }
  
      setLoading(false);
    });
  
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Please log in to continue</div>;
  }

  // Remove the strict role check or make it more flexible
  // if (currentUser.role !== 'doctor') {
  //   return <p>Unauthorized</p>;
  // }

  return (
    <MessagesPage 
      currentUser={currentUser}
      specificUserId={userId}
      onBack={() => navigate('/doctor/dashboard')}
    />
  );
};

export default DoctorMessages;