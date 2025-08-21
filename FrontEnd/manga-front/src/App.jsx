import './App.css'
import NavigationBar from "../src/home/components/NavigationBar";
import FeaturedManga from "../src/home/components/FeaturedManga";
// import PopularToday from "../src/home/components/PopularToday";
// import LatestUpdates from "../src/home/components/LatestUpdates";
// import Recommendations from "../src/home/components/Recommendations";
// import AdvancedSearch from "../src/home/components/AdvancedSearch";
// import NewSeries from "../src/home/components/NewSeries";
// import GenreCloud from "../src/home/components/GenreCloud";
// import Footer from "../src/home/components/Footer";

function App() {
  // const navLinks = ["Home", "Comics", "Romance", "Action", "Bookmarks"];

  return (
    <div className="bg-light">
      <NavigationBar />
      <div className="container mt-4">
        <FeaturedManga />
        {/* <PopularToday />
        <LatestUpdates />
        <Recommendations />
        <AdvancedSearch />
        <NewSeries />
        <GenreCloud /> */}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
