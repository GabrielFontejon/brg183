import { Head } from '@inertiajs/react';
import {
    Trophy,
    Medal,
    Calendar,
    Star,
    Users,
    CheckCircle,
    TrendingUp,
    Download,
    FileText,
    Heart,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    Eye
} from 'lucide-react';
import { SubmitApplicationDialog } from '@/components/ltia/submit-application-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';

interface Award {
    year: string;
    category: string;
    recipient: string;
    position: string;
    achievement: string;
    status: string;
}

interface LTIAProps {
    stats: {
        completion_rate: number;
        nominees: number;
        total_awards: number;
        days_remaining: number;
    };
    metrics: {
        resolution_rate: number;
        settlement_success: number;
        community_satisfaction: number;
        timely_resolution: number;
        documentation_quality: number;
    };
    awardHistory: Award[];
}

export default function LTIAPage({ stats, metrics, awardHistory }: LTIAProps) {
    const breadcrumbs = [
        {
            title: 'LTIA',
            href: '/ltia',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LTIA" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 text-slate-900 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Lupong Tagapamayapa Incentives Awards (LTIA)</h2>
                        <p className="text-muted-foreground">
                            Recognition and incentives program for outstanding performance
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="h-9">
                            <Download className="mr-2 h-4 w-4" />
                            Download Guidelines
                        </Button>
                        <SubmitApplicationDialog />
                    </div>
                </div>

                {/* KPI Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-[#dd8b11] rounded-lg">
                                <Trophy className="h-4 w-4 text-white dark:text-black stroke-[2.5]" />
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                                {new Date().getFullYear()}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.total_awards}</div>
                            <p className="text-xs text-muted-foreground">Total Awards</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-[#dd8b11] rounded-lg">
                                <Users className="h-4 w-4 text-white dark:text-black stroke-[2.5]" />
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                Active
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.nominees}</div>
                            <p className="text-xs text-muted-foreground">Nominees</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-[#dd8b11] rounded-lg">
                                <Calendar className="h-4 w-4 text-white dark:text-black stroke-[2.5]" />
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Deadline
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.days_remaining}</div>
                            <p className="text-xs text-muted-foreground">Days Remaining</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="p-2 bg-[#dd8b11] rounded-lg">
                                <Star className="h-4 w-4 text-white dark:text-black stroke-[2.5]" />
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                                Status
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#1c2434] dark:text-white">{stats.completion_rate}%</div>
                            <p className="text-xs text-muted-foreground">Completion Rate</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Award Categories */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Award Categories</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Summary metrics for categories instead of just static cards */}
                        <Card className="bg-slate-50 border-none shadow-none dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Settlement Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.settlement_success}%</div>
                                <Progress value={metrics.settlement_success} className="h-1 mt-2" />
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-none shadow-none dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Timely Resolution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.timely_resolution}%</div>
                                <Progress value={metrics.timely_resolution} className="h-1 mt-2" />
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-none shadow-none dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Documentation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.documentation_quality}%</div>
                                <Progress value={metrics.documentation_quality} className="h-1 mt-2" />
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-none shadow-none dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Satisfaction</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.community_satisfaction}%</div>
                                <Progress value={metrics.community_satisfaction} className="h-1 mt-2" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Metrics & Timeline Grid */}
                <div className="grid gap-6 md:grid-cols-7">
                    {/* Performance Metrics */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Case Resolution Rate</span>
                                    <span className="font-bold">{metrics.resolution_rate}%</span>
                                </div>
                                <Progress value={metrics.resolution_rate} className="h-3" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Settlement Success</span>
                                    <span className="font-bold">{metrics.settlement_success}%</span>
                                </div>
                                <Progress value={metrics.settlement_success} className="h-3" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Community Satisfaction</span>
                                    <span className="font-bold">{metrics.community_satisfaction}%</span>
                                </div>
                                <Progress value={metrics.community_satisfaction} className="h-3" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Timely Resolution (15 days)</span>
                                    <span className="font-bold">{metrics.timely_resolution}%</span>
                                </div>
                                <Progress value={metrics.timely_resolution} className="h-3" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Documentation Quality</span>
                                    <span className="font-bold">{metrics.documentation_quality}%</span>
                                </div>
                                <Progress value={metrics.documentation_quality} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c2434] text-white text-xs font-bold">1</div>
                                        <div className="h-full w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                                    </div>
                                    <div className="space-y-1 pb-4">
                                        <h4 className="text-sm font-semibold">Nomination Period</h4>
                                        <p className="text-xs text-muted-foreground">January 1 - February 28, 2025</p>
                                        <Progress value={100} className="h-1.5 w-full mt-2" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">2</div>
                                        <div className="h-full w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                                    </div>
                                    <div className="space-y-1 pb-4">
                                        <h4 className="text-sm font-semibold">Evaluation Period</h4>
                                        <p className="text-xs text-muted-foreground">March 1 - March 31, 2025</p>
                                        <Progress value={0} className="h-1.5 w-full mt-2" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">3</div>
                                        <div className="h-full w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                                    </div>
                                    <div className="space-y-1 pb-4">
                                        <h4 className="text-sm font-semibold">Deliberation</h4>
                                        <p className="text-xs text-muted-foreground">April 1 - April 15, 2025</p>
                                        <Progress value={0} className="h-1.5 w-full mt-2" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold dark:bg-slate-800 dark:text-slate-400">4</div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">Awarding Ceremony</h4>
                                        <p className="text-xs text-muted-foreground">April 30, 2025</p>
                                        <Progress value={0} className="h-1.5 w-full mt-2" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Award History Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Award History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase border-b">
                                    <tr>
                                        <th className="py-3 px-4 font-medium">Year</th>
                                        <th className="py-3 px-4 font-medium">Award Category</th>
                                        <th className="py-3 px-4 font-medium">Recipient</th>
                                        <th className="py-3 px-4 font-medium">Position</th>
                                        <th className="py-3 px-4 font-medium">Achievement</th>
                                        <th className="py-3 px-4 font-medium">Status</th>
                                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {awardHistory.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                            <td className="py-3 px-4 font-medium">{item.year}</td>
                                            <td className="py-3 px-4">{item.category}</td>
                                            <td className="py-3 px-4 flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                                                {item.recipient}
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">{item.position}</td>
                                            <td className="py-3 px-4 text-muted-foreground truncate max-w-[300px]">{item.achievement}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
