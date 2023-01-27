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
    departmentName: yup.string().required("required")
});
const initialValues = {
    departmentName: "",
};

const Department = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [existingDepartments, setExistingDepartments] = useState([])
    useEffect(() => {
        fetch(`https://cmh-server01.onrender.com/api/getDepartments`)
            .then(res => res.json())
            .then(data => setExistingDepartments(data))
    }, [])
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    console.log(existingDepartments);

    const columns = [
        { field: "sl", headerName: "SL" },
        {
            field: "departmentName",
            headerName: "Department Name",
            flex: 1,
            cellClassName: "name-column--cell",
        }
    ]
    // const [deptList, setDeptList] = useState([]);
    let deptList = []

    deptList = existingDepartments.map((dept, index) => {
        return {
            id: index,
            sl: index + 1,
            departmentName: dept.departmentName
        }
    })

    const handleFormSubmit = async (values) => {
        console.log(values);

        const response = await fetch(`https://cmh-server01.onrender.com/api/createDepartment`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
                // Authorization: 'Bearer ' + token,
            },
        });

        const json = await response.json();
        console.log(json.departmentName);

        // if (!response.ok) {
        //     setError(json.error);
        // }

        if (response.ok) {
            const list = [...deptList];
            setExistingDepartments([...list, {
                id: list.length,
                sl: list.length + 1,
                departmentName: json.departmentName
            }])
        }
    };

    return (
        <Box m="20px">
            <Header title="DEPARTMENT" subtitle="View/Create Departments" />

            <Header2 title="EXISTING DEPARTMENTS" subtitle="" />
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
                <DataGrid checkboxSelection rows={deptList} columns={columns} />
            </Box>


            <Header2 title="CREATE DEPARTMENT" subtitle="" />
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
                                label="Department Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.departmentName}
                                name="departmentName"
                                error={!!touched.departmentName && !!errors.departmentName}
                                helperText={touched.departmentName && errors.departmentName}
                                sx={{ gridColumn: "span 2" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" sx={{ width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }} variant="contained">
                                Create New Department
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};



export default Department;
