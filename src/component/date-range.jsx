
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

const DateRange = ({ control, getValues, watch, setValue, errors }) => {
  // 監聽日期變化
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // 即時驗證的回呼
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setValue("endDate", null); // 如果結束日小於起始日，清除結束日
    }
  }, [startDate, endDate, setValue]);

  return (
    <div className="date-picker-container">
      <div className="picker">
        <label>起始日</label>
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: "起始日為必填",
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="yyyy"
            />
          )}
        />
        {errors.startDate && <p className="error-message">{errors.startDate.message}</p>}
      </div>

      <div className="picker" >
        <label>結束日</label>
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: "結束日為必填",
            validate: (value) => {
              // 確保結束日大於等於起始日
              const startDate = getValues("startDate");
              return !startDate || value >= startDate || "結束日不可小於起始日";
            },
          }}
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              minDate={getValues("startDate")} // 動態設置結束日最小日期
              dateFormat="dd"
            />
          )}
        />
        {errors.endDate && <p className="error-message">{errors.endDate.message}</p>}
      </div>
    </div>
  );
};

export default DateRange;
