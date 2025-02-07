import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaUser, FaEnvelope, FaLock, FaPlus, FaUserCog } from "react-icons/fa";
import { getUserRoles, storeUserRole } from "@/lib/Apis";
import { toast } from "react-toastify";

export default function AddUserForm({UserData}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newRole, setNewRole] = useState("");
  const [roles, setRoles] = useState([]);
//  console.log(UserData);
  console.log(UserData);
  
  const form = useForm({
    defaultValues: {
      name: UserData?.name || "",
      email: UserData?.email ||  "",
      role: "",
      password: "",
    },
  });

  const generatePassword = (name) => {
    if (!name) return "";
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${name.replace(/\s+/g, "")}@${randomNumbers}`;
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    form.setValue("name", name);
    form.setValue("password", generatePassword(name));
  };

  const fetchRoles = async () => {
    try {
      const response = await getUserRoles();
      setRoles(response.Roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (UserData) {
        // Update existing user
        const response = await axios.put(`/update-user/${UserData.id}`, values);
        console.log("Updated user data:", response.data);
        toast.success("User updated successfully");
        form.reset();
      } else {
        // Create a new user
        const response = await axios.post("/store", values);
        console.log("Created new user:", response.data);
        toast.success("User added successfully");
      }
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error.response?.data?.message || "Failed to process request"}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  // const updateUser = (data) => {
  //   console.log('updated user');
  //   console.log(data);
    
    
  // }

  

  const handleAddRole = async () => {
    if (newRole.trim()) {
      try {
        await storeUserRole(newRole);
        toast.success("Role added successfully");
        setNewRole("");
        fetchRoles(); // Refresh roles after adding a new one
      } catch (error) {
        console.error("Error adding role:", error);
      }
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormLabel className="flex items-center text-gray-600">
                      <FaUser className="mr-2 text-blue-500" /> Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} onChange={handleNameChange} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormLabel className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-2 text-blue-500" /> Email
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              {/* Role Field */}
              {UserData && (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="flex items-center text-gray-600">
                    <FaUserCog className="mr-2 text-blue-500" /> Role
                  </FormLabel>
                  <FormControl>
                    <Input  readOnly value={`Current Role - ${UserData.role}`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormLabel className="flex items-center text-gray-600">
                      <FaUserCog className="mr-2 text-blue-500" /> Role
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)} // Update selected role correctly
                      value={field.value} // Ensure selected role is shown
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>  {/* Convert ID to string */}
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {!UserData && (
                <>
                  {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormLabel className="flex items-center text-gray-600">
                      <FaLock className="mr-2 text-blue-500" /> Password (Auto-generated)
                    </FormLabel>
                    <FormControl>
                      <Input {...field} readOnly placeholder="Generated password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </>
              )}

              {/* Buttons Section */}
              <div className="flex justify-end space-x-4">
                {/* Add Role Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600 flex items-center">
                      <FaPlus className="mr-2" /> Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <Input
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Enter new role"
                      />
                      <DialogFooter className={`mt-4`}>
                        <Button onClick={handleAddRole} className="bg-green-500 hover:bg-green-600">
                          <FaPlus className="mr-2" /> Add Role
                        </Button>
                        <Button variant="outline" onClick={() => setNewRole("")}>
                          Cancel
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Submit Button */}
                {UserData ? (
                  <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center" disabled={isLoading}>
                    {isLoading? (
                      <>
                        <FaUser className="animate-spin mr-2" /> Updating...
                      </>
                    ) : (
                      <>
                        <FaUser className="mr-2" /> Update User
                      </>
                    )}
                  </Button>
                ) : (
                  <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center" disabled={isLoading}>
                    {isLoading? (
                      <>
                        <FaUser className="animate-spin mr-2" /> Adding...
                      </>
                    ) : (
                      <>
                        <FaUser className="mr-2" /> Add User
                      </>
                    )}
                  </Button>
                )
              
              }
                {/* <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <FaUser className="animate-spin mr-2" /> Adding...
                    </>
                  ) : (
                    <>
                      <FaUser className="mr-2" /> Add User
                    </>
                  )}
                </Button> */}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
