import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form"

function FormInput({ name, label, required }) {
  const isError = false;
  const {  control } = useForm();
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        as={TextField}
        name={name}
        control={control}
        error={isError}
        render={({ field }) => (
          <TextField
            required
            fullWidth
            label={label}
          />
        )}
      />
    </Grid>

  );
}

export default FormInput;

// import React from "react";
// import ReactDatePicker from "react-datepicker";
// import { TextField } from "@material-ui/core";
// import { useForm, Controller } from "react-hook-form";

// function App() {
//   const { handleSubmit, control } = useForm();

//   return (
//     <form onSubmit={handleSubmit(data => console.log(data))}>
//       <Controller
//         control={control}
//         name="ReactDatepicker"
//         render={({ field: { onChange, onBlur, value, ref } }) => (
//           <ReactDatePicker
//             onChange={onChange}
//             onBlur={onBlur}
//             selected={value}
//           />
//         )}
//       />
      
//       <input type="submit" />
//     </form>
//   );
// }