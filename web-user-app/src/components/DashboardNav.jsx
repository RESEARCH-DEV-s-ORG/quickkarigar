import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ─── Icons (inline SVG to avoid extra deps) ───────────────────────────────────
const Icon = ({ name, size = 22, color = "currentColor" }) => {
    const icons = {
        home: (
            <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
        ),
        bookings: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
            </>
        ),
        messages: (
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        ),
        profile: (
            <>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </>
        ),
        nearby: (
            <>
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
            </>
        ),
        reviews: (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        ),
        bell: (
            <>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </>
        ),
        settings: (
            <>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </>
        ),
        tool: (
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        ),
        menu: (
            <path d="M3 12h18M3 6h18M3 18h18" />
        ),
        close: (
            <path d="M18 6L6 18M6 6l12 12" />
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {icons[name]}
        </svg>
    );
};

// ─── Nav Items Config ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { key: "home",     label: "Home",     icon: "home",     path: "/",          badge: null },
    { key: "bookings", label: "Bookings", icon: "bookings", path: "/bookings",  badge: null },
    { key: "messages", label: "Messages", icon: "messages", path: "/messages",  badge: 3    },
    // { key: "nearby",   label: "Nearby",   icon: "nearby",   path: "/nearby",    badge: null },
    { key: "profile",  label: "Profile",  icon: "profile",  path: "/profile",   badge: null },
];

// ─── Brand Color ───────────────────────────────────────────────────────────────
const BRAND = "#232b9c";
const BRAND_BG = "#232b9c18";
const BRAND_LIGHT = "#232b9c0d";

// ─── Mobile Bottom Tab Bar ────────────────────────────────────────────────────
export function MobileTabBar({ activePath, onNavigate, user }) {
    // Show only 4 items on mobile
    const mobileItems = NAV_ITEMS.filter((i) =>
        ["home", "bookings", "messages", "profile"].includes(i.key)
    );

    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: "rgba(247,248,251,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: "0.5px solid rgba(0,0,0,0.08)",
                padding: "10px 8px calc(10px + env(safe-area-inset-bottom))",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                gap: 4,
            }}
        >
            {mobileItems.map((item) => {
                const active = activePath === item.path;
                return (
                    <button
                        key={item.key}
                        onClick={() => onNavigate(item.path)}
                        aria-label={item.label}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                            padding: "8px 18px",
                            borderRadius: 16,
                            background: active ? BRAND_BG : "transparent",
                            border: "none",
                            cursor: "pointer",
                            minWidth: 64,
                            transition: "background 0.2s ease",
                            position: "relative",
                        }}
                    >
                        {/* Badge */}
                        {item.badge && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: 6,
                                    right: 14,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    background: BRAND,
                                    color: "#fff",
                                    fontSize: 9,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #f7f8fb",
                                }}
                            >
                {item.badge}
              </span>
                        )}

                        <Icon
                            name={item.icon}
                            size={22}
                            color={active ? BRAND : "#9a9aa8"}
                        />
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: active ? 600 : 500,
                                color: active ? BRAND : "#9a9aa8",
                                letterSpacing: "0.01em",
                                transition: "color 0.2s ease",
                            }}
                        >
              {item.label}
            </span>
                    </button>
                );
            })}
        </nav>
    );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
export function DesktopSidebar({ activePath, onNavigate, user }) {
    return (
        <aside
            style={{
                width: 240,
                minHeight: "100vh",
                background: "#f7f8fb",
                borderRight: "0.5px solid rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
                padding: "20px 12px",
                gap: 4,
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: BRAND,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Icon name="tool" size={18} color="#fff" />
                </div>
                <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#07102b", margin: 0, letterSpacing: "-0.3px" }}>
                        QuickKarigar
                    </p>
                    <p style={{ fontSize: 11, color: "#9a9aa8", margin: 0 }}>Dashboard</p>
                </div>
            </div>

            {/* Nav items */}
            {NAV_ITEMS.map((item) => {
                const active = activePath === item.path;
                return (
                    <button
                        key={item.key}
                        onClick={() => onNavigate(item.path)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: active ? BRAND_BG : "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                            transition: "background 0.15s ease",
                            position: "relative",
                        }}
                        onMouseEnter={(e) => {
                            if (!active) e.currentTarget.style.background = BRAND_LIGHT;
                        }}
                        onMouseLeave={(e) => {
                            if (!active) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <Icon name={item.icon} size={20} color={active ? BRAND : "#9a9aa8"} />
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: active ? 600 : 500,
                                color: active ? BRAND : "#5a5a6a",
                                flex: 1,
                            }}
                        >
              {item.label}
            </span>
                        {item.badge && (
                            <span
                                style={{
                                    background: BRAND,
                                    color: "#fff",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    borderRadius: 8,
                                    padding: "2px 7px",
                                    minWidth: 20,
                                    textAlign: "center",
                                }}
                            >
                {item.badge}
              </span>
                        )}
                    </button>
                );
            })}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User card */}
            <div
                style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "#ececef",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 8,
                }}
            >
                {user?.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                ) : (
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: BRAND,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                            flexShrink: 0,
                        }}
                    >
                        {user?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("") || "U"}
                    </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#07102b",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {user?.fullName || "User"}
                    </p>
                    <p style={{ fontSize: 11, color: "#9a9aa8", margin: 0, textTransform: "capitalize" }}>
                        {user?.role || "customer"}
                    </p>
                </div>
                <button
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, color: "#9a9aa8" }}
                    onClick={() => onNavigate("/settings")}
                    aria-label="Settings"
                >
                    <Icon name="settings" size={16} color="#9a9aa8" />
                </button>
            </div>
        </aside>
    );
}

// ─── Desktop Top Navbar ───────────────────────────────────────────────────────
export function DesktopTopNav({ activePath, onNavigate, user, notificationCount = 3 }) {
    const topItems = NAV_ITEMS.filter((i) =>
        ["home", "bookings", "messages", "nearby"].includes(i.key)
    );

    const initials =
        user?.fullName
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("") || "U";

    return (
        <header
            style={{
                height: 64,
                background: "rgba(247,248,251,0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "0.5px solid rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                gap: 8,
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >
            {/* Logo */}
            <div
                style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 28, cursor: "pointer" }}
                onClick={() => onNavigate("/")}
            >
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: BRAND,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon name="tool" size={16} color="#fff" />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#07102b", letterSpacing: "-0.3px" }}>
          QuickKarigar
        </span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                {topItems.map((item) => {
                    const active = activePath === item.path;
                    return (
                        <button
                            key={item.key}
                            onClick={() => onNavigate(item.path)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "7px 14px",
                                borderRadius: 10,
                                background: active ? BRAND_BG : "transparent",
                                border: "none",
                                cursor: "pointer",
                                transition: "background 0.15s ease",
                                position: "relative",
                            }}
                            onMouseEnter={(e) => {
                                if (!active) e.currentTarget.style.background = BRAND_LIGHT;
                            }}
                            onMouseLeave={(e) => {
                                if (!active) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <Icon name={item.icon} size={17} color={active ? BRAND : "#9a9aa8"} />
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: active ? 600 : 500,
                                    color: active ? BRAND : "#5a5a6a",
                                }}
                            >
                {item.label}
              </span>
                            {item.badge && (
                                <span
                                    style={{
                                        background: BRAND,
                                        color: "#fff",
                                        fontSize: 9,
                                        fontWeight: 700,
                                        borderRadius: 6,
                                        padding: "1px 5px",
                                    }}
                                >
                  {item.badge}
                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right: bell + avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Bell */}
                <button
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#ececef",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                    }}
                    onClick={() => onNavigate("/notifications")}
                    aria-label="Notifications"
                >
                    <Icon name="bell" size={18} color="#5a5a6a" />
                    {notificationCount > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                background: BRAND,
                                border: "2px solid #f7f8fb",
                            }}
                        />
                    )}
                </button>

                {/* Avatar */}
                {user?.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                            border: `2px solid ${BRAND}22`,
                        }}
                        onClick={() => onNavigate("/profile")}
                    />
                ) : (
                    <button
                        onClick={() => onNavigate("/profile")}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: BRAND,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        {initials}
                    </button>
                )}
            </div>
        </header>
    );
}

// ─── Responsive Layout Wrapper ────────────────────────────────────────────────
// Wraps your page content with the right nav for the screen size.
// Usage:
//   <DashboardLayout user={user}>
//     <YourPageContent />
//   </DashboardLayout>

export function DashboardLayout({ children, user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* ── Desktop layout ── */}
            <div
                // style={{
                //     display: "none",
                //     // Show on lg+ via media query — use Tailwind class instead if preferred
                // }}
                className="hidden lg:flex min-h-screen"
            >
                <DesktopSidebar
                    activePath={location.pathname}
                    onNavigate={navigate}
                    user={user}
                />
                <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
                    {children}
                </main>
            </div>

            {/* ── Mobile layout ── */}
            <div className="flex flex-col min-h-screen lg:hidden">
                <main style={{ flex: 1, paddingBottom: 80 }}>
                    {children}
                </main>
                <MobileTabBar
                    activePath={location.pathname}
                    onNavigate={navigate}
                    user={user}
                />
            </div>
        </>
    );
}

// ─── Tailwind-based version (if you prefer className) ─────────────────────────
// If using Tailwind, replace the DashboardLayout above with this:

export function DashboardLayoutTailwind({ children, user }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:flex min-h-screen">
                <DesktopSidebar
                    activePath={location.pathname}
                    onNavigate={navigate}
                    user={user}
                />
                <main className="flex-1 min-w-0 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile */}
            <div className="flex flex-col min-h-screen lg:hidden">
                <main className="flex-1 pb-20">
                    {children}
                </main>
                <MobileTabBar
                    activePath={location.pathname}
                    onNavigate={navigate}
                    user={user}
                />
            </div>
        </>
    );
}

export default DashboardLayout;