import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { deleteCategory, fetchCategories, addCategory, updateCategory } from '@/lib/Apis';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // State to track the category being edited
  const methods = useForm();
  const { control, handleSubmit, reset, errors } = methods;

  // Fetch categories
  const fetchData = async () => {
    const response = await fetchCategories();
    setCategories(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit action
  const handleEdit = (category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
    });
    setImagePreview(category.imageUrl); // Assuming category has an imageUrl field
  };

  // Handle delete action
  const handleDelete = async (categoryId) => {
    console.log('Delete category:', categoryId);
    const response = await deleteCategory(categoryId);
    console.log(response);

    // Refetch categories after deletion
    toast.success(`${response.message}`);
    if (response.message) {
      fetchData();
    }
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (image) {
        formData.append('image', image);
      }

      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, data.name);
        toast.success('Category updated successfully!');
      } else {
        // Add new category
        await addCategory(formData);
        toast.success('Category added successfully!');
      }

      reset({
        name: '',
      });
      setImage(null);
      setImagePreview(null);
      setEditingCategory(null); // Reset editing state
      fetchData(); // Refetch categories after adding/updating
    } catch (error) {
      console.error('Error adding/updating category:', error.response?.data || error.message);
      toast.error(`${error.response?.data.errors.name}`);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Add/Edit Category Form */}
      <div className="sticky top-0 w-full max-w-2xl mb-6">
        <Card className="p-8 shadow-lg rounded-lg bg-white">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <FormProvider {...methods}>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="name"
                rules={{ required: 'Category Name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="p-4 border border-gray-300 rounded-md shadow-sm w-full" placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage>{errors?.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border border-gray-300 rounded-md shadow-sm w-full" />
                    </FormControl>
                    {image && <p className="text-sm text-gray-500 mt-2">Selected Image: {image.name}</p>}
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Image Preview:</h4>
                  <img src={imagePreview} alt="Category Preview" className="mt-2 w-full max-w-sm rounded-md" />
                </div>
              )}
              <Button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
              {editingCategory && (
                <Button
                  type="button"
                  onClick={() => {
                    reset({
                      name: '',
                    });
                    setImage(null);
                    setImagePreview(null);
                    setEditingCategory(null);
                  }}
                  className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition ml-2"
                >
                  Cancel Edit
                </Button>
              )}
            </form>
          </FormProvider>
        </Card>
      </div>

      {/* Categories Table */}
      <div className="mt-6 w-full flex justify-center">
        <div className="w-full max-w-6xl">
          <Table className="w-full border">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="text-center">{category.id}</TableCell>
                  <TableCell className="text-center">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
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

export default CategoryPage;