import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import CollectionsPage from "./pages/CollectionsPage";
// import ExpandMenuPage from "./pages/ExpandMenuPage";
import ProductPage from "./pages/ProductPage";
import MyBagPage from "./pages/MyBagPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          {/* <Route path="/collections/expanded" element={<ExpandMenuPage />} /> */}
          <Route path="/product" element={<ProductPage />} />
          <Route path="/mybag" element={<MyBagPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
