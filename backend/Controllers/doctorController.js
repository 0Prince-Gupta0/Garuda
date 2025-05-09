import BookingSchema from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).populate("reviews").select("-password");
    res.status(200).json({
      success: true,
      message: "Doctor Found",
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "No user Found" });
  }
};
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved", 
        $or: [
          { name: { $regex: query, $options: "i" } }, 
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: doctors,
    });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ success: false, message: "No Found" });
  }
};


export const getDoctorprofile = async (req, res) => {
  const userId = req.userId;
  try {
    const doctor = await Doctor.findById(userId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    const appointments=await BookingSchema.find({doctor:doctor})
    res
      .status(200)
      .json({
        success: true,
        message: "Profile info is getting",
        data: { ...rest, appointments },
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};
