import './App.css';
import Login from './components/login';
import Register from './components/register';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Profile from './components/profile';
import Admin from './components/admin';
import ProtectedRoute from './components/protectedRoute';
import Error from './components/error404';

import { auth , db } from './components/firebase';

import { useEffect , useState } from 'react';
import Dashboard from './components/dashboard';
import { doc, getDoc } from 'firebase/firestore';
import ResumeHelper from './components/resumeHelper';
import JobAnalyzer from './components/jobAnalyzer';
import Chatbot from './components/chatbot';


export default function App() {

  const [user , setUser] = useState(null);
  const [userData , setUserData] = useState(null);
  const [loading , setLoading] = useState(true);

  useEffect(() => {


    const unsubscribe = auth.onAuthStateChanged( async (currentUser) => {

      setUser(currentUser);

      if(currentUser) {

        const docRef = doc(db , "users" , currentUser.uid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){

          setUserData(docSnap.data());

        }

      } else {

        setUserData(null);

      }

      setLoading(false);

    });

    return () => unsubscribe();


  } , [])


  return (

    <Router>


      <Routes>

        <Route path='/' element = {<Login />} />
        <Route path='/register' element = {<Register/>} />
        
        {/*protected routes*/}

        <Route
        
          path='/profile'
          element= {

            <ProtectedRoute user={user} userData={userData} loading={loading}>

              <Profile />

            </ProtectedRoute>

          }
        
        />

        <Route
        
          path='/admin'
          element= {

            <ProtectedRoute user={user} userData={userData} requiredRole="admin" loading={loading}>

              <Admin/>

            </ProtectedRoute>

          }
        
        />

        <Route 
        
          path='/dashboard'
          element= {

            <ProtectedRoute user={user} userData={userData} loading={loading}>

              <Dashboard />

            </ProtectedRoute>

          }
        
        />

        <Route 
        
          path='/resumeHelper'
          element= {

            <ProtectedRoute user={user} userData={userData} loading={loading}>

              <ResumeHelper />

            </ProtectedRoute>

          }

        />

        <Route 
        
          path='/jobAnalyzer'
          element= {

            <ProtectedRoute user={user} userData={userData} loading={loading}>

              <JobAnalyzer />

            </ProtectedRoute>

          }
        
        />

        <Route 

          path='/chatbot'
          element= {

            <ProtectedRoute user={user} userData={userData} loading={loading}>

              <Chatbot />

            </ProtectedRoute>

          }
        
        />

        <Route 
        
          path='*'
          element={<Error />}
        
        />


      </Routes>


    </Router>

  );


}
