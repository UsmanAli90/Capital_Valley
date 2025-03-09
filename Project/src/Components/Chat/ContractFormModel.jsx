import { useState } from "react";

const ContractFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [equityPercentage, setEquityPercentage] = useState("");
  const [conditions, setConditions] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ investmentAmount, equityPercentage, conditions, paymentDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Contract</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Investment Amount (in wei)"
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