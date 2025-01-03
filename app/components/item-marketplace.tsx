'use client'
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

interface Item {
  name: string;
  location: string;
  street_price: string;
  shop_price: string;
  members: string;
  shop: string;
  high_alchemy: string;
  low_alchemy: string;
  logo_url: string;
}

const ItemMarketplace = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState({
    tradeable: false,
    membersOnly: false
  });
  
  // Initialize posts state with useEffect to avoid hydration mismatch
  const [posts, setPosts] = useState<{
    id: number;
    type: 'buy' | 'sell';
    item: Item;
    quantity: number;
    price: number;
    message: string;
    world: string;
    ingameName: string;
    timestamp: string;
  }[]>([]);
  
  useEffect(() => {
    // Set initial posts after component mounts
    setPosts([{
      id: 1,
      type: 'buy',
      item: {
        name: 'Rune Scimitar',
        location: 'Player Smiths',
        street_price: '0',
        shop_price: '25000',
        members: 'false',
        shop: 'Various Shops',
        high_alchemy: '12000',
        low_alchemy: '8000',
        logo_url: ''
      },
      quantity: 1,
      price: 30000,
      message: 'Looking for a good deal!',
      world: '1',
      ingameName: 'Player123',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const [newPost, setNewPost] = useState({
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    message: '',
    world: '1',
    ingameName: ''
  });

  // Load items data from local JSON file
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://2004items-production.up.railway.app/api/items');
        const data = await response.json();
        setItems(data.items || []);
      } catch (error) {
        console.error('Error loading items:', error);
        setItems([]);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on search term and filters
  const filteredItems = items.filter((item: Item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isTradeableMatch = !filters.tradeable || 
      (parseInt(item.street_price) > 0 || parseInt(item.shop_price) > 0);
    const isMembersMatch = !filters.membersOnly || item.members === "true";
    return matchesSearch && isTradeableMatch && isMembersMatch;
  });

  // Handle creating a new post
  const handlePostSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    if (!newPost.quantity || !newPost.price || !newPost.ingameName) {
      alert('Please fill in quantity, price, and in-game name');
      return;
    }

    const post = {
      id: Date.now(),
      item: selectedItem,
      type: newPost.type as 'buy' | 'sell',
      quantity: parseInt(newPost.quantity),
      price: parseInt(newPost.price),
      message: newPost.message,
      world: newPost.world,
      ingameName: newPost.ingameName,
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts => [post, ...prevPosts]);
    
    setNewPost({
      type: 'buy',
      quantity: '',
      price: '',
      message: '',
      world: '1',
      ingameName: ''
    });
  };

  // Add a filter handler to use setFilters
  const handleFilterChange = (filterType: 'tradeable' | 'membersOnly') => {
    setFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-background">
      {/* Main Content */}
      <div className="p-6 pb-32">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white font-bold text-2xl">Item Marketplace</CardTitle>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Recent Posts
              {posts.length > 0 && (
                <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {posts.length}
                </span>
              )}
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/4 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.tradeable}
                      onChange={() => handleFilterChange('tradeable')}
                      className="rounded"
                    />
                    <span>Tradeable Only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.membersOnly}
                      onChange={() => handleFilterChange('membersOnly')}
                      className="rounded"
                    />
                    <span>Members Only</span>
                  </label>
                </div>
              </div>

              {searchTerm && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {filteredItems.map((item: Item) => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedItem(item)}
                      className={`border rounded-lg transition-all duration-200 ${
                        selectedItem?.name === item.name
                          ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
                          : 'hover:bg-background/50 cursor-pointer'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Item Image */}
                          <div className="relative w-12 h-12 flex-shrink-0">
                            {item.logo_url && item.logo_url.includes('githubusercontent.com') ? (
                              <Image
                                src={item.logo_url}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="object-contain"
                                priority
                                onError={(e) => {
                                  // If image fails to load, replace with fallback
                                  const target = e.target as HTMLElement;
                                  target.style.display = 'none';
                                  const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <div className="fallback w-12 h-12 bg-background/50 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                            <p className="text-md text-gray-100 mt-1">📍 {item.location}</p>
                          </div>
                        </div>

                        {selectedItem?.name === item.name && (
                          <div className="mt-3 pt-3 border-t border-primary/20">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-200">Shop Price</p>
                                <p className="text-sm">{parseInt(item.shop_price) > 0 
                                  ? `${(item.shop_price)} gp` 
                                  : 'Not sold in shops'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-200">Street Price</p>
                                <p className="text-sm">{parseInt(item.street_price) > 0 
                                  ? `${(item.street_price)} gp` 
                                  : 'No street value'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-200">High Alchemy</p>
                                <p className="text-sm">{parseInt(item.high_alchemy) > 0 
                                  ? `${(item.high_alchemy).toLocaleString()} gp` 
                                  : 'No alch value'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-200">Low Alchemy</p>
                                <p className="text-sm">{parseInt(item.low_alchemy) > 0 
                                  ? `${parseInt(item.low_alchemy).toLocaleString()} gp` 
                                  : 'No alch value'}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[25%] bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between bg-background">
            <h2 className="font-semibold">Recent Posts</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-background/50 rounded-full"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className={`border-l-4 rounded-lg bg-background/40 shadow p-3 ${
                    post.type === 'buy' ? 'border-l-primary' : 'border-l-red-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-white">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      post.type === 'buy' ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-700'
                    }`}>
                      {post.type === 'buy' ? '🟢 WTB' : '🔴 WTS'}
                    </span>
                    <h3 className="font-medium text-md truncate">
                      {post.item.name}
                    </h3>
                  </div>
                  <div className="text-md space-y-1">
                    <p className="text-gray-400">
                      Qty: {post.quantity.toLocaleString()} @ {post.price.toLocaleString()}ea
                    </p>
                    <p className="text-gray-400">
                      World {post.world} • {post.ingameName}
                    </p>
                    {post.message && (
                      <p className="text-gray-500 italic truncate">{post.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sticky Post Creation Form */}
      {selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary border-t shadow-lg p-4 h-[15%]">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handlePostSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-2xl mb-2 text-white">Create Post for {selectedItem?.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="px-3 py-2 border rounded-lg bg-background/90"
                    value={newPost.type}
                    onChange={(e) => setNewPost({...newPost, type: e.target.value as 'buy' | 'sell'})}
                  >
                    <option value="buy">Buying</option>
                    <option value="sell">Selling</option>
                  </select>
                  <select
                    className="px-3 py-2 border rounded rounded-lg bg-background/90"
                    value={newPost.world}
                    onChange={(e) => setNewPost({...newPost, world: e.target.value})}
                  >
                    <option value="1">World 1</option>
                    <option value="2">World 2</option>
                    <option value="3">World 3</option>
                    <option value="4">World 4</option>
                  </select>
                  <input
                    type="text"
                    placeholder="In-game name"
                    className="w-32 px-3 py-2 border rounded rounded-lg bg-background/90"
                    value={newPost.ingameName}
                    onChange={(e) => setNewPost({...newPost, ingameName: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-24 px-3 py-2 border rounded rounded-lg bg-background/90"
                    value={newPost.quantity}
                    onChange={(e) => setNewPost({...newPost, quantity: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price each"
                    className="w-24 px-3 py-2 border rounded rounded-lg bg-background/90"
                    value={newPost.price}
                    onChange={(e) => setNewPost({...newPost, price: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Message (optional)"
                    className="flex-1 min-w-[200px] px-3 py-2 border rounded rounded-lg bg-background/90"
                    value={newPost.message}
                    onChange={(e) => setNewPost({...newPost, message: e.target.value})}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/60"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemMarketplace;