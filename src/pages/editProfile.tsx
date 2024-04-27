import Layout from "../components/layout";
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button} from "@mui/material";
import { useUser } from '@clerk/clerk-react';
import { Paper, Typography } from '@mui/material';
import { FaEdit } from "react-icons/fa";

export default function EditProfilePage(){

    
    return (
        <Layout>
        <div style={{padding:'50px'}}>
        
        <Box display='flex' justifyContent="left" borderRadius={3} width='80%' paddingLeft='200px' paddingTop='50px' paddingBottom='20%'
        sx={{ border: '2px solid grey' }}>
            <Grid
                container
                direction="column"
                justifyContent="left"
                alignItems="left"
            >
            
            <h3>Account Information </h3>

            <Grid item>
                <p>Change Organization Name</p>
                <input type="text"/>
            </Grid>
            <br></br>
            <h3>Personal Information</h3>
            <Grid
                container spacing={2}
            >
                <Grid item xs={1.5}>
                    <p><b>First Name</b></p>
                    <input type="text"/>
                </Grid>
                <Grid item xs={2}>
                    <p><b>Last Name</b></p>
                    <input type="text"/>
                </Grid>
            </Grid>
            <p><b>Position in Organization</b></p>
            <br></br>
            <input type="text" style={{ width: '300px' }}/>

            <h3>Organization Information</h3>
            <p><b>Email Address</b></p>
            <input type="text" style={{ width: '300px' }}/>
            <p><b>Phone number</b></p>
            <input type="text" style={{ width: '300px' }}/>
            <br></br><br></br>

            <Button style={{ width: '50px', backgroundColor:"#ef7f2d",color: 'black'}} sx={{textTransform:'none'}}>
                Save
            </Button>
            </Grid>
            
        </Box>
        </div>

    </Layout>
    );
    
}

