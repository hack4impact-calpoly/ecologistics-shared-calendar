import Layout from "../components/layout";
import PendingApprovals from "../admin_components/PendingApprovals";
import React from "react";

export default function AdminDashboard() {
  return (
    <Layout>
      <div style={styles.container}>
        <PendingApprovals />
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
