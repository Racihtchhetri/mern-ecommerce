const Product = require("../../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load products" });
  }
};


exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load product" });
  }
};