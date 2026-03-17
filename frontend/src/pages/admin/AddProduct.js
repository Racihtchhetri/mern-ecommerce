import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AddProduct() {

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "men",
    subCategory: "",
    basePrice: "",
    isActive: true
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [variants, setVariants] = useState([]);

  const [variant, setVariant] = useState({
    size: "",
    color: "",
    stock: "",
    price: "",
    sku: "",
    image: null,
    preview: ""
  });

  // Product change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Product images
  const handleImageUpload = (e) => {

    const files = Array.from(e.target.files);

    setImages([...images, ...files]);

    const previewUrls = files.map(file => URL.createObjectURL(file));

    setPreview([...preview, ...previewUrls]);
  };

  // Variant input change
  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // Variant image
  const handleVariantImage = (e) => {

    const file = e.target.files[0];

    setVariant({
      ...variant,
      image: file,
      preview: URL.createObjectURL(file)
    });
  };

  // Add variant
  const addVariant = () => {

    if (!variant.size || !variant.color) {
      alert("Size and Color required");
      return;
    }

    setVariants([...variants, variant]);

    setVariant({
      size: "",
      color: "",
      stock: "",
      price: "",
      sku: "",
      image: null,
      preview: ""
    });
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  // Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    formData.append(
      "variants",
      JSON.stringify(
        variants.map(v => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
          price: v.price,
          sku: v.sku
        }))
      )
    );

    // product images
    images.forEach((img) => {
      formData.append("images", img);
    });

    // variant images
    variants.forEach((v, i) => {
      if (v.image) {
        formData.append("variantImages", v.image);
      }
    });

    try {

      await API.post("/admin/products", formData);

      alert("Product Added Successfully");

      navigate("/admin/products");

    } catch (err) {
      alert("Failed to add product");
    }
  };

  return (

    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-dark text-white">
          <h4>Add New Product</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <h5 className="mb-3">Basic Information</h5>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">Product Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Base Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="basePrice"
                  value={product.basePrice}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Sub Category</label>
                <input
                  className="form-control"
                  name="subCategory"
                  value={product.subCategory}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* PRODUCT IMAGES */}

            <h5 className="mt-4">Product Images</h5>

            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleImageUpload}
            />

            <div className="row mt-3">

              {preview.map((img, i) => (

                <div className="col-md-2 mb-2" key={i}>

                  <img
                    src={img}
                    alt="preview"
                    className="img-fluid rounded border"
                  />

                </div>

              ))}

            </div>

            {/* VARIANT SECTION */}

            <h5 className="mt-4">Product Variants</h5>

            <div className="row">

              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Size"
                  name="size"
                  value={variant.size}
                  onChange={handleVariantChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  className="form-control"
                  placeholder="Color"
                  name="color"
                  value={variant.color}
                  onChange={handleVariantChange}
                />
              </div>

              <div className="col-md-2">

              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  name="stock"
                  value={variant.stock}
                  onChange={handleVariantChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  name="price"
                  value={variant.price}
                  onChange={handleVariantChange}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleVariantImage}
                />
              </div>

              <div className="col-md-2 mt-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addVariant}
                >
                  Add Variant
                </button>
              </div>

            </div>

            {/* VARIANT TABLE */}

            {variants.length > 0 && (

              <table className="table table-bordered mt-3">

                <thead className="table-dark">
                  <tr>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {variants.map((v, i) => (

                    <tr key={i}>

                      <td>
                        {v.preview && (
                          <img
                          alt="preview"
                            src={v.preview}
                            width="40"
                          />
                        )}
                      </td>

                      <td>{v.size}</td>
                      <td>{v.color}</td>
                      <td>{v.sku}</td>
                      <td>{v.stock}</td>
                      <td>{v.price}</td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeVariant(i)}
                        >
                          Remove
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

            {/* ACTIVE */}

            <div className="form-check form-switch mt-3">

              <input
                className="form-check-input"
                type="checkbox"
                checked={product.isActive}
                onChange={(e) =>
                  setProduct({ ...product, isActive: e.target.checked })
                }
              />

              <label className="form-check-label">
                Product Active
              </label>

            </div>

            <button className="btn btn-success mt-4">
              Add Product
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}