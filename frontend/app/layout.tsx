import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'TODO-List | Gestão de Tarefas',
    description: 'Sistema completo para gerenciamento de tarefas e atividades.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <head>
                {/* Fontes Inter para visual corporativo */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased min-h-screen flex flex-col">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-grow pt-24 pb-12">
                        {children}
                    </main>
                    <Toaster position="bottom-right" theme="system" />
                </AuthProvider>
            </body>
        </html>
    );
}
