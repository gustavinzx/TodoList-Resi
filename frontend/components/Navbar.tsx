'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut, CheckSquare, Shield } from 'lucide-react';

export default function Navbar() {
    const { user, token, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (pathname === '/login' || pathname === '/cadastro') return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <Link href="/" className="text-xl font-bold tracking-tight">
                            Todo-List<span className="text-blue-600 dark:text-blue-400">.</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {token ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">
                                    Minhas Tarefas
                                </Link>
                                {user?.perfil === 'admin' && (
                                    <Link href="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1">
                                        <Shield className="w-4 h-4" /> Admin
                                    </Link>
                                )}
                                <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium">
                                    <LogOut className="w-4 h-4" /> Sair
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium hover:text-blue-600">
                                    Entrar
                                </Link>
                                <Link href="/cadastro" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Cadastre-se
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden glass border-b">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {token ? (
                            <>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Minhas Tarefas
                                </Link>
                                {user?.perfil === 'admin' && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Admin Panel
                                    </Link>
                                )}
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                                    Entrar
                                </Link>
                                <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                                    Cadastre-se
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
