import { useEffect, useState } from "react";


const useLoadDepartments = () => {
    const [ existingDepartments, setExistingDepartments ] = useState([])
    useEffect( ()=> {
        fetch(`https://cmh-server01.onrender.com/api/getDepartments`)
        .then(res => res.json())
        .then(data => setExistingDepartments(data))
    }, [])
    return {
        existingDepartments,
    }
};

export default useLoadDepartments;