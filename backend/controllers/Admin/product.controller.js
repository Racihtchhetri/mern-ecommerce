const Product = require("../../models/Product");

const generateSKU = (product, variant) => {

  const category = product.category?.substring(0, 3).toUpperCase() || "PRD";
  const size = variant.size?.toUpperCase() || "NA";
  const color = variant.color?.substring(0, 3).toUpperCase() || "CLR";

  const random = Math.floor(1000 + Math.random() * 9000);

  return `${category}-${size}-${color}-${random}`;

};

exports.createProduct = async (req, res) => {

  try {

    const data = req.body;

    const variants = JSON.parse(data.variants || "[]");

    variants.forEach(v => {
      v.sku = generateSKU(data, v);
    });

    // product images
    const productImages = req.files["images"] || [];

    const gallery = productImages.map(file => file.filename);

    // variant images
    const variantImages = req.files["variantImages"] || [];

    variants.forEach((v, i) => {
      if (variantImages[i]) {
        v.image = variantImages[i].filename;
      }
    });

    const product = new Product({
      name: data.name,
      description: data.description,
      category: data.category,
      subCategory: data.subCategory,
      basePrice: data.basePrice,
      isActive: data.isActive,
      images: {
        gallery
      },
      variants
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created",
      product
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Product creation failed"
    });
  }
};

exports.deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product delete" });

  } catch (err) {

    res.status(500).json({ message: "Delete failed" });
  }
};