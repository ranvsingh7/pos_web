"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

type Props = {};

interface Category {
  categoryName: string;
  description: string;
  createdOn: string;
  _id: string;
}

const Categories = (props: Props) => {
  const [newCategoryData, setNewCategoryData] = useState({
    categoryName: "",
    description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleAddCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTableLoading(true);
    try {
      const data = await axios.post("/api/menu/categories/new-category", {
        categoryName: newCategoryData.categoryName,
        description: newCategoryData.description,
      });
      toast.success("Category added successfully");
      getCategories();
      setTableLoading(false);
      setNewCategoryData({
        categoryName: "",
        description: "",
      });
      //   console.log("category added: ", data);
    } catch (error: any) {
      toast.error(error.response.data.error);
      setTableLoading(false);
    }
  };

  const getCategories = async () => {
    setTableLoading(true);
    try {
      const data = await axios.get("/api/menu/categories/get-categories");
      setCategories(data.data);
      setTableLoading(false);
    } catch (error: any) {
      setTableLoading(false);
      toast.error(error.response.data.error);
    }
  };

  const handleDelete =
    (id: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDeleteLoading(true);
      try {
        const res = await axios.delete("/api/menu/categories/delete-category", {
          data: { id: id },
        });
        toast.success("Category deleted successfully");
        getCategories();
        setDeleteLoading(false);
        //   console.log("category added: ", data);
      } catch (error: any) {
        toast.error(error.response.data.error);
        setDeleteLoading(false);
      }
    };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <form>
        <div className="flex gap-4 p-4">
          <Input
            placeholder="Category Name"
            value={newCategoryData.categoryName}
            onChange={(e) => {
              setNewCategoryData({
                ...newCategoryData,
                categoryName: e.target.value,
              });
            }}
          />
          <Input
            placeholder="Description"
            value={newCategoryData.description}
            onChange={(e) => {
              setNewCategoryData({
                ...newCategoryData,
                description: e.target.value,
              });
            }}
          />
          <Button className=" p-2 rounded-md" onClick={handleAddCategory}>
            Add Category
          </Button>
        </div>
      </form>

      <div className="p-4">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border">Category Name</th>
              <th className="border">Description</th>
              <th className="border">Created On</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-slate-900">
                <td className="border p-3">{category.categoryName}</td>
                <td className="border p-3">{category.description}</td>
                <td className="border p-3 text-center">
                  {new Date(category.createdOn).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  })}
                </td>
                <td className="border flex gap-4 justify-center">
                  <Button className=" p-2 rounded-md">Edit</Button>
                  <Button
                    className=" p-2 rounded-md"
                    disabled={deleteLoading}
                    variant={"destructive"}
                    onClick={handleDelete(category._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
