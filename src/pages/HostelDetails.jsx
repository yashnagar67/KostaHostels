import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams grabs the ID from URL
import axios from 'axios';

const HostelDetails = () => {
  const { id } = useParams(); // Get the ID (e.g., 65a4b...)
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    // CHALLENGE: Fetch the single hostel data
    axios.get(`http://localhost:3000/api/hostels/${id}`)
    .then((res) => {setHostel(res.data)
        console.log(res)
    })
    
    // Write this logic yourself!
  }, [id]);

  if (!hostel) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-gray-500 hover:text-black mb-4 inline-block">← Back to Hostels</Link>
      
      {/* Cover Image */}
      <img 
        src={hostel.imageUrl || "https://via.placeholder.com/800x400"} 
        alt={hostel.name} 
        className="w-full h-80 object-cover rounded-xl shadow-lg mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Main Info */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{hostel.name}</h1>
          <p className="text-lg text-gray-600 mb-6">📍 {hostel.address}</p>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {/* Map through facilities here */}
            {hostel.facilities.map((fac, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {fac}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Contact Box */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit border border-gray-100">
          <p className="text-gray-500 mb-1">Rent starts at</p>
          <h2 className="text-3xl font-bold text-green-600 mb-6">₹{hostel.price}<span className="text-sm text-gray-400">/mo</span></h2>
          
          <div className="space-y-4">
             <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Hostel Type</p>
                <p className="font-bold text-gray-800">{hostel.type}</p>
             </div>
             
             <button 
                onClick={() => alert(`Call owner at: ${hostel.contactNumber}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
             >
                📞 Call Owner
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HostelDetails;