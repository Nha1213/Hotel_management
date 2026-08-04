import "./roomType,.css"
import LightMode from "../DartMode/LightMode"
const RoomType = () => {
  return (
   <>
     <div className="dashboard">
        <LightMode title="Room Type"/>

        <div className="d-flex justify-content-end">
            <button className="btn btn-primary">
               + Add New RoomType
            </button>
        </div>
     </div>
   </>
  )
}

export default RoomType