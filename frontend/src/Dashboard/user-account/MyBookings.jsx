import { useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { BASE_URL, token } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { formatDate } from '../../utils/formatDate';
import { BsChatDots } from "react-icons/bs";
import ChatModal from '../../components/ChatModal';

const MyBookings = ({ userData }) => {
  const { data: appointments, loading, error } = useFetchData(`${BASE_URL}/user/appointments/my-appointments`);
  const [selectedChat, setSelectedChat] = useState(null);
  console.log(userData);
  const openChat = async (user) => {
    const userId=user._id;
    const reUserModel=user.role;

      console.log(user);
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
    <div className='m-auto'>
      {loading && !error && <Loading />}
      {error && !loading && <Error errorMessage={error} />}

      {!loading && !error && appointments.length > 0 ? (
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Payment</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Booked on</th>
              <th scope="col" className="px-6 py-3">Chat</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item._id}>
                <td className="flex items-center px-6 py-4">
                  <img src={item.doctor.photo} className="w-10 h-10 rounded-full mr-3" alt="Profile" />
                  <div>
                    <div className="text-base font-semibold">{item.doctor.name}</div>
                    <div className="text-normal text-gray-500">{item.doctor.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
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
                <td className="px-6 py-4">{item.ticketPrice || 'N/A'}</td>
                <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
                <td className="px-6 py-4">
                <button onClick={() => openChat(item.doctor)}>
    <BsChatDots size={24} />
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && (
          <h2 className="mt-5 text-center text-headingColor text-[20px] font-semibold">
            You have not booked any doctor yet.
          </h2>
        )
      )}

    
      {selectedChat && (
       <ChatModal
         chat={selectedChat}
         currentUser={userData}
         onClose={() => setSelectedChat(null)}
       />
     )}
    </div>
  );
};

export default MyBookings;
