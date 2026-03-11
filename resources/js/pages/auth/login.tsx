import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { ShieldAlert, Database, Eye, EyeOff } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [role, setRole] = useState('Admin');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout
            title={`Log in as ${role}`}
            description="Enter your email and password below to log in"
        >
            <Head title={`Log in - ${role}`} />

            {/* Role Selection Tabs */}
            <div className="flex bg-muted p-1 rounded-xl mb-6 shadow-inner">
                <button
                    type="button"
                    onClick={() => setRole('Admin')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'Admin'
                        ? 'bg-white dark:bg-slate-800 text-[#dd8b11] shadow-sm ring-1 ring-black/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50'
                        }`}
                >
                    <ShieldAlert className="h-4 w-4" />
                    Administrator
                </button>
                <button
                    type="button"
                    onClick={() => setRole('Encoder')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'Encoder'
                        ? 'bg-white dark:bg-slate-800 text-[#dd8b11] shadow-sm ring-1 ring-black/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50'
                        }`}
                >
                    <Database className="h-4 w-4" />
                    Data Encoder
                </button>
            </div>

            {/* Example Credentials */}
            <div className="bg-blue-50 dark:bg-slate-800/50 p-3 rounded-lg border border-blue-100 dark:border-slate-800 text-sm mb-6 flex items-start gap-2 text-blue-800 dark:text-blue-300">
                <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <span className="font-semibold block mb-0.5">Example Credentials ({role})</span>
                    Email: <span className="font-mono bg-white/50 dark:bg-black/50 px-1 rounded">{role === 'Admin' ? 'admin@gmail.com' : 'encoder@gmail.com'}</span>
                    <br />
                    Password: <span className="font-mono bg-white/50 dark:bg-black/50 px-1 rounded">12345</span>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="role" value={role} />

                        {(errors as any).role && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 shadow-sm flex items-start gap-2">
                                <ShieldAlert className="h-4 w-4 mt-0.5" />
                                <span>{(errors as any).role}</span>
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address / Username</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    value="true"
                                    tabIndex={3}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="remember" className="cursor-pointer">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-[#dd8b11] text-white hover:bg-[#c47c0f]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>



                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Need Access? Contact your barangay administrator to request login credentials
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
