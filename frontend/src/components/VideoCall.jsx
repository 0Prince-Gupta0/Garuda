import { useCallback, useEffect, useState } from "react";
import { socket } from "../socket";
import peer from "../service/peer";
import ReactPlayer from "react-player";
import { FaVideo, FaPhoneSlash } from "react-icons/fa";
import { MdScreenShare } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const VideoCall = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [callStarted, setCallStarted] = useState(false);
  const navigate = useNavigate();

  const handleUserJoined = useCallback(({ id, socketId }) => {
    setRemoteSocketId(socketId);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setCallStarted(true);
  }, [remoteSocketId]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
      setCallStarted(true);
    },
    []
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    []
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    if (peer.peer) {
      peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    }
  
    return () => {
      if (peer.peer) {
        peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      }
    };
  }, [handleNegoNeeded]);
  

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  const cleanup = () => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    peer.destroy();
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
    setCallStarted(false);

    if (remoteSocketId) {
      socket.emit("end:call", { to: remoteSocketId });
    }

    navigate("/");
  };

  const handleCallEnded = useCallback(() => {
    cleanup();
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:ended", handleCallEnded);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:ended", handleCallEnded);
    };
  }, [
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleCallEnded
  ]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-4">Video Call Room</h1>
      <h4 className="text-lg mb-6">
        {remoteSocketId ? "✅ User connected" : "❌ Waiting for user to join..."}
      </h4>

      <div className="relative flex gap-4">
        {myStream && (
          <div className="relative">
            <ReactPlayer
              playing
              muted
              height="200px"
              width="300px"
              url={myStream}
              className="rounded-xl shadow-lg border-2 border-green-500"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-xs rounded">
              You
            </span>
          </div>
        )}

        {remoteStream && (
          <div className="relative">
            <ReactPlayer
              playing
              height="200px"
              width="300px"
              url={remoteStream}
              className="rounded-xl shadow-lg border-2 border-blue-500"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-xs rounded">
              Remote
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        {remoteSocketId && !callStarted && (
          <button
            onClick={handleCallUser}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <FaVideo /> Call
          </button>
        )}

        {myStream && (
          <button
            onClick={sendStreams}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <MdScreenShare /> Camera On
          </button>
        )}

        {myStream && (
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full flex items-center gap-2"
            onClick={cleanup}
          >
            <FaPhoneSlash /> End
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
