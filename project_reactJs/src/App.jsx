import { Routes, Route, } from 'react-router-dom'
import Layout from "./Page/components/Layout";


import LayoutPage from "./Page/frontend/layout/LayoutPage";
import Homepage from "./Page/frontend/Homepage/Homepage";
import AboutPage from './Page/frontend/AboutPage/AboutPage';

import Login from "./Page/backend/user_account/Login";
import Register from "./Page/backend/user_account/Register";
const App = () => {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<h1>Home</h1>} />
      </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      <Route element={<LayoutPage />}>
        <Route path='/index' element={<Homepage />} />
        <Route path='/about' element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App