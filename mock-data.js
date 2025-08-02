import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Mock data for different collections
const mockProducts = [
  // Bed Collection
  {
    name: "Queen Size Platform Bed",
    description: "Modern platform bed with clean lines and premium wood construction. Perfect for contemporary bedrooms.",
    price: 899.99,
    category: "Bedroom",
    collection_id: "bed-collection",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 15,
    rating: 4.8,
    review_count: 127,
    discount: 10,
    featured: true,
    trending: true
  },
  {
    name: "King Size Upholstered Bed",
    description: "Luxurious king-size bed with premium fabric upholstery and tufted headboard for ultimate comfort.",
    price: 1299.99,
    category: "Bedroom",
    collection_id: "bed-collection",
    images: [
      "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 8,
    rating: 4.9,
    review_count: 89,
    discount: 0,
    featured: true,
    trending: false
  },
  {
    name: "Twin Size Bunk Bed",
    description: "Space-saving bunk bed perfect for kids' rooms or guest accommodations.",
    price: 599.99,
    category: "Bedroom",
    collection_id: "bed-collection",
    images: [
      "https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 12,
    rating: 4.6,
    review_count: 45,
    discount: 15,
    featured: false,
    trending: true
  },
  {
    name: "California King Bed Frame",
    description: "Extra-long California king bed frame with minimalist design and sturdy construction.",
    price: 799.99,
    category: "Bedroom",
    collection_id: "bed-collection",
    images: [
      "https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 6,
    rating: 4.7,
    review_count: 67,
    discount: 0,
    featured: false,
    trending: false
  },

  // Living Room Collection
  {
    name: "Modern L-Shaped Sofa",
    description: "Contemporary L-shaped sofa with premium fabric and comfortable seating for the whole family.",
    price: 1499.99,
    category: "Living Room",
    collection_id: "living-room-collection",
    images: [
      "https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 10,
    rating: 4.8,
    review_count: 156,
    discount: 20,
    featured: true,
    trending: true
  },
  {
    name: "Accent Armchair",
    description: "Stylish accent chair with velvet upholstery and gold-finished legs for elegant living spaces.",
    price: 399.99,
    category: "Living Room",
    collection_id: "living-room-collection",
    images: [
      "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 20,
    rating: 4.5,
    review_count: 78,
    discount: 0,
    featured: false,
    trending: true
  },
  {
    name: "Coffee Table with Storage",
    description: "Functional coffee table with built-in storage compartments and modern design.",
    price: 299.99,
    category: "Living Room",
    collection_id: "living-room-collection",
    images: [
      "https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 25,
    rating: 4.6,
    review_count: 92,
    discount: 10,
    featured: true,
    trending: false
  },
  {
    name: "Entertainment Center",
    description: "Large entertainment center with multiple shelves and cable management for organized living rooms.",
    price: 899.99,
    category: "Living Room",
    collection_id: "living-room-collection",
    images: [
      "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 7,
    rating: 4.7,
    review_count: 34,
    discount: 0,
    featured: false,
    trending: false
  },

  // Dining Room Collection
  {
    name: "6-Seater Dining Table",
    description: "Elegant dining table with extendable design and premium wood finish for family gatherings.",
    price: 699.99,
    category: "Dining Room",
    collection_id: "dining-room-collection",
    images: [
      "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 12,
    rating: 4.8,
    review_count: 113,
    discount: 15,
    featured: true,
    trending: true
  },
  {
    name: "Dining Chairs Set",
    description: "Set of 4 comfortable dining chairs with ergonomic design and durable upholstery.",
    price: 399.99,
    category: "Dining Room",
    collection_id: "dining-room-collection",
    images: [
      "https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 30,
    rating: 4.6,
    review_count: 67,
    discount: 0,
    featured: false,
    trending: true
  },
  {
    name: "Buffet Sideboard",
    description: "Classic buffet sideboard with multiple drawers and shelves for dining room storage.",
    price: 549.99,
    category: "Dining Room",
    collection_id: "dining-room-collection",
    images: [
      "https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 8,
    rating: 4.7,
    review_count: 45,
    discount: 10,
    featured: true,
    trending: false
  },

  // Office Collection
  {
    name: "Executive Desk",
    description: "Professional executive desk with ample storage and cable management for home offices.",
    price: 899.99,
    category: "Office",
    collection_id: "office-collection",
    images: [
      "https://images.pexels.com/photos/1571475/pexels-photo-1571475.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571476/pexels-photo-1571476.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 15,
    rating: 4.9,
    review_count: 89,
    discount: 0,
    featured: true,
    trending: true
  },
  {
    name: "Ergonomic Office Chair",
    description: "High-back ergonomic office chair with adjustable features and breathable mesh back.",
    price: 299.99,
    category: "Office",
    collection_id: "office-collection",
    images: [
      "https://images.pexels.com/photos/1571477/pexels-photo-1571477.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 40,
    rating: 4.8,
    review_count: 234,
    discount: 20,
    featured: true,
    trending: true
  },
  {
    name: "Bookshelf with Drawers",
    description: "Versatile bookshelf with built-in drawers for organized office storage solutions.",
    price: 199.99,
    category: "Office",
    collection_id: "office-collection",
    images: [
      "https://images.pexels.com/photos/1571478/pexels-photo-1571478.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 25,
    rating: 4.5,
    review_count: 56,
    discount: 0,
    featured: false,
    trending: false
  },

  // Outdoor Collection
  {
    name: "Patio Dining Set",
    description: "Weather-resistant patio dining set with table and 4 chairs for outdoor entertaining.",
    price: 799.99,
    category: "Outdoor",
    collection_id: "outdoor-collection",
    images: [
      "https://images.pexels.com/photos/1571479/pexels-photo-1571479.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571480/pexels-photo-1571480.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 10,
    rating: 4.7,
    review_count: 78,
    discount: 25,
    featured: true,
    trending: true
  },
  {
    name: "Adirondack Chair Set",
    description: "Classic Adirondack chairs made from durable materials for comfortable outdoor relaxation.",
    price: 299.99,
    category: "Outdoor",
    collection_id: "outdoor-collection",
    images: [
      "https://images.pexels.com/photos/1571481/pexels-photo-1571481.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 35,
    rating: 4.6,
    review_count: 123,
    discount: 0,
    featured: false,
    trending: true
  },
  {
    name: "Garden Bench",
    description: "Elegant garden bench with weather-resistant finish perfect for outdoor spaces.",
    price: 249.99,
    category: "Outdoor",
    collection_id: "outdoor-collection",
    images: [
      "https://images.pexels.com/photos/1571482/pexels-photo-1571482.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 18,
    rating: 4.5,
    review_count: 45,
    discount: 10,
    featured: true,
    trending: false
  },

  // Kids Collection
  {
    name: "Kids Study Desk",
    description: "Adjustable study desk with storage compartments designed specifically for children.",
    price: 199.99,
    category: "Kids",
    collection_id: "kids-collection",
    images: [
      "https://images.pexels.com/photos/1571483/pexels-photo-1571483.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 22,
    rating: 4.8,
    review_count: 67,
    discount: 15,
    featured: true,
    trending: true
  },
  {
    name: "Toy Storage Cabinet",
    description: "Colorful toy storage cabinet with multiple bins for organized kids' rooms.",
    price: 149.99,
    category: "Kids",
    collection_id: "kids-collection",
    images: [
      "https://images.pexels.com/photos/1571484/pexels-photo-1571484.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 30,
    rating: 4.6,
    review_count: 89,
    discount: 0,
    featured: false,
    trending: true
  },
  {
    name: "Kids Bookcase",
    description: "Sturdy bookcase with safety features and colorful design for children's rooms.",
    price: 129.99,
    category: "Kids",
    collection_id: "kids-collection",
    images: [
      "https://images.pexels.com/photos/1571485/pexels-photo-1571485.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    stock: 25,
    rating: 4.7,
    review_count: 56,
    discount: 10,
    featured: true,
    trending: false
  }
]

// Function to insert mock data
async function insertMockData() {
  try {
    console.log('Starting to insert mock data...')
    
    for (const product of mockProducts) {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()

      if (error) {
        console.error('Error inserting product:', product.name, error)
      } else {
        console.log('Successfully inserted:', product.name)
      }
    }

    console.log('Mock data insertion completed!')
  } catch (error) {
    console.error('Error inserting mock data:', error)
  }
}

// Run the insertion
insertMockData() 