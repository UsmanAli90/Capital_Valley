// import { X } from "lucide-react";

// const ChatHeader = ({ user, onClose }) => {
//     // If no user is selected, return a fallback UI
//     if (!user) {
//         return (
//             <div className="p-2.5 border-b border-base-300">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div>
//                             <h3 className="font-medium">No user selected</h3>
//                             <p className="text-sm text-base-content/70">Offline</p>
//                         </div>
//                     </div>

//                     {/* Close button */}
//                     <button onClick={onClose}>
//                         <X />
//                     </button>
//                 </div>
//             </div>
//         );
//     }



//     return (
//         <div className="p-2.5 border-b border-base-300">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     {/* User info */}
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <img
//                                 src={user.profilepic || "/avatar.png"}
//                                 alt={user.username}
//                                 className="size-12 object-cover rounded-full"
//                             />
//                             <h3 className="font-medium">{user.username}</h3>
//                         </div>
//                         <p className="text-sm text-base-content/70">
//                             {/* Online status */}
//                             {/* {user.online ? "Online" : "Offline"} */}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Close button */}
//                 <button onClick={onClose}>
//                     <X />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatHeader;




//   if (!user) {
//     return (
//         <div className="p-2.5 border-b border-base-300">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                     <div>
//                         <h3 className="font-medium">No user selected</h3>
//                         <p className="text-sm text-base-content/70">Offline</p>
//                     </div>
//                 </div>

//                 {/* Close button */}
//                 <button onClick={onClose}>
//                     <X />
//                 </button>
//             </div>
//         </div>
//     );
// }


// import { useState } from "react";
// import toast from "react-hot-toast";
// import Web3 from "web3";
// import { X } from "lucide-react";
// import contractABI from "./ContractABI";
// import ContractFormModal from "./ContractFormModel";
// import socket from "./Socket"; // Import Socket.IO client

// const ChatHeader = ({ user, onClose }) => {
//   const BASE_URL = "http://localhost:3000";
//   const [contractAddress, setContractAddress] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);


//   const createContract = async ({ investmentAmount, equityPercentage, paymentDate }) => {
//     if (!window.ethereum) {
//       toast.error("Please install MetaMask to create a contract.");
//       return;
//     }
  
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const web3 = new Web3(window.ethereum);
//       const accounts = await web3.eth.getAccounts();
//       const investorAddress = accounts[0];
//       const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; 
  
//       const paymentTimestamp = Math.floor(new Date(paymentDate).getTime() / 1000);
  
//       // Send the contract details to Ali via Socket.IO
//       const contractDetails = {
//         investorAddress,
//         secondUserAddress,
//         investmentAmount,
//         equityPercentage,
//         paymentTimestamp,
//       };
  
//       socket.emit("sendContract", contractDetails);
//       toast.success("Contract sent successfully!");
//     } catch (error) {
//       console.error("Error creating contract:", error);
//       toast.error("Failed to create contract. Check the console for details.");
//     }
//   };


//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div>
//             <div className="flex items-center gap-3">
//               <img
//                 src={user.profilepic || "/avatar.png"}
//                 alt={user.username}
//                 className="size-12 object-cover rounded-full"
//               />
//               <h3 className="font-medium">{user.username}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Make Contract
//           </button>

//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>
//       </div>

//       <ContractFormModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={createContract}
//       />
//     </div>
//   );
// };

// export default ChatHeader;




import { X } from "lucide-react";
import ContractFormModal from "./ContractFormModel";
import toast from "react-hot-toast";
import Web3 from "web3";
import socket from "./Socket"; // Import Socket.IO client
// const createContract = async ({ investmentAmount, equityPercentage, paymentDate },user,onContractSubmit = () => {}) => {
//     const BASE_URL = "http://localhost:3000";
//     const currentUser = JSON.parse(localStorage.getItem('user'));
//     const web3 = new Web3(window.ethereum);
//     const accounts = await web3.eth.getAccounts();
//     const investorAddress = accounts[0];
//     const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
//     console.log("Selected User in ChatHeader.jsx is:",currentUser.id)
//     try {
//         const response = await fetch(`${BASE_URL}/contracts/${user._id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify({
//                 senderId: currentUser.id,
//                 receiverId: user._id,
//                 investorAddress: investorAddress, // Assuming currentUser has walletAddress
//                 secondUserAddress: secondUserAddress, // Assuming user has walletAddress
//                 investmentAmount,
//                 equityPercentage,
//                 // paymentDate,
//             }),
//         });
//         console.log("Response is", response);
//         console.log("User in Chatgeader is",user._id)
//         console.log("CurrentUser in Chatgeader is",currentUser.id)
//         console.log("Username in Chatgeader is",user.username)

//         if (!response.ok) {
//             throw new Error('Failed to save contract details.');
//         }

//         const data = await response.json();
//         onContractSubmit({
//             id: data._id,
//             investmentAmount,
//             equityPercentage
//           });
//         console.log("Data is",data)
//         toast.success("Contract saved successfully!");

        
//     } catch (error) {
//         console.error("Error creating contract:", error);
//         toast.error("Failed to create contract. Check the console for details.");
//     }
// };



const createContract = async ({ 
    investmentAmount, 
    equityPercentage, 
    conditions, 
    paymentDate,
    postId,
    postDetails
  }, user, onContractSubmit = () => {}) => {
      const BASE_URL = "http://localhost:3000";
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const investorAddress = accounts[0];
      const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      console.log("Selected User in ChatHeader.jsx is:", currentUser.id)
      try {
          const response = await fetch(`${BASE_URL}/contracts/${user._id}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                  senderId: currentUser.id,
                  receiverId: user._id,
                  investorAddress: investorAddress,
                  secondUserAddress: secondUserAddress,
                  investmentAmount,
                  equityPercentage,
                  paymentDate,
                  conditions,
                  postId,
                  postName: postDetails?.problem || '',
                  companyName: postDetails?.companyName || '',
              }),
          });
          console.log("Response is", response);
          console.log("User in Chatgeader is", user._id)
          console.log("CurrentUser in Chatgeader is", currentUser.id)
          console.log("Username in Chatgeader is", user.username)
  
          if (!response.ok) {
              throw new Error('Failed to save contract details.');
          }
  
          const data = await response.json();
          
          // Pass back complete data including the original form values
          onContractSubmit({
              id: data._id,
              investmentAmount,
              equityPercentage,
              conditions,
              paymentDate,
              postId,
              postDetails
          });
          
          console.log("Data is", data)
          toast.success("Contract saved successfully!");
  
          
      } catch (error) {
          console.error("Error creating contract:", error);
          toast.error("Failed to create contract. Check the console for details.");
      }
  };

const ChatHeader = ({ user, onClose, setIsModalOpen, isModalOpen, onContractSubmit }) => {
    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={user.avatar || "/avatar.png"}
                                alt={user.username}
                                className="size-12 object-cover rounded-full"
                            />
                            <h3 className="font-medium">{user.username}</h3>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Make Contract
                    </button>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>
            </div>

            <ContractFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(formData) => {
                    // Make sure formData contains investmentAmount and equityPercentage
                    if (!formData || !formData.investmentAmount || !formData.equityPercentage) {
                        toast.error("Please fill in all required contract fields");
                        return;
                    }
                    createContract(formData, user, onContractSubmit);
                }}
            />
        </div>
    );
};

export default ChatHeader;