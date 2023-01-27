import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import Header2 from "../../components/Header2";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useState } from "react";
import { useEffect } from "react";


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
    departmentName: {
        id: '',
        label: ''
    },
    servicePrice: 0
};

const Services = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [existingServices, setExistingServices] = useState([])
    useEffect(() => {
        fetch(`https://cmh-server01.onrender.com/api/getServices`)
            .then(res => res.json())
            .then(data => setExistingServices(data))
    }, [])
    const [existingDepartments, setExistingDepartments] = useState([])
    useEffect(() => {
        fetch(`https://cmh-server01.onrender.com/api/getDepartments`)
            .then(res => res.json())
            .then(data => setExistingDepartments(data))
    }, [])
    const departments = existingDepartments.map(dept => ({
        label: dept.departmentName,
        id: dept._id
    }))
    console.log('departments', departments);
    console.log("existing services", existingServices);

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "serviceName",
            headerName: "Service Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "departmentName",
            headerName: "Department Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "servicePrice",
            headerName: "Price (Tk.)",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]
    let servicesList = []
    servicesList = existingServices.map((service, index) => {
        return {
            id: index,
            sl: index + 1,
            key: service._id,
            serviceName: service.serviceName,
            departmentName: service.departmentId.departmentName,
            servicePrice: service.servicePrice
        }
    })
    console.log("services list : ", servicesList);

    const handleFormSubmit = async (values) => {
        console.log(values);
        const newService = {
            serviceName: values.serviceName,
            departmentId: values.departmentName.id,
            servicePrice: values.servicePrice
        }
        console.log(newService);
        const response = await fetch(`https://cmh-server01.onrender.com/api/createService`, {
            method: "POST",
            body: JSON.stringify(newService),
            headers: {
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + token,
            },
        });

        const json = await response.json();
        console.log(json);

        // if (!response.ok) {
        //     setError(json.error);
        // }

        if (response.ok) {
            // console.log('in response dept id',json.departmentId);
            const list = [...existingServices];
            setExistingServices([...list, {


                _id: json._id,
                serviceName: json.serviceName,
                departmentId: {
                    _id: json.departmentId,
                    departmentName: departments.find(dept => dept.id === json.departmentId).label
                },
                servicePrice: json.servicePrice
            }])
        }
    };

    return (
        <Box m="20px">
            <Header title="SERVICES" subtitle="View/Create Services" />

            <Header2 title="EXISTING SERVICES" subtitle="" />
            <Box
                m="20px 0 20px 0"
                height="40vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                {/* <DataGrid checkboxSelection rows={servicesList} columns={columns} /> */}
                <DataGrid rows={servicesList} columns={columns} />
            </Box>


            <Header2 title="CREATE SERVICE" subtitle="" />
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
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
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Service Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.serviceName}
                                name="serviceName"
                                error={!!touched.serviceName && !!errors.serviceName}
                                helperText={touched.serviceName && errors.serviceName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            {/* <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Department Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.departmentName}
                                name="departmentName"
                                error={!!touched.departmentName && !!errors.departmentName}
                                helperText={touched.departmentName && errors.departmentName}
                                sx={{ gridColumn: "span 2" }}
                            /> */}
                            <Autocomplete
                                disablePortal
                                sx={{ gridColumn: "span 2" }}
                                // name="departmentName"
                                options={departments}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => {
                                    return option.id === value.id
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        {option.label}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Department Name"
                                        name="departmentName"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                                onChange={(e, value) => setFieldValue("departmentName", value !== null ? value : initialValues.departmentName)}
                                onBlur={handleBlur}
                            // error={(!!touched.departmentName && !!errors.departmentName)? !!touched.departmentName && !!errors.departmentName : undefined}
                            // helpertext={touched.departmentName && errors.departmentName}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Service Price (Tk.)"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.servicePrice}
                                name="servicePrice"
                                error={!!touched.servicePrice && !!errors.servicePrice}
                                helperText={touched.servicePrice && errors.servicePrice}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" sx={{ width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }} variant="contained">
                                Create New Service
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};



export default Services;