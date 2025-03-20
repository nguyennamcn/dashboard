"use client";

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config, URL_BASE } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';


export default function Page(): React.JSX.Element {
  const [orders, setOrders] = React.useState([]);
  const [user, setUser] = React.useState([]);
  const [vaccine, setVaccine] = React.useState([]);
  const [od, setOd] = React.useState([]);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("custom-auth-token");
        const response = await fetch(`${URL_BASE}/vaccine/search`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.data.data.length);
        setVaccine(data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
  

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("custom-auth-token");
        const response = await fetch(`${URL_BASE}/user/search`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setUser(data.data.data.length);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchUser();
  }, []);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("custom-auth-token");
        const response = await fetch(`${URL_BASE}/order/search`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data.data.data)
        setOd(data.data.data)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrder();
  }, []);




  return (
    <Grid container spacing={3}>
      <Grid lg={4} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value={orders} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={user} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={80} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[20, 26, 54]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          
          products={[
            vaccine.data
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            od
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
