import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { tokens } from "../../theme";

const RevenueDistribution = () => {
    const [value, setValue] = useState(dayjs('2023-01-01'));
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const sampleRevenueData = [
        {
            sl : 1,
            departmentName : 'Radiation Oncology',
            services : [
                {
                    name : 'PET-CT',
                    revenue : 1500000 
                },
                {
                    name : 'Simulation',
                    revenue : 2500000 
                },
                {
                    name : 'Brachytherapy',
                    revenue : 500000 
                },
                {
                    name : 'Radiotherapy',
                    revenue : 1000000 
                },
            ]
        },
        {   
            sl: 2,
            departmentName : 'Medical Oncology',
            services : [
                {
                    name : 'Chemotherapy',
                    revenue : 4500000 
                },
                {
                    name : 'Blood Transfusion',
                    revenue : 25000000 
                },
                {
                    name : 'Fluid Suction',
                    revenue : 5000000 
                },
            ]
        },
    ]
    let total = 0
    const totalRevenue = sampleRevenueData.forEach(sample => sample.services.forEach(service => total+=service.revenue))

    const getPreviuosInvoice = () => {

    }

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box m='20px'>
                <Box sx={{'@media print': { display : 'none'}}}>
                    <Header title="REVENUE DISBURSEMENT" subtitle="Generate Revenue Disbursement" />
                </Box>
                <Box display='flex' gap='10px' sx={{'@media print': { display : 'none'}}}>
                    <DatePicker
                        views={['year', 'month']}
                        label="Select Month"
                        minDate={dayjs('2018-03-01')}
                        maxDate={dayjs('2023-01-01')}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                    <Button variant="contained" onClick={() => getPreviuosInvoice()}
                        sx={{
                            width:'150px', 
                            color:"#3b3c31", 
                            fontWeight:"bold", 
                            backgroundColor:"#878970", 
                            '&:hover' :{color: colors.oliveAccent[100]}
                        }}
                    >Load Revenue</Button>
                </Box>
            


            {/* Table Part */}
            <Paper elevation={4}  sx={{background:`${colors.primary[400]} !important`, padding: '10px'}}>
                {/* table title */}
                <Typography
                    variant="h4"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    textAlign='center'
                    sx={{ m: "0 0 5px 0" }}
                >Revenue Distribution - January 2023</Typography>

                {/* table main */}
                <Box border='1px solid gray' padding='5px' mt='15px' borderRadius="3px">
                    <Box sx={{ flexGrow: 1, p: 0 }}>
                        <TableContainer sx={{width: '70%', marginInline:'auto'}}>
                            <Table>
                                <TableHead >
                                    <TableRow>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>SL</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>DESCRIPTION</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>REVENUE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        sampleRevenueData.map((dept) => {
                                            return (
                                                <>
                                                    <TableRow key={dept.sl}>
                                                    <TableCell sx={{p : 1, border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>{dept.sl}</TableCell>
                                                    <TableCell sx={{p : 1, border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='left'>{dept.departmentName}</TableCell>
                                                    <TableCell sx={{p : 1, border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'></TableCell>
                                                </TableRow>
                                                    {
                                                        dept.services.map((service, index) => (
                                                            <TableRow  key={index}>
                                                                <TableCell sx={{p : 1, border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} align='center'></TableCell>
                                                                <TableCell sx={{paddingLeft: '50px', border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} >{service.name}</TableCell>
                                                                <TableCell sx={{p : 1, border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} align='center'>{service.revenue}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell sx={{p : 1, border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} align='center'></TableCell>
                                        <TableCell sx={{fontSize:'1rem',paddingleft:'auto', paddingRight: '20px', border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} align='center'>TOTAL</TableCell>
                                        <TableCell sx={{fontSize:'1rem',p : 1, border: '1px solid gray','@media print':{color : 'black', borderColor:'black'}}} align='center'>{total}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box marginTop='25px' />
                        <TableContainer sx={{width: '70%', marginInline:'auto'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>SL</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>DISTRIBUTION HEAD</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>1</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>Welfare Fund</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>{total*0.8}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>2</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>Personnel Allocation</TableCell>
                                        <TableCell sx={{p : 1, fontWeight:'bold', border: '1px solid gray', '@media print':{color : 'black', borderColor:'black'}}} align='center'>{total*0.2}</TableCell>
                                    </TableRow>
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box sx={{width: '70%', marginInline:'auto'}}>
                        <Button type="submit"  variant="contained" 
                            sx={{mt:'10px', width:'150px', color:"#3b3c31", fontWeight:"bold", backgroundColor:"#878970", '&:hover' :{color: colors.oliveAccent[100]}}}>
                            Insert Personnel Allocation Table
                        </Button>
                    </Box>
                    <Box display='flex' justifyContent='end'>
                        <Button type="submit"  variant="contained" 
                            sx={{mt:'10px', width:'150px', color:"#3b3c31", fontWeight:"bold", backgroundColor:"#878970", '&:hover' :{color: colors.oliveAccent[100]}}}>
                            Save Disbursement Record
                        </Button>
                    </Box>
                </Box>

            </Paper>
            </Box>
        </LocalizationProvider>
    )

}

export default RevenueDistribution;