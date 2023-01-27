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

const ModifyInvoice = () => {
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
    const [formVisible, setFormVisible] = useState(false);
    const [ adminRE, setAdminRE ] = useState(0)

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const  auth  = JSON.parse(localStorage.getItem('auth'));
    console.log(auth);


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

    const handleDeleteService = index => {
        console.log("index",index, "  table row data",tableRowData);
        let newTableData = [...tableRowData]
        newTableData.splice(index,1)
        console.log('new table data', newTableData);
        setTableRowData(newTableData)
        let newTotal = 0
        newTableData.forEach(service => newTotal+=service.netAmount)
        setTotal(newTotal)
    }

    const handleAdminRE = () => {
        console.log("Previous Data",tableRowData);
        let newTableData = [...tableRowData]
        let newTotal = 0
        newTableData.forEach((service, index) => {
            newTableData[index].re = adminRE
            newTableData[index].netAmount = service.unitPrice * (100 - parseInt(adminRE)) / 100
            console.log("new data at index",index,"is : ",newTableData[index]);
            newTotal+=service.netAmount
        })
        setTotal(newTotal)
        setTableRowData(newTableData)
    }

    return (

        <Box m="20px" sx={{ '@media screen': { marginTop: 0, color: 'white', border: 'black' }, '@media print': { marginTop: 0, color: 'black', border: 'black' } }}>
            <Box sx={{ '@media print': { display: 'none' } }}><Header title="MODIFY INVOICE" subtitle="Modify Invoice" /></Box>
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
                >Modify Invoice</Button>
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
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="RT No."
                                        onChange={(e) => setPatientRT(e.target.value)}
                                        value={patientRT}
                                    />
                                    <TextField
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Patient Rank"
                                        onChange={(e) => setPatientRank(e.target.value)}
                                        value={patientRank}
                                    />
                                    <TextField
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
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardian Name"
                                        onChange={(e) => setGuardianName(e.target.value)}
                                        value={guardianName}
                                    />
                                    <TextField
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardin Unit"
                                        onChange={(e) => setGuardianUnit(e.target.value)}
                                        value={guardianUnit}
                                    />
                                    <TextField
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Guardin Phone Number"
                                        onChange={(e) => setGuardianPhoneNumber(e.target.value)}
                                        value={guardianPhoneNumber}
                                    />
                                    <TextField
                                        width='50%'
                                        variant="filled"
                                        type="text"
                                        label="Doctor Name"
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        value={doctorName}
                                    />
                                </Box>
                            </Box>
                            <Button type="submit" variant="contained"
                                sx={{ mt: '10px', width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }}>
                                Modify Patient Info
                            </Button>
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
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Unit Price</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>RE %</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Net Amount</TableCell>
                                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Status</TableCell>
                                                <TableCell colSpan={2} sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                tableRowData.map((service, index) => {
                                                    return (
                                                        <TableRow key={service.serviceId}>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{index + 1}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.billingItem}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.quantity}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.unitPrice}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.re}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.netAmount}</TableCell>
                                                            <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{service.serviceStatus}</TableCell>

                                                            <TableCell sx={{ p: '1px', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>
                                                                <Button type="submit" variant="contained"
                                                                    sx={{
                                                                        width: '100%', color: "#3b3c31", fontWeight: "bold",
                                                                        backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }
                                                                    }}
                                                                    onClick={() => handleDeleteService(index)}
                                                                >Delete</Button>
                                                            </TableCell>
                                                            <TableCell sx={{ p: '1px', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>
                                                                <Button type="submit" variant="contained"
                                                                    sx={{
                                                                        width: '100%', color: "#3b3c31", fontWeight: "bold",
                                                                        backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }
                                                                    }}
                                                                >Edit</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            <TableRow>
                                                <TableCell colSpan={4} sx={{ p: 1, border: 'none' }}></TableCell>
                                                <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Total</TableCell>
                                                <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{total}</TableCell>
                                                <TableCell sx={{ p: 1, border: 'none' }}></TableCell>
                                                <TableCell colSpan={2} sx={{ p: '1px', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>
                                                    <Button type="submit" variant="contained"
                                                        sx={{
                                                            width: '100%', color: "#3b3c31", fontWeight: "bold",
                                                            backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }
                                                        }}
                                                    >Add Service</Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow></TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} rowSpan={3} sx={{ p: 1, border: 'none', '@media print': { color: 'black', borderColor: 'black' } }}>Prepared by - <span style={{ fontWeight: '700' }}>{preparedBy}</span> </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            
                            {
                                auth.userRole === 'Admin' 
                                ?
                                <>
                                    <Box sx={{padding:'15px', border: '1px solid', borderColor: colors.oliveAccent[100], width: '350px', marginInline: 'auto', backgroundColor:'#3c3d32'}}>
                                        <Typography sx={{fontSize: '1.5rem', textAlign:'center'}}>ADMIN PRIVILAGE</Typography>
                                        <TextField 
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Allocate RE"
                                            value={adminRE}
                                            onChange={(e) => setAdminRE(e.target.value)}
                                            sx={{marginBlock: '10px'}}
                                        />
                                        <Button type="submit" variant="contained"
                                            sx={{
                                                width: '40%', color: "#3b3c31", fontWeight: "bold", marginInline:'auto',
                                                display: 'block',
                                                backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }
                                            }}
                                            onClick={handleAdminRE}
                                        >Update RE</Button>
                                    </Box>
                                </>
                                : ""
                            }
                            <Button type="submit" variant="contained"
                                sx={{ mt: '10px', width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }}>
                                Modify Service Info
                            </Button>
                        </Box>
                    </Paper>
                </>
                : ""
            }
        </Box>
    )
}

export default ModifyInvoice;