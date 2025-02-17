import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { fetchCategories, addProductName, fetchProductNames, deleteProductName, editProductName } from '@/lib/Apis';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

function ProductNamePage() {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;
  const [categories, setCategories] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // State to track the product being edited

  useEffect(() => {
    fetchCategoryData();
    fetchProductNameData();
  }, []);

  const fetchCategoryData = async () => {
    const response = await fetchCategories();
    setCategories(response);
  };

  const fetchProductNameData = async () => {
    const response = await fetchProductNames();
    setProductNames(response);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { name: data.product_category_name, category_id: data.category_id };
      console.log(payload);
      
      if (editingProduct) {
        // Update existing product
        console.log(payload);
        await editProductName(editingProduct.id, payload);
        
        toast.success('Product Name Updated Successfully!');
      } else {
        // Add new product
        await addProductName(payload);
        toast.success('Product Name Added Successfully!');
      }

      fetchProductNameData(); // Refresh the product list
      reset(); // Reset the form
      setEditingProduct(null); // Clear editing state
    } catch (error) {
      console.error('Error adding/updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to add/update product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // Set the product being edited
    reset({
      product_category_name: product.name,
      category_id: String(product.category_id),
    }); // Populate the form with the product's data
  };

  const handleDelete = async (productNameId) => {
    console.log('Delete product name:', productNameId);
    const response = await deleteProductName(productNameId);
    if (response.message) {
      toast.success(`${response.message}`);
      fetchProductNameData();
    } else {
      toast.error('Failed to delete product name');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null); // Clear editing state
    reset(); // Reset the form
  };

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-6">Product Names</h1>
      <Card className="p-8 shadow-lg rounded-lg bg-white max-w-2xl w-full">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingProduct ? 'Edit Product Name' : 'Add Product Name with Category'}
        </h3>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="product_category_name"
              rules={{ required: "Product name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="p-4 border border-gray-300 rounded-md w-full" placeholder="Enter product name" />
                  </FormControl>
                  <FormMessage>{errors.product_category_name?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category_id"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Controller
                      name="category_id"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value || ""}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={String(category.id)}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.category_id?.message}</FormMessage>
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md">
                {editingProduct ? 'Update Product Name' : 'Add Product Name'}
              </Button>
              {editingProduct && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </Card>
      <div className="mt-6 w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Product Name</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productNames.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center">{product.id}</TableCell>
                  <TableCell className="text-center">{product.name}</TableCell>
                  <TableCell className="text-center">
                    {categories.find((cat) => cat.id === product.category_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductNamePage;