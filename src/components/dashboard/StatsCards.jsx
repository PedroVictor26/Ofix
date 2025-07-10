import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards({ title, value, icon: Icon, gradient }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div className={`absolute top-0 right-0 w-20 h-20 transform translate-x-6 -translate-y-6 bg-gradient-to-r ${gradient} rounded-full opacity-10`} />
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20`}>
                            <Icon className={`w-5 h-5 text-white`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export const StatsCardSkeleton = () => {
    return (
        <Card className="animate-pulse">
            <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
            </CardContent>
        </Card>
    );
};