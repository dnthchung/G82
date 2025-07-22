const Goods = require("../models/goods");
const Category = require("../models/category");

// Searching function
exports.searchGoods = async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm." });
  }

  try {
    // Tìm kiếm đồng thời trên goods_name và barcode
    const goods = await Goods.find({
      $or: [{ goods_name: { $regex: searchQuery, $options: "i" } }, { barcode: { $regex: searchQuery, $options: "i" } }],
    }).populate("category_id");

    if (goods.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hàng hóa phù hợp." });
    }

    // Lọc ra những thông tin cần thiết
    const filteredGoods = goods.map((item) => ({
      barcode: item.barcode,
      goods_name: item.goods_name,
      description: item.description,
      unit_of_measure: item.unit_of_measure,
      selling_price: item.selling_price,
      average_import_price: item.average_import_price,
      last_import_price: item.last_import_price,
      stock_quantity: item.stock_quantity,
      minimum_stock_quantity: item.minimum_stock_quantity,
      is_active: item.is_active,
      category: item.category_id ? item.category_id.name : null,
    }));

    res.status(200).json(filteredGoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Lỗi khi tìm kiếm hàng hóa. ${error.message}` });
  }
};

// Lọc theo danh mục
exports.filterByCategory = async (req, res) => {
  const { categoryId } = req.body;

  try {
    const goods = await Goods.find({
      category_id: categoryId,
    }).populate("category_id", "name");

    if (goods.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hàng hóa trong danh mục này." });
    }

    const filteredGoods = goods.map((item) => ({
      barcode: item.barcode,
      goods_name: item.goods_name,
      description: item.description,
      unit_of_measure: item.unit_of_measure,
      selling_price: item.selling_price,
      average_import_price: item.average_import_price,
      last_import_price: item.last_import_price,
      stock_quantity: item.stock_quantity,
      minimum_stock_quantity: item.minimum_stock_quantity,
      is_active: item.is_active,
      category: item.category_id ? item.category_id.name : null,
    }));

    res.status(200).json(filteredGoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lọc hàng hóa theo danh mục." });
  }
};

// Lọc theo trạng thái hoạt động
exports.filterByStatus = async (req, res) => {
  const { is_active } = req.body;

  try {
    const goods = await Goods.find({ is_active }).populate("category_id", "name");

    if (goods.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy hàng hóa với trạng thái này." });
    }

    const filteredGoods = goods.map((item) => ({
      barcode: item.barcode,
      goods_name: item.goods_name,
      description: item.description,
      unit_of_measure: item.unit_of_measure,
      selling_price: item.selling_price,
      average_import_price: item.average_import_price,
      last_import_price: item.last_import_price,
      stock_quantity: item.stock_quantity,
      minimum_stock_quantity: item.minimum_stock_quantity,
      is_active: item.is_active,
      category: item.category_id ? item.category_id.name : null,
    }));

    res.status(200).json(filteredGoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lọc hàng hóa theo trạng thái." });
  }
};

// Lọc theo khoảng giá bán
exports.filterGoodsByPriceRange = async (req, res) => {
  let { minPrice, maxPrice } = req.body;
  minPrice = parseFloat(minPrice);
  maxPrice = parseFloat(maxPrice);

  // Validate minPrice and maxPrice
  if (typeof minPrice !== "number" || typeof maxPrice !== "number" || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
    return res.status(400).json({ message: "Giá trị minPrice và maxPrice không hợp lệ." });
  }

  try {
    const goods = await Goods.find({
      selling_price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    }).populate("category_id", "name");

    if (goods.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy mặt hàng trong khoảng giá này." });
    }

    const filteredGoods = goods.map((item) => ({
      barcode: item.barcode,
      goods_name: item.goods_name,
      description: item.description,
      unit_of_measure: item.unit_of_measure,
      selling_price: item.selling_price,
      average_import_price: item.average_import_price,
      last_import_price: item.last_import_price,
      stock_quantity: item.stock_quantity,
      minimum_stock_quantity: item.minimum_stock_quantity,
      is_active: item.is_active,
      category: item.category_id ? item.category_id.name : null,
    }));

    res.status(200).json(filteredGoods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Lỗi khi lọc hàng hóa theo khoảng giá: ${error.message}` });
  }
};

// Get all goods with pagination, sorting, and filtering
exports.getAllGoods = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category = "", minPrice = "", maxPrice = "", sortBy = "", sortOrder = "asc" } = req.query;

    // Build filter query
    let filter = { is_active: true };

    // Search filter
    if (search.trim()) {
      filter.$or = [{ goods_name: { $regex: search, $options: "i" } }, { barcode: { $regex: search, $options: "i" } }];
    }

    // Category filter
    if (category && category !== "Tất cả") {
      // Find category by name
      const categoryDoc = await Category.findOne({ category_name: category });
      if (categoryDoc) {
        filter.category_id = categoryDoc._id;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.selling_price = {};
      if (minPrice) filter.selling_price.$gte = Number(minPrice);
      if (maxPrice) filter.selling_price.$lte = Number(maxPrice);
    }

    // Build sort query
    let sort = {};
    if (sortBy) {
      // Map frontend field names to backend field names
      const fieldMapping = {
        name: "goods_name",
        sellingPrice: "selling_price",
        costPrice: "average_import_price",
        stock: "stock_quantity",
        category: "category_id",
      };
      const sortField = fieldMapping[sortBy] || sortBy;
      sort[sortField] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort = { createdAt: -1 }; // Default sort by creation date
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Goods.countDocuments(filter);

    // Get goods with pagination and populate category
    const goods = await Goods.find(filter).populate("category_id", "category_name").sort(sort).skip(skip).limit(limitNum);

    // Transform data to match frontend format
    const transformedGoods = goods.map((item) => ({
      id: item._id.toString(),
      name: item.goods_name,
      category: item.category_id ? item.category_id.category_name : "Chưa phân loại",
      sellingPrice: item.selling_price,
      costPrice: item.average_import_price || item.last_import_price || 0,
      stock: item.stock_quantity || 0,
      unit: item.unit_of_measure,
      barcode: item.barcode,
      description: item.description,
      image_url: item.image_url,
      is_active: item.is_active,
      minimum_stock_quantity: item.minimum_stock_quantity,
      display_quantity: item.display_quantity,
    }));

    res.status(200).json({
      success: true,
      data: transformedGoods,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum,
      },
    });
  } catch (error) {
    console.error("Error getting all goods:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi lấy danh sách hàng hóa: ${error.message}`,
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ category_name: 1 });

    const transformedCategories = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.category_name,
      description: cat.description,
    }));

    res.status(200).json({
      success: true,
      data: transformedCategories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi lấy danh sách danh mục: ${error.message}`,
    });
  }
};

// Create new goods
exports.createGoods = async (req, res) => {
  try {
    const {
      goods_name,
      barcode,
      unit_of_measure,
      description,
      category_id,
      selling_price,
      average_import_price,
      last_import_price,
      stock_quantity = 0,
      display_quantity = 0,
      minimum_stock_quantity = 0,
      image_url,
    } = req.body;

    // Validate required fields
    if (!goods_name || !barcode || !unit_of_measure || !selling_price) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin: tên hàng, mã vạch, đơn vị tính, giá bán",
      });
    }

    // Check if barcode already exists
    const existingGoods = await Goods.findOne({ barcode });
    if (existingGoods) {
      return res.status(400).json({
        success: false,
        message: "Mã vạch đã tồn tại",
      });
    }

    // Validate category if provided
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Danh mục không tồn tại",
        });
      }
    }

    // Create new goods
    const newGoods = new Goods({
      goods_name,
      barcode,
      unit_of_measure,
      description,
      category_id: category_id || null,
      selling_price: Number(selling_price),
      average_import_price: Number(average_import_price) || Number(selling_price) * 0.8,
      last_import_price: Number(last_import_price) || Number(average_import_price) || Number(selling_price) * 0.8,
      last_import_date: new Date(),
      stock_quantity: Number(stock_quantity),
      display_quantity: Number(display_quantity),
      minimum_stock_quantity: Number(minimum_stock_quantity),
      is_active: true,
      image_url,
    });

    const savedGoods = await newGoods.save();

    // Populate category for response
    await savedGoods.populate("category_id", "category_name");

    // Transform response
    const transformedGoods = {
      id: savedGoods._id.toString(),
      name: savedGoods.goods_name,
      category: savedGoods.category_id ? savedGoods.category_id.category_name : "Chưa phân loại",
      sellingPrice: savedGoods.selling_price,
      costPrice: savedGoods.average_import_price,
      stock: savedGoods.stock_quantity,
      unit: savedGoods.unit_of_measure,
      barcode: savedGoods.barcode,
      description: savedGoods.description,
      image_url: savedGoods.image_url,
      is_active: savedGoods.is_active,
    };

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: transformedGoods,
    });
  } catch (error) {
    console.error("Error creating goods:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi tạo sản phẩm: ${error.message}`,
    });
  }
};

// Update goods
exports.updateGoods = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if goods exists
    const existingGoods = await Goods.findById(id);
    if (!existingGoods) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Check if barcode is being changed and already exists
    if (updateData.barcode && updateData.barcode !== existingGoods.barcode) {
      const barcodeExists = await Goods.findOne({
        barcode: updateData.barcode,
        _id: { $ne: id },
      });
      if (barcodeExists) {
        return res.status(400).json({
          success: false,
          message: "Mã vạch đã tồn tại",
        });
      }
    }

    // Validate category if provided
    if (updateData.category_id) {
      const category = await Category.findById(updateData.category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Danh mục không tồn tại",
        });
      }
    }

    // Update goods
    const updatedGoods = await Goods.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).populate("category_id", "category_name");

    // Transform response
    const transformedGoods = {
      id: updatedGoods._id.toString(),
      name: updatedGoods.goods_name,
      category: updatedGoods.category_id ? updatedGoods.category_id.category_name : "Chưa phân loại",
      sellingPrice: updatedGoods.selling_price,
      costPrice: updatedGoods.average_import_price,
      stock: updatedGoods.stock_quantity,
      unit: updatedGoods.unit_of_measure,
      barcode: updatedGoods.barcode,
      description: updatedGoods.description,
      image_url: updatedGoods.image_url,
      is_active: updatedGoods.is_active,
    };

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: transformedGoods,
    });
  } catch (error) {
    console.error("Error updating goods:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi cập nhật sản phẩm: ${error.message}`,
    });
  }
};

// Delete goods (soft delete)
exports.deleteGoods = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if goods exists
    const existingGoods = await Goods.findById(id);
    if (!existingGoods) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Soft delete by setting is_active to false
    const updatedGoods = await Goods.findByIdAndUpdate(
      id,
      {
        is_active: false,
        updatedAt: new Date(),
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Error deleting goods:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi xóa sản phẩm: ${error.message}`,
    });
  }
};

// Get goods by ID
exports.getGoodsById = async (req, res) => {
  try {
    const { id } = req.params;

    const goods = await Goods.findById(id).populate("category_id", "category_name");

    if (!goods || !goods.is_active) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Transform response
    const transformedGoods = {
      id: goods._id.toString(),
      name: goods.goods_name,
      category: goods.category_id ? goods.category_id.category_name : "Chưa phân loại",
      category_id: goods.category_id ? goods.category_id._id.toString() : null,
      sellingPrice: goods.selling_price,
      costPrice: goods.average_import_price,
      stock: goods.stock_quantity,
      unit: goods.unit_of_measure,
      barcode: goods.barcode,
      description: goods.description,
      image_url: goods.image_url,
      is_active: goods.is_active,
      minimum_stock_quantity: goods.minimum_stock_quantity,
      display_quantity: goods.display_quantity,
    };

    res.status(200).json({
      success: true,
      data: transformedGoods,
    });
  } catch (error) {
    console.error("Error getting goods by ID:", error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi lấy thông tin sản phẩm: ${error.message}`,
    });
  }
};
