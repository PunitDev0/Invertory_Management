import { FormProvider, useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { Inertia } from "@inertiajs/inertia";

export function AddProductForm({ productData }) {
  const [categories, setCategories] = useState([]);
  const [productsName, setProductsName] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [shops, setShops] = useState([]);

  const methods = useForm({
    defaultValues: {
      productName: productData?.productName || "",
      category: productData?.category || "",
      owned_imported: productData?.owned_imported || "owned",
      price: productData?.price || "",
      stock_quantity: productData?.stock_quantity || "",
      description: productData?.description || "",
      companyName: productData?.companyName || "",
      shop_name: productData?.shop_name || "",
    },
    mode: "onBlur",
  });

  const { control, handleSubmit, setValue, formState: { errors }, reset, watch } = methods;
  const ownedImportedValue = watch("owned_imported");

  useEffect(() => {
    if (productData) {
      reset({
        productName: productData.productName || "",
        category: productData.category || "",
        owned_imported: productData.owned_imported || "owned",
        price: productData.price || "",
        stock_quantity: productData.stock_quantity || "",
        description: productData.description || "",
        companyName: productData.companyName || "",
        shop_name: productData.shop_name || "",
      });
    }
  }, [productData, reset]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getProductsName = async () => {
      try {
        const response = await fetchProductNames();
        setProductsName(response || []);
        setFilteredProducts(response || []);
      } catch (error) {
        toast.error("Failed to load product names");
      }
    };
    getProductsName();
  }, []);

  useEffect(() => {
    const getShops = async () => {
      try {
        const response = await fetchShops();
        setShops(response || []);
      } catch (error) {
        toast.error("Failed to load shops");
      }
    };
    getShops();
  }, []);

  const handleCategoryChange = (categoryId) => {
    const filtered = productsName.filter(
      (product) => product.category_id === parseInt(categoryId, 10)
    );
    setFilteredProducts(filtered || []);
    setValue("productName", "");
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        productName: data.productName,
        category: data.category,
        owned_imported: data.owned_imported,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        description: data.description,
      };

      if (data.owned_imported === "owned") {
        formData.companyName = data.companyName || "";
      } else {
        formData.shop_name = data.shop_name || "";
      }

      if (productData) {
        const response = await updateProducts(productData.id, formData);
        toast.success("Product updated successfully");
        // reset({
        //   productName: "",
        //   category:  "",
        //   owned_imported: "",
        //   price: "",
        //   stock_quantity: "",
        //   description: "",
        //   companyName: "",
        //   shop_name: "",
        // });
        Inertia.visit('/admin/allproducts')
          // window.location.reload();
        // if (response.status === 201) {
        // }
      } else {
        const response = await axios.post("/api/products/add", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201 || response.status === 200) {
          toast.success("Product added successfully");
          reset();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to add/update product");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 md:p-8 w-full max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {productData ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? categories.find((cat) => cat.name === field.value)?.name || "Select category..."
                            : "Select category..."}
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
                                  onSelect={(value) => {
                                    setValue("category", value);
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
                          {field.value
                            ? filteredProducts.find((prod) => prod.name === field.value)?.name || "Select product..."
                            : "Select product..."}
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
                                  onSelect={(value) => {
                                    field.onChange(value);
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
                  <FormMessage>{errors.productName?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="owned_imported"
              rules={{ required: "Owned/Imported selection is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      className="w-full"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Owned or Imported" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="imported">Imported</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{errors.owned_imported?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="price"
                rules={{ required: "Price is required", min: { value: 0, message: "Price must be >= 0" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter price"
                      />
                    </FormControl>
                    <FormMessage>{errors.price?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="stock_quantity"
                rules={{ required: "Stock quantity is required", min: { value: 0, message: "Stock must be >= 0" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="Enter stock quantity"
                      />
                    </FormControl>
                    <FormMessage>{errors.stock_quantity?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

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
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {ownedImportedValue === "owned" ? (
              <FormField
                control={control}
                name="companyName"
                rules={{ required: "Company Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter company name"
                      />
                    </FormControl>
                    <FormMessage>{errors.companyName?.message}</FormMessage>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={control}
                name="shop_name"
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {shops.map((shop) => (
                            <SelectItem key={shop.id} value={shop.name}>
                              {shop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{errors.shop_name?.message}</FormMessage>
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
              {productData ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}