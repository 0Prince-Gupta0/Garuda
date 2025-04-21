/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../../config"
import convertTime from "../../utils/convertTime"
import {toast} from 'react-toastify';

const SidePanel = ({doctorId, ticketPrice, timeSlots}) => {
  const navigate=useNavigate();
  const bookingHandler= async ()=>{
    try{
      const res = await fetch(`${BASE_URL}/booking/checkout-session/${doctorId}`, {
        method: "POST",
        headers: {
          authorization:`Bearer ${token}`
        }
      })
      const data = await res.json()
      if(!res.ok)
      {
        throw new Error(data.message +'\n'+'\"Hope you\'re not a DOCTOR\"')
      }

      if(data.session.url)
      {
        window.location.href = data.session.url
      }

      if(res.ok)
      {
        navigate('/checkout-success');
      }
    }
    catch(err)
    {
     toast.error(err.message);
    }
  }
  
  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md '>
        <div className="flex items-center justifu-between">
            <p className="text_para mt-0 font-semibold ">Ticket Price </p>
            <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
            &nbsp; Rs. {ticketPrice}
            </span>

        </div>
        <div className='mt-[30px] '>
          <p className="text_para mt-0 font-semibold text-headingColor">
            Available Time Slots: 
          </p>
          <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className='flex items-center justify-between mb-2'>
              <p className='text-[15px] leading-6 text-textColor font-semibold'>
                {item.day.charAt(0).toUpperCase()+item.day.slice(1)}
              </p>
              <p className='text-[15px] leading-6 text-textColor font-semibold'>
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
              </p>
            </li>
          ))}
          </ul>
          
          
        </div>
        <button onClick={bookingHandler} className='btn px-2 w-full rounded-md'>Book Appointment</button>
    </div>
  )
}

export default SidePanel