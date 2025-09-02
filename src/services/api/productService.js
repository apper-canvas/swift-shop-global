class ProductService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.tableName = 'product_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not initialized');
    }
  }

  async getAll() {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getById(id) {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  async getByCategory(category) {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  }

  async searchProducts(query) {
    await this.ensureClient();
    
    try {
      if (!query || !query.trim()) {
        return await this.getAll();
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query.trim()]},
                {"fieldName": "category_c", "operator": "Contains", "values": [query.trim()]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query.trim()]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 12) {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  }

  async getProductVariants(id) {
    // Mock variant data - in real app this would come from database
    // For now, return static variants for any product
    return {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Black", value: "#000000" },
        { name: "Navy", value: "#1e3a8a" },
        { name: "Gray", value: "#6b7280" },
        { name: "White", value: "#ffffff" }
      ],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format"
      ]
    };
  }

  async getCategories() {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [{"field": {"Name": "category_c"}}],
        groupBy: ["category_c"],
        orderBy: [{"fieldName": "category_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Extract unique categories from the grouped results
      const categories = (response.data || []).map(item => item.category_c).filter(Boolean);
      return [...new Set(categories)].sort();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async filterProducts({ searchQuery, category, sortBy, priceRange }) {
    await this.ensureClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [],
        whereGroups: [],
        orderBy: []
      };

      // Build where conditions
      const whereConditions = [];
      
      // Category filter
      if (category && category.trim()) {
        whereConditions.push({
          "FieldName": "category_c", 
          "Operator": "EqualTo", 
          "Values": [category.trim()]
        });
      }
      
      // Price range filter
      if (priceRange && (priceRange.min > 0 || priceRange.max < 500)) {
        if (priceRange.min > 0) {
          whereConditions.push({
            "FieldName": "price_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [priceRange.min]
          });
        }
        if (priceRange.max < 500) {
          whereConditions.push({
            "FieldName": "price_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [priceRange.max]
          });
        }
      }
      
      params.where = whereConditions;
      
      // Search query filter (use whereGroups for OR logic)
      if (searchQuery && searchQuery.trim()) {
        params.whereGroups = [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [searchQuery.trim()]},
                {"fieldName": "category_c", "operator": "Contains", "values": [searchQuery.trim()]},
                {"fieldName": "description_c", "operator": "Contains", "values": [searchQuery.trim()]}
              ],
              "operator": "OR"
            }
          ]
        }];
      }
      
      // Sorting
      switch (sortBy) {
        case 'price-low':
          params.orderBy = [{"fieldName": "price_c", "sorttype": "ASC"}];
          break;
        case 'price-high':
          params.orderBy = [{"fieldName": "price_c", "sorttype": "DESC"}];
          break;
        case 'newest':
          params.orderBy = [{"fieldName": "Id", "sorttype": "DESC"}];
          break;
        case 'popular':
        default:
          params.orderBy = [{"fieldName": "Id", "sorttype": "ASC"}];
          break;
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error filtering products:", error);
      throw error;
    }
  }
}

export default new ProductService();