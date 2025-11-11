const fs = require('fs');
const path = require('path');

const files = {
  // Models
  'models/User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);`,

  'models/Product.js': `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [{ type: String }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);`,

  'models/Order.js': `const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(\`Created: \${filepath}\`);
});

console.log('\nAll model files created successfully!');
