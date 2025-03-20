"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { Download as DownloadIcon } from "@phosphor-icons/react/dist/ssr/Download";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { CustomersFilters } from "@/components/dashboard/customer/customers-filters";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";
import type { Customer } from "@/components/dashboard/customer/customers-table";
import { URL_BASE } from "@/config";

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editCustomer, setEditCustomer] = React.useState<Customer | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  // 🛠 Fetch danh sách vaccine từ API khi trang load
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL_BASE}/vaccine/search`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("custom-auth-token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }


        const data = await response.json();
        setCustomers(data.data.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🛠 Khi nhấn "Edit", mở modal với dữ liệu vaccine theo ID
  const handleEdit = async (id: string) => {
    try {
      const token = localStorage.getItem("custom-auth-token");
      const response = await fetch(`${URL_BASE}/vaccine/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }

      const data = await response.json();
      setEditCustomer(data.data);

      setIsEditing(true);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  // 🛠 Xóa vaccine theo ID
  const handleDelete = async (id: string) => {
    console.log(id)
    try {
      const token = localStorage.getItem("custom-auth-token");
      const response = await fetch(`${URL_BASE}/vaccine/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      window.location.reload()
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // 🛠 Mở modal để thêm mới vaccine
  const handleOpen = () => {
    setEditCustomer({
      name: "",
      diseasePrevention: "",
      price: 0,
      img: "",
      dosageRegimen: {
        doses: 1, // Mặc định là 1 liều
        intervals: [], // Mặc định là mảng rỗng
      },
    });
    setIsEditing(false);
    setOpen(true);
  };

  // 🛠 Đóng modal
  const handleClose = () => setOpen(false);

  // 🛠 Cập nhật dữ liệu khi nhập vào form
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEditCustomer((prev) => {
      if (!prev) return prev;

      if (name === "doses") {
        return {
          ...prev,
          dosageRegimen: {
            ...prev.dosageRegimen,
            doses: Number(value), // Chuyển thành số
          },
        };
      }

      if (name === "intervals") {
        return {
          ...prev,
          dosageRegimen: {
            ...prev.dosageRegimen,
            intervals: value.split(",").map((interval) => interval.trim()), // Chuyển thành mảng
          },
        };
      }

      return { ...prev, [name]: value };
    });
  };

  // 🛠 Gửi dữ liệu lên API khi bấm "Save"
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("custom-auth-token");
      const url = isEditing
        ? `${URL_BASE}/vaccine/${editCustomer?._id}`
        : `${URL_BASE}/vaccine`;
      const method = isEditing ? "PUT" : "POST";

      const data = {
        img: editCustomer?.img,
        name: editCustomer?.name,
        price: editCustomer?.price,
        diseasePrevention: editCustomer?.diseasePrevention,
        dosageRegimen: {
          doses: editCustomer?.dosageRegimen?.doses ?? 1,
          intervals: editCustomer?.dosageRegimen?.intervals ?? [],
        },
      };

      console.log(data); // Kiểm tra dữ liệu trước khi gửi

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update customer" : "Failed to add customer");
      }

      const savedCustomer = await response.json();

      if (isEditing) {
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === savedCustomer.data.id ? savedCustomer.data : customer
          )
        );
      } else {
        setCustomers([...customers, savedCustomer.data]);
      }
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error(isEditing ? "Error updating customer:" : "Error adding customer:", error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">Vaccines</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpen}
          >
            Add
          </Button>
        </div>
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CustomersTable onEdit={handleEdit} onDelete={handleDelete} count={customers.length} page={0} rows={customers} rowsPerPage={5} />
        </>
      )}

      {/* Modal thêm / chỉnh sửa vaccine */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Name" name="name" fullWidth value={editCustomer?.name || ""} onChange={handleChange} />
            <TextField label="Disease Prevention" name="diseasePrevention" fullWidth value={editCustomer?.diseasePrevention || ""} onChange={handleChange} />
            <TextField label="Price" name="price" fullWidth type="number" value={editCustomer?.price || ""} onChange={handleChange} />
            <TextField label="Image URL" name="img" fullWidth value={editCustomer?.img || ""} onChange={handleChange} />

            {editCustomer?.img && <Avatar src={editCustomer.img} sx={{ width: 56, height: 56 }} />}

            {/* 🆕 Thêm trường số liều (doses) */}
            <TextField label="Number of Doses" name="doses" type="number" fullWidth value={editCustomer?.dosageRegimen?.doses || 1} onChange={handleChange} />

            {/* 🆕 Thêm trường khoảng cách giữa các liều (intervals) */}
            <TextField
              label="Intervals (comma-separated)"
              name="intervals"
              fullWidth
              placeholder="E.g. 3 days, 7 days"
              value={editCustomer?.dosageRegimen?.intervals?.join(", ") || ""}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
