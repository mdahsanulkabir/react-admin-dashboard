import { Box, Button, Paper, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { useContext } from 'react';
import { CleaningServices } from '@mui/icons-material';

const checkoutSchema = yup.object().shape({
    userId: yup.string().required("required"),
    password: yup.string().required("required"),
});
const initialValues = {
    userId: "",
    password: ""
};

const Login = (props) => {
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { setAuthenticated, setAuth } = props;


    const handleFormSubmit = async (values) => {
        console.log(values);
        const credential = {
            userId: values.userId,
            password: values.password
        }

        const response = await fetch(`https://cmh-server01.onrender.com/api/login`, {
            method: "POST",
            body: JSON.stringify(credential),
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

        if (json.error === "Authentication Failed !") {
            alert("Auth Fail !!!")
        }

        if (response.ok) {
            setAuthenticated(true);
            localStorage.setItem('auth', JSON.stringify(json))
            setAuth(json);
        }

        if (json?.userRole === 'Admin') {
            console.log(json.userRole)
            navigate('layout')
        } else if (json?.userRole === 'Business Manager') {
            console.log(json.userRole)
            navigate('layout/modifyInvoice')
        } else if (json?.userRole === 'Operator') {
            console.log(json.userRole)
            navigate('layout/createInvoice')
        } else {
            console.log(json.userRole)
            navigate('layout/serviceProvider')
        }
    }


    return (
        <Box width='auto' height='100vh' display="flex" justifyContent="center" alignItems="center">
            <Box sx={{ width: '500px', height: 'auto', p: 2 }} backgroundColor={colors.primary[400]}>
                <Typography variant="h2" color={colors.oliveAccent[100]} fontWeight="bold" sx={{ m: "0 0 5px 0", textAlign: 'center' }}>
                    LOGIN
                </Typography>
                <Typography variant="h5" color="#d2d2c0" sx={{ textAlign: 'center' }}>
                    Welcome to CMH Cancer Center Billing Application Software. <br />
                    Please Login
                </Typography>
                <Box sx={{ width: "90%", height: "2px", marginInline: 'auto' }} backgroundColor="#9ca324"></Box>

                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {
                        ({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="flex"
                                    flexDirection='column'
                                    width='70%'
                                    marginInline='auto'
                                >
                                    <TextField
                                        fullWidth
                                        autoComplete="new-password"
                                        sx={{ marginBlock: 2 }}
                                        variant="filled"
                                        type="text"
                                        label="User Id"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.userId}
                                        name="userId"
                                        error={!!touched.userId && !!errors.userId}
                                        helperText={touched.userId && errors.userId}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        sx={{ marginBlock: 2 }}
                                        type="password"
                                        label="Password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="center" mt="20px">
                                    <Button sx={{ width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }} type="submit" variant="contained">
                                        Login
                                    </Button>
                                </Box>
                            </form>
                        )
                    }
                </Formik>

            </Box>

        </Box>
    );
};

export default Login;