import { Head, Link, router, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import {
    FileText, Bell, FileCheck, FileMinus, Search, Download, Eye, Plus,
    Scale, AlertTriangle, Gavel, Handshake, Calendar, BadgeCheck, X,
    FileSignature, ClipboardCheck, UserPlus, Send, History, Trash2,
    ClipboardList, Briefcase, ShieldAlert, BadgeInfo, Edit
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    FileSignature,
    FileText,
    ClipboardList,
    Briefcase,
    ShieldAlert,
    BadgeInfo,
    Scale,
    Bell,
    Handshake,
    Gavel,
    AlertTriangle,
    FileMinus,
    Calendar,
    UserPlus,
    ClipboardCheck,
    Send,
    FileCheck
};
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

// ─── Template definitions (All 22 Templates) ──────────────────────────────────
const TEMPLATES = [
    { title: 'Complaint Form', description: 'KP Form No. 7 – Formal complaint filing', icon: FileText, type: 'complaint' },
    { title: 'Summons', description: 'KP Form No. 9 – Official notice to appear', icon: Bell, type: 'summons' },
    { title: 'Amicable Settlement', description: 'KP Form No. 16 – Agreement between parties', icon: Handshake, type: 'amicable_settlement' },
    { title: 'Affidavit of Withdrawal', description: 'Statement to withdraw complaint', icon: FileMinus, type: 'affidavit_withdrawal' },
    { title: 'Notice of Hearing (Conciliation)', description: 'Notice for Conciliation Proceedings', icon: Calendar, type: 'hearing_conciliation' },
    { title: 'Notice of Hearing (Mediation)', description: 'Notice for Mediation Proceedings', icon: Calendar, type: 'hearing_mediation' },
    { title: 'Notice of Hearing (Fail. to Appear)', description: 'Failure to appear at hearing', icon: Calendar, type: 'hearing_failure_appear' },
    { title: 'Notice of Hearing (Counterclaim)', description: 'Failure to appear – Counterclaim', icon: Calendar, type: 'hearing_failure_appear_counterclaim' },
    { title: 'Certificate to File Action', description: 'Authorization to file action', icon: Scale, type: 'cert_file_action' },
    { title: 'Certificate to File Action (Court)', description: 'Authorization for court filing', icon: Scale, type: 'cert_file_action_court' },
    { title: 'Certificate to Bar Action', description: 'Barring future action', icon: Gavel, type: 'cert_bar_action' },
    { title: 'Certificate to Bar Counterclaim', description: 'Barring future counterclaim', icon: Gavel, type: 'cert_bar_counterclaim' },
    { title: 'Motion for Execution', description: 'Request for enforcement of settlement/award', icon: FileSignature, type: 'motion_execution' },
    { title: 'Officers Return', description: 'Record of summons or notice service', icon: ClipboardCheck, type: 'officers_return' },
    { title: 'Letter of Demand', description: 'Formal demand for action or payment', icon: Send, type: 'letter_of_demand' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
const getTemplateTitle = (type: string) => {
    if (type === 'uploaded') return 'Uploaded Document';
    if (type === 'custom_form' || type === 'custom') return 'Custom Form';
    const template = TEMPLATES.find(t => t.type === type);
    return template ? template.title : type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

interface Document {
    id: number;
    type: string;
    status: string;
    date: string | null;
    case_id: number | null;
    case_number: string | null;
    creator: { name: string } | null;
}

interface CustomTemplate {
    id: number;
    title: string;
    description: string;
    type: string;
    icon_name?: string;
}

interface DocumentsProps {
    documents: Document[];
    stats: {
        total: number; complaints: number; summons: number;
        settlements: number; certificates: number; notices: number; others: number;
    };
    customTemplates: CustomTemplate[];
    hiddenTemplates: string[];
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Documents({ documents, stats, customTemplates, hiddenTemplates }: DocumentsProps) {
    const { auth } = usePage<SharedData>().props;
    const canEdit = auth.user.role !== 'Admin';

    // Search filters templates
    const [search, setSearch] = useState('');
    // Filter for recent docs table only
    const [docFilter, setDocFilter] = useState('all');

    const breadcrumbs = [{ title: 'Documents', href: '/documents' }];

    // Combine built-in with custom
    const allAvailableTemplates = useMemo(() => {
        const custom = (customTemplates ?? []).map(t => ({
            ...t,
            icon: ICON_MAP[t.icon_name || 'FileSignature'] || FileSignature,
            isCustom: true
        }));

        const standard = TEMPLATES
            .filter(t => !(hiddenTemplates ?? []).includes(t.type))
            .map(t => ({ ...t, isCustom: false, id: 0 }));

        return [...standard, ...custom];
    }, [customTemplates, hiddenTemplates]);

    // ── Filter templates by search query ─────────────────────────────────────
    const filteredTemplates = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allAvailableTemplates;
        return allAvailableTemplates.filter(t =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.type.toLowerCase().includes(q)
        );
    }, [search, allAvailableTemplates]);

    // ── Filter recent documents by type dropdown and search ──────────────────────
    const filteredDocs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (documents ?? []).filter(doc => {
            const matchesType = docFilter === 'all' || doc.type === docFilter;
            const title = getTemplateTitle(doc.type).toLowerCase();
            const caseNum = (doc.case_number ?? '').toLowerCase();
            const creator = (doc.creator?.name ?? '').toLowerCase();
            const matchesSearch = !q || title.includes(q) || caseNum.includes(q) || creator.includes(q);
            return matchesType && matchesSearch;
        });
    }, [documents, docFilter, search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />

            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">

                {/* ── Page Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Document Management</h2>
                        <p className="text-muted-foreground">Search and generate official Lupon documents</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search — filters template cards */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="template-search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search templates…"
                                className="h-9 w-[220px] pl-8 pr-8"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {/* Add Document → dedicated page */}
                        {canEdit && (
                            <Link href="/documents/new">
                                <Button id="add-document-btn" className="h-9 bg-[#dd8b11] hover:bg-[#c47c0f] text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Document
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total Documents', value: stats.total, sub: 'All generated forms', icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
                        { label: 'Summons Issued', value: stats.summons, sub: 'Official summons generated', icon: <Bell className="h-4 w-4 text-muted-foreground" /> },
                        { label: 'Settlements', value: stats.settlements, sub: 'Agreements & awards', icon: <FileCheck className="h-4 w-4 text-muted-foreground" /> },
                        { label: 'Certificates', value: stats.certificates, sub: 'Certificates to file/bar action', icon: <BadgeCheck className="h-4 w-4 text-muted-foreground" /> },
                    ].map(s => (
                        <Card key={s.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                                {s.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <p className="text-xs text-muted-foreground">{s.sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Document Templates ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <CardTitle>Document Templates</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {search
                                        ? `${filteredTemplates.length} of ${allAvailableTemplates.length} templates matching "${search}"`
                                        : `Choose from all ${allAvailableTemplates.length} official Lupon forms`}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredTemplates.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                <FileText className="h-10 w-10 mb-3 text-[#dd8b11]" />
                                <p className="font-medium text-sm">No templates match "{search}"</p>
                                <button
                                    onClick={() => setSearch('')}
                                    className="text-xs mt-2 text-primary underline-offset-2 hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredTemplates.map((template, idx) => {
                                    const fillHref = template.isCustom ? `/documents/fill-custom/${template.id}` : `/documents/create/${template.type}`;
                                    const editHref = template.isCustom ? `/documents/edit-template/${template.id}` : `/documents/edit-standard/${template.type}`;

                                    return (
                                        <div
                                            key={template.isCustom ? `custom-${template.id}` : template.type}
                                            onClick={() => {
                                                if (!canEdit) {
                                                    // Admin role: redirect to Case Management with the specific filter
                                                    const natureFilter = template.isCustom ? template.title : template.description;
                                                    router.visit(`/cases?nature=${encodeURIComponent(natureFilter)}`);
                                                } else {
                                                    // Encoder role: open fill-out form in new tab
                                                    window.open(fillHref, '_blank');
                                                }
                                            }}
                                            className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:border-[#dd8b11]/30 hover:bg-[#dd8b11]/5 dark:hover:bg-[#dd8b11]/10 transition-all group cursor-pointer relative shadow-sm hover:shadow-md"
                                        >
                                            <div className="p-2 bg-[#dd8b11] rounded-lg mt-1 flex-shrink-0 group-hover:bg-[#cb7d0f] transition-colors">
                                                <template.icon className="h-4 w-4 text-white dark:text-black stroke-[2]" />
                                            </div>
                                            <div className="flex-1 space-y-1 pr-6">
                                                <p className="text-sm font-semibold leading-none group-hover:text-[#dd8b11] transition-colors">{template.title}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                                            </div>

                                            {canEdit && (
                                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                    <a
                                                        href={fillHref}
                                                        target="_blank"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center justify-center rounded bg-[#dd8b11] text-white px-2.5 py-1 text-[10px] font-semibold tracking-wide hover:bg-[#c47c0f] transition-colors uppercase mr-1"
                                                        title="Fill Out Form"
                                                    >
                                                        Fill Out
                                                    </a>
                                                    <a
                                                        href={editHref}
                                                        onClick={e => e.stopPropagation()}
                                                        className="inline-flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                                        title="Word Editor"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </a>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const msg = template.isCustom
                                                                ? 'Are you sure you want to delete this custom template?'
                                                                : 'Are you sure you want to remove this standard template from the list?';

                                                            if (confirm(msg)) {
                                                                const url = `/documents/delete/${template.id || 0}`;
                                                                const data = !template.isCustom ? { document_type: template.type } : {};
                                                                router.post(url, data);
                                                            }
                                                        }}
                                                        className="inline-flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        title="Delete Template"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Recent Documents ── */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                        <div>
                            <CardTitle>Recent Documents</CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Documents generated or uploaded via this system
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <select
                                id="doc-filter-type"
                                value={docFilter}
                                onChange={e => setDocFilter(e.target.value)}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring max-w-[200px]"
                            >
                                <option value="all">All Types</option>
                                <optgroup label="Standard Forms">
                                    {TEMPLATES.map(t => (
                                        <option key={t.type} value={t.type}>{t.title}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Other">
                                    <option value="custom_form">Custom Form</option>
                                    <option value="uploaded">Uploaded</option>
                                </optgroup>
                            </select>
                            {docFilter !== 'all' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 text-xs"
                                    onClick={() => setDocFilter('all')}
                                >
                                    <X className="h-3 w-3 mr-1" /> Clear
                                </Button>
                            )}
                            {canEdit && (
                                <Link href="/documents/new">
                                    <Button className="h-9 bg-[#dd8b11] hover:bg-[#c47c0f] text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Document
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Document Type</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Case No.</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Encoded By</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocs.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                                                <History className="h-8 w-8 mx-auto mb-2 text-[#dd8b11]" />
                                                {docFilter !== 'all'
                                                    ? `No documents of type "${docFilter}".`
                                                    : (
                                                        <span>
                                                            No documents yet.{' '}
                                                            <Link href="/documents/new" className="text-primary underline-offset-2 hover:underline">
                                                                Add one
                                                            </Link>
                                                            {' '}or fill out a template above.
                                                        </span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDocs.map(doc => (
                                            <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-[#dd8b11] rounded-lg flex-shrink-0">
                                                            <FileText className="h-4 w-4 text-white dark:text-black stroke-[2]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-xs">{getTemplateTitle(doc.type)}</span>
                                                            <span className="text-[10px] text-muted-foreground uppercase opacity-70">
                                                                {doc.type.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                                    {doc.case_number ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {doc.creator ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#dd8b11] flex-shrink-0">
                                                                <span className="text-[10px] font-medium text-white dark:text-black">
                                                                    {doc.creator.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm">{doc.creator.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline">{doc.status}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground text-sm">
                                                    {doc.date ? new Date(doc.date).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2">
                                                        <a
                                                            href={`/documents/view/${doc.id}`}
                                                            target="_blank"
                                                            title="View Document"
                                                            className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-[#dd8b11] transition-colors text-muted-foreground hover:text-white"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                        <button
                                                            disabled
                                                            title="Download (coming soon)"
                                                            className="inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground/30 cursor-not-allowed"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                        {canEdit && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (confirm('Are you sure you want to delete this document?')) {
                                                                        router.post(`/documents/delete/${doc.id}`);
                                                                    }
                                                                }}
                                                                title="Delete Document"
                                                                className="inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
                            {docFilter !== 'all' && ` (filtered by type: ${docFilter})`}
                        </p>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
