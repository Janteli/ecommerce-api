import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        ref: "Category",
        required: true,
    },
    sizes: {
        type: [String],
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    images: [
        {
            type: String,
            default: "https://via.placeholder.com/150"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    totalQty: {
        type: Number,
        required: true
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0
    }
},{timestamps: true,
    toJSON: {virtuals: true}
})
// Virtuals
// qty left
productSchema.virtual('qtyLeft').get(function(){
    const product = this
    return product.totalQty - product.totalSold;
})
// Total rating
productSchema.virtual('totalReviews').get(function(){
    // console.log("this",this);
    const product = this;
    return product?.reviews?.length || 0;
})
// average Rating
productSchema.virtual('averageRating').get(function(){
    let ratingTotal = 0;
    const product = this;
    product?.reviews?.forEach((review)=>{
        ratingTotal += review?.rating
    })
    if(product?.reviews?.length === 0) return 0;
    // calc average rating
    const averageRating = Number(ratingTotal / product?.reviews?.length).toFixed;
    return averageRating;
})
const Product = mongoose.model("Product", productSchema);

export default Product;