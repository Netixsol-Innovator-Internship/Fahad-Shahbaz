import { Location, mail, call } from "../assets/index";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F5F5] text-black py-4 px-4 sm:px-8 md:px-20  ">
      <div className="flex flex-col sm:flex-col-2 md:flex-row ">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row mb-6 md:mb-0 ">
          {/* Block 1 */}
          <div className="w-full sm:w-1/2 mb-6 sm:mb-0 ">
            <h3 className="text-lg font-medium mb-4 uppercase">Collections</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:underline">
                  Black teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Green teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  White teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Herbal teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Matcha
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Chai
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Oolong
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Rooibos
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Teaware
                </a>
              </li>
            </ul>
          </div>
          {/* Block 2 */}
          <div className="w-full sm:w-1/2">
            <h3 className="text-lg font-medium mb-4 uppercase">LEARN</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:underline">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About our teas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Tea academy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col sm:flex-row">
          {/* Block 3 */}
          <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
            <h3 className="text-lg font-medium mb-4 uppercase">
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:underline">
                  Ordering and payment
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy and policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          {/* Block 4 */}
          <div className="w-full sm:w-1/2">
            <h3 className="text-lg font-medium mb-4 uppercase">CONTACT US</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="flex items-start hover:underline">
                  <img
                    src={Location}
                    alt="Location logo"
                    className="w-5 h-5 mr-2"
                  />
                  <span>
                    3 Falahi, Falahi St, Pasdaran Ave,
                    <br />
                    Shiraz, Fars Province,
                    <br />
                    Iran
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <img
                    src={mail}
                    alt="Location logo"
                    className="w-5 h-5 mr-2"
                  />

                  <span>Email: amoopur@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <img
                    src={call}
                    alt="Location logo"
                    className="w-5 h-5 mr-2"
                  />

                  <span>Tel: +98 9173038406</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
