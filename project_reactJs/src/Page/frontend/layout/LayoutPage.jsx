import {Outlet} from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
const LayoutPage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default LayoutPage