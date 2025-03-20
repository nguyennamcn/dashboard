"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import dayjs from "dayjs";
import { URL_BASE } from "@/config";

const statusMap = {
  pending: { label: "Pending", color: "warning" },
  delivered: { label: "Delivered", color: "success" },
  refunded: { label: "Refunded", color: "error" },
} as const;

export default function Page(): React.JSX.Element {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL_BASE}/order/search`, {
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
        setOrders(data.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = async (orderId) => {
    try {
      const response = await fetch(`${URL_BASE}/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("custom-auth-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.data)
      setSelectedOrder(data.data);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Orders</Typography>
      <Card>
        <CardHeader title="Orders" />
        <Divider />
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow hover key={order._id} onClick={() => handleRowClick(order._id)} sx={{ cursor: "pointer" }}>
                  <TableCell>{order._id.slice(0, 8)}</TableCell>
                  <TableCell>{order.userId.fullname}</TableCell>
                  <TableCell>{dayjs(order.createdAt).format("MMM D, YYYY")}</TableCell>
                  <TableCell>
                    {order.vaccines.map((vaccine, index) => (
                      <Chip key={index} color={statusMap[vaccine.status]?.color || "default"} label={statusMap[vaccine.status]?.label || "Unknown"} size="small" sx={{ marginRight: 1 }} />
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
      </Card>
      <Pagination count={5} shape="rounded" />

      {/* Order Detail Modal */}
      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            {selectedOrder ? (
              <>
                <Typography variant="h6" gutterBottom>Order Details</Typography>
                <Typography variant="body1">Order ID: {selectedOrder._id}</Typography>
                <Typography variant="body1">Customer: {selectedOrder.userId.fullname}</Typography>
                <Typography variant="body1">Email: {selectedOrder.userId.email}</Typography>
                <Typography variant="body1">Date: {dayjs(selectedOrder.createdAt).format("MMM D, YYYY")}</Typography>
                {selectedOrder.vaccines.map((vaccine, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body1">Vaccine Id: {vaccine.vaccineId}</Typography>
                    <Typography variant="body1">Dose Number: {vaccine.countDoseNumber}</Typography>
                    <Typography variant="body1">Next Scheduled Date: {dayjs(vaccine.nextScheduledDate).format("MMM D, YYYY")}</Typography>
                  </Box>
                ))}
                <Button onClick={() => setOpen(false)} sx={{ mt: 2 }} fullWidth variant="contained" color="primary">Close</Button>
              </>
            ) : (
              <Typography>Loading order details...</Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Stack>
  );
}