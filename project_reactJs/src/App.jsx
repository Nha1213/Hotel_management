import { Routes, Route, } from 'react-router-dom'

import Layout from "./Page/components/Layout";
import Login from "./Page/backend/user_account/Login";
import Register from "./Page/backend/user_account/Register";
import Dashboard from "./Page/backend/dashboard/Dashboard";
import RoomType from './Page/backend/roomType/RoomType';
import Room from "./Page/backend/Room/Room";
import Branches from "./Page/backend/branches/Branches";
import Protect from "./Page/backend/Protect/Protect";
import ResetPassword from './Page/backend/user_account/resetPassword';

import LayoutPage from "./Page/frontend/layout/LayoutPage";
import Homepage from "./Page/frontend/Homepage/Homepage";
import AboutPage from './Page/frontend/AboutPage/AboutPage';

const App = () => {
  return (
    <Routes>
      <Route element={<Protect />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room" element={<Room />} />
          <Route path="/room_type" element={<RoomType />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
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