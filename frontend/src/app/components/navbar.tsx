"use client";

import React, { FC } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth";

const styles = {
  header: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "16px 0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
  },
  menu: {
    display: "flex",
    gap: "32px",
  },
  menuItem: {
    textDecoration: "none",
    color: "white",
  },
  menuButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
};

const Navbar: FC = () => {
  const { user, logout } = useAuth();
  console.log(user);
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link href="/" style={styles.logo}>
            Movo
          </Link>
          <div style={styles.menu}>
          </div>
          <div style={styles.flexRow}>
            {user ? (
                <>
                  <Link href="/dashboard" style={styles.menuItem}>Menü</Link>
                  <button
                    onClick={logout}
                    style={styles.menuButton}
                  >
                    Logout
                  </button>
                </>
            ) : (
              <>
                <Link href="/login" style={styles.menuItem}>Login</Link>
                <Link href="/register" style={styles.menuItem}>Registrieren</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
