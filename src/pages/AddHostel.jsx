import { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; 
import { Link, useNavigate } from 'react-router-dom';


const AddHostel = () => {
  const navigate = useNavigate();

//   useEffect(() => {
//     const pin = prompt("Enter Admin PIN to add a hostel:");
//     if (pin !== "1234") { // <--- Set your secret PIN here
//       toast.error("Access Denied! Admins only.");
//       navigate('/'); // Kick them out instantly
//     }
//   }, []);
  // Add this near your other useState
const [coverImage, setCoverImage] = useState(""); // Stores the Base64 string for the database
const [selectF,setSelectF]=useState([])

  // ---------------------------------------------------------
  // CHALLENGE 1: Initialize your State here
  // Hint: It needs fields: name, address, price, contactNumber, type, facilities
  // ---------------------------------------------------------
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    price: '',
    ownerName: '',
    contactNumber: '',
    type: 'Boys', // Default
    facilities:'',
    adminpassword:'',
    
     // We will handle this as a comma-separated string for simplicity
  });;
  const handelSelectF=(e)=>{
  console.log("Dekhona guys",selectF)
  setSelectF((prev)=>
  prev.includes(e.target.name)?prev.filter((item=>item!==e.target.name)):[...prev,e.target.name])
}
  const [loading, setLoading] = useState(false); // For the "AI Thinking" spinner
  const [imagePreview, setImagePreview] = useState(null)



  // ---------------------------------------------------------
  // CHALLENGE 2: Write the Handle Change Function
  // Hint: standard React form handling
  // ---------------------------------------------------------
  const handleChange = (e) => {
    // console.log("foucs on me",e.target.value)
    setFormData({...formData,[e.target.name]:e.target.value})
  };

useEffect(() => {
  console.log("Form State Updated:", formData);
}, [formData]);
  // ---------------------------------------------------------
  // CHALLENGE 3: Write the Image Upload & AI Logic
  // Hint: Use FormData(), append the file, and axios.post to '/api/ai/extract'
  // ---------------------------------------------------------
  const handleImageUpload = async (e) => {
    const file=e.target.files[0]
    if(!file) return;
         setImagePreview(URL.createObjectURL(file))
         setLoading(true)
         toast.loading("AI is reading the pamphlet...")
         const data=new FormData()
         data.append("imgUrl",file)

         try{
            const res=await axios.post("https://hostel-finder-backend-viny.onrender.com/api/ai/extract",data,{
                headers: { 'Content-Type': 'multipart/form-data' },
                
            })
            const aiData=res.data
            console.log("Cemara Foucs kro",aiData)
            toast.dismiss()
            toast.success("Details Extracted")
            console.log("Dekhona",aiData.name)
            setFormData(prev=>({
                ...prev,
                name: aiData.name || prev.name,
        address: aiData.address || prev.address,
        price: aiData.price || prev.price,
        contactNumber: aiData.contactNumber || prev.contactNumber,
        type: aiData.type || 'Boys',
        facilities: aiData.facilities ? aiData.facilities : prev.facilities
      
            }))
            setImagePreview(null)
        // setFormData({...formData,["name"]:aiData.name})
            
         }catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("AI failed to read. Please type manually.");
    } finally {
      setLoading(false);
    }
  

  };
  const handleCoverImageUpload=(e)=>{
    const file=e.target.files[0]
    if(!file)return
    const render=new FileReader()
    render.readAsDataURL(file)
    render.onloadend=()=>{
        setCoverImage(render.result)
        toast.success("cover Image selected")
    }
  }


  // ---------------------------------------------------------
  // CHALLENGE 4: Write the Submit Logic
  // Hint: axios.post to '/api/hostels'
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log("Button is clicked",selectF)
    try {
        setLoading(true)
      // normalize facilities (AI may return array or string)
      
      const facilitiesString = Array.isArray(selectF)
        ? selectF.join(',')
        : (selectF || '');
      const finalData = {
        ...formData,
        facilities: facilitiesString.split(',').map(f => f.trim()).filter(Boolean),
        imageUrl:coverImage
      };
      console.log("post request has beenb set,watting for response")

     let res= await axios.post('https://hostel-finder-backend-viny.onrender.com/api/hostels', finalData);
     console.log(res)
      toast.success("Hostel Added Successfully!");
      navigate('/'); // Go back home
    } catch (error) {
     
      toast.error("Failed to save hostel.",error.response);
    }finally{
        setLoading(false)
    }
  };

  return (
    
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className='flex justify-between mb-6'>

      
      <h2 className="text-2xl font-bold  text-gray-800">Add New Hostel</h2>
      <Link
                    to={`/`}
                    className="text-sm font-bold text-blue-600 border-2 border-blue-600/10 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl transition-colors "
                    >
                    Home
                    
                  </Link>
                    </div>
      

      {/* Image Uploader UI */}
     <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-blue-600/30 bg-blue-50 p-8 mb-10 group transition-all hover:border-blue-600/60">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="text-8xl text-blue-600">✨</span>
              </div>
              <div className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="w-10 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-3xl">🤖</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-gray-900 text-xl font-bold">✨ AI Magic</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Upload a photo of your pamphlet, and our AI will automatically fill in the details below for you.
                  </p>
                </div>
                <label className="mt-2 flex items-center justify-center rounded-full h-12 px-8 bg-blue-600 text-white text-sm font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                  <span className="mr-2 text-lg">📤</span>
                  Upload Pamphlet
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {loading && (
                  <p className="text-blue-600 mt-2 text-sm animate-pulse font-semibold">
                    ✨ AI is extracting details...
                  </p>
                )}
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="mt-4 h-48 w-full object-cover rounded-md border-2 border-blue-200"
                  />
                )}
              </div>
            </div>

    

      {/* The Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hostel Name</label>
          <input 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Shiv Residency"
            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            required
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input 
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Landmark City, Kunhari"
            className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            required
          />
        </div>

        {/* Price & Phone Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹/month)</label>
            <input 
              name="price"
              value={formData.price}
              type="number"
              onChange={handleChange}
              placeholder="12000"
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input 
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="eg. John Doe"
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input 
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="9928xxxxxx"
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>
         
        </div>
        </div>

        {/* Type & Facilities */}
        
        {/* Facilities */}
<div className="flex flex-col gap-6 pt-4">
  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
    <span className="material-symbols-outlined text-gray-400">wifi</span>
    <h3 className="text-[#0e121b]  text-xl  font-bold">Facilities</h3>
  </div>
  
  <div className="flex flex-col gap-4">
    <p className="text-sm text-[#4d6599] dark:text-gray-400 px-2">
      Select the amenities available at your hostel.
    </p>
    
    <div className="flex flex-wrap gap-3">
      {/* WiFi */}
      <label className="cursor-pointer group">
        <input 
          type="checkbox" 
          name='WIFI'
          // checked={selectF.includes(this.name)}
          className="peer sr-only"
          onChange={handelSelectF}
        />
        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-light dark:bg-background-dark border border-[#d0d7e7] dark:border-gray-700 text-gray-600 dark:text-gray-300 peer-checked:bg-primary/10 peer-checked:border-blue-500 peer-checked:text-blue-500 transition-all">
          <span className="material-symbols-outlined text-[20px]">wifi</span>
          <span className="font-medium">High-Speed WiFi</span>
        </div>
      </label>

      {/* AC */}
      <label className="cursor-pointer group">
        <input 
          type="checkbox" 
          className="peer sr-only"
           name='AC'
          onChange={handelSelectF}
        />
        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-light dark:bg-background-dark border border-[#d0d7e7] dark:border-gray-700 text-gray-600 dark:text-gray-300 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
          <span className="material-symbols-outlined text-[20px]">ac_unit</span>
          <span className="font-medium">Air Conditioner</span>
        </div>
      </label>

      {/* Mess */}
      <label className="cursor-pointer group">
        <input 
          type="checkbox" 
          className="peer sr-only"
           name='MESS'
          onChange={handelSelectF}
        />
        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-light dark:bg-background-dark border border-[#d0d7e7] dark:border-gray-700 text-gray-600 dark:text-gray-300 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
          <span className="material-symbols-outlined text-[20px]">restaurant</span>
          <span className="font-medium">Healthy Mess</span>
        </div>
      </label>

      {/* Laundry */}
      <label className="cursor-pointer group">
        <input 
          type="checkbox" 
          className="peer sr-only"
           name='Laundry'
          onChange={handelSelectF}
        />
        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-light dark:bg-background-dark border border-[#d0d7e7] dark:border-gray-700 text-gray-600 dark:text-gray-300 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
          <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
          <span className="font-medium">Laundry</span>
        </div>
      </label>

      {/* RO Water */}
      <label className="cursor-pointer group">
        <input 
          type="checkbox" 
          className="peer sr-only"
           name='RO Water'
          onChange={handelSelectF}
        />
        <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-background-light dark:bg-background-dark border border-[#d0d7e7] dark:border-gray-700 text-gray-600 dark:text-gray-300 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
          <span className="material-symbols-outlined text-[20px]">water_drop</span>
          <span className="font-medium">RO Water</span>
        </div>
      </label>
     
    </div>
  </div>
</div>

              <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <span className="text-gray-400 text-xl">🖼️</span>
                  <h3 className="text-gray-900 text-xl font-bold">Cover Photo</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 px-2">
                    High quality images attract 3x more students.
                  </p>
                  
                  {coverImage ? (
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Cover Preview" 
                        className=" h-64 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // setCoverPreview(null);
                          setCoverImage("");
                          
                          
                        }}
                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="text-4xl text-gray-400 mb-3 group-hover:text-blue-600 transition-colors">
                          📷
                        </span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
        
        <div className="col-span-2">
  <label className="block text-sm font-bold text-red-600 mb-1">Admin Security Code</label>
  <input 
    type="password" 
    placeholder="Enter Secret Code to Publish"
    value={formData.adminpassword}
    name='adminpassword'
    onChange={handleChange}
    className="w-full p-3 border border-red-200 rounded-lg focus:ring-red-500"
    required
  />
</div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Processing...' : 'Save Hostel'}
        </button>


      </form>
    </div>
  );
};

export default AddHostel;