/* eslint-disable react/prop-types */

import { BsChatDots } from "react-icons/bs";
import { formatDate } from "../../utils/formatDate";
import ChatModal from "../../components/ChatModal";
import { useState } from "react";
import {BASE_URL, token} from './../../config'


const Appointments = ({ data}) => {
 
  const [selectedChat, setSelectedChat] = useState(null);

   const openChat = async (user) => {
    const userId=user._id;
    const reUserModel=user.role;
    // console.log("reUserId:");
    // console.log(userId);
    // console.log("reUserModel:");
    // console.log(reUserModel);


    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reUserId : userId, reUserModel: reUserModel})
      });
  console.log(res);
      if (!res.ok) {
        const errText = await res.text();
        console.error("Error Response:", errText);
        throw new Error(`Chat API error: ${res.status}`);
      }
  
      const data = await res.json();
      setSelectedChat(data);
    } catch (error) {
      console.error("❌ Failed to open chat:", error.message);
      alert("Failed to open chat. Please try again.");
    }
  };
  return (
    <div>
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Gender</th>
            <th scope="col" className="px-6 py-3">Payment</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Booked on</th>
            <th scope="col" className="px-6 py-3">Chat</th>
          </tr>
        </thead>
        <tbody>
          {data.appointments?.map((item) => (
            <tr key={item.id}>
              <th scope="row" className="flex items-center px-6 py-4">
                {item.name}
                <img
                  src={item.user.photo}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <div className="text-base font-semibold">{item.user.name}</div>
                  <div className="text-normal text-gray-500">{item.user.email}</div>
                </div>
              </th>
              <td className="px-6 py-4">{item.gender}</td>
              <td className="px-6 py-4">
                {item.isPaid ? (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <div className="text-sm text-gray-500">Paid</div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    <div className="text-sm text-gray-500">Unpaid</div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{item.ticketPrice}</td>
              <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
              <td className="px-6 py-4">
              <button onClick={() => openChat(item.user)}>
    <BsChatDots size={24} />
  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChat && (
  <ChatModal
    chat={selectedChat}
    currentUser={data}
    onClose={() => setSelectedChat(null)}
  />
)}
    </div>
  );
};

export default Appointments;
