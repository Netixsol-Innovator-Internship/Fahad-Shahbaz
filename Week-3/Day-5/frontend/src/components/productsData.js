// hooks/useProducts.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://fahad-week3-day5-teabackend.vercel.app/api/products"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchData();
  }, []);

  return products;
};
