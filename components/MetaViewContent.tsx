"use client";

import { useEffect, useRef } from "react";
import { fireEvent } from "@/lib/meta";

interface MetaViewContentProps {
  title: string;
  category?: string;
  price: number;
  variantId?: string;
}

export default function MetaViewContent({ title, category, price, variantId }: MetaViewContentProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fireEvent("ViewContent", {
      content_name: title,
      content_category: category,
      content_ids: variantId ? [variantId] : undefined,
      value: price,
      currency: "COP",
    });
  }, [title, category, price, variantId]);

  return null;
}
