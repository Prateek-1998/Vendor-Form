import React, { useState } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import VehicleTab from './VehicleTab'
import { useFormik } from 'formik';
import * as Yup from 'yup';


const validateForm = Yup.object().shape({
      companyName: Yup.string(),
      ownerName: Yup.string().required('Owner name is required.'),
      contactNumber: Yup.string()
          .matches(/^[0-9]{10}$/, 'A valid contact number is required.')
          .required('Contact number is required.'),
      address: Yup.string().required('Address is required.'),
      services: Yup.object().shape({
          bikeRental: Yup.boolean(),
          carRental: Yup.boolean(),
          bus: Yup.boolean(),
          coaches: Yup.boolean(),
          cab: Yup.boolean(),
          others: Yup.boolean(),
          otherType: Yup.string(),
      }).required('At least one service is required.'),
  });
const VendorDetails = (onSubmit) => {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    contactNumber: '',
    address: '',
    services: {
      bikeRental: false,
      carRental: false,
      bus: false,
      coaches: false,
      cab: false,
      others: false,
      otherType: '',
    },
  });
  const formik = useFormik({
    initialValues: { formData },
    validateForm,
    onSubmit: (values) => {
   onSubmit(values);
    },
  });



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'others') {
        setFormData({
          ...formData,
          services: {
            ...formData.services,
            [name]: checked,
            otherType: checked ? formData.services.otherType : '',
          },
        });
      } else {
        setFormData({
          ...formData,
          services: {
            ...formData.services,
            [name]: checked,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-[800px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Become a Vendor</h2>
        <p className="text-gray-600 mb-8 text-center">Fill out the application to partner with us today!</p>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Name of the company (Optional)"
              variant="outlined"
              fullWidth
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            <TextField
              label="Name of the owner"
              variant="outlined"
              fullWidth
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
            <TextField
              label="Contact number"
              variant="outlined"
              fullWidth
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <TextField
              label="Office or Home Address"
              variant="outlined"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

         
          <div className="mt-6">
            <p className="text-lg font-medium mb-2">Services offered (Select all that apply)</p>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(formData.services).slice(0, 5).map((service) => (
                <FormControlLabel
                  key={service}
                  control={<Checkbox name={service} checked={formData.services[service]} onChange={handleChange} />}
                  label={service.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                />
              ))}
              <div className="flex items-center space-x-2">
                <FormControlLabel
                  control={<Checkbox name="others" checked={formData.services.others} onChange={handleChange} />}
                  label="Others"
                />
                {formData.services.others && (
                  <TextField
                    label="Mention the service type"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="otherType"
                    value={formData.services.otherType}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </div>

          
        </form>

        
        {Object.entries(formData.services).map(([key, value]) =>
          value && key !== 'others' ? <VehicleTab key={key} service={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} /> : null
        )}
        {formData.services.others && formData.services.otherType && (
          <VehicleTab parentFormik={formik} service={formData.services.otherType} />
        )}
      </div>
    </div>
  );
};

export default VendorDetails;