import Review from "../models/ReviewSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const getAllReviews=async(req,res)=>{
    try {
        const reviews=await Review.find({});
        res.status(200).json({success:true, data:reviews});
    }
    catch(err)
    {
        res.status(500).json({success:false, message:err.message});
    }
}


export const createReview = async (req, res) => {
    try {
      
      if (!req.params.doctorId) {
        return res.status(400).json({ success: false, message: "Doctor ID is required" });
      }
  
      
      if (!req.userId) {
        return res.status(401).json({ success: false, message: "User authentication required" });
      }
  
      req.body.doctor = req.params.doctorId;
      req.body.user = req.userId;
  
      const doctorExists = await Doctor.findById(req.body.doctor);
      if (!doctorExists) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }

      const newReview = new Review(req.body);
      const savedReview = await newReview.save();
  
     
      await Doctor.findByIdAndUpdate(
        req.body.doctor,
        { $push: { reviews: savedReview._id } },
        { new: true, useFindAndModify: false }
      );
  
      res.status(201).json({ success: true, data: savedReview });
    } catch (err) {
      console.error("Error creating review:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  