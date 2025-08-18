import AboutContainer from "../components/AboutItem";
import SingleItem from "../components/SingleItem";
import Recommended from "../components/Recommended";

export default function SingleProductPage() {
  return (
    <main className="container mx-auto">
      <SingleItem />
      <AboutContainer />
      <Recommended />
    </main>
  );
}
