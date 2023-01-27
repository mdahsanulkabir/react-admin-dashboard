import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { tokens } from '../../theme';
import Header2 from "../../components/Header2";
import { DataGrid } from "@mui/x-data-grid";


const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  // contact: yup
  //   .string()
  //   .matches(phoneRegExp, "Phone number is not valid")
  //   .required("required"),
  userId: yup.string().required("required"),
  access: yup.object().shape({
    id: yup.string().required("required"),
    label: yup.string().required("required")
  }),
});
const initialValues = {
  name: "",
  userId: "",
  access: ""
};

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [accesses, setAccesses] = useState([])
  const auth = useContext(AuthContext);
  const { access_token, name, userRole } = auth;

  const [ existingUsers, setExistingUsers ] = useState([])

  useEffect(() => {
    fetch(`https://cmh-server01.onrender.com/api/getUsers`)
        .then(res => res.json())
        .then(data => setExistingUsers(data))
  }, [])
  console.log(existingUsers);
  const columns = [
    { field: "sl", headerName: "SL" },
    {
        field: "name",
        headerName: "User Name",
        flex: 1,
        cellClassName: "name-column--cell",
    },
    {
      field: "userId",
        headerName: "User ID",
        flex: 1,
        cellClassName: "name-column--cell",
    },
    {
      field: "access",
        headerName: "User Role",
        flex: 1,
        cellClassName: "name-column--cell",
    }
  ]

  let userList = []

  userList = existingUsers.map((user, index) => {
    return {
      id : index,
      sl: index +1,
      name : user.name,
      userId : user.userId,
      access : user.accessId.access
    }
  })


  useEffect(() => {
    fetch(`https://cmh-server01.onrender.com/api/getRoles`)
      .then(res => res.json())
      .then(data => setAccesses(data))
  }, [])

  console.log(accesses);

  const accessList = accesses.map((acc) => ({
    id: acc._id,
    label: acc.access
  }))

  const handleFormSubmit = async (values) => {
    console.log(values);
    const newUser = {
      name: values.name,
      userId: values.userId,
      accessId: values.access.id
    }

    const response = await fetch(`https://cmh-server01.onrender.com/api/createUser`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
        // Authorization: 'Bearer ' + token,
      },
    });

    const json = await response.json();
    // console.log(json.departmentName);

    // if (!response.ok) {
    //     setError(json.error);
    // }

    if (response.ok) {
      console.log(json);
      const newUserAccess = accesses.find(access=> access._id ===json.accessId)
      const newUser = {
        name : json.name,
        userId : json.userId,
        accessId : {
          access : newUserAccess
      }}
      let list = [...existingUsers];
      setExistingUsers([...list, newUser])
      // userList = [...list, {
      //     id : list.length,
      //     sl: list.length + 1,
      //     name : json.name,
      //     userId : json.userId,
      //     access : newUserAccess
      // }]
    }
  };

  return (
    <Box m="20px">
      <Header title="SHOW / CREATE USER(s)" subtitle="Show and Create a New User Profile" />

      <Header2 title="EXISTING USERS" subtitle="" />

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
          <DataGrid checkboxSelection rows={userList} columns={columns} />
      </Box>


      <Header2 title="CREATE USER" subtitle="" />
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
                label="User Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="User Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userId}
                name="userId"
                error={!!touched.userId && !!errors.userId}
                helperText={touched.userId && errors.userId}
                sx={{ gridColumn: "span 2" }}
              />
              <Autocomplete
                disablePortal
                sx={{ gridColumn: "span 2" }}
                // name="departmentName"
                options={accessList}
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
                    label="Access Level"
                    name="access"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
                onChange={(e, value) => setFieldValue("access", value !== null ? value : initialValues.access)}
                onBlur={handleBlur}
              // error={(!!touched.departmentName && !!errors.departmentName)? !!touched.departmentName && !!errors.departmentName : undefined}
              // helpertext={touched.departmentName && errors.departmentName}
              />

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" sx={{ width: '150px', color: "#3b3c31", fontWeight: "bold", backgroundColor: "#878970", '&:hover': { color: colors.oliveAccent[100] } }} variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;



export default Form;
