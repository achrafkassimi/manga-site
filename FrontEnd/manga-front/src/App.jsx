import './App.css'
import NavigationBar from "../src/home/components/NavigationBar";
import FeaturedManga from "../src/home/components/FeaturedManga";
import PopularToday from "../src/home/components/PopularToday";
import LatestUpdates from "../src/home/components/LatestUpdates";
import Recommendations from "../src/home/components/Recommendations";
import AdvancedSearch from "../src/home/components/AdvancedSearch";
import NewSeries from "../src/home/components/NewSeries";
import GenreCloud from "../src/home/components/GenreCloud";
import Footer from "../src/home/components/Footer";

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
        <PopularToday />
        <LatestUpdates />
        <Recommendations />
        <AdvancedSearch />
        <NewSeries />
        <GenreCloud />
      </div>
      <Footer />
    </div>
  );
}

export default App;