import React from "react";
import { useGetProductsQuery } from "../services/api";
import Loader from "../components/Loader";
import Collections from "../components/Collections";
import { Link } from "react-router-dom";

const CollectionsPage = () => {
  const {
    data: productsResponse,
    error,
    isLoading: loading,
  } = useGetProductsQuery();

  const products = productsResponse?.data || [];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Failed to fetch products</p>
      </div>
    );
  }

  return (
    <>
      <Collections />
      <div className="p-4 font-sans sm:p-6 md:p-8 max-w-7xl mx-auto">
        <p className="text-1xl md:text-2xl font-bold mb-6 text-center">
          Our Collections
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8">
          {products.map((product) => (
            <Link to="/accessories">
              <div
                key={product._id}
                className="bg-white  overflow-hidden text-center"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl  mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.description}</p>
                  <p className="text-gray-500 text-sm">$ {product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CollectionsPage;
