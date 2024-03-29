import productSchema from "../models/product.schema.js";

class productDAO {

    static async getAll() {
        return productSchema.find().lean();
    }

    static async getById(id) {
        return productSchema.findOne({ _id: id}).lean();
    }

    static async getLimit(num) {
        return productSchema.find().limit(num).lean();
    }

    static async getByCategory(category) {
        return productSchema.find({ category: category }).lean();
    }
}

export default productDAO