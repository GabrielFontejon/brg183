import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    Clock,
    CheckCircle,
    Users,
    Download,
    Calendar
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Legend 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface AnalyticsProps {
    stats: {
        growth_rate: number;
        avg_resolution_time: number;
        settlement_rate: number;
        active_cases: number;
    };
    monthlyTrends: Array<{ name: string; total: number }>;
    typeDistribution: Array<{ name: string; value: number }>;
    outcomeDistribution: Array<{ name: string; value: number }>;
    totalCases: number;
}

const COLORS = ['#1c2434', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

export default function Analytics({ stats, monthlyTrends, typeDistribution, outcomeDistribution, totalCases }: AnalyticsProps) {
    const breadcrumbs = [
        {
            title: 'Analytics',
            href: '/analytics',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 text-slate-900 dark:text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Analytics & Insights</h2>
                        <p className="text-muted-foreground">
                            Data trends and case statistics
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800">
                                <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </div>
                            <Badge variant="secondary" className={`${stats.growth_rate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} dark:bg-slate-800`}>
                                {stats.growth_rate >= 0 ? '+' : ''}{stats.growth_rate}%
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium text-muted-foreground">Case Growth Rate</div>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.growth_rate}%</div>
                            <p className="text-xs text-muted-foreground">vs previous month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800">
                                <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium text-muted-foreground">Avg Resolution Time</div>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.avg_resolution_time} days</div>
                            <p className="text-xs text-muted-foreground">average processing speed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800">
                                <CheckCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium text-muted-foreground">Settlement Rate</div>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.settlement_rate}%</div>
                            <p className="text-xs text-muted-foreground">success in mediation</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800">
                                <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium text-muted-foreground">Active Cases</div>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.active_cases}</div>
                            <p className="text-xs text-muted-foreground">currently pending</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Area 1 */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Monthly Case Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Bar dataKey="total" fill="#1c2434" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Case Outcome Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={outcomeDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {outcomeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Case Categories Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Case Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {typeDistribution.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">No data available</div>
                        ) : (
                            typeDistribution.map((stat, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{stat.name}</span>
                                        <span className="text-muted-foreground text-xs">
                                            <strong className="text-[#1c2434] dark:text-white">{stat.value} cases</strong> 
                                            ({totalCases > 0 ? round((stat.value / totalCases) * 100, 1) : 0}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#1c2434] rounded-full" 
                                            style={{ width: `${totalCases > 0 ? (stat.value / totalCases) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
