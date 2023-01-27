import { Autocomplete, Box, Button, TextField, useTheme, Modal, Typography, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, RadioGroup, FormLabel, FormControlLabel, Radio, Grid, Paper } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useReducer, useState } from "react";
import { useEffect } from "react";
import { darken, lighten, styled } from "@mui/system";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { AuthContext } from "../../App";
import { useContext } from "react";
import Barcode from "react-barcode";

const ServiceProvider = () => {
    const [patient_ID, setPatient_ID] = useState('')
    const [patientId, setPatientId] = useState('')
    const [patientName, setPatientName] = useState('');
    const [patientRT, setPatientRT] = useState('');
    const [patientRank, setPatientRank] = useState('');
    const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianUnit, setGuardianUnit] = useState('');
    const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [invoiceId, setInvoiceId] = useState('')
    const [tableRowData, setTableRowData] = useState([])
    const [invoiceDate, setInvoiceDate] = useState('')
    const [total, setTotal] = useState(0)
    const [preparedBy, setPreparedBy] = useState('')
    const [formVisible, setFormVisible] = useState(false)
    const [servedBy, setServedBy] = useState('')

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const auth = useContext(AuthContext)

    console.log("auth at provider", auth)


    const getPreviuosInvoice = async () => {
        console.log(invoiceId);
        fetch(`https://cmh-server01.onrender.com/api/getInvoice/${invoiceId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setPatient_ID(data[0].patientId._id)
                setPatientId(data[0].patientId.patientSerial)
                setPatientName(data[0].patientId.patientName)
                setPatientRT(data[0].patientId.rtNumber)
                setPatientRank(data[0].patientId.rank)
                setPatientPhoneNumber(data[0].patientId.patientPhoneNumber)
                setInvoiceDate(data[0].invoiceDate)
                setGuardianName(data[0].guardianName)
                setGuardianUnit(data[0].guardianUnit)
                setGuardianPhoneNumber(data[0].guardianPhoneNumber)
                setDoctorName(data[0].doctorName)
                setPreparedBy(data[0].preparedBy)
                setTableRowData(
                    data[0].billedServices.map(service => {
                        setTotal(prev => prev + service.serviceUnitPrice * (100 - service.discountRate) / 100)
                        return {
                            billingItem: service.serviceId.serviceName,
                            serviceId: service.serviceId._id,
                            quantity: service.serviceQuantity,
                            unitPrice: service.serviceUnitPrice,
                            re: service.discountRate,
                            netAmount: service.serviceUnitPrice * (100 - service.discountRate) / 100,
                            serviceStatus: service.serviceStatus
                        }
                    })
                )
            })
            .then(() => setFormVisible(true))
    }

    const handleServed = (index) => {
        let newTableData = [...tableRowData]
        newTableData[index].serviceStatus = 'Completed'
        setTableRowData(newTableData)
    }
    return (

        <Box m="20px" sx={{ '@media screen': { marginTop: 0, color: 'white', border: 'black' }, '@media print': { marginTop: 0, color: 'black', border: 'black' } }}>
            <Box sx={{ '@media print': { display: 'none' } }}><Header title="SERVICE BOOTH" subtitle="Execute Service" /></Box>
            <Box display='flex' gap='10px' sx={{ '@media print': { display: 'none' } }}>
                <TextField
                    width='50%'
                    variant="filled"
                    type="text"
                    label="Invoice Number"
                    onChange={(e) => setInvoiceId(e.target.value)}
                    value={invoiceId}
                />
                <Button variant="contained" onClick={() => getPreviuosInvoice()}
                    sx={{
                        width: '150px',
                        color: "#3b3c31",
                        fontWeight: "bold",
                        backgroundColor: "#878970",
                        '&:hover': { color: colors.oliveAccent[100] }
                    }}
                >Get Patient & Service Info</Button>
            </Box>
            {/* <Box sx={{'@media screen': { display : 'none'}, textAlign:'center'}}> */}
            {formVisible ?
                <>
                    <Box sx={{ '@media screen': { display: 'block' }, textAlign: 'center', '@media print': { color: 'black' } }}>
                        <Grid container>
                            <Grid item xs={4}>
                                <Box display='flex' gap="10px">
                                    <Typography>Invoice No.:{invoiceId}</Typography>
                                    <Typography>
                                        Date :  {
                                            invoiceDate ?
                                                `${new Date(invoiceDate).getDate()} / ${new Date(invoiceDate).getMonth() + 1} / ${new Date(invoiceDate).getFullYear(invoiceDate)}`
                                                : ""
                                        }
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>


                    <Paper elevation={4} sx={{ background: `${colors.primary[400]} !important`, padding: '10px' }}>
                        <Box border='1px solid gray' padding='5px' borderRadius="3px">
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                            >
                                <Box
                                    display="grid"
                                    gap="5px"
                                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                >
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Patient ID:"
                                        value={patientId}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="RT No."
                                        onChange={(e) => setPatientRT(e.target.value)}
                                        value={patientRT}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Patient Rank"
                                        onChange={(e) => setPatientRank(e.target.value)}
                                        value={patientRank}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Patinents Name"
                                        onChange={(e) => setPatientName(e.target.value)}
                                        value={patientName}
                                    />
                                </Box>
                                <Box
                                    display="grid"
                                    gap="5px"
                                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                                >
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardian Name"
                                        onChange={(e) => setGuardianName(e.target.value)}
                                        value={guardianName}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardin Unit"
                                        onChange={(e) => setGuardianUnit(e.target.value)}
                                        value={guardianUnit}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardin Phone Number"
                                        onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                                        value={guardianPhoneNumber}
                                    />
                                    <TextField
                                        disabled
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Doctor Name"
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        value={doctorName}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box border='1px solid gray' padding='5px' mt='15px' borderRadius="3px">
                            <Box sx={{ flexGrow: 1, p: 0 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead >
                                            <TableRow>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Item No.</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Billing Item</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Quantity</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Status</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                tableRowData.map((service, index) => (
                                                    <TableRow key={service.serviceId}>
                                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{index + 1}</TableCell>
                                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.billingItem}</TableCell>
                                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.quantity}</TableCell>
                                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.serviceStatus}</TableCell>

                                                        <TableCell sx={{ p: '1px', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>
                                                            <Button type="submit" variant="contained"
                                                                sx={{
                                                                    width: '100%', color: "#3b3c31", fontWeight: "bold",
                                                                    backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }
                                                                }} onClick={() => handleServed(index)}
                                                            >Service Provided</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                                )
                                            }
                                            <TableRow>

                                            </TableRow>
                                            <TableRow></TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} rowSpan={3} sx={{ p: 1, border: 'none', '@media print': { color: 'black', borderColor: 'black' } }}>Served by - <span style={{ fontWeight: '700' }}>{auth.name}</span> </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            {/* <Button type="submit"  variant="contained" 
                                sx={{mt:'10px', width:'150px', color:"#3b3c31", fontWeight:"bold", backgroundColor:"#878970", '&:hover' :{color: colors.oliveAccent[100]}}}>
                                Modify Service Info
                            </Button> */}
                        </Box>
                    </Paper>
                </>
                : ""
            }
        </Box>
    )
}

export default ServiceProvider;