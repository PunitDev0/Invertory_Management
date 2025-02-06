import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchUsers } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";

export default function AllUsers({ setActiveSection, setuserData }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleAction = (action, user) => {
    if (action === "edit") {
      setActiveSection("add-user");
      setuserData(user)
    } else if (action === "delete") {
      // Implement delete logic here
      console.log("Deleting user:", user.id);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <Card className="w-full shadow-lg rounded-xl bg-white overflow-hidden">
        <CardContent className="p-5">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2 text-indigo-800">
              <CubeIcon className="h-8 w-8 text-indigo-600" /> All Users
            </h2>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 max-w-lg border p-2 mt-4 mx-4 rounded-md bg-white shadow-sm">
              <FaSearch className="text-gray-500" size={20} />
              <Input
                className="outline-none border-none px-3 py-2 rounded-md text-gray-700"
                placeholder="Search..."
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setActiveSection('add-user')} className="bg-green-500 text-white hover:bg-green-600">Add New</Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">Export</Button>
            </div>
          </div>

          <div className="p-6">
            {error ? (
              <Alert variant="destructive" className="mb-6 bg-red-100 border border-red-400">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">Error loading users: {error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-auto shadow-lg">
                <Table className="w-full min-w-[600px]">
                  <TableHeader className="bg-indigo-100">
                    <TableRow>
                      <TableHead className="text-center text-indigo-800">ID</TableHead>
                      <TableHead className="text-center text-indigo-800">Name</TableHead>
                      <TableHead className="text-center text-indigo-800">Email</TableHead>
                      <TableHead className="text-center text-indigo-800">Role</TableHead>
                      <TableHead className="text-center text-indigo-800">Created At</TableHead>
                      <TableHead className="text-center text-indigo-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-indigo-50 border-t">
                          <TableCell className="text-center py-4">{user.id}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-indigo-600">
                              {user.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">{user.email}</TableCell>
                          <TableCell className="text-center font-mono text-gray-600">{user.role}</TableCell>
                          <TableCell className="text-center text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Select onValueChange={(value) => handleAction(value, user)} className="">
                              <SelectTrigger className="w-24 border rounded-md bg-indigo-50 text-indigo-700 mx-auto">
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
                        <TableCell colSpan="6" className="h-24 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <CubeIcon className="h-8 w-8 text-gray-400" />
                            No users found
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
