import DoctorCard from "../../components/Doctors/DoctorCard";
import { doctors } from "../../assets/data/doctors";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { useEffect, useState } from "react";

const Doctors = () => {
 
 const [query,setQuery]=useState('');
 const [debounceQuery, setDebounceQuery] = useState('');
const handleSearch=()=>{
  setQuery(query.trim());
  console.log('handleSearch')
}

useEffect(()=>{
  const timerId = setTimeout(() => {setDebounceQuery(query)},700)
  return () => clearTimeout(timerId)
})

const { data:doctors, loading, error } = useFetchData(`${BASE_URL}/doctor?query=${query}`);
  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              className="py-4 pl-4 pr-2 bg-transparent w-full fous:outline-none cursor-pointer placeholder:text-textColor "
              type="search"
              placeholder="Search doctor by name or specialization"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></input>
            <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
        {loading && <Loader/>}
        {error && <Error />} 
        {!loading && !error && <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-5 '>{ doctors.map((doctor, index)=>(<DoctorCard doctor={doctor} index={index} key={index} />))}
    </div>
       }
        
        </div>
      </section>
      <section>
          <div className="container">
            <div className="lg:w-[470px] mx-auto">
              <h2 className="heading text-center">What our patients say</h2>
              <p className="text_para text-center">
                World-class care for everyone. Our health System offers
                unmatched, expert health care.
              </p>
            </div>
            <Testimonial></Testimonial>
          </div>
        </section>
    </>
  );
};

export default Doctors;
