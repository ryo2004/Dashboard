import Header from './components/Header';
import WeatherSection from './components/WeatherSection';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-900">
      <Header />
      <main className="flex-grow p-4 space-y-8">
        <WeatherSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;