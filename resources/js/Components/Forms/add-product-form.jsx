import { FormProvider, useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";

export function AddProductForm() {
  const methods = useForm({
    defaultValues: {
      name: "",
      category: "",
      owned_imported: "",
      price: "",
      stock_quantity: "",
      description: "",
      company_name: "", // Added company name here
      images: []
    },
    mode: "onBlur", // Validation triggers onBlur
  });
  const { control, handleSubmit, setValue, register, formState: { errors } } = methods;

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(file => file.type.startsWith('image/')); // Filter valid image files
      setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
      setValue("images", validFiles); // Update the value of images in form data
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Check if data is being logged here

    if (data.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", data.name);
    formData.append("category_id", '2');
    formData.append("owned_imported", data.owned_imported);
    formData.append("price", data.price);
    formData.append("stock_quantity", data.stock_quantity);
    formData.append("description", data.description);
    formData.append("companyName", data.company_name); // Append company name to FormData

    // Append images to FormData
    data.images.forEach((image, index) => {
      formData.append("images[]", image);
    });
    console.log(formData); // Check if FormData is being populated correctly

    try {
      // Send data to Laravel backend API
      const response = await axios.post("/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added successfully:", response.data);
      // Handle success response
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle error response
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 md:p-8 w-full mx-auto">
        <Card className="p-8 shadow-lg rounded-lg bg-white">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Product Name */}
            <FormField
              control={control}
              name="name"
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter product name"
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

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
                        <Select onValueChange={onChange} value={value} className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.category?.message}</FormMessage>
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

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="images">Product Images</Label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md shadow-lg" />
                      <div className="absolute top-2 right-2 p-1 bg-black text-white rounded-full cursor-pointer">
                        <button
                          onClick={() => {
                            const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
                            setImagePreviews(updatedPreviews);
                            setValue("images", updatedPreviews); // Update form data
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {imagePreviews.length === 0 && (
                <p className="text-gray-500 text-sm">No images selected. Choose images to upload.</p>
              )}
            </div>

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

