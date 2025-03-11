import { useState, useEffect } from "react";

const ContractFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [equityPercentage, setEquityPercentage] = useState("");
  const [conditions, setConditions] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current user's posts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserPosts();
    }
  }, [isOpen]);

  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.id) {
        console.error("User ID is missing");
        return;
      }

      const postedUrl = `http://localhost:3000/posts/owned/${currentUser.id}`;
      const response = await fetch(postedUrl);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setUserPosts(data);
        if (data.length > 0) {
          setSelectedPost(data[0]._id); // Select first post by default
        }
      } else {
        console.error("Error fetching posts:", data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the full post object based on selected ID
    const postDetails = userPosts.find(post => post._id === selectedPost);
    
    onSubmit({
      investmentAmount: parseFloat(investmentAmount),
      equityPercentage: parseFloat(equityPercentage),
      conditions,
      paymentDate,
      postId: selectedPost,
      postDetails // Include full post details
    });
    
    // Reset form
    setInvestmentAmount("");
    setEquityPercentage("");
    setConditions("");
    setPaymentDate("");
    setSelectedPost("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Contract</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Post Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Select Your Startup Idea</label>
              {isLoading ? (
                <p className="text-gray-500">Loading your posts...</p>
              ) : userPosts.length === 0 ? (
                <p className="text-red-500 text-sm">No posts found. You need to create a post first.</p>
              ) : (
                <select 
                  value={selectedPost}
                  onChange={(e) => setSelectedPost(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>Select an idea</option>
                  {userPosts.map(post => (
                    <option key={post._id} value={post._id}>
                      {post.problem} - {post.companyName || 'Unnamed'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <input
              type="number"
              placeholder="Investment Amount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Equity Percentage"
              value={equityPercentage}
              onChange={(e) => setEquityPercentage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="date"
              placeholder="Payment Date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            <textarea
              placeholder="Additional Conditions"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={isLoading || userPosts.length === 0}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractFormModal;