import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

const Analytics = () => {
    const [stockData, setStockData] = useState([]);
    const [latestPrice, setLatestPrice] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get("https://api.example.com/stock-data");
                setStockData(response.data);
                setLatestPrice(response.data[response.data.length - 1].price);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchStockData();
        const interval = setInterval(fetchStockData, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Stock Market Analytics</h2>
            <div className="mb-4">
                <span className="text-lg font-semibold">Latest Price: </span>
                <span className="text-green-500">${latestPrice}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockData}>
                    <XAxis dataKey="time" stroke="#8884d8"/>
                    <YAxis stroke="#8884d8" />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Analytics;
