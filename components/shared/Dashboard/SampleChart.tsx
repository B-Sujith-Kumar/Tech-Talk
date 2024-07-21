"use client"
import { getPosts } from '@/lib/actions/post.action';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const PostChart = ({ period, currentUser } : {period : string, currentUser: string}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data  = await getPosts(currentUser);

            const postsByDate = data.reduce((acc, post) => {
                let date;
                if (period === 'daily') {
                    date = new Date(post.createdAt).toLocaleDateString();
                } else if (period === 'weekly') {
                    const d = new Date(post.createdAt);
                    const week = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
                    date = week;
                } else if (period === 'monthly') {
                    date = new Date(post.createdAt).toLocaleDateString('default', { year: 'numeric', month: 'long' });
                }
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            const formattedData = Object.entries(postsByDate).map(([date, count]) => ({ date, count }));
            setChartData(formattedData);
        };

        fetchData();
    }, [period]);

    return (
        <div>
            <h2>Number of Posts Created Over Time ({period})</h2>
            <LineChart width={800} height={400} data={chartData}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    );
};

export default PostChart;
