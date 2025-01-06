import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; 

const DatePickerOpenTo = ({ control, errors }) => {
  dayjs.locale("zh-tw"); 
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name="date"
        control={control}
        rules={{
          required: "請選擇日期再送出",
        }}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="選擇日期"
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
            value={field.value || null}
            onChange={(newValue) => field.onChange(newValue)}
          />
        )}
      />
      {errors.date && <p className="error-message">{errors.date.message}</p>}
    </LocalizationProvider>
  );
}

export default DatePickerOpenTo
