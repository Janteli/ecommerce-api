import Brand from "../model/Brand.model.js";
import Category from "../model/Category.model.js";
import Product from "../model/Product.model.js";
import asyncHandler from "express-async-handler";
// @desc Create new product
// @route Post /api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
  console.log(req.files);
  // console.log(req.body)
  // const {
  //   name,
  //   description,
  //   category,
  //   sizes,
  //   colors,
  //   price,
  //   totalQty,
  //   brand,
  // } = req.body;
  // // Existance of product
  // const productExists = await Product.findOne({ name });
  // if (productExists) {
  //   throw new Error("Product Already Exists");
  // }
  // // find the category- associating product with category
  // const categoryFound = await Category.findOne({name: category})

  // if(!categoryFound){
  //   throw new Error(
  //     "Category not found, please create category first or check category name"
  //   )
  // }

  //  // find the brand- associating product with category
  //  const brandFound = await Brand.findOne({name: brand.toLowerCase()})
 
  //  if(!brandFound){
  //    throw new Error(
  //      "Brand not found, please create brand first or check brand name"
  //    )
  //  }
 
  // // if not, create product
  // const product = await Product.create({
  //   name,
  //   description,
  //   category,
  //   sizes,
  //   colors,
  //   user: req.userAuthId,
  //   price,
  //   totalQty,
  //   brand,
  // });
  // //push the product into category
  // categoryFound.products.push(product._id)
  // // resave
  // await categoryFound.save()
  // // pushing the product to brand field
  // brandFound.products.push(product._id)
  // // resave
  // await brandFound.save()

  // // send response
  // res.json({
  //   status: "success",
  //   message: "Product created successfully",
  //   product,
  // });
});

// @desc Get all products
// @route Get /api/v1/products
// @access Public

export const getProductsCtrl = asyncHandler(async (req, res) => {
  console.log(req.query);
  // query
  let productQuery = Product.find();

  // search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  // search by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  // search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // search by color
  if (req.query.color) {
    productQuery = productQuery.find({
      color: { $regex: req.query.color, $options: "i" },
    });
  }

  // search by color
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  // filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    // console.log(priceRange);
    // gte: greater or equal
    // lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // pagination
  // page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // startIdx
  const startIndex = (page - 1) * limit;
  // endIdx
  const endIndex = page * limit;
  // total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // await the query
  const products = await productQuery.populate('reviews');//toJson s used in model
  // console.log(products);
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

// @desc Get single product
// @route Get /api/products/:id
// @access Public

export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

// @desc Update the product
// @route PUT /api/products/:id/update
// @access Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

//   update
// if (!product) {
//     throw new Error("Product not found");
//   }

  const product = await Product.findByIdAndUpdate(req.params.id,{
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  },{new: true});
  
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

// @desc Delete single product
// @route DELETE /api/products/:id
// @access Private/Admin

export const deleteProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new Error("Product not found");
    }
    res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  });
