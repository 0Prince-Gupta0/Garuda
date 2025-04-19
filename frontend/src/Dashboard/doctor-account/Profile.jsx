import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "./../../config";
import { toast } from "react-toastify";

const Profile = ({ doctorData }) => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [],
    experiences: [],
    timeSlots: [],
    photo: null,
  });

  useEffect(() => {
    // console.log("doctorData:", doctorData); 
    setFormData({
      name: doctorData?.name || "",
      email: doctorData?.email || "",
      phone: doctorData?.phone || "",
      bio: doctorData?.bio || "",
      gender: doctorData?.gender || "",  
      specialization: doctorData?.specialization || "",
      ticketPrice: doctorData?.ticketPrice || 0,
      qualifications: doctorData?.qualifications || [],
      experiences: doctorData?.experiences || [],
      timeSlots: doctorData?.timeSlots || [],
      photo: doctorData?.photo || null,
    });
  }, [doctorData]);

  const handleInputChange = (e) => {
    // console.log(`Updating ${e.target.name}: ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/doctor/${doctorData._id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
     
      const result = await res.json();
      // console.log(result)
      if (!res.ok) {
        throw Error(result.message);
      }
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteItem = (key, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  const addItem = (key, item) => {
    setFormData({ ...formData, [key]: [...formData[key], item] });
  };

  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updateItems = [...prevFormData[key]];
      updateItems[index][name] = value;
      return { ...prevFormData, [key]: updateItems };
    });
  };

  const deleteQualification = (e, index) => {
    e.preventDefault();
    deleteItem("qualifications", index);
  };

  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      position: "",
      hospital: "",
    });
  };

  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event);
  };

  const deleteExperience = (e, index) => {
    e.preventDefault();
    deleteItem("experiences", index);
  };

  const addExperience = (e) => {
    e.preventDefault();
    addItem("experiences", {
      startingDate: "",
      endingDate: "",
      degree: "",
      university: "",
    });
  };

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event);
  };

  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };

  const addTimeSlot = (e) => {
    e.preventDefault();
    addItem("timeSlots", { day: "", startingTime: "", endingTime: "" });
  };

  const handleTimeSlotChange = (event, index) => {
    handleReusableInputChangeFunc("timeSlots", index, event);
  };

  return (
    <>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>
      <form>
        <div className="mb-5">
          <p className="form_label">Name</p>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form_input"
          ></input>
        </div>
        <div className="mb-5">
          <p className="form_label">Email</p>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form_input"
            readOnly
            aria-readonly
            disabled={true}
          ></input>
        </div>
        <div className="mb-5">
          <p className="form_label">Phone</p>
          <input
            type="number"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form_input"
          ></input>
        </div>
        <div className="mb-5">
          <p className="form_label">Bio</p>
          <input
            type="text"
            placeholder="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="form_input"
            maxLength={100}
          ></input>
        </div>
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form_label">Gender</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form_input py-3.5"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <p className="form_label">Specialization</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form_input py-3.5"
              >
                <option value="surgeon">Surgeon</option>
                <option value="dermalogist">Dermalogist</option>
                <option value="neurologist">Neurologist</option>
              </select>
            </div>
            <div>
              <p className="form_label">Ticket Price</p>
              <input
                type="number"
                placeholder="100"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                className="form_input"
              ></input>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className="form_label">Qualifications</p>
          {formData.qualifications?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form_label">Starting Dates</p>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate}
                      className="form_input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form_label">Ending Dates</p>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate}
                      className="form_input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form_label">Degree</p>
                    <input
                      type="text"
                      name="degree"
                      value={item.degree}
                      className="form_input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form_label">University</p>
                    <input
                      type="text"
                      name="university"
                      value={item.university}
                      className="form_input"
                      onChange={(e) => handleQualificationChange(e, index)}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => deleteQualification(e, index)}
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addQualification}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Qualification
          </button>
        </div>

        <div className="mb-5">
          <p className="form_label">Experiences</p>
          {formData.experiences?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form_label">Starting Dates</p>
                    <input
                      type="date"
                      name="startingDate"
                      value={item.startingDate}
                      className="form_input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form_label">Ending Dates</p>
                    <input
                      type="date"
                      name="endingDate"
                      value={item.endingDate}
                      className="form_input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                  <div>
                    <p className="form_label">Position</p>
                    <input
                      type="text"
                      name="position"
                      value={item.position}
                      className="form_input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form_label">Hospital</p>
                    <input
                      type="text"
                      name="hospital"
                      value={item.hospital}
                      className="form_input"
                      onChange={(e) => handleExperienceChange(e, index)}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => deleteExperience(e, index)}
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Experience
          </button>
        </div>

        <div className="mb-5">
          <p className="form_label">Time Slots</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                  <div>
                    <p className="form_label">Days</p>
                    <select
                      name="day"
                      value={item.day}
                      className="form_input py-3.5 "
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <p className="form_label">Starting Time</p>
                    <input
                      type="time"
                      name="startingTime"
                      value={item.startingTime}
                      className="form_input"
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div>
                    <p className="form_label">Ending Time</p>
                    <input
                      type="time"
                      name="endingTime"
                      value={item.endingTime}
                      className="form_input"
                      onChange={(e) => handleTimeSlotChange(e, index)}
                    />
                  </div>
                  <div
                    onClick={(e) => deleteTimeSlot(e, index)}
                    className="frlx items-center"
                  >
                    <button className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer mt-10">
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addTimeSlot}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Time Slot
          </button>
        </div>

        <div className="mb-5">
          <p className="form_label ">About</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder="Write about you"
            onChange={handleInputChange}
            className="form_input "
          ></textarea>
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img
                src={formData.photo}
                alt=""
                className="w-full rounded-full"
              ></img>
            </figure>
          )}
          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              {selectedFile ? selectedFile.name : "Upload Photo"}
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </>
  );
};

export default Profile;
