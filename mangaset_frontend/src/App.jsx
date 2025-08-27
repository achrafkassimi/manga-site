import './App.css'
import NavigationBar from "./home/components/NavigationBar";
import FeaturedManga from "./home/components/FeaturedManga";
import PopularToday from "./home/components/PopularToday";
import LatestUpdates from "./home/components/LatestUpdates";
import Recommendations from "./home/components/Recommendations";
import AdvancedSearch from "./home/components/AdvancedSearch";
import NewSeries from "./home/components/NewSeries";
import GenreCloud from "./home/components/GenreCloud";
import Footer from "./home/components/Footer";

function App() {
  const featured = [
    {
      id: "1",
      title: "Tears on a Withered Flower",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "65",
      genres: ["Manhwa", "Romance", "Mature", "Drama"]
    },
    {
      id: "2",
      title: "Solo Leveling: Ragnarok",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "51",
      genres: ["Action", "Adventure", "Fantasy", "Manhwa"]
    },
    {
      id: "3",
      title: "Tower of God",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "623",
      genres: ["Action", "Adventure", "Drama", "Fantasy", "Manhwa"]
    },
    {
      id: "4",
      title: "The Beginning After The End",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      chapter: "185",
      genres: ["Action", "Adventure", "Fantasy", "Magic", "Manhwa"]
    }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <NavigationBar />
      <div className="container-fluid px-3 px-lg-5">
        <FeaturedManga items={featured} />
        <hr />
        <PopularToday />
        <hr />
        <LatestUpdates />
        <hr />
        <Recommendations />
        <hr />
        <AdvancedSearch />
        <hr />
        <NewSeries />
        <hr />
        <GenreCloud />
        <hr />
      </div>
      <Footer />
    </div>
  );
}

export default App;