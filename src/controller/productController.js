
const product = require('../model/products')
const pagination = require("../services/genricFunction")

module.exports.fetch = async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const fetchData = await response.json();
        const productsToInsert = fetchData.map(item => {
            delete item.id;
            return item;
        });
        const productList = await product.insertMany(productsToInsert);
        if (productList && productList.length > 0) {
            res.status(200).json({
                message: "Product Fetched And Saved Successfully.",
                data: productList,
            });
        } else {
            res.status(400).json({
                message: "No Data Fetched",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

module.exports.create = async (req, res) => {
    try {
        const {
            title,
            price,
            description,
            category,
            image,
            rating,
        } = req.body;
        if (!title || !price || !description || !category || !image || !rating) {
            res.status(400).json({
                message: "Required Fields Are Missing.",
            });
            return;
        }
        const productCreate = await product.create({
            title: title,
            price: price,
            description: description,
            category: category,
            image: image,
            rating: rating
        });
        if (productCreate) {
            res.status(200).json({
                message: "Product Created Successfully.",
                data: productCreate,
            });
        } else {
            res.status(400).json({
                message: "Failed To Create The Product.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

module.exports.update = async (req, res) => {
    try {
        const {
            title,
            price,
            description,
            category,
            image,
            rating,
        } = req.body;
        const { productId } = req.params;
        if (!title || !price || !description || !category || !image || !rating) {
            res.status(400).json({
                message: "Required Fields Are Missing.",
            });
            return;
        }
        const updatedProduct = await product.findByIdAndUpdate(
            productId,
            {
                title: title,
                price: price,
                description: description,
                category: category,
                image: image,
                rating: rating,
            },
            { new: true }
        );
        if (updatedProduct) {
            res.status(200).json({
                message: "Product Updated Successfully.",
                data: updatedProduct,
            });
        } else {
            res.status(400).json({
                message: "Failed To Update The Product.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

module.exports.getAll = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const per_page = req.query.per_page ? parseInt(req.query.per_page) : 20;
        const sortBy = req.query.sort ? req.query.sort.sort_by : "desc";
        const sortDirection = sortBy === "asc" ? 1 : -1;
        const search = req.query.search
        const category = req.query.category
        const price = req.query.price
        let match = {};
        if (search) {
            match.title = {
                $regex: new RegExp(search, 'i')
            };
        }
        if (category) {
            match.category = {
                $regex: new RegExp(category, 'i')
            };
        }
        if (price) {
            match.price = {
                $eq: price
            };
        }
        const productCount = await product.countDocuments({});
        const productList = await product.find(match)
            .sort({ [sortBy]: sortDirection })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .lean();
        const paginate = pagination.paginationService(productCount, productList.length, per_page, page)
        if (paginate) {
            res.status(200).json({
                message: "Product List Fetched Successfully.",
                data: productList,
                paginate: paginate
            });
        } else {
            res.status(400).json({
                message: "No Products Found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

module.exports.delete = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await product.findByIdAndUpdate(
            productId,
            {
                deleted_at: new Date(),
                is_deleted: true
            },
            { new: true }
        );
        if (deletedProduct) {
            res.status(200).json({
                message: "Product Deleted Successfully.",
                data: deletedProduct._id,
            });
        } else {
            res.status(404).json({
                message: "Product not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};