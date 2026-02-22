"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export function StartSchemeModal({ onClose }: { onClose: () => void }) {
  const { firId } = useAuth();
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (amount < 10000) {
      alert("Minimum amount is ₹10,000");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/scheme/create", {
        firId: firId,
        targetAmount: amount,
      });

      alert("Scheme Created Successfully");
      onClose();

    } catch (err) {
      alert("Error creating scheme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#111] p-8 rounded-2xl w-[90%] max-w-md shadow-2xl">

        <h2 className="text-2xl font-bold text-royalGold mb-6 text-center">
          Start New Scheme
        </h2>

        <label className="block text-gray-400 mb-2">
          Enter Total Amount (Minimum ₹10,000)
        </label>

        <input
          type="number"
          min={10000}
          step={1}
          value={amount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 10000) {
              setAmount(value);
            } else {
              setAmount(value); // still allow typing, validation will block submit
            }
          }}
          className="w-full p-3 rounded bg-black border border-gray-700 text-white mb-2"
        />

        {amount > 0 && amount < 10000 && (
          <p className="text-red-500 text-sm">
            Minimum starting amount is ₹10,000
          </p>
        )}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-6 py-2 bg-royalGold text-black rounded-lg font-bold"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}
