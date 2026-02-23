import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useAuthStore } from '../store/useAuthStore';
import { LoginModal } from './LoginModal';
import { supabase } from '../services/supabaseClient';
import { Menu as LucideMenu, Activity } from 'lucide-react';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const { isAuthenticated, user, clearSession } = useAuthStore();
    const menu = React.useRef<Menu>(null);
    const navigate = useNavigate();
    const [loginVisible, setLoginVisible] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        clearSession();
        navigate('/');
    };

    const menuItems: MenuItem[] = [
        {
            label: 'Navigation',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-home',
                    command: () => navigate('/home')
                },
                {
                    label: 'User Profile',
                    icon: 'pi pi-user',
                    command: () => navigate('/profile')
                },
                {
                    label: 'Health Journal',
                    icon: 'pi pi-book',
                    command: () => navigate('/journal')
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Account',
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    className: 'text-danger',
                    command: handleLogout
                }
            ]
        }
    ];

    return (
        <nav className="w-full bg-white shadow-1 px-4 py-3 flex align-items-center justify-content-between sticky top-0 z-5">
            {/* Left Section: Logo + Hamburger */}
            <div className="flex align-items-center gap-3 flex-1">
                <div className="flex align-items-center gap-2 cursor-pointer">
                    <div className="w-2rem h-2rem bg-primary border-round flex align-items-center justify-content-center shadow-2">
                        <Activity size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-900 hidden sm:block">VITAL</span>
                </div>
                <Menu model={menuItems} popup ref={menu} id="hamburger_menu" />
                <Button
                    icon={<LucideMenu size={20} />}
                    tooltip="Menu"
                    className="p-button-text p-button-plain p-button-sm ml-1"
                    onClick={(e) => menu.current?.toggle(e)}
                    aria-controls="hamburger_menu"
                    aria-haspopup
                />
            </div>

            {/* Center Section: Title */}
            <div className="flex-1 text-center">
                <span className="text-xl font-black text-primary tracking-tight whitespace-nowrap">
                    PROJECT VITAL
                </span>
            </div>

            {/* Right Section: Auth Controls */}
            <div className="flex align-items-center justify-content-end gap-3 flex-1">
                {isAuthenticated ? (
                    <div className="flex align-items-center gap-3">
                        <span className="hidden lg:inline text-sm text-600 font-medium">
                            {user?.email}
                        </span>
                        <Button
                            label="Logout"
                            icon="pi pi-sign-out"
                            className="p-button-sm p-button-outlined p-button-danger border-round-xl"
                            onClick={handleLogout}
                        />
                    </div>
                ) : (
                    <Button
                        label="Login"
                        icon="pi pi-sign-in"
                        className="p-button-sm border-round-xl px-4"
                        onClick={() => setLoginVisible(true)}
                    />
                )}
            </div>

            <LoginModal visible={loginVisible} onHide={() => setLoginVisible(false)} />
        </nav>
    );
};
