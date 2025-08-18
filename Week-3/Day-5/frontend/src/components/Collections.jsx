import { useProducts } from "./productsData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const Collections = () => {
     const products = useProducts();
     if (!products.length) return <p>Loading...</p>;
    return (
        <section className="w-[90%] mx-auto px-6 sm:px-10 md:px-14 lg:px-18 py-10">
            <h2 className="text-3xl font-bold text-center mb-10">Our Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                    <Link to={`/product/${idx}`} key={product.id}>
                        <ProductCard image={product.image} name={product.name} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Collections;