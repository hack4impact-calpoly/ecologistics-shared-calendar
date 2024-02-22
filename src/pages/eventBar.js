import React from "react";

export default function EventBar() {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: "80%"
        },
        header: {
            backgroundColor: 'white',
            borderStyle: 'solid',
            borderWidth: '4px',
            borderRadius: '12px',
            fontFamily: 'Inter',
            flexGrow: '1',
            padding: '0.5% 7%', // Adjusted padding using percentages
            display: 'flex',
            margin: '2%', // Adjusted margin using percentages
            width: '40%', // Adjusted width using percentages
            justifyContent: 'center',
        },
        allEventContainer: {
            display: 'flex', // Use flexbox layout
            justifyContent: 'center', // Center children horizontally
            alignItems: 'center', // Center children vertically
            flexDirection: 'column', // Stack children vertically

           /* borderStyle: 'solid',
            borderWidth: '7px', // Adjusted border width to match eventContainer
            borderRadius: '12px',
            margin: '2%', // Adjusted margin using percentages
            padding: '3%', // Adjusted padding using percentages to match eventContainer*/
        },
        eventContainer: {
            borderStyle: 'solid',
            borderWidth: '7px',
            borderRadius: '12px',
            whiteSpace: 'wrap',
            width: '70%',
            height: 'auto',
            backgroundColor: "#D9D9D9",
            padding: '2% 1%'
        },
        headerContainer: {
            display: 'flex',
            flexDirection: 'row',
            
        },
        tagContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '0'
        },
        eventTag: {
            color: 'purple'
        },
        dateContainer: {
            borderStyle: 'solid',
            borderWidth: '5px',
            borderRadius: '16px',
            flexGrow: '1',
            display: 'grid',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: 'auto',
        },
        titleContainer: {
            display: 'grid',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: 'auto',
        },
        title: {
            fontSize: '3.5vw',
            margin: '0', // Adjust margin to remove extra space around the title
            
        },
        month: {
            fontSize: '1.5vw',
            fontWeight: 'bold',
            margin: '0', // Adjust margin to remove extra space around the month
            textAlign: 'center'
        },
        day: {
            fontSize: '2vw',
            fontWeight: 'bold',
            margin: '0', // Adjust margin to remove extra space around the day
            textAlign: 'center'
        },
        eventText: {
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '2%'
        },


    };
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Selected Date</h1>
            </div>
            <div style={styles.allEventContainer}>
                <div style={styles.eventContainer}>
                    <div style={styles.headerContainer}>
                        <div style={styles.titleContainer}>
                            <h1 style={styles.title}>Event 1</h1>
                            <div style={styles.tagContainer}>
                                <p style={styles.eventTag}>Event Tags</p>
                                <p>  &#128205; Location</p>
                                <p>  &#128204; Website URL</p>
                            </div>
                        </div>
                        <div style={styles.dateContainer}>
                            <p style={styles.day}>2</p>
                            <p style={styles.month}>February</p>
                            <p>1:00pm - 2:00pm</p>
                        </div>

                    </div>
                    <div style={styles.eventText}>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    </div>
                </div>
                <div style={styles.eventContainer}>
                    <div style={styles.headerContainer}>
                        <div style={styles.titleContainer}>
                            <h1 style={styles.title}>Event 2</h1>
                            <div style={styles.tagContainer}>
                                <p style={styles.eventTag}>Event Tags</p>
                                <p>&#128205; Location</p>
                                <p>&#128204; Website URL</p>
                            </div>
                        </div>
                        <div style={styles.dateContainer}>
                            <p style={styles.day}>2</p>
                            <p style={styles.month}>February</p>
                            <p>1:00pm - 2:00pm</p>
                        </div>

                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    
                </div>
                <div style={styles.eventContainer}>
                    <div style={styles.headerContainer}>
                        <div style={styles.titleContainer}>
                            <h1 style={styles.title}>Event 3</h1>
                            <div style={styles.tagContainer}>
                                <p style={styles.eventTag}>Event Tags</p>
                                <p>&#128205; Location</p>
                                <p>&#128204; Website URL</p>
                            </div>
                        </div>
                        <div style={styles.dateContainer}>
                            <p style={styles.day}>2</p>
                            <p style={styles.month}>February</p>
                            <p>1:00pm - 2:00pm</p>
                        </div>

                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    
                </div>
                <div style={styles.eventContainer}>
                    <div style={styles.headerContainer}>
                        <div style={styles.titleContainer}>
                            <h1 style={styles.title}>Event 4</h1>
                            <div style={styles.tagContainer}>
                                <p style={styles.eventTag}>Event Tags</p>
                                <p>&#128205; Location</p>
                                <p>&#128204; Website URL</p>
                            </div>
                        </div>
                        <div style={styles.dateContainer}>
                            <p style={styles.day}>2</p>
                            <p style={styles.month}>February</p>
                            <p>1:00pm - 2:00pm</p>
                        </div>

                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                    
                </div>
            </div>
        </div>
    );
}