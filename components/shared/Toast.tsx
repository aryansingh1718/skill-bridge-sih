"use client";

import { useEffect, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  function showToast(msg: string) {
    setMessage(msg);
    setShow(true);
    setTimeout(() => setShow(false), 2200);
  }

  const ToastElement = (
    <div
      className={`fixed bottom-7 left-1/2 -translate-x-1/2 bg-mint text-bg font-bold text-sm px-6 py-3 rounded-full z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );

  return { showToast, ToastElement };
}