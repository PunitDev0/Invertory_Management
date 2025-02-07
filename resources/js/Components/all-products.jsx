import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";
import { Input } from "@/Components/ui/input";
import { FaSearch } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
// import { toast } from "react-hot-toast";
import axios from "axios";
import { toast } from "react-toastify";

export default function AllProducts({ setActiveSection, setproductData }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAction = async (action, product) => {
    if (action === "edit") {
      setActiveSection("add-product");
      setproductData(product);
    } else if (action === "delete") {
      setSelectedProduct(product);
      setIsDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/product-delete/${selectedProduct.id}`);
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== selectedProduct.id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error.response?.data?.message || error.message);
      toast.error("Failed to delete product.");
    } finally {
      setIsDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold flex items-center gap-2 mt-4 ml-4 text-gray-800">
        <CubeIcon className="h-8 w-8 text-blue-500" /> Product Inventory
      </h2>
      <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 max-w-lg border p-2 mt-4 mx-4 rounded-md bg-white shadow-sm">
              {/* <FaSearch className="text-gray-500" size={20} />
              <Input className="outline-none border-none px-3 py-2 rounded-md text-gray-700" placeholder="Search..." /> */}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setActiveSection('add-product')} className="bg-green-500 text-white hover:bg-green-600">Add New</Button>
             
            </div>
          </div>
      <Card className="w-full shadow-lg rounded-lg bg-white overflow-hidden mt-4">
        <CardContent className="py-0 px-2">
          <div className="p-6">
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>Error loading products: {error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          <Badge className={product.stock_quantity > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => handleAction(value, product)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Actions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="edit">Edit</SelectItem>
                              <SelectItem value="delete">Delete</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center">No products found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedProduct?.productName}?</p>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
