import { Box, Button, TextField, useTheme } from "@mui/material";
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
    discountName: yup.string().required("required"),
    discountRate: yup.number().min(0).max(100).required("required")
});
const initialValues = {
    discountName: "",
    discountRate: 0
};

const Discount = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [existingDiscountCategories, setExistingDiscountCategories] = useState([])
    useEffect(() => {
        fetch(`https://cmh-server01.onrender.com/api/getDiscounts`)
            .then(res => res.json())
            .then(data => setExistingDiscountCategories(data))
    }, [])
    console.log("existing discounts", existingDiscountCategories);

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "discountName",
            headerName: "Discount Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "discountRate",
            headerName: "Rate (%)",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]
    let discountListArranged = []
    discountListArranged = existingDiscountCategories.map((discount, index) => {
        return {
            id: index,
            sl: index + 1,
            key: discount._id,
            discountName: discount.discountName,
            discountRate: discount.discountRate
        }
    })
    console.log("discount list : ", discountListArranged);

    const handleFormSubmit = async (values) => {
        console.log(values);
        const newDiscount = {
            discountName: values.discountName,
            discountRate: values.discountRate
        }
        console.log(newDiscount);
        const response = await fetch(`https://cmh-server01.onrender.com/api/createDiscount`, {
            method: "POST",
            body: JSON.stringify(newDiscount),
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
            const list = [...existingDiscountCategories];
            setExistingDiscountCategories([...list, {


                _id: json._id,
                discountName: json.discountName,
                discountRate: json.discountRate
            }])
        }
    };

    return (
        <Box m="20px">
            <Header title="DISCOUNTS" subtitle="View/Create Discount Categories" />

            <Header2 title="EXISTING DISCOUNT CATEGORIES" subtitle="" />
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
                <DataGrid rows={discountListArranged} columns={columns} />
            </Box>


            <Header2 title="CREATE DISCOUNT" subtitle="Create Discount Scheme" />
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
                                label="Discount Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.discountName}
                                name="discountName"
                                error={!!touched.discountName && !!errors.discountName}
                                helperText={touched.discountName && errors.discountName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Discount Rate (%)"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.discountRate}
                                name="discountRate"
                                error={!!touched.discountRate && !!errors.discountRate}
                                helperText={touched.discountRate && errors.discountRate}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" sx={{ width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }} variant="contained">
                                Create Discount Category
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};



export default Discount;