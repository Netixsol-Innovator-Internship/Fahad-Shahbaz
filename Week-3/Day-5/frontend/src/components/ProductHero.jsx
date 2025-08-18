import { producthero } from "../assets/";

const ProductHero = () => {
    return (
        <section id="products-hero">
            <img src={producthero} alt="Product hero image" className="w-full object-cover max-h-76" />
            <h5 className=" text-sm text-[#282828] pl-6 sm:pl-10 md:pl-14 lg:pl-18 xl:pl-20 py-6">
                {/* HOME/COLLECTIONS/CHAI */}
            </h5>
        </section>
    );
}

export default ProductHero;
