const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
   
      unique: true,
   
      lowercase: true,
        trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
  },
  phone: {
      type: String,
        required: true,
      trim: true
    },
    wishlist: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      default: []
    }
  },
  { timestamps: { createdAt: true,
    updatedAt: false } }
);

customerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  
  next();
});

customerSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};


customerSchema.methods.toSafeObject = function toSafeObject() {
  return {
    _id: this._id,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone
  };
};

module.exports = mongoose.model('Customer', customerSchema);
