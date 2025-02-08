import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ModeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent SSR flicker and hydration mismatch
    if (!mounted) {
        return <Button size="icon" />;
    }

    return (
        <Button size="icon" onClick={toggleTheme}>
            {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
};

export default ModeToggle;