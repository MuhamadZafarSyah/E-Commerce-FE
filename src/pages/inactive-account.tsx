import createInstance from '@/axios/instance';
import ModeToggle from '@/components/ModeToggle';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from '@/store/useAuthStore';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const InactiveAccount = () => {
    const router = useRouter();

    const handleLogout = async () => {
        // Hapus cookie dan redirect ke login
        await createInstance().post('/logout');
        useAuthStore.getState().logout();


        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className='absolute top-4 right-4'>
                <ModeToggle />

            </div>

            <Card className="w-full max-w-md">
                <CardHeader className="pb-2">
                    <CardTitle className="flex flex-col items-center gap-4 text-yellow-600">
                        <AlertCircle className="h-20 w-20" />
                        Account Inactive
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="md:text-lg text-base">
                        I'm sorry, your account is inactive. Please contact the administrator if this is a mistake.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleLogout} className="w-full">
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default InactiveAccount;