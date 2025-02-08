"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, BarChart2, DollarSign, Activity } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import createInstance from "@/axios/instance"
import AdminLayout from "@/components/layouts/admin"
import { toRupiah } from "@/utils/toRupiah"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatData {
    basic_stats: {
        total_users: number
        total_products: number
        total_orders: number
        total_order_items: number
        total_revenue: number
        average_order_value: number
    }
    monthly_revenue: Array<{
        month: string
        revenue: number
        order_count: number
    }>
    top_products: Array<{
        name: string
        total_quantity: number
        total_revenue: number
    }>
    order_status: Array<{
        status: string
        count: number
        total_amount: number
    }>
    user_registrations: Array<{
        month: string
        count: number
    }>
    product_categories: Array<{
        category: string
        count: number
    }>
}

export default function StatOverview() {
    const { data, isSuccess, isLoading } = useQuery<StatData>({
        queryKey: ["statistics"],
        queryFn: async () => {
            const response = await createInstance().get("/statistics");
            return response.data.data;
        },
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Statistics Overview</h1>

                {/* Basic Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "0ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : data?.basic_stats.total_users}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "100ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : data?.basic_stats.total_products}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : data?.basic_stats.total_orders}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : data?.basic_stats.total_order_items}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "400ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : toRupiah(data?.basic_stats.total_revenue || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`overflow-hidden transition-all duration-300 ${isSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                        style={{ transitionDelay: "500ms" }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? "-" : toRupiah(data?.basic_stats.average_order_value || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                {isSuccess && data && (
                    <>
                        {/* Monthly Revenue Chart */}
                        <Card className="p-6">
                            <CardHeader>
                                <CardTitle>Monthly Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.monthly_revenue}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => toRupiah(value as number)} />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                                            <Line type="monotone" dataKey="order_count" stroke="#82ca9d" name="Order Count" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Products and Order Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>Top Selling Products</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data.top_products}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="total_quantity" fill="#8884d8" name="Quantity Sold" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>Order Status Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data.order_status}
                                                    dataKey="count"
                                                    nameKey="status"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    label
                                                />
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Registrations and Product Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>User Registration Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data.user_registrations}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="New Users" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="p-6">
                                <CardHeader>
                                    <CardTitle>Product Categories Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data.product_categories}
                                                    dataKey="count"
                                                    nameKey="category"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#82ca9d"
                                                    label
                                                />
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}