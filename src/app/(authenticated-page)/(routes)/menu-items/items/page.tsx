"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

interface Item {
  itemName: string;
  description: string;
  price: string;
  category: string;
  mealCategory: string;
  inStock: boolean;
  createdOn: string;
  _id: string;
}

interface Category {
  categoryName: string;
  description: string;
  createdOn: string;
  _id: string;
}

const Items = (props: Props) => {
  const [newItemData, setNewItemData] = useState({
    categoryId: "",
    itemName: "",
    description: "",
    price: 0,
    category: "",
    mealCategory: "",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleAddItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTableLoading(true);
    try {
      const data = await axios.post("/api/menu/items/new-item", {
        categoryId: newItemData.categoryId,
        itemName: newItemData.itemName,
        description: newItemData.description,
        price: newItemData.price,
        category: newItemData.category,
        mealCategory: newItemData.mealCategory,
      });
      toast.success("Item added successfully");
      getItems();
      setTableLoading(false);
      setNewItemData({
        categoryId: "",
        itemName: "",
        description: "",
        price: 0,
        category: "",
        mealCategory: "",
      });
      //   console.log("item added: ", data);
    } catch (error: any) {
      toast.error(error.response.data.error);
      setTableLoading(false);
    }
  };

  const getItems = async () => {
    setTableLoading(true);
    try {
      const data = await axios.get("/api/menu/items/get-items");
      setItems(data.data);
      setTableLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };
  const getCategories = async () => {
    try {
      const data = await axios.get("/api/menu/categories/get-categories");
      setCategories(data.data);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  const handleDelete =
    (category: string, id: string) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDeleteLoading(true);
      try {
        const res = await axios.delete("/api/menu/items/delete-item", {
          data: { categoryName: category, itemId: id },
        });
        toast.success("Item deleted successfully");
        getItems();
        setDeleteLoading(false);
        //   console.log("item added: ", data);
      } catch (error: any) {
        toast.error(error.response.data.error);
        setDeleteLoading(false);
      }
    };

  useEffect(() => {
    getItems();
    getCategories();
  }, []);

  console.log(newItemData);

  return (
    <div>
      <form>
        <div className="flex gap-4 p-4">
          <Input
            placeholder="Item Name"
            value={newItemData.itemName}
            onChange={(e) => {
              setNewItemData({
                ...newItemData,
                itemName: e.target.value,
              });
            }}
          />
          <Input
            placeholder="Description"
            value={newItemData.description}
            onChange={(e) => {
              setNewItemData({
                ...newItemData,
                description: e.target.value,
              });
            }}
          />
          <Input
            placeholder="Price"
            value={newItemData.price === 0 ? "" : newItemData.price}
            onChange={(e) => {
              const newValue = e.target.value;
              // Check if the input is numeric
              if (/^\d*$/.test(newValue)) {
                const newPrice = newValue === "" ? 0 : parseInt(newValue);
                setNewItemData({
                  ...newItemData,
                  price: newPrice,
                });
              }
            }}
          />
          <Select
            onValueChange={(value) => {
              setNewItemData({
                ...newItemData,
                categoryId: value,
                category:
                  categories.find((category) => category._id === value)
                    ?.categoryName || "",
              });
            }}
            value={newItemData.categoryId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              setNewItemData({
                ...newItemData,
                mealCategory: value,
              });
            }}
            value={newItemData.mealCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Meal Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Veg">Veg</SelectItem>
              <SelectItem value="Non-Veg">Non-Veg</SelectItem>
              <SelectItem value="Egg">Egg</SelectItem>
            </SelectContent>
          </Select>

          <Button className=" p-2 rounded-md" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>
      </form>

      <div className="p-4">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border">Item Name</th>
              <th className="border">Description</th>
              <th className="border">Price</th>
              <th className="border">Category</th>
              <th className="border">Meal Category</th>
              <th className="border">Created On</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-900">
                <td className="border p-3">{item.itemName}</td>
                <td className="border p-3">{item.description}</td>
                <td className="border p-3 text-center">₹ {item.price}.00</td>
                <td className="border p-3 text-center">{item.category}</td>
                <td className="border p-3 text-center">{item.mealCategory}</td>
                <td className="border p-3 text-center">
                  {new Date(item.createdOn).toLocaleString("en-US", {
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
                    onClick={handleDelete(item.category, item._id)}>
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

export default Items;
