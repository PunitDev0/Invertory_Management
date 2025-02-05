import { FormProvider, useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchCategories, fetchProductNames } from "@/lib/Apis";
import { toast } from "react-toastify";

export function AddProductForm() {
  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
      owned_imported: "owned",
      price: "",
      stock_quantity: "",
      description: "",
      company_name: "",
    },
    mode: "onBlur", // Validation triggers onBlur
  });
  const { control, handleSubmit, setValue, register, formState: { errors }, reset } = methods;
  const [categories, setCategories] = useState([]);
  const [productsName, setProductsName] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();  // Use fetchCategories from api.js
        setCategories(categoriesData);
        console.log(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const getProductsName = async () => {
      try {
        const response = await fetchProductNames();  // Use fetchProductNames from api.js
        setProductsName(response);
        setFilteredProducts(response);  // Initially show all products
        console.log(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProductsName();
  }, []);

  const handleCategoryChange = (categoryId) => {
    // Filter products by category_id
    const filtered = productsName.filter(product => product.category_id === parseInt(categoryId));
    setFilteredProducts(filtered);
    console.log(filtered);
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const formData = new FormData();
    formData.append("productName", data.name);
    formData.append("category", data.category); // For now, assuming category_id is fixed. Modify this if necessary.
    formData.append("owned_imported", data.owned_imported);
    formData.append("price", data.price);
    formData.append("stock_quantity", data.stock_quantity);
    formData.append("description", data.description);
    formData.append("companyName", data.company_name);

    try {
      // Send data to backend API
      const response = await axios.post("/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added successfully:", response.data);
      toast.success('Product added successfully')
      reset()
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 md:p-8 w-full mx-auto">
        <Card className="p-8 shadow-lg rounded-lg bg-white">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category */}
            <FormField
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Controller
                      {...field}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={(selectedCategoryName) => {
                            const selectedCategory = categories.find(
                              (category) => category.name === selectedCategoryName
                            );
                            onChange(selectedCategoryName);  // Update category name
                            handleCategoryChange(selectedCategory.id);  // Pass category id
                          }}
                          value={value} // value is based on the category name
                          className="w-full"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.category?.message}</FormMessage>
                </FormItem>
              )}
            />


            {/* Product Name */}
            <FormField
              control={control}
              name="name"
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Controller
                      {...field}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          onValueChange={onChange}
                          value={value}
                          className="w-full"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product name" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProducts.map((product) => (
                              <SelectItem key={product.id} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Owned/Imported */}
            <FormField
              control={control}
              name="owned_imported"
              rules={{ required: "Owned/Imported selection is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owned/Imported</FormLabel>
                  <FormControl>
                    <Controller
                      {...field}
                      render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} value={value} className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Owned or Imported" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="imported">Imported</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.owned_imported?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Price & Stock Quantity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="price"
                  rules={{ required: "Price is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                          placeholder="Enter price"
                        />
                      </FormControl>
                      <FormMessage>{errors.price?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="stock_quantity"
                  rules={{ required: "Stock quantity is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                          placeholder="Enter stock quantity"
                        />
                      </FormControl>
                      <FormMessage>{errors.stock_quantity?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <FormField
              control={control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter description"
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={control}
              name="company_name"
              rules={{ required: "Company Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter company name"
                    />
                  </FormControl>
                  <FormMessage>{errors.company_name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
              Add Product
            </Button>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
