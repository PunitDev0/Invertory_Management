import React, { useEffect, useState } from 'react';
import Layout from './Layout/Layout';
import AddShopForm from './Forms/add-shops-form';
import { deleteShops, fetchShops } from '@/lib/Apis';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Import shadcn table components
import { Button } from '@/components/ui/button'; // Import shadcn button component
import { Pencil, Trash } from 'lucide-react'; // Icons for edit and delete actions
import { toast } from 'react-toastify';

function ShopPage() {
  const [shops, setShops] = useState([]);

  // Fetch shops
  const fetchAndSetShops = async () => {
    try {
      const shopsData = await fetchShops();
      console.log(shopsData);
      
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to fetch shops');
    }
  };

  useEffect(() => {
    fetchAndSetShops();
  }, []);

  // Handle edit action
  const handleEdit = (shopId) => {
    console.log('Edit shop:', shopId);
    // Add your edit logic here
  };

  // Handle delete action
  const handleDelete = async (shopId) => {
    console.log('Delete shop:', shopId);
    try {
      const response = await deleteShops(shopId);
      console.log(response);
      
      if (response.message) {
        toast.success(`${response.message}`);
        fetchAndSetShops(); // Refetch shops after deletion
      } else {
        toast.error('Failed to delete shop');
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast.error('Failed to delete shop');
    }
  };

  return (
    <Layout>
      <div className="p-6 flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-6">Shops</h1>
        <AddShopForm onSuccess={fetchAndSetShops} />

        {/* Centered Table */}
        <div className="mt-6 w-full flex justify-center">
          <div className="w-full max-w-4xl">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Shop Name</TableHead>
                  <TableHead className="text-center">Address</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="text-center">{shop.id}</TableCell>
                    <TableCell className="text-center">{shop.name}</TableCell>
                    <TableCell className="text-center">{shop.address}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex space-x-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(shop.id)}
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(shop.id)}
                        >
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
    </Layout>
  );
}

export default ShopPage;