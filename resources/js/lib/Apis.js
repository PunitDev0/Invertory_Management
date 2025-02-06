import axios from 'axios';

export const storeUserRole = async  (name)=>{
    try {
        const response = await axios.post(`/add-roles`,{
            name : name
        }); 
        return response.data;
    } catch (error) {
        console.error('Error storing user role:', error);
        throw error;
    }
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`/getcategories`);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getUserRoles = async () => {
  try {
    const response = await axios.get(`/get-all-roles`);
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`/get-all-users`);    
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch all product names
export const fetchProductNames = async () => {
  try {
    const response = await axios.get(`/get-product-names`); // New endpoint to fetch product names
    return response.data.productNames; // Assuming the response contains 'productNames' array
  } catch (error) {
    console.error('Error fetching product names:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
    try {
      const response = await axios.get(`/get-all-products`);
      console.log(response);
      return response.data.products; // Ensure this matches the Laravel API response
      
    } catch (error) {
      console.error('Error fetching products', error);
      throw error;
    }
  };
  

// Add product name with category
export const addProductName = async (payload) => {
  try {
    const response = await axios.post(`/add-product-name`, payload);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const addCategory = async (data) => {
  try {
    const response = await axios.post('/add-categories', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`/get-all-orders`);
    return response.data.orders; // Ensure this matches the Laravel API response
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};