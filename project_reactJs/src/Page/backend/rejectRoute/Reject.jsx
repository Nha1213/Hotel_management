import React from 'react'
import { getStoreUser } from '../../localStorage/userStore'
import { useEffect } from 'react'


const Reject = () => {
    useEffect(() => {
        const user = getStoreUser();
        if (!user) {
            window.location.href = "/login";
        }
    }, [])
  return (
    <></>
  )
}

export default Reject