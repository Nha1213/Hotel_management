import {alertError,alertSuccess} from "../../../swertalert/AlertSuccess"
import request from "../util/request"
const HookUser = () => {

    const UserLogin =  async () => {
        try{
            const res = await request("/api/user/login", "POST", {
                username: "vothanarern@gmail.com",
                password: "12345678"
            })
            if(res){
                alertSuccess({
                    title: "Login Success",
                    text: "Login successfully"
                })
                console.log(res);
            }
        }catch(error){
            alertError({
                title: "Error",
                text: error?.response?.data?.message
            })
        }
    }

  return (
    {
        UserLogin
    }
  )
}

export default HookUser