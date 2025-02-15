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
import { fetchCategories, fetchProductNames, fetchShops, updateProducts } from "@/lib/Apis";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

export function AddProductForm({ productData }) {
  const [categories, setCategories] = useState([]);
  const [productsName, setProductsName] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [shops, setShops] = useState([]);

  console.log("productData:", productData);

  const methods = useForm({
    defaultValues: {
      productName: productData?.productName || "",
      category: productData?.category || "",
      owned_imported: productData?.owned_imported || "owned",
      price: productData?.price || "",
      stock_quantity: productData?.stock_quantity || "",
      description: productData?.description || "",
      company_name: productData?.companyName || "",
      shop_id: productData?.shopId || "",
    },
    mode: "onBlur",
  });

  const { control, handleSubmit, setValue, register, formState: { errors }, reset, watch } = methods;
  const ownedImportedValue = watch("owned_imported");

  useEffect(() => {
    if (productData) {
      reset({
        productName: productData.productName,
        category: productData.category,
        owned_imported: productData.owned_imported,
        price: productData.price,
        stock_quantity: productData.stock_quantity,
        description: productData.description,
        company_name: productData.companyName,
        shop_id: productData.shopId,
      });
    }
  }, [productData, reset]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const getProductsName = async () => {
      try {
        const response = await fetchProductNames();
        setProductsName(response);
        setFilteredProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProductsName();
  }, []);

  useEffect(() => {
    const getShops = async () => {
      try {
        const response = await fetchShops();
        setShops(response);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    getShops();
  }, []);

  const handleCategoryChange = (categoryId) => {
    const filtered = productsName.filter(product => product.category_id === parseInt(categoryId));
    setFilteredProducts(filtered);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("category", data.category);
    formData.append("owned_imported", data.owned_imported);
    formData.append("price", data.price);
    formData.append("stock_quantity", data.stock_quantity);
    formData.append("description", data.description);
    if (data.owned_imported === "imported") {
      formData.append("companyName", data.company_name);
    } else {
      formData.append("shop_name", data.shop_id);
    }

    try {
      if (productData) {
        const response = await updateProducts(productData.id, data);
        toast.success('Product updated successfully');
        if (response.status === 200) {
          window.location.reload();
        }
        reset();
      } else {
        const response = await axios.post("/products/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success('Product added successfully');
        reset();
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast.error('Error adding/updating product');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 md:p-8 w-full mx-auto">
        <Card className="p-8 shadow-lg rounded-lg bg-white">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {productData ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Selection */}
            <FormField
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col relative">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className="justify-between"
                        >
                          {field.value ? categories.find((category) => category.name === field.value)?.name : "Select category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="max-w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={(selectedCategory) => {
                                    setValue("category", selectedCategory);
                                    handleCategoryChange(category.id);
                                    setCategoryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage>{errors.category?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Product Name Selection */}
            <FormField
              control={control}
              name="productName"
              rules={{ required: "Product Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Popover open={productOpen} onOpenChange={setProductOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={productOpen}
                          className="w-full justify-between"
                        >
                          {field.value ? filteredProducts.find((product) => product.name === field.value)?.name : "Select product..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search product..." />
                          <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                              {filteredProducts.map((product) => (
                                <CommandItem
                                  key={product.id}
                                  value={product.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    setProductOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === product.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {product.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                      placeholder="Enter product description"
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Conditionally render Company Name or Shop Name */}
            {ownedImportedValue === "imported" ? (
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
            ) : (
              <FormField
                control={control}
                name="shop_id"
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        className="w-full"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Shop">
                            {field.value
                              ? shops.find((shop) => shop.id === field.value)?.name
                              : "Select Shop"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {shops?.map((shop) => (
                            <SelectItem key={shop.id} value={shop.id.toString()}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors.shop_id?.message}</FormMessage>
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">{productData ? "Update Product" : "Add Product"}</Button>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}