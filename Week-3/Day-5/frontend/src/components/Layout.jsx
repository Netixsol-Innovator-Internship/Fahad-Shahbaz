import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="container mx-w-[1660px] mx-auto">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
