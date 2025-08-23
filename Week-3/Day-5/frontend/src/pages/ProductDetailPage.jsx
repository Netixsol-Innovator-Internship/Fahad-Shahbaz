import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import RecommendedProducts from "../components/RecommendedProducts";
import TeaDetails from "../components/TeaDetails";
import { useAuth } from "../contexts/AuthContext";
import { TbWorld } from "react-icons/tb";
import { MdOutlineRedeem, MdOutlineEco } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import { useGetProductsQuery, useAddToCartMutation } from "../api/apiSlice";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useGetProductsQuery();
  const [addToCartMutation] = useAddToCartMutation();

  const product = data?.data?.find((p) => p._id === id) || null;

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const getVariantImage = (weight) => {
    switch (weight) {
      case "50g":
        return variant50g;
      case "100g":
        return variant100g;
      case "170g":
        return variant170g;
      case "250g":
        return variant250g;
      case "1kg":
        return variant1kg;
      default:
        return variant50g;
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev === 1) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev === 10) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  };

  const handleAddToBag = async () => {
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("idOfUser");
    if (!token || !isAuthenticated) {
      alert("Please log in to add items to your bag.");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      await addToCartMutation({
        productId: product._id,
        userId,
        quantity,
        token,
      }).unwrap();
      setMsg("Item added to cart. See cart at the top right corner.");
      setError("");
    } catch (err) {
      setError(err?.data?.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-8">
        Failed to fetch product details
      </div>
    );
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {msg && (
          <div className="text-green-600 text-center bg-green-100 max-w-[300px] p-3 mx-auto text-sm font-montserrat">
            {msg}
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 cursor-pointer text-gray-600 hover:text-gray-800 flex items-center font-montserrat text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="rounded-sm overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>
          {/* Product Details */}
          <div className="lg:w-1/2">
            <div className="space-y-6">
              {/* Product Title */}
              <h1 className="text-4xl font-prosto leading-11 text-[#282828]">
                {product.name}
              </h1>
              {/* Description */}
              <p className="text-base leading-6 font-montserrat text-[#282828]">
                {product.description}
              </p>
              {/* Product Meta */}
              <div className="flex items-center gap-14 flex-wrap">
                {product.origin && (
                  <div className="flex items-center gap-2">
                    <TbWorld className="h-6 w-6 text-[#282828]" />
                    <p className="font-montserrat text-base leading-6 font-medium tracking-[0.15px] text-[#282828]">
                      Origin: {product.origin}
                    </p>
                  </div>
                )}
                {product.organic && (
                  <div className="flex items-center gap-2">
                    <MdOutlineRedeem className="h-6 w-6 text-[#282828]" />
                    <p className="font-montserrat text-base leading-6 font-medium tracking-[0.15px] text-[#282828]">
                      {product.organic ? "Organic" : "Non-organic"}
                    </p>
                  </div>
                )}
                {product.vegan && (
                  <div className="flex items-center gap-2">
                    <MdOutlineEco className="h-6 w-6 text-[#282828]" />
                    <p className="font-montserrat text-base leading-6 font-medium tracking-[0.15px] text-[#282828]">
                      Vegan
                    </p>
                  </div>
                )}
              </div>
              {/* Price */}
              <p className="text-4xl font-prosto leading-11 text-[#282828]">
                €{selectedVariant?.price || product.price}
              </p>
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <p className="text-base font-medium text-[#282828] leading-6 tracking-[0.15px] font-montserrat">
                    Variants
                  </p>
                  <div className="flex py-[10px] gap-3.5 text-[#282828] flex-wrap">
                    {product.variants.map((variant, index) => {
                      const isActive = selectedVariant?._id === variant._id;
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedVariant(variant)}
                          className={`w-[84px] cursor-pointer py-[10px] px-1 flex flex-col items-center rounded-sm transition ${
                            isActive
                              ? "border-2 border-[#282828] bg-gray-100"
                              : "border border-gray-300"
                          }`}
                        >
                          <img
                            src={getVariantImage(variant.weight)}
                            alt={`${variant.weight} bag`}
                            className="w-[42px] h-[53px] object-contain"
                          />
                          <span className="text-sm font-montserrat leading-5 tracking-[0.25px]">
                            {variant.weight} bag
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Quantity and Add to Bag */}
              <div className="flex items-center gap-6">
                <button
                  onClick={handleAddToBag}
                  className="flex items-center gap-2 bg-[#282828] text-white justify-center py-3 px-12 hover:bg-gray-800 transition-colors font-medium h-14 cursor-pointer"
                >
                  <IoBagHandleOutline /> ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeaDetails />
      <RecommendedProducts />
    </div>
  );
};

export default ProductDetailPage;
