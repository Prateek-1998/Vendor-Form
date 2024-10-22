import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import districts from './list.json'

import {
    TextField,
    Button,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,

} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FILE_SIZE_2MB = 2 * 1024 * 1024;
const FILE_SIZE_5MB = 5 * 1024 * 1024;
const validationSchema = Yup.object().shape({
    vehicles: Yup.array().of(
        Yup.object().shape({
            modelName: Yup.string().required('Model Name is required'),
            vehicleAge: Yup.number().required('Vehicle Age is required').min(1, 'Invalid age'),
            registrationNumber: Yup.string().required('Registration Number is required'),
            occupants: Yup.number().required('Occupants is required').min(1, 'At least one occupant is required'),
            baseLocation: Yup.string().required('Base Location is required'),
            citiesCatered: Yup.string().required('Cities Catered is required'),
            areasExcluded: Yup.string(),
            musicSystem: Yup.string().required('This field is required'),
            modifications: Yup.string().required('This field is required'),
            airConditioning: Yup.string().required('This field is required'),
            fuelType: Yup.string().required('Fuel Type is required'),
            photos: Yup.array()
                .min(1, 'At least one photo is required')
                .test('fileSize', 'Photo size must be less than 2MB', (files) =>
                    !files || files.every(file => file.size <= FILE_SIZE_2MB)
                )
                .required('This field is required'),
            documents: Yup.array()
                .min(1, 'At least one document is required')
                .test('fileSize', 'Document size must be less than 5MB', (files) =>
                    !files || files.every(file => file.size <= FILE_SIZE_5MB)
                )
                .required('This field is required'),
        })
    ),
});


const VehicleTab = ({ service, parentFormik }) => {
    const [vehicles, setVehicles] = useState([createVehicle()]);
    const formik = useFormik({
        initialValues: { vehicles },
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });
    function createVehicle() {
        return {
            id: Date.now(),
            modelName: '',
            vehicleAge: '',
            registrationNumber: '',
            occupants: '',
            baseLocation: '',
            citiesCatered: '',
            areasExcluded: '',
            musicSystem: '',
            modifications: '',
            airConditioning: '',
            fuelType: '',
            photos: [],
            documents: [],
        };
    }


    const addVehicle = () => {
        const newVehicle = createVehicle();
        setVehicles([...vehicles, newVehicle]);
        formik.setFieldValue('vehicles', [...formik.values.vehicles, newVehicle]);
    };


    const removeVehicle = (id) => {
        const newVehicles = vehicles.filter(vehicle => vehicle.id !== id);
        setVehicles(newVehicles);
        formik.setFieldValue('vehicles', newVehicles);
    };

    const [expanded, setExpanded] = useState(true);
    const handleAccordionChange = () => {
        setExpanded(!expanded);
    }

    const handleVehicleChange = (index, field, value) => {
        const newVehicles = [...formik.values.vehicles];
        newVehicles[index][field] = value;
        formik.setFieldValue('vehicles', newVehicles);
    };
    const handlePhotoDrop = (acceptedFiles, index) => {
        const newVehicles = [...formik.values.vehicles];
        newVehicles[index].photos = acceptedFiles;
        formik.setFieldValue('vehicles', newVehicles);
    };
    const handleDocumentDrop = (acceptedFiles, index) => {
        const newVehicles = [...formik.values.vehicles];
        newVehicles[index].documents = acceptedFiles;
        formik.setFieldValue('vehicles', newVehicles);
    };

    const allDistricts = districts.states.flatMap(state => state.districts);


    return (
        <><div className="max-w-[1000px] mx-auto p-4">
            <form onSubmit={formik.handleSubmit} className="p-4">
                <h2>Vehicle Information (Only Owned by you)</h2>

                <Accordion

                    expanded={expanded}
                    onChange={handleAccordionChange}
                    className="max-w-[800px] mx-auto p-4" defaultExpanded>

                    <AccordionSummary
                        style={{ backgroundColor: 'bisque' }}
                        expandIcon={<ExpandMoreIcon />}>

                        <h3 className="font-semibold">Service Description - {service} </h3>

                    </AccordionSummary>


                    <AccordionDetails>

                        {formik.values.vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className={`mb-4 ${index > 0 ? 'mt-8' : ''}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span>{`${index + 1}) ${service}`}</span>
                                    </div>
                                    <Button
                                        color="secondary"
                                        onClick={() => removeVehicle(vehicle.id)}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Remove
                                    </Button>

                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <TextField
                                        label="Model Name"
                                        name={`vehicles[${index}].modelName`}
                                        select
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'modelName', e.target.value)}
                                        value={vehicle.modelName}
                                        error={formik.touched.vehicles?.[index]?.modelName && Boolean(formik.errors.vehicles?.[index]?.modelName)}
                                        helperText={formik.touched.vehicles?.[index]?.modelName && formik.errors.vehicles?.[index]?.modelName}
                                    >
                                        <MenuItem value="Model 1">Model 1</MenuItem>
                                        <MenuItem value="Model 2">Model 2</MenuItem>
                                    </TextField>


                                    <TextField
                                        label="Age of the vehicle"
                                        name={`vehicles[${index}].vehicleAge`}
                                        type="number"
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'vehicleAge', e.target.value)}
                                        value={vehicle.vehicleAge}
                                        error={formik.touched.vehicles?.[index]?.vehicleAge && Boolean(formik.errors.vehicles?.[index]?.vehicleAge)}
                                        helperText={formik.touched.vehicles?.[index]?.vehicleAge && formik.errors.vehicles?.[index]?.vehicleAge} />


                                    <TextField
                                        label="Vehicle Registration Number"
                                        name={`vehicles[${index}].registrationNumber`}
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'registrationNumber', e.target.value)}
                                        value={vehicle.registrationNumber}
                                        error={formik.touched.vehicles?.[index]?.registrationNumber && Boolean(formik.errors.vehicles?.[index]?.registrationNumber)}
                                        helperText={formik.touched.vehicles?.[index]?.registrationNumber && formik.errors.vehicles?.[index]?.registrationNumber} />


                                    <TextField
                                        label="Ideal Number of Occupants"
                                        name={`vehicles[${index}].occupants`}
                                        select
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'occupants', e.target.value)}
                                        value={vehicle.occupants}
                                        error={formik.touched.vehicles?.[index]?.occupants && Boolean(formik.errors.vehicles?.[index]?.occupants)}
                                        helperText={formik.touched.vehicles?.[index]?.occupants && formik.errors.vehicles?.[index]?.occupants}
                                    >
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        
                                    </TextField>


                                    <TextField
                                        label="Base Location of the Vehicles"
                                        name={`vehicles[${index}].baseLocation`}
                                        select
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'baseLocation', e.target.value)}
                                        value={vehicle.baseLocation}
                                        error={formik.touched.vehicles?.[index]?.baseLocation && Boolean(formik.errors.vehicles?.[index]?.baseLocation)}
                                        helperText={formik.touched.vehicles?.[index]?.baseLocation && formik.errors.vehicles?.[index]?.baseLocation}
                                    >
                                        {allDistricts.map((district, idx) => (
                                            <MenuItem key={idx} value={district}>
                                                {district}
                                            </MenuItem>
                                        ))}

                                    </TextField>


                                    <TextField
                                        label="Cities Catered"
                                        name={`vehicles[${index}].citiesCatered`}
                                        select
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'citiesCatered', e.target.value)}
                                        value={vehicle.citiesCatered}
                                        error={formik.touched.vehicles?.[index]?.citiesCatered && Boolean(formik.errors.vehicles?.[index]?.citiesCatered)}
                                        helperText={formik.touched.vehicles?.[index]?.citiesCatered && formik.errors.vehicles?.[index]?.citiesCatered}
                                    >
                                        {allDistricts.map((district, idx) => (
                                            <MenuItem key={idx} value={district}>
                                                {district}
                                            </MenuItem>
                                        ))}
                                    ))}
                                    </TextField>


                                    <TextField
                                        label="Out of the selected city, which areas you don’t serve?"
                                        name={`vehicles[${index}].areasExcluded`}
                                        fullWidth
                                        onChange={(e) => handleVehicleChange(index, 'areasExcluded', e.target.value)}
                                        value={vehicle.areasExcluded}
                                        error={formik.touched.vehicles?.[index]?.areasExcluded && Boolean(formik.errors.vehicles?.[index]?.areasExcluded)}
                                        helperText={formik.touched.vehicles?.[index]?.areasExcluded && formik.errors.vehicles?.[index]?.areasExcluded} />
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block mb-2">Indicate if a music system is available:</label>
                                        <RadioGroup
                                            name={`vehicles[${index}].musicSystem`}
                                            onChange={(e) => handleVehicleChange(index, 'musicSystem', e.target.value)}
                                            value={vehicle.musicSystem}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                        {formik.touched.vehicles?.[index]?.musicSystem && formik.errors.vehicles?.[index]?.musicSystem && (
                                            <div className="text-red-500">{formik.errors.vehicles[index].musicSystem}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2">Were there any modifications done?</label>
                                        <RadioGroup
                                            name={`vehicles[${index}].modifications`}
                                            onChange={(e) => handleVehicleChange(index, 'modifications', e.target.value)}
                                            value={vehicle.modifications}
                                        >
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                        {formik.touched.vehicles?.[index]?.modifications && formik.errors.vehicles?.[index]?.modifications && (
                                            <div className="text-red-500">{formik.errors.vehicles[index].modifications}</div>
                                        )}
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block mb-2">Select if the vehicle has air conditioning:</label>
                                        <RadioGroup
                                            name={`vehicles[${index}].airConditioning`}
                                            onChange={(e) => handleVehicleChange(index, 'airConditioning', e.target.value)}
                                            value={vehicle.airConditioning}
                                        >
                                            <FormControlLabel value="ac" control={<Radio />} label="A/C" />
                                            <FormControlLabel value="non-ac" control={<Radio />} label="Non - A/C" />
                                        </RadioGroup>
                                        {formik.touched.vehicles?.[index]?.airConditioning && formik.errors.vehicles?.[index]?.airConditioning && (
                                            <div className="text-red-500">{formik.errors.vehicles[index].airConditioning}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-2">Fuel Type:</label>
                                        <RadioGroup
                                            name={`vehicles[${index}].fuelType`}
                                            onChange={(e) => handleVehicleChange(index, 'fuelType', e.target.value)}
                                            value={vehicle.fuelType}
                                        >
                                            <FormControlLabel value="petrol" control={<Radio />} label="Petrol" />
                                            <FormControlLabel value="diesel" control={<Radio />} label="Diesel" />
                                            <FormControlLabel value="cng" control={<Radio />} label="CNG" />
                                        </RadioGroup>
                                        {formik.touched.vehicles?.[index]?.fuelType && formik.errors.vehicles?.[index]?.fuelType && (
                                            <div className="text-red-500">{formik.errors.vehicles[index].fuelType}</div>
                                        )}
                                    </div>
                                </div>



                                <Typography variant="h6">Upload Photos</Typography>
                                <Box className="border-2 rounded-[20px] border-dashed border-blue-300 p-0 bg-blue-50">
                                    <Dropzone
                                        onDrop={(acceptedFiles) => handlePhotoDrop(acceptedFiles, index)}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className="cursor-pointer flex flex-col items-center p-4">
                                                <UploadFileIcon fontSize="large" className="text-blue-400" />
                                                <input {...getInputProps()} />
                                                <p className="text-center">Choose a file or drag and drop it here</p>
                                                <p className="text-xs text-gray-500">png, jpeg, webp formats, max size 2MB</p>
                                            </div>
                                        )}
                                    </Dropzone>
                                </Box>
                                {vehicle.photos.length > 0 && (
                                    <Typography variant="body2">
                                        {`Uploaded ${vehicle.photos.length} photo(s).`}
                                    </Typography>
                                )}


                                <Typography variant="h6">Upload insurance or registration</Typography>
                                <Box className="border-2 rounded-[20px]  border-dashed border-blue-300 p-0 bg-blue-50">

                                    <Dropzone
                                        onDrop={(acceptedFiles) => handleDocumentDrop(acceptedFiles, index)}

                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className="cursor-pointer flex flex-col items-center p-4">
                                                <UploadFileIcon fontSize="large" className="text-blue-400" />
                                                <input {...getInputProps()} />
                                                <p className="text-center">Choose a file or drag and drop it here</p>
                                                <p className="text-xs text-gray-500">png, jpeg, webp, pdf, docx formats, max size 5MB</p>
                                            </div>
                                        )}
                                    </Dropzone>
                                    {formik.touched.documents && formik.errors.documents && (
                                        <Typography className="text-red-500 mt-2">{formik.errors.documents}</Typography>
                                    )}
                                </Box>



                            </div>
                        ))}
                        <div className="text-center mt-4">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addVehicle}
                                style={{ width: '200px' }}
                            >
                                Add {service}
                            </Button>
                        </div>
                    </AccordionDetails>



                </Accordion>






            </form>
        </div>
            <div >

                <div className=" ws- full fixed bottom-0 left-0 w-full h-[60px] bg-blue-200 flex justify-end items-center p-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: '30px' }}
                    >
                        Save Draft
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}

                    >
                        Submit
                    </Button>
                </div>

            </div>
        </>

    );
};

export default VehicleTab;
