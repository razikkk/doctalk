import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, MoreVertical } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {io} from 'socket.io-client'

type WEBRTCSignal = 
    | {type:'offer'; offer:RTCSessionDescriptionInit}
    | {type:'answer'; answer:RTCSessionDescriptionInit}
    | {type:'candidate'; candidate:RTCIceCandidate} //both sides share network info like IP, ports , ➡️ This creates a new ICE candidate object from the data we received from the other user.    

    const VideoCallPage = () => {
    const socket = useRef(io('http://localhost:3000'))
    const {appointmentId:roomId} = useParams()
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null) //is a webrtc object that let 2 users to connect direvvtly
  const localStreamRef = useRef<MediaStream | null>(null)

  const navigate = useNavigate()

  useEffect(()=>{
    // let isMounted = true
        const handleSignal = async(data:WEBRTCSignal)=>{ //to send offer/answer/ice btw 2 users
            if(!peerConnection.current) return // no connection stop it
            if(data.type === 'offer'){ // ithilthe first step offer aan offer ayakne aal aan (ivde dr)
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer)) // patientin aa offer kittum saves dr info
                const answer = await peerConnection.current.createAnswer() // patient anser create cheyyum
                await peerConnection.current.setLocalDescription(answer)//saving in patient side
                socket.current.emit('webrtc_signal',{roomId,data:{type:"answer", answer}})//patient store cheytha shesham dr send(tells teh webrtc : “Hey server, please send my WebRTC answer to the other person in the same room.”)
            }else if(data.type === 'answer'){ //This part is run by the doctor when the patient sends back the answer.
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer))
            }else if(data.type === 'candidate'){ //ICE = Interactive Connectivity Establishment.
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate)) //add network informations(ip,port) to webrtc connection
            }

        }

        socket.current.on('webrtc_signal',handleSignal) //Doctor sends a signal 📡 to server → server sends it to patient.   Patient is listening for "webrtc_signal" — when he hears it, he runs handleSignal() to handle it.
        
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{ //asks for audio and video, if accepts gives back a stream(contains video and audio) 
            localStreamRef.current = stream //You're saving the stream (camera + mic) into a variable so you can use it later (example: to send it over the internet to someone).
            if(localVideoRef.current){
                localVideoRef.current.srcObject = stream //Show my camera stream inside the <video> tag on the page.
                // The srcObject is a property on HTML <video> or <audio> elements.


            }

            peerConnection.current = new RTCPeerConnection() //creates a new peer connection object

            stream.getTracks().forEach((track)=>{ // each treack either video or audio
                peerConnection.current?.addTrack(track,stream) //This line takes each track (audio and video separately) and tells the WebRTC connection:
                //“Hey, when you connect to the other person, send this track (audio/video) to them.”
            })
            peerConnection.current.ontrack = (event:RTCTrackEvent)=>{ //ontrack (This sets up an event handler that runs every time the peer connection receives a new media track from the other user (like their video or audio).
                //RTCTrackEvent = this object contains the info of the incoming call
                if(remoteVideoRef.current){
                    remoteVideoRef.current.srcObject = event.streams[0] // this is the stream that the other user sends you contains video and audio (remoteVideoRef)
                }
            }

            peerConnection.current.onicecandidate = (event:RTCPeerConnectionIceEvent) =>{ //fn to run on every new ice canidate is found
                if(event.candidate){ // if canidate is not null means if there is a user 
                    socket.current.emit('webrtc_signal',{roomId,data:{type:'candidate',candidate:event.candidate.toJSON()}}) //This sends the ICE candidate to the other user through the server using a WebSocket (via Socket.IO).
                }
            }

            peerConnection.current.onnegotiationneeded = async()=>{ // this happens when something change that needs renegotiation(eg:mic mute aaki vode off aki call start cheytha shesham)
                const offer = await peerConnection.current?.createOffer() // browser creates a offer
                if(offer){
                    await peerConnection.current?.setLocalDescription(offer) //saves that info in webrtc connection
                    socket.current.emit("webrtc_signal",{roomId,data:{type:"offer",offer}}) // send this to other person throught the server
                }
            }
            socket.current.emit('join_room',roomId) // this happens before signaling(means exchanging offer/asnwer/ice btwn tow peers using websockets) , tells the server 
            
        })
        
        const handleCallEnded = ()=>{ // when the other user ends
            cleanup()
            navigate(-1)//go back to the previous page
        }
        socket.current.on('call_ended',handleCallEnded)// listens call_ended from server and call handleCallednded()

        return ()=>{ // when this component is removed(unmounted)
            socket.current.off('webrtc_signal',handleSignal) //stop listening to signals 
            socket.current.off('call_ended',handleCallEnded) //stop listening to call end

            cleanup() //to avoid memory leaks
        }
  },[roomId,navigate])

  const cleanup = ()=>{
    if(peerConnection.current){
        peerConnection.current.onicecandidate = null
        peerConnection.current.onnegotiationneeded = null
        peerConnection.current.ontrack = null
        peerConnection.current.close()
        peerConnection.current = null
    }

    if(localStreamRef.current){
        //stops the camera and mic
        localStreamRef.current.getTracks().forEach((track)=> track.stop())
        localStreamRef.current = null
    }

    //clear the vidoe screeens
    if(localVideoRef.current){
        localVideoRef.current.srcObject = null
    }
    if(remoteVideoRef.current){
        remoteVideoRef.current.srcObject = null
    }
  }

  const handleEndCall = ()=>{ // when i end the call
    cleanup()
    socket.current.emit('end_call',{roomId})
    navigate(-1)
  }
//   useEffect(()=>{
//     socket.current.on('call_ended',()=>{
//         navigate(-1)
//     })
//     return ()=>{
//         socket.current.off('call_ended')
//     }
//   },[navigate])

  const toggleMic = ()=>{
    setIsMuted(!isMuted)
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if(audioTrack) audioTrack.enabled = isMuted
  }

  const toggleVideo = ()=>{
    setIsVideoOff(!isVideoOff)
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if(videoTrack) videoTrack.enabled = isVideoOff
  }
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Call Timer and Info */}
      <div className="p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="font-semibold">DR</span>
          </div>
          <div>
            <h2 className="font-semibold">Dr. Sarah Johnson</h2>
            <p className="text-sm text-gray-400">32:15</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <MoreVertical size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 flex items-center justify-center relative">
        {/* Remote Video (Full Screen) */}
        <div className="w-full h-[calc(100vh-12rem)] bg-gray-800 rounded-2xl overflow-hidden relative">
        <video ref={remoteVideoRef} autoPlay playsInline  className="w-full h-full object-cover"/>
          
          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-72 h-70 bg-gray-900 rounded-xl overflow-hidden shadow-lg border-2 border-gray-700">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="p-8 bg-gray-900 flex items-center justify-center space-x-4">
        <button 
          onClick={toggleMic}
          className={`p-4 rounded-full ${
            isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          } transition-colors`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          } transition-colors`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        
        <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
          <Phone size={24} onClick={handleEndCall}/>
        </button>
        
        <button className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
          <MessageSquare size={24} />
        </button>
        
        <button className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
          <Users size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;