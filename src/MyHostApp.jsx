  import React, { useState } from 'react';
import { MapPin, Home, Users, Star, Plus, Menu, X, Sparkles, Search, Globe, Heart, Calendar, User } from 'lucide-react';
import { calculateBookingFees, calculateNights, FEE_CONFIG } from './utils/paymentUtils';

const MyHostApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Lakeside Villa",
      location: "Kisumu, Kenya",
      description: "Beautiful 4-bedroom villa with stunning lake view. Perfect for families and groups.",
      rooms: 4,
      dailyRate: 5000,
      amenities: ["WiFi", "Pool", "Garden", "Parking", "Kitchen", "Washing Machine"],
      host: "Jane Kimani",
      caretaker: "John Ochieng",
      rating: 4.8,
      reviews: 12,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      title: "Mountain Retreat",
      location: "Nanyuki, Kenya",
      description: "Cozy 3-bedroom house near Mt. Kenya with fireplace and garden views.",
      rooms: 3,
      dailyRate: 4000,
      amenities: ["WiFi", "Fireplace", "Garden", "Kitchen", "Parking"],
      host: "Peter Mwangi",
      caretaker: "Mary Wanjiku",
      rating: 4.9,
      reviews: 8,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 3,
      title: "Countryside Cottage",
      location: "Nakuru, Kenya",
      description: "Peaceful 2-bedroom cottage with farm views. Ideal for couples and small families.",
      rooms: 2,
      dailyRate: 3000,
      amenities: ["WiFi", "Garden", "Kitchen", "Parking"],
      host: "Sarah Njeri",
      caretaker: "David Kamau",
      rating: 4.7,
      reviews: 15,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop"
      ]
    }
  ]);

  const [bookingForm, setBookingForm] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    customerEmail: '',
    customerPhone: '',
    customerFirstName: '',
    customerLastName: ''
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    description: '',
    rooms: 1,
    dailyRate: 0,
    amenities: '',
    host: '',
    caretaker: ''
  });

  const handleAddProperty = () => {
    if (!newProperty.title || !newProperty.location || !newProperty.description || !newProperty.host || !newProperty.caretaker) {
      alert('Please fill in all required fields');
      return;
    }
    
    const property = {
      id: properties.length + 1,
      title: newProperty.title,
      location: newProperty.location,
      description: newProperty.description,
      rooms: newProperty.rooms,
      dailyRate: newProperty.dailyRate,
      amenities: newProperty.amenities.split(',').map(a => a.trim()),
      host: newProperty.host,
      caretaker: newProperty.caretaker,
      rating: 0,
      reviews: 0,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500"
    };
    setProperties([...properties, property]);
    setNewProperty({
      title: '',
      location: '',
      description: '',
      rooms: 1,
      dailyRate: 0,
      amenities: '',
      host: '',
      caretaker: ''
    });
    setCurrentPage('properties');
  };

  const filteredProperties = properties.filter(p => 
    !searchQuery || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (!bookingForm.location || p.location.toLowerCase().includes(bookingForm.location.toLowerCase()))
  );

  // Airbnb-style Header
  const Header = () => (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <div className="text-2xl font-bold">
              <span className="text-rose-500">My</span>
              <span className="text-gray-900">Host</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          {currentPage === 'home' && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="flex items-center w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">Location</div>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-none outline-none text-sm text-gray-600"
                  />
                </div>
                <div className="border-l border-gray-300 mx-4 h-8"></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">Check in</div>
                  <input
                    type="date"
                    className="w-full border-none outline-none text-sm text-gray-600"
                  />
                </div>
                <div className="border-l border-gray-300 mx-4 h-8"></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">Check out</div>
                  <input
                    type="date"
                    className="w-full border-none outline-none text-sm text-gray-600"
                  />
                </div>
                <div className="border-l border-gray-300 mx-4 h-8"></div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">Guests</div>
                  <input
                    type="number"
                    min="1"
                    className="w-full border-none outline-none text-sm text-gray-600"
                  />
                </div>
                <button className="ml-4 bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('host')}
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              Become a Host
            </button>
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition">
              <Globe className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow">
              <Menu className="w-5 h-5" />
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Home Page - Airbnb Style
  const HomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] rounded-2xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a0d9c6e7f9a?w=1920&h=1080&fit=crop"
          alt="Countryside"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="absolute bottom-20 left-10 right-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Not sure where to go? Perfect.
            </h1>
            <button 
              onClick={() => setCurrentPage('properties')}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-shadow"
            >
              I'm flexible
            </button>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Explore nearby</h2>
          <button className="text-sm font-semibold text-gray-900 underline">Show all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <div
              key={property.id}
              className="cursor-pointer group"
              onClick={() => {
                setSelectedProperty(property);
                setCurrentPage('details');
              }}
            >
              {/* Image */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-3">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              {/* Details */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-black" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{property.location}</p>
                <p className="text-sm text-gray-500">{property.description.split('.')[0]}</p>
                <div className="flex items-center space-x-1 pt-1">
                  <span className="font-semibold text-gray-900">KSh {property.dailyRate}</span>
                  <span className="text-gray-600">night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="relative bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full opacity-50"></div>
          <Home className="w-12 h-12 text-red-500 mb-4 relative z-10" />
          <h3 className="text-xl font-bold mb-2">Short & Long Stay</h3>
          <p className="text-gray-600">Budget accommodation for countryside travelers with flexible duration</p>
          <div className="mt-4 flex space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          </div>
        </div>
        
        <div className="relative bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full opacity-50"></div>
          <Users className="w-12 h-12 text-orange-500 mb-4 relative z-10" />
          <h3 className="text-xl font-bold mb-2">Student Longstay</h3>
          <p className="text-gray-600">Monthly or semester-based accommodation closer to colleges</p>
          <div className="mt-4 flex space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
          </div>
        </div>
        
        <div className="relative bg-white p-6 rounded-xl shadow-md border-t-4 border-red-400 hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full opacity-50"></div>
          <Star className="w-12 h-12 text-red-400 mb-4 relative z-10" />
          <h3 className="text-xl font-bold mb-2">WeHost Exchange</h3>
          <p className="text-gray-600">Reciprocal hosting arrangements between families</p>
          <div className="mt-4 flex space-x-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl border border-red-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Why Choose MyHost?</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-red-600">150+</p>
            <p className="text-gray-600">Properties</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-orange-600">5,000+</p>
            <p className="text-gray-600">Happy Guests</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-red-500">20+</p>
            <p className="text-gray-600">Locations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <p className="text-3xl font-bold text-orange-600">4.8</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#D15449"/>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-3 text-red-600 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              For Hosts
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">1</span>
                <span>Post your property with details</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">2</span>
                <span>Set availability and pricing</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">3</span>
                <span>Manage bookings and guests</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">4</span>
                <span>Earn from unused properties</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#FB923C"/>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-3 text-orange-600 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              For Travelers
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">1</span>
                <span>Browse countryside properties</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">2</span>
                <span>Book your preferred dates</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">3</span>
                <span>Enjoy homely accommodation</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">4</span>
                <span>Leave reviews and ratings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const PropertiesPage = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Home className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Available Properties</h1>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
            <input
              type="text"
              placeholder="e.g. Kisumu"
              value={bookingForm.location}
              onChange={(e) => setBookingForm({...bookingForm, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Check In</label>
            <input
              type="date"
              value={bookingForm.checkIn}
              onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Check Out</label>
            <input
              type="date"
              value={bookingForm.checkOut}
              onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Guests</label>
            <input
              type="number"
              min="1"
              value={bookingForm.guests}
              onChange={(e) => setBookingForm(b => ({ ...b, guests: parseInt(e.target.value, 10) || 1 }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-red-300" onClick={() => {
            setSelectedProperty(property);
            setCurrentPage('details');
          }}>
            <div className="relative">
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" stroke="none" />
              </div>
              <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {property.rooms} Rooms
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <div className="flex items-center text-yellow-500">
                  <span className="ml-1 text-sm font-semibold">{property.rating}</span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                <span className="text-sm">{property.location}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{property.description}</p>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-500">{property.reviews} reviews</span>
                <span className="font-bold text-red-600 text-lg">KSh {property.dailyRate}/day</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Property Details - Airbnb Style
  const PropertyDetails = () => {
    if (!selectedProperty) return null;
    
    const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
    const fees = calculateBookingFees(selectedProperty.dailyRate, nights || 1);
    const minDate = new Date().toISOString().split('T')[0];
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => setCurrentPage('properties')}
          className="mb-6 text-gray-600 hover:text-gray-900 font-medium"
        >
          ← Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">{selectedProperty.title}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star className="w-5 h-5 fill-black" />
                <span className="font-medium">{selectedProperty.rating}</span>
                <span>·</span>
                <span className="underline">{selectedProperty.reviews} reviews</span>
                <span>·</span>
                <MapPin className="w-4 h-4" />
                <span className="underline">{selectedProperty.location}</span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              <div className="col-span-2 row-span-2 h-96">
                <img
                  src={selectedProperty.images?.[0] || selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {selectedProperty.images?.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-48">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                    <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Host Info */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Meet your host</h3>
                  <div className="space-y-2 mb-4">
                    <p className="font-medium">{selectedProperty.host}</p>
                    <p className="text-sm text-gray-600">Host · {selectedProperty.reviews} reviews</p>
                  </div>
                  <button className="w-full border border-gray-900 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 transition">
                    Contact host
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-semibold">KSh {selectedProperty.dailyRate}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-700">CHECK-IN</label>
                  <input
                    type="date"
                    min={minDate}
                    value={bookingDetails.checkIn}
                    onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                    className="w-full border-none outline-none text-sm mt-1"
                  />
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-700">CHECKOUT</label>
                  <input
                    type="date"
                    min={bookingDetails.checkIn || minDate}
                    value={bookingDetails.checkOut}
                    onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                    className="w-full border-none outline-none text-sm mt-1"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="border border-gray-300 rounded-lg p-3 mb-4">
                <label className="text-xs font-semibold text-gray-700">GUESTS</label>
                <input
                  type="number"
                  min="1"
                  value={bookingDetails.guests}
                  onChange={(e) => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value) || 1})}
                  className="w-full border-none outline-none text-sm mt-1"
                />
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="underline">KSh {selectedProperty.dailyRate} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>KSh {fees.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="underline">Service fee</span>
                    <span>KSh {fees.guestFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>KSh {fees.total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <button
                onClick={async () => {
                  if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
                    alert('Please select check-in and check-out dates');
                    return;
                  }
                  if (nights <= 0) {
                    alert('Check-out date must be after check-in date');
                    return;
                  }
                  
                  if (!bookingDetails.customerEmail) {
                    const email = prompt('Please enter your email address:');
                    if (!email) return;
                    setBookingDetails({...bookingDetails, customerEmail: email});
                  }
                  
                  setIsProcessingPayment(true);
                  
                  try {
                    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    
                    const response = await fetch(`${API_BASE_URL}/api/pesapal/initiate`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        propertyId: selectedProperty.id,
                        checkIn: bookingDetails.checkIn,
                        checkOut: bookingDetails.checkOut,
                        guests: bookingDetails.guests,
                        baseAmount: selectedProperty.dailyRate,
                        nights: nights,
                        customerEmail: bookingDetails.customerEmail || 'guest@myhost.com',
                        customerPhone: bookingDetails.customerPhone || null,
                        customerFirstName: bookingDetails.customerFirstName || 'Guest',
                        customerLastName: bookingDetails.customerLastName || 'User'
                      })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success && data.redirectUrl) {
                      window.location.href = data.redirectUrl;
                    } else {
                      throw new Error(data.error || 'Failed to initiate payment');
                    }
                  } catch (error) {
                    console.error('Payment error:', error);
                    alert(`Payment error: ${error.message}\n\nMake sure the backend server is running.`);
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? 'Processing...' : 'Reserve'}
              </button>

              <p className="text-xs text-center text-gray-600 mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HostDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Host Dashboard</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Title</label>
              <input
                type="text"
                value={newProperty.title}
                onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Lakeside Villa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={newProperty.location}
                onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Kisumu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={newProperty.description}
              onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows="3"
              placeholder="Describe your property..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Rooms</label>
              <input
                type="number"
                min="1"
                value={newProperty.rooms}
                onChange={(e) => setNewProperty({...newProperty, rooms: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Daily Rate (KSh)</label>
              <input
                type="number"
                min="0"
                value={newProperty.dailyRate}
                onChange={(e) => setNewProperty({...newProperty, dailyRate: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
            <input
              type="text"
              value={newProperty.amenities}
              onChange={(e) => setNewProperty({...newProperty, amenities: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g. WiFi, Pool, Garden, Parking"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Host Name</label>
              <input
                type="text"
                value={newProperty.host}
                onChange={(e) => setNewProperty({...newProperty, host: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Caretaker Name</label>
              <input
                type="text"
                value={newProperty.caretaker}
                onChange={(e) => setNewProperty({...newProperty, caretaker: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <button onClick={handleAddProperty} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition shadow-md">
            <Plus className="inline w-5 h-5 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Properties ({properties.length})</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {properties.map(property => (
            <div key={property.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="font-bold">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-red-600 font-semibold mt-2">KSh {property.dailyRate}/day</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'properties' && <HomePage />}
        {currentPage === 'details' && <PropertyDetails />}
        {currentPage === 'host' && <HostDashboard />}
      </main>
    </div>
  );
};

export default MyHostApp;



