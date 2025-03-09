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


import { useState } from "react";
import toast from "react-hot-toast";
import Web3 from "web3";
import { X } from "lucide-react";
import contractABI from "./ContractABI"; // Import the ABI
import ContractFormModal from "./ContractFormModel"; // Import the modal

const ChatHeader = ({ user, onClose }) => {
    const BASE_URL = "http://localhost:3000"
    const [contractAddress, setContractAddress] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const createContract = async ({ investmentAmount, equityPercentage, paymentDate }) => {
        // Check if MetaMask is installed
        if (!window.ethereum) {
            toast.error("Please install MetaMask to create a contract.");
            return;
        }

        try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Create a Web3 instance
            const web3 = new Web3(window.ethereum);

            // Get the logged-in user's address from local storage


            //   const loggedInUserAddress = JSON.parse(localStorage.getItem('user'));
            //   console.log(loggedInUserAddress);
            //   const firstuser=loggedInUserAddress.id;
            //   if (!loggedInUserAddress) {
            //     toast.error("User address not found in local storage.");
            //     return;
            //   }


            const accounts = await web3.eth.getAccounts();
            const investorAddress = accounts[0];
            // Get the second user's address from the `user` prop
            const secondUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
            // console.log("user is", user) // Assuming `user.address` contains the second user's address
            // if (!secondUserAddress) {
            //     toast.error("Second user's address not found.");
            //     return;
            // }

            // Convert payment date to a timestamp
            const paymentTimestamp = Math.floor(new Date(paymentDate).getTime() / 1000);

            // Deploy the contract
            const contract = new web3.eth.Contract(contractABI);
            const deployedContract = await contract
                .deploy({
                    data: "0x608060405234801561001057600080fd5b50604051610970380380610970833981810160405281019061003291906100f4565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160028190555080600381905550505050506101c1565b6000815190506100d981610193565b92915050565b6000815190506100ee816101aa565b92915050565b6000806000806080858703121561010a57600080fd5b6000610118878288016100ca565b9450506020610129878288016100ca565b935050604061013a878288016100df565b925050606061014b878288016100df565b91505092959194509250565b600061016282610169565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b61019c81610157565b81146101a757600080fd5b50565b6101b381610189565b81146101be57600080fd5b50565b6107a0806101d06000396000f3fe6080604052600436106100915760003560e01c80639818227611610059578063981822761461014c578063b3892c6414610163578063b564e9261461018e578063e4f2e4e8146101b9578063f4a92299146101d057610091565b80631e0018d61461009657806367bbe321146100c157806369d89575146100ec5780636d20676e146100f65780636faa10b914610121575b600080fd5b3480156100a257600080fd5b506100ab6101fb565b6040516100b89190610640565b60405180910390f35b3480156100cd57600080fd5b506100d661021f565b6040516100e391906106f6565b60405180910390f35b6100f4610225565b005b34801561010257600080fd5b5061010b610356565b60405161011891906106f6565b60405180910390f35b34801561012d57600080fd5b5061013661035c565b604051610143919061065b565b60405180910390f35b34801561015857600080fd5b5061016161036f565b005b34801561016f57600080fd5b5061017861041a565b6040516101859190610640565b60405180910390f35b34801561019a57600080fd5b506101a3610440565b6040516101b0919061065b565b60405180910390f35b3480156101c557600080fd5b506101ce610453565b005b3480156101dc57600080fd5b506101e5610500565b6040516101f2919061065b565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b600460009054906101000a900460ff16801561024d5750600460019054906101000a900460ff165b61028c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610283906106b6565b60405180910390fd5b60025434146102d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c790610696565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015610338573d6000803e3d6000fd5b506001600460026101000a81548160ff021916908315150217905550565b60035481565b600460009054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103f4906106d6565b60405180910390f35b6001600460006101000a81548160ff021916908315150217905550565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460029054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104da90610676565b60405180910390fd5b6001600460016101000a81548160ff021916908315150217905550565b600460019054906101000a900460ff1681565b61051c81610722565b82525050565b61052b81610734565b82525050565b600061053e601583610711565b91507f4f6e6c7920737461727475702063616e207369676e00000000000000000000006000830152602082019050919050565b600061057e601b83610711565b91507f496e636f727265637420696e766573746d656e7420616d6f756e7400000000006000830152602082019050919050565b60006105be601c83610711565b91507f426f74682070617274696573206d757374207369676e206669727374000000006000830152602082019050919050565b60006105fe601683610711565b91507f4f6e6c7920696e766573746f722063616e207369676e000000000000000000006000830152602082019050919050565b61063a81610760565b82525050565b60006020820190506106556000830184610513565b92915050565b60006020820190506106706000830184610522565b92915050565b6000602082019050818103600083015261068f81610531565b9050919050565b600060208201905081810360008301526106af81610571565b9050919050565b600060208201905081810360008301526106cf816105b1565b9050919050565b600060208201905081810360008301526106ef816105f1565b9050919050565b600060208201905061070b6000830184610631565b92915050565b600082825260208201905092915050565b600061072d82610740565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600081905091905056fea264697066735822122061b2e345bbf950d29132ae9280beef421251b3e797499019c99295f1ece55f3f64736f6c63430008000033",
                    arguments: [investorAddress, secondUserAddress, investmentAmount, equityPercentage, paymentTimestamp],
                })
                .send({ from: investorAddress });

            setContractAddress(deployedContract.options.address);
            toast.success("Contract created successfully!");

            // Save contract details to the database
            await saveContractDetails({
                investorAddress,
                secondUserAddress,
                investmentAmount,
                equityPercentage,
                paymentTimestamp,
            });
        } catch (error) {
            console.error("Error creating contract:", error);
            toast.error("Failed to create contract. Check the console for details.");
        }
    };

    const saveContractDetails = async (details) => {
        try {
            const response = await fetch(`${BASE_URL}/contracts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (!response.ok) {
                throw new Error("Failed to save contract details.");
            }

            console.log("Contract details saved to the database.");
            toast.success("Contract details saved successfully.");
        } catch (error) {
            console.error("Error saving contract details:", error);
            toast.error("Error saving contract details");
        }
    };

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* User info */}
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={user.profilepic || "/avatar.png"}
                                alt={user.username}
                                className="size-12 object-cover rounded-full"
                            />
                            <h3 className="font-medium">{user.username}</h3>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    {/* Make Contract button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Make Contract
                    </button>

                    {/* Close button */}
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>
            </div>

            {/* Contract Form Modal */}
            <ContractFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createContract}
            />
        </div>
    );
};

export default ChatHeader;








