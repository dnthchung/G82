const API_BASE_URL = "http://localhost:9999/api";

class ProductService {
  // Lấy danh sách sản phẩm với pagination, filtering và sorting
  static async getAllProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Pagination
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Search and filters
      if (params.search) queryParams.append("search", params.search);
      if (params.category) queryParams.append("category", params.category);
      if (params.minPrice) queryParams.append("minPrice", params.minPrice);
      if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);

      // Sorting
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${API_BASE_URL}/goods${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Lấy danh sách danh mục
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Lấy sản phẩm theo ID
  static async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }

  // Tạo sản phẩm mới
  static async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  static async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Xóa sản phẩm (soft delete)
  static async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Tìm kiếm sản phẩm (legacy API)
  static async searchProducts(searchQuery) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  // Lọc sản phẩm theo danh mục (legacy API)
  static async filterByCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/filter/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error filtering by category:", error);
      throw error;
    }
  }

  // Lọc sản phẩm theo khoảng giá (legacy API)
  static async filterByPriceRange(minPrice, maxPrice) {
    try {
      const response = await fetch(`${API_BASE_URL}/goods/filter/price-range`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ minPrice, maxPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error filtering by price range:", error);
      throw error;
    }
  }
}

export default ProductService;
