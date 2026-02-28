import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0, required: true },
    validity: { type: Date, required: true },
    manufacturingDate: { type: Date, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
