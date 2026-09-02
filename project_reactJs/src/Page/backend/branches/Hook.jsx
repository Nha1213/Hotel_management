
import {alertError} from '../../../swertalert/AlertSuccess'
import Request from '../../util/Request';
import { useEffect } from 'react';
import { useState } from 'react';
const Hook = () => {
    const [dataStaff, setStaff] = useState([]);
    const fetchStaff = async () => {
        try{
            const res = await Request('/api/staffs', "get");
            if(res){
                setStaff(res.data);
                console.log("Fetched Staff Data:", res.data);
            }
        }catch(error){
            alertError({
                text: error?.message || "Failed to fetch staff data",
            });
        }
    }
    useEffect(() => {      
        fetchStaff();
    }, []);
  return (
    {
        dataStaff, 
    }
  )
}

export default Hook