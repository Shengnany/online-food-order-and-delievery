import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, TextField } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';
import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken, test }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const { register, handleSubmit } = useForm();

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region: stateProvince });

    setShippingOptions(options);
    if (options[0]) {
      setShippingOption(options[0].id);
    }
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping address</Typography>
      <FormProvider >
        <form onSubmit={handleSubmit((data) => test({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
          <Grid container spacing={3}>
            {/* <FormInput name="firstName" label="First name" />
            <FormInput name="lastName" label="Last name" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="City" />
            <FormInput name="zip" label="Zip / Postal code" /> */}
            <Grid item xs={12} sm={6}>
              <TextField id="standard-secondary" label="First Name" color="secondary"
                {...register("firstName", { required: "Please enter your first name." })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="standard-secondary" label="Last Name" color="secondary"
                {...register("lastName", { required: "Please enter your lastt name." })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="standard-secondary" label="Second Name" color="secondary"
                {...register("address1", { required: "Please enter your Address." })} />
            </Grid>
            <Grid item xs={12} sm={6}>

              <TextField id="standard-secondary" label="Email" color="secondary"
                {...register("email", { required: "Please enter your Email." })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="standard-secondary" label="City" color="secondary"
                {...register("city", { required: "Please enter your city." })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="standard-secondary" label="Zip Code" color="secondary"
                {...register("zip", { required: "Please enter your Zip." })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
