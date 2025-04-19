import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import {BASE_URL, token} from "../../config";
import HashLoader from 'react-spinners/HashLoader';
import {toast} from 'react-toastify';

const FeedbackForm = () => {
  const [rating, setrating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText]=useState("");
 const [loading,setLoading]=useState(false);
 const {id}= useParams();


  const handleSubmitReview = async e=>{
    e.preventDefault();
    setLoading(true);
    try {
      if(!rating || !reviewText){
        setLoading(false)
        return toast.error('Rating & Review Fields are required')

        
      }
      const res = await fetch(`${BASE_URL}/doctor/${id}/reviews`, {
        method:"post",
        headers:{
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body:JSON.stringify({rating,reviewText})
      })
      const result=await res.json()
      if(!res.ok)
      {
        throw new Error(result.message);
      }
      setLoading(false);
      toast.success('Review Added Successfully')
    }
    catch(err)
    {
      setLoading(false);
      toast.error(err.message);
    }
  }
  return (
    <form action="">
      <div>
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4">
          How would you rate the overall experience?
        </h3>
        <div>
          {[...Array(5).keys()].map((_, index) => {
            index += 1;
            return (
              <button
                key={index}
                type="button"
                className={`${
                  index <= ((rating && hover) || hover)
                    ? "text-yellowColor"
                    : "text-gray-400"
                } bg-transparent border-none outline-none text-[22px] cursor-pointer `}
                onClick={() => setrating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setrating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-[30px]">
      <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4">
          Share yourfeedback or suggestions
        </h3>
        <textarea className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md" rows="5" placeholder="Write your message" onChange={e=>setReviewText(e.target.value)} value={reviewText}>

          
        </textarea>
        <button type="submit" className="btn" onClick={handleSubmitReview}>
         {loading ? <HashLoader size={25} color='#fff'></HashLoader>: 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
