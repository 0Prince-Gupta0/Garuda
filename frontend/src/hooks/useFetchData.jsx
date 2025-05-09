import {useEffect, useState} from 'react';
import {token} from '../config'


const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);
    // console.log(url);
    useEffect(()=>{
        
        const fetchData = async () => {
            setLoading(true);
            try{
                const res= await fetch(url, {
                    headers:{Authorization:`Bearer ${token}`}
                })
                // console.log(res);
                const result = await res.json();
                // console.log(result);
                if(!res.ok)
                {
                  // console.log(result.message)
                  throw new Error(result.message);
                }
                
                setData(result.data);
                // console.log(data);
                setLoading(false)
            }
            catch(err)
            {
                setLoading(false);
                setError(err.message)
            }
            }
            fetchData();
            
    },[url])

  return (
    { data, loading, error }
  )
}

export default useFetchData