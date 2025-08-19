"use client";

import { useEffect } from "react";
import Marketplace from "@/components/marketplace/products";
import { useMarketplaceStore } from "@/store/product";

export default function MarketplacePage() {
  const { fetchProducts } = useMarketplaceStore();
  
  useEffect(() => {
    // Load mock products when the page loads
    fetchProducts();
  }, [fetchProducts]);
  
  return (
    <div className="">
      <Marketplace/>
    </div>
  );
}
