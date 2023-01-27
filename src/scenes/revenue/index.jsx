import { Box } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';


const Revenue = () => {
    const [startDate, setStartDate] = useState(dayjs('2023-01-01'));
    const [endDate, setEndDate] = useState(dayjs('2023-01-25'));

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box m='20px'>
                <Box sx={{'@media print': { display : 'none'}}}>
                    <Header title="REVENUE HISTORY" subtitle="Get Revenue as duration" />
                </Box>
                    <DatePicker
                        // views={['year', 'month']}
                        label="Select Start Date"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                    <DatePicker
                        // views={['year', 'month']}
                        label="Select End Date"
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
            </Box>
        </LocalizationProvider>
    )

}

export default Revenue;