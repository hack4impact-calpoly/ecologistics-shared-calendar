import React from 'react';
import Layout from "../components/layout";

export default function EventPage() {
    // You can add state hooks here if you need to manage state

    return (
        <Layout>
            <div style={styles.container}>
                <div style={styles.box}>
                    <h1 style={styles.title}>Event Name</h1>
                    <p style={styles.date}>Event Date -- Event Time</p>
                    <div style={styles.imagePlaceholder}></div>
                    <div style={styles.descriptionBox}>
                        <p style={styles.descriptionText}>Event description</p>
                    </div>
                    <div style={styles.locationAndMapContainer}>
                        <h2 style={styles.locationType}>Location Type</h2>
                        <div style={styles.mapPlaceholder}></div>
                    </div>
                    <address style={styles.address}>
                        <p>Street Address</p>
                        <p>City, State, Zip Code</p>
                    </address>
                </div>
            </div>
        </Layout>
    );
}

const styles : { [key: string]: React.CSSProperties }= {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    box: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'left',
    },
    title: {
        fontFamily: "Arial, sans-serif",
        fontSize: '24px',
        margin: '0 0 8px 0',
        fontWeight: 'bold',
    },
    date: {
        fontFamily: "Arial, sans-serif",
        fontSize: '16px',
        margin: '0 0 16px 0',
        color: '#333',
    },
    imagePlaceholder: {
        height: '300px',
        width: '100%',
        backgroundColor: '#e1e1e1',
        marginBottom: '16px',
    },
    descriptionBox: {
        textAlign: 'left',
        border: '1px solid #ddd',
        padding: '8px',
        marginBottom: '16px',
    },
    descriptionText: {
        height: '100px',
        fontFamily: "Arial, sans-serif",
        fontSize: '14px',
        margin: '0',
    },
    locationType: {
        fontFamily: "Arial, sans-serif",
        fontSize: '18px',
        margin: '0 16px 0 0', // Adjusted margin to ensure spacing on the right
        fontWeight: 'bold',
        flexShrink: 0, // Prevents the title from shrinking if space is tight
    },
    address: {
        fontFamily: "Arial, sans-serif",
        fontSize: '14px',
        textAlign: 'left',
        marginBottom: '16px',
    },
    mapPlaceholder: {
        height: '220px',
        width: '50%',
        backgroundColor: '#e1e1e1',
        alignItems: 'center', 
        marginLeft: 'auto', // This pushes the element to the right
        marginRight: '0', // This ensures it aligns right without any margin on the right side
    },
    locationAndMapContainer: {
        display: 'flex',
        alignItems: 'flex-start', // Changed to align items at the top
        justifyContent: 'space-between', // Adjust if you want a different spacing
        width: '100%', // Ensures the container takes up the full width
    },

};
