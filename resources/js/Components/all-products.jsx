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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { SelectValue } from "./ui/select";
import { Button } from "./ui/button";

export default function AllProducts({ setActiveSection, setproductData }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive", color: "bg-red-500" };
    if (stock < 5) return { label: "Low Stock", variant: "warning", color: "bg-yellow-500" };
    return { label: "In Stock", variant: "success", color: "bg-green-500" };
  };

  const handleAction = (action, product) => {
    if (action === "edit") {
      setActiveSection("add-product");
      setproductData(product)
      
    } else if (action === "delete") {
      // Implement delete logic here
      console.log("Deleting user:", product.id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold flex items-center gap-2 mt-4 ml-4 text-gray-800">
        <CubeIcon className="h-8 w-8 text-blue-500" />
        Product Inventory
      </h2>
      <Card className="w-full shadow-lg rounded-lg bg-white overflow-hidden mt-4">
        <CardContent className="py-0 px-2">
          {/* Search and Filter Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 max-w-lg border p-2 mt-4 mx-4 rounded-md bg-gray-100">
              <FaSearch className="text-gray-500" size={20} />
              <Input
                className="outline-none border-none px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="Search..."
              />
              <Select className="w-20 sm:w-24 md:w-32">
                <SelectTrigger className="border-none rounded-md w-20 sm:w-24 md:w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setActiveSection('add-product')} className="bg-blue-600 text-white hover:bg-blue-700">
                Add New
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700">Export</Button>
            </div>
          </div>

          {/* Product List Section */}
          <div className="p-6">
            {error ? (
              <Alert variant="destructive" className="mb-6 bg-red-100 border border-red-400 text-red-700">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>Error loading products: {error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table className="w-full">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-center font-medium text-gray-600">Product Name</TableHead>
                      <TableHead className="text-center text-gray-600">Category</TableHead>
                      <TableHead className="text-center text-gray-600">Company</TableHead>
                      <TableHead className="text-center text-gray-600">Price</TableHead>
                      <TableHead className="text-center text-gray-600">Stock</TableHead>
                      <TableHead className="text-center text-gray-600">Actions</TableHead> {/* New actions header */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <TableRow key={product.id} className="transition-colors hover:bg-gray-50/50 group border-t">
                          <TableCell className="text-center font-medium py-4">{product.productName}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-gray-600">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{product.companyName}</TableCell>
                          <TableCell className="text-center font-mono">${product.price}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${getStockStatus(product.stock_quantity).color} text-white`}>
                              {getStockStatus(product.stock_quantity).label}
                              <span className="ml-2 font-mono">({product.stock_quantity})</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                          <Select onValueChange={(value) => handleAction(value, product)} className="">
                              <SelectTrigger className="w-24 border rounded-md bg-indigo-50 text-indigo-700 mx-auto">
                                <SelectValue placeholder="Actions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="edit">Edit</SelectItem>
                                <SelectItem value="delete">Delete</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell> {/* Actions column */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="7" className="h-24 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <CubeIcon className="h-8 w-8 text-gray-400" />
                            No products found in inventory
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
