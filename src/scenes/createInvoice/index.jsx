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




//? FOR MODAL
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    bgcolor: '#1c1d15',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

//? modal initial values
const modalInitialValues = {
    patientName: "",
    patientPhoneNumber: "",
    guardianName: "",
    guardianUnit: "",
    guardianPhoneNumber: "",
    doctorName: "",
}
//? For modal validation schema
const modalValidationSchema = yup.object().shape({
    patientName: yup.string().required("required"),
    patientPhoneNumber: yup.number().required("required").positive(),
    guardianName: yup.string().required("required"),
    guardianUnit: yup.string().required("required"),
    guardianPhoneNumber: yup.number().required("required").positive(),
    doctorName: yup.string().required("required"),
})




const checkoutSchema = yup.object().shape({
    serviceName: yup.string().required("required"),
    departmentName: yup.object().shape({
        id: yup.string().required("required"),
        label: yup.string().required("required")
    }),
    servicePrice: yup.number().required("required").positive()
});
const initialValues = {
    serviceName: "",
    servicePrice: 0
};

const GroupHeader = styled('div')(({ theme }) => ({    //const GroupHeader = styled('div')(({ theme }) => ({  
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: '#345623',  //color: theme.palette.primary.main,
    backgroundColor: '#e5e510'
        // theme.palette.mode === 'light'
        //     ? lighten("#e5e510", 0.85)   // lighten(theme.palette.primary.light, 0.85) 
        //     : darken("#e5e510", 0.8),     // darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

const CreateInvoice = () => {
    // for new patient
    const [newModalOpen, setNewModalOpen] = useState(false);
    const handleNewModalOpen = () => {
        setNewModalOpen(true);
    }
    const handleNewModalClose = () => setNewModalOpen(false);

    // For Returning Patient
    const [existModalOpen, setExistModalOpen] = useState(false);
    const handleExistModalOpen = () => {
        setExistModalOpen(true);
    }
    const handleExistModalClose = () => setExistModalOpen(false);

    const auth = JSON.parse(localStorage.getItem('auth'));
    console.log("auth data", auth);

    const [patientDataState, setPatientDataState] = useState(false);
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
    const [patientQty, setPatientQty] = useState(0)
    const [invoiceQty, setInvoiceQty] = useState(0)
    const [date, setDate] = useState('')

    fetch(`https://cmh-server01.onrender.com/api/getNumberOfPatients`)
        .then(res => res.json())
        .then(data => setPatientQty(data))

    fetch(`https://cmh-server01.onrender.com/api/getNumberOfInvoices`)
        .then(res => res.json())
        .then(data => setInvoiceQty(data))

    const [discounts, setDiscounts] = useState('')
    const [selectedDiscount, setSelectedDiscount] = useState('')
    const [tableRowData, setTableRowData] = useState([])
    const [total, setTotal] = useState(0)
    const [serviceData, setServiceData] = useState([])

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    useEffect(() => {
        fetch('https://cmh-server01.onrender.com/api/getServices')
            .then(res => res.json())
            .then(data => {
                // console.log("service data from db",data);
                setServiceData(data)
            })
    }, [])

    useEffect(() => {
        fetch(`https://cmh-server01.onrender.com/api/getDiscounts`)
            .then(res => res.json())
            .then(data => {
                setDiscounts(data)
                setSelectedDiscount(data[2]._id)
            })
    }, [])

    // console.log('discounts', discounts);
    const serviceList = serviceData.map(service => {
        return {
            id: service._id,
            serviceId: service._id,
            serviceName: service.serviceName,
            // serviceDeptId : service.departmentId._id,
            serviceDeptName: service.departmentId.departmentName,
            // servicePrice : service.servicePrice
        }
    })

    // console.log("services generated list for autocomplete", serviceList);


    const options = serviceList.map((option) => {
        const firstLetter = option.serviceName[0].toUpperCase();
        return {
            firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
            ...option,
        };
    });

    const handleInvoiceFormSubmit = (values) => {
        console.log(values);
        const selectedServiceData = values.serviceName.map(service => {
            const price = serviceData.find(data => data._id === service.serviceId).servicePrice
            const patientRE = discounts.find(discount => discount._id === selectedDiscount).discountRate
            setTotal(prev => prev + (price * (100 - patientRE) / 100))
            return {
                billingItem: service.serviceName,
                serviceId: service.serviceId,
                quantity: 1,
                unitPrice: price,
                re: patientRE,
                netAmount: price * (100 - patientRE) / 100
            }
        })
        setTableRowData(selectedServiceData)
    }

    const handleNewModalFormSubmit = async (e) => {
        e.preventDefault();
        // save patient data in database
        console.log("patient data from state variable", patientQty)
        // console.log("data after json convert", data);
        const newPatient = {
            patientName: patientName,
            patientSerial: "R-" + String(patientQty + 1).padStart(8, '0'),
            patientPhoneNumber: patientPhoneNumber,
            rtNumber: patientRT,
            rank: patientRank,
        }
        console.log("patient data ready for send", newPatient);
        const response = await fetch(`https://cmh-server01.onrender.com/api/createPatient`, {
            method: "POST",
            body: JSON.stringify(newPatient),
            headers: {
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + token,
            },
        });
        const json = await response.json();
        console.log("returned patient data from DB ", json);
        if (response.ok) {
            // setPatientName(json.patientName)
            // setPatientPhoneNumber(json.patientPhoneNumber)
            // setPatientRT(json.rtNumber)
            // setPatientRank(json.rank)
            setPatient_ID(json._id)
            // setPatientId(json.patientSerial)
            // setGuardianName(values.guardianName)
            // setGuardianUnit(values.guardianUnit)
            // setGuardianPhoneNumber(values.guardianPhoneNumber)
            // setDoctorName(values.doctorName)
            setPatientDataState(true);
            setPatientQty(prev => prev + 1)
        }

        handleNewModalClose();
    }

    const resetForm = () => {
        setPatientDataState(false)
        setPatient_ID('')
        setPatientId('')
        setPatientName('')
        setPatientRT('')
        setPatientRank('')
        setPatientPhoneNumber('')
        setGuardianName('')
        setGuardianUnit('')
        setGuardianPhoneNumber('')
        setDoctorName('')
        setTableRowData([])
        setDate('')
    }

    const generateInvoice = async () => {

        const invoiceData = {
            patientId: patient_ID,
            invoiceSerial: "CC-" + String(invoiceQty + 1).padStart(8, '0'),
            invoiceDate: new Date(),
            guardianName: guardianName,
            guardianUnit: guardianUnit,
            guardianPhoneNumber: guardianPhoneNumber,
            doctorName: doctorName,
            preparedBy: auth.name,
            billedServices: tableRowData.map(data => {
                return {
                    serviceId: data.serviceId,
                    serviceQuantity: data.quantity,
                    serviceUnitPrice: data.unitPrice,
                    discountRate: data.re,
                    serviceStatus: "Pending"
                }
            })
        }

        console.log("arranged invoice data to send to DB", invoiceData);

        const response = await fetch(`https://cmh-server01.onrender.com/api/createInvoice`, {
            method: "POST",
            body: JSON.stringify(invoiceData),
            headers: {
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + token,
            },
        });

        const json = await response.json();
        console.log(json);

        if (response.ok) {
            setInvoiceId(json.invoiceSerial)
        }
    }

    return (
        <Box m="20px" sx={{ '@media print': { marginTop: 0, color: 'black', border: 'black' } }}>
            <Box sx={{ '@media screen': { display: 'none' }, textAlign: 'center' }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color='black'
                            sx={{ m: "0 0 5px 0" }}
                        >
                            Cancer Center CMH Dhaka
                        </Typography>
                        <Typography variant="h5" color='black'>
                            Cancer Center CMH Dhaka
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {invoiceId && <Barcode value={invoiceId} displayValue='false' height={30} />}
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h4" color='black'>
                            INVOICE
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Box display='flex' flexDirection='column' alignItems='end'>
                            <Typography>Date : {`${new Date().getDate()} / ${new Date().getMonth() + 1} / ${new Date().getFullYear()}`}</Typography>
                            <Typography>Invoice No.:{invoiceId}</Typography>

                        </Box>
                    </Grid>
                </Grid>
            </Box>


            <Box sx={{ '@media print': { display: 'none' } }}><Header title="INVOICE" subtitle="Create Invoice" /></Box>

            {
                patientDataState
                    ?
                    <>
                        <Button color="#3b3c31" variant="contained" onClick={() => resetForm()} sx={{
                            backgroundColor: "#878970",
                            '&:hover': { color: colors.oliveAccent[100] },
                            fontWeight: "bold", '@media print': { display: 'none' }
                        }}>
                            Reset
                        </Button>
                        <Button onClick={() => window.print()} sx={{
                            color: "#3b3c31", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] }, '@media print': { display: 'none' }, fontWeight: "bold", ml: '10px',
                        }} variant="contained" width='150px' >
                            Print
                        </Button>
                    </>
                    :
                    <Box sx={{ '@media print': { display: 'none' }, }}>
                        <Button type="button" variant="contained" onClick={() => handleNewModalOpen()}
                            sx={{
                                color: "#3b3c31",
                                fontWeight: "bold",
                                backgroundColor: "#878970",
                                '&:hover': { color: colors.oliveAccent[100] }
                            }}
                        >
                            Get New Patient Information
                        </Button>
                        <Button type="button" variant="contained" onClick={() => handleExistModalOpen()}
                            sx={{
                                ml: '5px',
                                color: "#3b3c31",
                                fontWeight: "bold",
                                backgroundColor: "#878970",
                                '&:hover': { color: colors.oliveAccent[100] }
                            }}
                        >
                            Get Existing Patient Information
                        </Button>
                        <Button onClick={() => window.print()} 
                            sx={{ 
                                '@media print': { display: 'none' }, 
                                '&:hover': { color: colors.oliveAccent[100] }, 
                                color: "#3b3c31", 
                                ml: '5px', 
                                fontWeight: "bold", 
                                backgroundColor: "#878970", 
                                width: '130px' }} 
                                variant="contained"  
                        >
                            Print
                        </Button>
                    </Box>
            }
            {
                patientDataState ?
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
                            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                            }}
                        >
                            <Typography sx={{ gridColumn: "span 1" }}>Patient ID:</Typography>
                            <Typography sx={{ gridColumn: "span 2" }}>{patientId}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>RT No.</Typography>
                            <Typography sx={{ gridColumn: "span 2" }}>{patientRT}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>Patient Rank</Typography>
                            <Typography sx={{ gridColumn: "span 2" }}>{patientRank}</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>patinents name</Typography>
                            <Typography sx={{ gridColumn: "span 2" }}>{patientName}</Typography>
                        </Box>
                        <Box
                            display="grid"
                            gap="0"
                            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 3" },
                                '@media print': { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
                            }}
                        >
                            <Typography sx={{ gridColumn: "span 1" }}>Guardian</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianName}</Typography>
                            <Box sx={{ gridColumn: "span 1", '@media print': { display: 'none' } }}>
                                <Button type='button' color='secondary' variant='contained' sx={{ height: '80%' }}> Edit </Button>
                            </Box>
                            <Typography sx={{ gridColumn: "span 1" }}>Guardin Unit</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianUnit}</Typography>
                            <Box sx={{ gridColumn: "span 1", '@media print': { display: 'none' } }}>
                                <Button type='button' color='secondary' variant='contained' sx={{ height: '80%' }}> Edit </Button>
                            </Box>
                            <Typography sx={{ gridColumn: "span 1" }}>Guardin Mobile Number</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{guardianPhoneNumber}</Typography>
                            <Box sx={{ gridColumn: "span 1", '@media print': { display: 'none'} }}>
                                <Button type='button' color='secondary' variant='contained' sx={{ height: '80%' }}> Edit </Button>
                            </Box>
                            <Typography sx={{ gridColumn: "span 1" }}>Doctor name</Typography>
                            <Typography sx={{ gridColumn: "span 1" }}>{doctorName}</Typography>
                            <Box sx={{ gridColumn: "span 1", '@media print': { display: 'none'} }}>
                                <Button type='button' color='secondary' variant='contained' sx={{ height: '80%' }}> Edit </Button>
                            </Box>
                        </Box>
                        <FormControl >
                            <FormLabel sx={{ '@media print': { display: 'none', backgroundColor: 'red', height: 0 } }}>Discount</FormLabel>
                            <RadioGroup row name="controlled-radio-buttons-group" value={selectedDiscount}
                                onChange={e => setSelectedDiscount(e.target.value)} sx={{ '@media print': { display: 'none', height: 0 } }}>
                                {
                                    discounts.map(discount => (
                                        <FormControlLabel key={discount._id} value={discount._id} control={<Radio />} label={discount.discountName} />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    : null
            }

            <Formik
                onSubmit={handleInvoiceFormSubmit}
                initialValues={initialValues}
                validationSchema={null}
            >
                {
                    ({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                }}
                            >
                                {/* Select Service(s) */}
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="grouped-demo"
                                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={(option) => String(option.serviceDeptName)}
                                    getOptionLabel={(option) => option.serviceName}
                                    isOptionEqualToValue={(option, value) => {
                                        return option.id === value.id
                                    }}
                                    sx={{
                                        '&  .MuiOutlinedInput-root': {
                                            marginTop: '10px'
                                        }
                                        , width: 300, '@media print': { display: 'none', height: 0, m: 0, backgroundColor: 'red' }
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Service(s)"
                                            name='serviceName'
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                    renderGroup={(params) => {
                                        console.log("render grp params are : ", params);
                                        return (
                                            <li>
                                                <GroupHeader>{params.group}</GroupHeader>
                                                <GroupItems>{params.children}</GroupItems>
                                            </li>
                                        )
                                    }}
                                    onChange={(e, value) => setFieldValue("serviceName", value !== null ? value : initialValues.serviceName)}
                                    onBlur={handleBlur}
                                // error={(!!touched.serviceName && !!errors.serviceName)? !!touched.serviceName && !!errors.serviceName : undefined}
                                // helpertext={touched.serviceName && errors.serviceName}
                                />
                            </Box>
                            {/* <Button onChange={() => Formik.resetForm()}>Reset</Button> */}
                            <Box display="flex" justifyContent="end" mb="20px" sx={{ '@media print': { display: 'none', height: 0, mb: 0 } }}>
                                <Button type="submit" variant="contained" sx={{
                                    '@media print': { display: 'none', height: '0px', margin: '0px' },
                                    width: '150px',
                                    color: "#3b3c31",
                                    fontWeight: "bold",
                                    backgroundColor: "#878970",
                                    '&:hover': { color: colors.oliveAccent[100] }
                                }}>
                                    Bill Summary
                                </Button>
                            </Box>
                        </form>
                    )
                }
            </Formik>
            <Box sx={{ flexGrow: 1, p: 0 }}>
                <TableContainer sx={tableRowData.length < 1 && { display: 'none' }}>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Item No.</TableCell>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Billing Item</TableCell>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Quantity</TableCell>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Unit Price</TableCell>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>RE %</TableCell>
                                <TableCell sx={{ p: 1, fontWeight: 'bold', border: '1px solid gray', '@media print': { color: 'black', borderColor: 'black' } }} align='center'>Net Amount</TableCell>
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
                                <TableCell colSpan={3} rowSpan={3} sx={{ p: 1, border: 'none', '@media print': { color: 'black', borderColor: 'black' } }}>Prepared by - <span style={{ fontWeight: '700' }}>{auth.name}</span> </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box display="flex" justifyContent="end" marginTop='20px' sx={{ '@media print': { display: 'none', m: 0, height: 0 } }}>
                <Button type="button" variant="contained" onClick={() => generateInvoice()}
                    sx={{
                        width: '150px',
                        color: "#3b3c31",
                        fontWeight: "bold",
                        backgroundColor: "#878970",
                        '&:hover': { color: colors.oliveAccent[100] }
                    }}>
                    Generate Invoice
                </Button>
            </Box>


            
            <Modal open={newModalOpen} onClose={handleNewModalClose}>
                <Box sx={modalStyle}>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: 'center',
                            mb: "30px"
                        }}
                    >
                        <PersonOutlinedIcon color="primary" />
                        <Box>
                            <Typography
                                variant="h4"
                                color={colors.grey[100]}
                                fontWeight="bold"
                                sx={{ m: "0 0 0 0" }}
                            >
                                Patient Information
                            </Typography>
                            {/* <Typography variant="h6" color={colors.greenAccent[400]}>
                                {subtitle}
                            </Typography> */}
                        </Box>
                    </Box>

                    <form onSubmit={(e) => handleNewModalFormSubmit(e)}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Patient RT"
                                onChange={e => setPatientRT(e.target.value)}
                                value={patientRT}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Patient Rank"
                                onChange={e => setPatientRank(e.target.value)}
                                value={patientRank}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Patient Name"
                                onChange={e => setPatientName(e.target.value)}
                                value={patientName}
                                sx={{ gridColumn: "span 2" }}
                                />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Patient Phone Number"
                                onChange={e => setPatientPhoneNumber(e.target.value)}
                                value={patientPhoneNumber}
                                sx={{ gridColumn: "span 2" }}
                                />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Guardian Name"
                                onChange={e => setGuardianName(e.target.value)}
                                value={guardianName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Guardian Unit"
                                onChange={e => setGuardianUnit(e.target.value)}
                                value={guardianUnit}
                                sx={{ gridColumn: "span 2" }}
                            />
                            
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Guardian Phone Number"
                                onChange={e => setGuardianPhoneNumber(e.target.value)}
                                value={guardianPhoneNumber}
                                sx={{ gridColumn: "span 2" }}
                            />
                            
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Doctor's Name"
                                onChange={e => setDoctorName(e.target.value)}
                                value={doctorName}
                                sx={{ gridColumn: "span 2" }}
                            />

                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button color="secondary" variant="contained" 
                                sx={{ 
                                    marginRight: "5px",
                                        width: '150px',
                                        color: "#3b3c31",
                                        fontWeight: "bold",
                                        backgroundColor: "#878970",
                                        '&:hover': { color: colors.oliveAccent[100] }
                                }} onClick={() => handleNewModalClose()}>
                                    Back to Invoice
                            </Button>
                            <Button type='submit' variant="contained" 
                                sx={{ 
                                    marginRight: "5px",
                                    width: '150px',
                                    color: "#3b3c31",
                                    fontWeight: "bold",
                                    backgroundColor: "#878970",
                                    '&:hover': { color: colors.oliveAccent[100] }
                                }} >
                                Create New Patient
                            </Button>
                            <Button  variant="contained" onClick={() => handleNewModalClose()}
                                sx={{
                                    marginRight: "5px",
                                    width: '150px',
                                    color: "#3b3c31",
                                    fontWeight: "bold",
                                    backgroundColor: "#878970",
                                    '&:hover': { color: colors.oliveAccent[100] }
                                }}>
                                Cancel
                            </Button>
                        </Box>

                    </form>
                    {/* <Formik
                        onSubmit={handleNewModalFormSubmit}
                        initialValues={modalInitialValues}
                        validationSchema={null}
                    >
                        {
                            ({
                                values,
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                setFieldValue
                            }) => (  
                                <form onSubmit={handleSubmit}>
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                        }}
                                    >
                               
                                        {/* <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient SysCode"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patient_ID}
                                            name="patient_ID"
                                            error={!!touched.patient_ID && !!errors.patient_ID}
                                            helperText={touched.patient_ID && errors.patient_ID}
                                            sx={{ gridColumn: "span 2" }}
                                        /> */}
                                       
                                        {/* <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient ID"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patientId}
                                            name="patientId"
                                            error={!!touched.patientId && !!errors.patientId}
                                            helperText={touched.patientId && errors.patientId}
                                            sx={{ gridColumn: "span 2" }}
                                        /> 
                          
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient RT"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patientRT}
                                            name="patientRT"
                                            error={!!touched.patientRT && !!errors.patientRT}
                                            helperText={touched.patientRT && errors.patientRT}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                     
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient Rank"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patientRank}
                                            name="patientRank"
                                            error={!!touched.patientRank && !!errors.patientRank}
                                            helperText={touched.patientRank && errors.patientRank}
                                            sx={{ gridColumn: "span 2" }}
                                        />
               
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patientName}
                                            name="patientName"
                                            error={!!touched.patientName && !!errors.patientName}
                                            helperText={touched.patientName && errors.patientName}
                                            sx={{ gridColumn: "span 2" }}
                                        />
      
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Patient Phone Number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.patientPhoneNumber}
                                            name="patientPhoneNumber"
                                            error={!!touched.patientPhoneNumber && !!errors.patientPhoneNumber}
                                            helperText={touched.patientPhoneNumber && errors.patientPhoneNumber}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                     
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Guardian Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.guardianName}
                                            name="guardianName"
                                            error={!!touched.guardianName && !!errors.guardianName}
                                            helperText={touched.guardianName && errors.guardianName}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Guardian Unit"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.guardianUnit}
                                            name="guardianUnit"
                                            error={!!touched.guardianUnit && !!errors.guardianUnit}
                                            helperText={touched.guardianUnit && errors.guardianUnit}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Guardian Phone Number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.guardianPhoneNumber}
                                            name="guardianPhoneNumber"
                                            error={!!touched.guardianPhoneNumber && !!errors.guardianPhoneNumber}
                                            helperText={touched.guardianPhoneNumber && errors.guardianPhoneNumber}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Doctor's Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.doctorName}
                                            name="doctorName"
                                            error={!!touched.doctorName && !!errors.doctorName}
                                            helperText={touched.doctorName && errors.doctorName}
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                    </Box>
                                    <Box display="flex" justifyContent="end" mt="20px">
                                        <Button color="secondary" variant="contained" 
                                        sx={{ 
                                            marginRight: "5px",
                                                width: '150px',
                                                color: "#3b3c31",
                                                fontWeight: "bold",
                                                backgroundColor: "#878970",
                                                '&:hover': { color: colors.oliveAccent[100] }
                                        }} onClick={() => handleNewModalClose()}>
                                            Back to Invoice
                                        </Button>
                                        <Button type='submit' variant="contained" 
                                            sx={{ 
                                                marginRight: "5px",
                                                width: '150px',
                                                color: "#3b3c31",
                                                fontWeight: "bold",
                                                backgroundColor: "#878970",
                                                '&:hover': { color: colors.oliveAccent[100] }
                                            }} >
                                            Create New Patient
                                        </Button>
                                        <Button  variant="contained" onClick={() => handleNewModalClose()}
                                            sx={{
                                                marginRight: "5px",
                                                width: '150px',
                                                color: "#3b3c31",
                                                fontWeight: "bold",
                                                backgroundColor: "#878970",
                                                '&:hover': { color: colors.oliveAccent[100] }
                                            }}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </form>
                            )
                        }
                    </Formik> */}
                </Box>
            </Modal>
        </Box>
    );
};

export default CreateInvoice;