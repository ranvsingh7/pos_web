// dashboard page here is showing all tables
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Tables {
  _id: string;
  tableNo: string;
  tableName: string;
  isVacant: boolean;
  orderValue: number;
  createdOn: string;
  __v: number;
}

interface Table {
  tableNo: string;
  tableName: string;
  // isVacant: boolean;
  // orderValue: number;
}

const Dashboard = () => {
  const [tables, setTables] = useState<Tables[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [updatingTable, setUpdatingTable] = useState<boolean>(false);
  const [table, setTable] = useState<Table>({
    tableNo: "",
    tableName: "",
  });
  const [updateTable, setUpdateTable] = useState({
    id: "",
    isVacant: false,
    orderValue: 0,
  });

  const getTableData = async () => {
    setTableLoading(true);
    try {
      const data = await axios.get("/api/tables/get-tables");
      const sortedTables = data.data.sort(
        (a: { tableNo: number }, b: { tableNo: number }) =>
          a.tableNo - b.tableNo
      );
      setTables(sortedTables);
      setTableLoading(false);
    } catch (error: any) {
      //   console.log("get table data failed: ", error.message);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  const newTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/tables/new-table", table);
      const newData = [...tables, res.data.savedTable];
      const sortedTables = newData.sort(
        (a: { tableNo: number }, b: { tableNo: number }) =>
          a.tableNo - b.tableNo
      );
      setTables(sortedTables);
      toast.success("Table created successfully");
    } catch (error: any) {
      const errormsg = error.response.data.error;
      toast.error(errormsg);
    }
  };

  const handleUpdateTable = async (
    id: string,
    isVacant: boolean,
    orderValue: number
  ) => {
    try {
      // setUpdatingTable(true);
      const res = await axios.put("/api/tables/edit-table", {
        id: id,
        isVacant: isVacant,
        orderValue: orderValue,
      });
      res.status === 200 &&
        setTables(
          tables.map((table) => {
            if (table._id === id) {
              return {
                ...table,
                isVacant: isVacant,
                orderValue: orderValue,
              };
            }
            return table;
          })
        );
      // setUpdatingTable(false);
      console.log(res);
    } catch (error) {}
  };

  const handleDeleteTable = async (id: string) => {
    try {
      const res = await axios.delete("/api/tables/delete-table", {
        data: { id: id },
      });
      res.status === 200 &&
        setTables(tables.filter((table) => table._id !== id));
      toast.success("Table deleted successfully");
    } catch (error) {
      toast.error("Table has orders or is not vacant");
    }
  };
  return (
    <div className="border">
      <h1 className="text-center">Tables</h1>

      <div className="flex gap-3">
        <Dialog>
          <DialogTrigger className="text-red-500">
            Create New Table
          </DialogTrigger>
          <DialogContent className="max-w-[320px] top-[200px]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Create New Table
              </DialogTitle>
              <form
                onSubmit={newTable}
                className="grid w-full items-center gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="tableNo">Table No.</Label>
                  <Input
                    type="text"
                    id="tableNo"
                    placeholder="Enter Table No."
                    value={table.tableNo}
                    onChange={(e) => {
                      setTable({
                        ...table,
                        tableNo: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="newPassword">Table Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter Table Name"
                    value={table.tableName}
                    onChange={(e) => {
                      setTable({ ...table, tableName: e.target.value });
                    }}
                  />
                </div>
              </form>

              <div className="p-2 mt-8 flex gap-2 float-right justify-end">
                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button variant={"secondary"} color="red" onClick={newTable}>
                  {/* <CircularProgress size={16} className="mr-2" color="inherit" /> */}
                  Create Table
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Link href={"profile"}>Profile</Link>
      </div>

      {tableLoading || updatingTable ? (
        <div className="text-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="border grid grid-flow-row-dense grid-cols-5 grid-rows-3 p-6 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`${
                table.isVacant ? "bg-green-800" : "bg-red-800"
              } border  rounded-md max-w-[260px] p-3`}>
              <h1>{table._id}</h1>
              <h2>{table.tableName}</h2>
              <p>Table No: {table.tableNo}</p>
              <p>Order Value: {table.orderValue}</p>
              <p>Vacant: {table.isVacant ? "Yes" : "No"}</p>
              {table.isVacant ? (
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    handleUpdateTable(table._id, false, 3000);
                  }}>
                  Mark as Occupied
                </Button>
              ) : (
                <Button
                  className="bg-green-600 text-white"
                  variant={"secondary"}
                  onClick={() => {
                    handleUpdateTable(table._id, true, 0);
                  }}>
                  Mark as Complete
                </Button>
              )}
              <Button
                onClick={() => {
                  handleDeleteTable(table._id);
                }}>
                Delete Table
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
