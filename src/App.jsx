// //Css....................................................
// import './App.css'

// //Dependencies...........................................
// import { BrowserRouter, Routes, Route } from 'react-router-dom'


// //Pages..................................................
// import Home from './pages/Home'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Signin from './pages/Signin'
// import Signup from './pages/Signup'
// import VideoCall from './pages/VideoCall'
// //Components............................................
// // index.js
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Service from './pages/Service'
// import SocketProvider from './Context/SocketProvider'
// import Navbar from './components/Navbar'
// import Dashbord from './pages/Dashbord'
// // import { useState } from 'react'
// function App() {
//   // const [loginStatus,setLoginStatus] = useState(false)
//   return (

//     <BrowserRouter>
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/about' element={<About />} />
//         <Route path='/contact' element={<Contact />} />
//         <Route path='/signin' element={<Signin />} />
//         <Route path='/signup' element={<Signup />} />
//         <Route path='/service' element={<Service />} />
//         <Route path='/dash' element={<Dashbord />} />
//         <Route path='/call' element={<>
//           <SocketProvider>
//             <Navbar />
//             <VideoCall />
//           </SocketProvider>
//         </>} />
//       </Routes>
//     </BrowserRouter>

//   )
// }

// export default App


/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
//Css....................................................
import './App.css'

//Dependencies...........................................
import { BrowserRouter, Routes, Route } from 'react-router-dom'


//Pages..................................................
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
//import VideoCall from './pages/VideoCall'
//Components............................................
// index.js
import '@fortawesome/fontawesome-free/css/all.min.css';
import Service from './pages/Service'
import {SocketProvider} from './Context/SocketProvider'
import Navbar from './components/Navbar'
import Dashbord from './pages/Dashbord'
import { useState, useContext, createContext } from 'react';
import ProtectedRoute from './components/Dashboard/ProtectedRoute'
import Call from './pages/Call'
import VideoCall from './components/ISL/VideoCall'

export const StatusContext = createContext();


function App({ children }) {
  const [loginStatus, setLoginStatus] = useState(true);
  return (
    <StatusContext.Provider value={{ loginStatus, setLoginStatus }}>
      <SocketProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/service' element={<Service />} />
          <Route path='/dash' element={<Dashbord />} />
          <Route path='/calling/:id' element={<VideoCall />} />
          <Route path='/call' element={<>
            <Call />
          </>} />
        </Routes>
      </SocketProvider>
    </StatusContext.Provider>
  )
}

export default App
