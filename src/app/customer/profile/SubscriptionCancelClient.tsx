"use client";

import { useState, useTransition } from "react";
import { cancelSubscription } from "./actions";

const REASONS = [
  "Too expensive",
  "Don't need it anymore",
  "Switched products",
  "Temporarily pausing",
  "Delivery issues",
  "Other",
];

export default function SubscriptionCancelClient({ subscriptionId }: { subscriptionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [custom, setCustom] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      try {
        await cancelSubscription(subscriptionId, reason, custom);
        setIsOpen(false);
        setCustom("");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Cancel failed");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-2 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-600"
      >
        Cancel Subscription
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] bg-gray-900/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-8 border-gray-900 p-8 space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">Cancel Subscription</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Please let us know why you&apos;re cancelling.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border-4 border-gray-900 px-3 py-3 font-bold bg-white"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {reason === "Other" ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900">Details</label>
                <textarea
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  rows={3}
                  className="w-full border-4 border-gray-900 px-3 py-3 font-bold"
                />
              </div>
            ) : null}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-gray-100 font-black uppercase tracking-widest text-xs hover:bg-gray-200"
              >
                Keep Subscription
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={isPending}
                className="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 disabled:opacity-50"
              >
                {isPending ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
