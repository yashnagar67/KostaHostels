import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 

const HomePage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetched = useRef(false);

  let filteredHostels = hostels.filter((hostel) => {
    if (searchTerm === "") return true;
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = hostel.name.toLowerCase().includes(searchLower);
    const addressMatch = hostel.address.toLowerCase().includes(searchLower);
    return nameMatch || addressMatch;
  });
  const [activeFilter, setActiveFilter] = useState("All"); // Default is "All"
  const filtredbyTabs=(e)=>{
    filteredHostels=hostels.filter((hostel)=> hostel.facilities.includes("AC"))
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchData() {
      const loadingToast = toast.loading("Finding Available Hostels.......");
      
      try {
        const res = await axios.get("https://hostel-finder-backend-viny.onrender.com/api/hostels");
        const data = res.data;
        setHostels(data);
        toast.success("Hostels Fetched!", { id: loadingToast });
      } catch (err) {
        console.log("getting some error");
        toast.error("No Hostel Found", { id: loadingToast });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section with Search */}
      <div className="relative bg-blue-600 pb-32 pt-16 md:pt-32 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-liner-to-b from-blue-600/90 via-blue-600/80 to-blue-600/95 mix-blend-multiply z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center grayscale"
            style={{backgroundImage: 'url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?")'}}
          ></div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 px-4 md:px-10 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/10">
                <span className="text-2xl">🏢</span>
              </div>
              <h2 className="text-white text-xl font-bold leading-tight tracking-tight drop-shadow-md">
                Kota Hostel Finder
              </h2>
            </div>
            <Link 
              to="/add" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg"
            >
              <span className="text-lg">+</span>
              <span className="hidden sm:inline">Add Hostel</span>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto text-center z-10 mt-4">
          <h1 className="text-white text-3xl md:text-6xl font-black leading-tight tracking-tight mb-6 drop-shadow-lg">
            Find Your Home Away<br className="hidden md:block" /> From Home in Kota
          </h1>
          <p className="text-blue-50 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Verified hostels near your coaching institute with the best amenities, strictly curated for students.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 -mt-20 relative z-20 mb-12">
        <div className="max-w-6xl mx-auto bg-white p-3 md:p-4 rounded-3xl shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1 relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600/70">
              <span className="text-2xl">📍</span>
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-transparent focus:border-blue-600/30 rounded-2xl md:rounded-full h-14 pl-14 pr-4 text-base focus:ring-4 focus:ring-blue-600/10 placeholder:text-gray-400 font-medium transition-all"
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl md:rounded-full font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 transform hover:-translate-y-0.5 w-full md:w-auto">
            <span className="text-xl">🔍</span>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="grow max-w-7xl mx-auto w-full px-4 md:px-10 pb-20">
        {/* Filter Chips */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 pt-1">
          <button className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-600 text-white pl-5 pr-5 shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700">
            <span className="text-sm font-bold">All Hostels</span>
          </button>
          {/* <button className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:border-blue-600/50 hover:bg-gray-50 pl-4 pr-3 transition-all group shadow-sm">
            <span className="text-gray-700 text-sm font-medium group-hover:text-blue-600" id='facility-AC' onClick={filtredbyTabs}>AC Rooms</span>
            <span className="text-gray-400 group-hover:text-blue-600 text-lg">+</span>
          </button>
          <button className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:border-blue-600/50 hover:bg-gray-50 pl-4 pr-3 transition-all group shadow-sm">
            <label className="text-gray-700 text-sm font-medium group-hover:text-blue-600" id=''> Under </label>
            <select name="Range" id=""
            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none">

              <option value="8000">8000</option>
              <option value="10000">10000</option>
              <option value="12000">12000</option>
            </select>
            
          </button>
          <button className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:border-blue-600/50 hover:bg-gray-50 pl-4 pr-3 transition-all group shadow-sm">
            <span className="text-gray-700 text-sm font-medium group-hover:text-blue-600">Mess Included</span>
            <span className="text-gray-400 group-hover:text-blue-600 text-lg">+</span>
          </button> */}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Top Rated Hostels in Kota</h3>
            <p className="text-gray-500 text-sm">Handpicked accommodations for serious students</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 self-start md:self-auto shadow-sm">
            <span>Sort by:</span>
            <button className="font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors">
              Recommended <span className="text-lg">▼</span>
            </button>
          </div>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHostels && filteredHostels.map((hostel) => (
            <div key={hostel._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col h-full ">
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10 shadow-sm">
                  <span className="text-yellow-500 text-base">⭐</span>
                  <span className="text-sm font-bold text-gray-900">4.5</span>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <button className="bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full p-2 transition-colors border border-white/20">
                    <span className="text-xl">♥</span>
                  </button>
                </div>
                <img
                  src={hostel.imageUrl || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"}
                  alt={hostel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {hostel.name}
                  </h4>
                  <span className="text-blue-500 text-2xl mt-0.5" title="Verified Property">✓</span>
                </div>

                <div className="flex items-center gap-2 mb-5 text-gray-500 text-sm bg-gray-50 p-2 rounded-lg w-fit">
                  <span className="text-lg text-blue-600">🎓</span>
                  <span className="font-medium">{hostel.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase tracking-wide ${
                    hostel.type === 'Boys' 
                      ? 'bg-blue-50 text-blue-700' 
                      : hostel.type === 'Girls' 
                      ? 'bg-pink-50 text-pink-700' 
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {hostel.type}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">AC</span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">Mess</span>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Starting from</p>
                    <p className="text-blue-600 text-2xl font-bold">
                      ₹{hostel.price}
                      <span className="text-sm text-gray-400 font-normal ml-1">/mo</span>
                    </p>
                  </div>
                  <Link
                    to={`/hostel/${hostel._id}`}
                    className="text-sm font-bold text-blue-600 border-2 border-blue-600/10 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl transition-colors "
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHostels.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">No hostels found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredHostels.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 font-bold transition-all shadow-md group">
              Show More Hostels
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
            <div className="flex flex-col items-center gap-3 group">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">✓</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">100% Verified</h4>
                <p className="text-sm text-gray-500 font-medium">Every property physically visited</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">💬</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Student Support</h4>
                <p className="text-sm text-gray-500 font-medium">24/7 help for accommodation issues</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 group">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">🛡️</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Safety First</h4>
                <p className="text-sm text-gray-500 font-medium">Strict safety standards required</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;