import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Star, MapPin, Clock, Phone, Plus, Minus, Info, ChevronRight, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIChat from './components/AIChat';

// Mock Data
const STORE_INFO = {
  name: "阿爸的家園 Healthy Nutrition Center",
  rating: 4.9,
  reviews: "120+",
  address: "台北市大同區承德路一段23號1樓",
  phone: "0906-000-923 / 02-25236643",
  hours: "週一至週五 早上7:30-11:30 (其他時間改預約制)",
  deliveryFee: "NT$30",
  deliveryTime: "20-30 min",
  banner: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2000&h=500",
};

const MENU_CATEGORIES = [
  { id: 'promo', name: '特惠體驗' },
  { id: 'muscle', name: '增肌減脂餐' },
  { id: 'sports', name: '運動營養餐' },
  { id: 'kids', name: '兒童健康餐' },
  { id: 'drinks', name: '健康飲品' },
];

const MENU_ITEMS = [
  {
    id: 'p1',
    categoryId: 'promo',
    name: '營養代餐體驗組',
    description: '憑此券可享套餐體驗價，每人限體驗乙次。包含特調營養飲品與健康小點。',
    price: 49,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400&h=300',
    popular: true,
  },
  {
    id: 'm1',
    categoryId: 'muscle',
    name: '舒肥雞胸肉餐盒',
    description: '嚴選低脂雞胸肉，低溫舒肥鎖住肉汁，搭配季節鮮蔬與藜麥飯。',
    price: 120,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400&h=300',
    popular: true,
  },
  {
    id: 'm2',
    categoryId: 'muscle',
    name: '鹽烤鮭魚藜麥飯',
    description: '富含Omega-3的智利鮭魚，簡單鹽烤帶出鮮甜，健康無負擔。',
    price: 150,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 'm3',
    categoryId: 'muscle',
    name: '低脂牛肉鮮蔬餐',
    description: '精選瘦牛肉片，搭配大量水煮蔬菜，高蛋白低脂肪的首選。',
    price: 140,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 's1',
    categoryId: 'sports',
    name: '高蛋白雙拼餐盒',
    description: '雞胸肉與牛肉雙重滿足，提供運動後所需的優質蛋白質修復肌肉。',
    price: 180,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400&h=300',
    popular: true,
  },
  {
    id: 's2',
    categoryId: 'sports',
    name: '能量地瓜雞肉捲',
    description: '優質碳水地瓜搭配雞肉，運動前補充能量的最佳輕食。',
    price: 110,
    image: 'https://images.unsplash.com/photo-1626804475297-41609ea0fa4eb?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 'k1',
    categoryId: 'kids',
    name: '快樂小熊飯糰餐',
    description: '可愛小熊造型飯糰，搭配溫和調味的蔬菜與肉類，讓孩子愛上吃飯。',
    price: 90,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 'k2',
    categoryId: 'kids',
    name: '營養滿分玉子燒便當',
    description: '軟嫩玉子燒富含蛋白質，搭配多樣化配菜，營養均衡。',
    price: 100,
    image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 'd1',
    categoryId: 'drinks',
    name: '高蛋白營養奶昔',
    description: '多種口味可選，提供飽足感與優質蛋白質。',
    price: 80,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400&h=300',
  },
  {
    id: 'd2',
    categoryId: 'drinks',
    name: '鮮榨綠拿鐵',
    description: '新鮮蔬菜與水果打製，富含膳食纖維與維生素。',
    price: 90,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400&h=300',
  }
];

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('cat-', ''));
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    MENU_CATEGORIES.forEach((cat) => {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-green-700 tracking-tight">阿爸的家園</h1>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="搜尋餐點..." 
              className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-full py-2 pl-10 pr-4 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full flex items-center gap-2 bg-black text-white px-4 py-2"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline font-medium">購物車</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="h-48 md:h-64 lg:h-80 w-full relative">
          <img src={STORE_INFO.banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-16 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{STORE_INFO.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-600 mb-6">
              <div className="flex items-center gap-1 font-medium text-black">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span>{STORE_INFO.rating}</span>
                <span className="text-gray-500">({STORE_INFO.reviews})</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Clock size={18} />
                <span>{STORE_INFO.deliveryTime}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <span>外送費 {STORE_INFO.deliveryFee}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-4">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>{STORE_INFO.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="mt-0.5 flex-shrink-0" />
                <span>{STORE_INFO.hours}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>{STORE_INFO.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Info size={18} className="mt-0.5 flex-shrink-0" />
                <span>讓身體成為你想要的樣子！提供增肌減脂、運動營養等健康餐點。</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Nav */}
      <div className="sticky top-16 bg-white z-40 border-b shadow-sm mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex overflow-x-auto py-4 gap-8 no-scrollbar scroll-smooth">
            {MENU_CATEGORIES.map(cat => (
              <a 
                key={cat.id} 
                href={`#cat-${cat.id}`} 
                className={`whitespace-nowrap font-medium text-base transition-colors relative ${
                  activeCategory === cat.id ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {cat.name}
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute -bottom-4 left-0 right-0 h-0.5 bg-black"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="flex flex-col gap-12">
          {MENU_CATEGORIES.map(category => {
            const items = MENU_ITEMS.filter(item => item.categoryId === category.id);
            if (items.length === 0) return null;

            return (
              <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-32">
                <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="group flex bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => addToCart(item)}
                    >
                      <div className="flex-1 pr-4 flex flex-col">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors">{item.name}</h3>
                          {item.popular && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                              人氣
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-2 flex-1">{item.description}</p>
                        <div className="mt-4 font-bold text-gray-900">NT${item.price}</div>
                      </div>
                      <div className="w-32 h-32 flex-shrink-0 relative rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button 
                          className="absolute bottom-2 right-2 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">購物車</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <ShoppingCart size={64} className="text-gray-300" />
                    <p className="text-lg">您的購物車是空的</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                      開始點餐
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-gray-500 mt-1">NT${item.price}</div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="font-bold w-16 text-right">
                          NT${item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>小計</span>
                    <span>NT${cartTotal}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-gray-600">
                    <span>外送費</span>
                    <span>{STORE_INFO.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between mb-6 text-xl font-bold">
                    <span>總計</span>
                    <span>NT${cartTotal + parseInt(STORE_INFO.deliveryFee.replace(/\D/g, ''))}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20">
                    前往結帳 <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Chatbot */}
      <AIChat />
    </div>
  );
}
