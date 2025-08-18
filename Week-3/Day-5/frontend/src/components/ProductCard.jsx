const ProductCard = ({ image, name }) => {
    return (
        <div className="flex flex-col items-center overflow-hidden mx-auto">
            <div className="w-full h-full">
                <img
                    src={image}
                    alt={name}
                    className="object-cover lg:w-90 lg:h-90 md:w-80 md:h-80 w-70 h-70"
                />
            </div>
            <p className="py-2 md:py-4 lg:py-6 text-center text-base font-medium">{name}</p>
        </div>
    );
};

export default ProductCard;
