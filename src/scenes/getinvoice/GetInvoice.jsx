import { Autocomplete, Box, Button, TextField, useTheme, Modal, Typography, FormControl, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, RadioGroup, FormLabel, FormControlLabel, Radio, Grid } from "@mui/material";
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

const GetInvoice = () => {
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

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");


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

    return (

        <Box m="20px" sx={{ '@media screen': { marginTop: 0, color: 'white', border: 'black' }, '@media print': { marginTop: 0, color: 'black', border: 'black' } }}>
            <Box sx={{ '@media print': { display: 'none' } }}><Header title="SHOW INVOICE" subtitle="Displaying Existing Invoice" /></Box>
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
                >Show Invoice</Button>
            </Box>
            {/* <Box sx={{'@media screen': { display : 'none'}, textAlign:'center'}}> */}
            {formVisible ?
                <>
                    <Box sx={{ '@media screen': { display: 'block' }, textAlign: 'center', '@media print': { color: 'black' } }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    color='white'
                                    sx={{ m: "0 0 5px 0", '@media print': { color: 'black' } }}
                                >
                                    Cancer Center CMH Dhaka
                                </Typography>
                                <Typography variant="h5" color='white' sx={{ '@media print': { color: 'black' } }}>
                                    Cancer Center CMH Dhaka
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                {invoiceId && <Barcode value={invoiceId} displayValue='false' height={30} />}
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h4" color='white'>
                                    INVOICE
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Box display='flex' justifyContent='end' flexDirection='column' alignItems='end'>
                                    <Typography>
                                        Date :  {
                                            invoiceDate ?
                                                `${new Date(invoiceDate).getDate()} / ${new Date(invoiceDate).getMonth() + 1} / ${new Date(invoiceDate).getFullYear(invoiceDate)}`
                                                : ""
                                        }
                                    </Typography>
                                    <Typography>Invoice No.:{` `}{invoiceId}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>


                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                        sx={{
                            mb: '20px',
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
                            '@media print': { mt: '25px' }
                        }}
                    >
                        <Box
                            display="grid"
                            gap="0"
                            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                            }}
                        >
                            <Typography sx={{ gridColumn: "span 1" }}>Patient ID:</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{patientId}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>RT No.</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{patientRT}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>Patient Rank</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{patientRank}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>patinents name</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{patientName}</Typography>
                        </Box>
                        <Box
                            display="grid"
                            gap="0"
                            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                '@media print': { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
                            }}
                        >
                            <Typography sx={{ gridColumn: "span 1" }}>Guardian</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianName}</Typography>
                            {/* <Box        sx={{ gridColumn: "span 1", '@media print':{display :'none', backgroundColor:'red'}}}>
                            </Box> */}
                            <Typography sx={{ gridColumn: "span 1" }}>Guardin Unit</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianUnit}</Typography>
                            {/* <Box        sx={{ gridColumn: "span 1", '@media print':{display :'none', backgroundColor:'red'}}}>
                            </Box> */}
                            <Typography sx={{ gridColumn: "span 1" }}>Guardin Mobile Number</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianPhoneNumber}</Typography>
                            {/* <Box        sx={{ gridColumn: "span 1", '@media print':{display :'none', backgroundColor:'red'}}}>
                            </Box> */}
                            <Typography sx={{ gridColumn: "span 1" }}>Doctor name</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{doctorName}</Typography>
                            {/* <Box        sx={{ gridColumn: "span 1", '@media print':{display :'none', backgroundColor:'red'}}}>
                            </Box> */}
                        </Box>
                    </Box>


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

                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ p: 1, border: 'none' }}></TableCell>
                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Total</TableCell>
                                        <TableCell sx={{ p: 1, border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>{total}</TableCell>
                                    </TableRow>
                                    <TableRow></TableRow>
                                    <TableRow>
                                        {/* <TableCell colSpan={3} sx={{p : 1, border: 'none'}}></TableCell> */}
                                        <TableCell colSpan={3} rowSpan={3} sx={{ p: 1, border: 'none', '@media print': { color: 'black', borderColor: 'black' } }}>Prepared by - <span style={{ fontWeight: '700' }}>{preparedBy}</span> </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                </>
                : ""
            }
        </Box>
    )
}

export default GetInvoice;