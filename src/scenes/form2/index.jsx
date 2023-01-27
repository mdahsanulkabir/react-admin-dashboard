
import { Box } from "@mui/material";
// import { useFormik } from "formik"; 
import { Formik, Form, Field, ErrorMessage, FieldArray, FastField } from "formik"; 
import * as Yup from 'yup';
import Header from "../../components/Header";
import TextError from "./TextError";

const initialValues = {
    name : '',
    email : '',
    channel : '',
    comments : '',
    address : '',
    social : {
        facebook : '',
        twitter: ''
    },
    phoneNumbers : ['',''],
    phNumbers : ['']
}

const onSubmit = values => {
    console.log('Form Data', values);
}

const validationSchema = Yup.object({
    name : Yup.string().required('Required'),
    email : Yup.string()
        .email('Invalid email format')
        .required('Required'),
    channel : Yup.string().required('Required')
})

const validateComments = value => {
    let error 
    if (!value) {
        error = 'Required'
    }
    return error;
}

const Form2 = () => {
    // const formik = useFormik({
    //     initialValues,
    //     onSubmit,
    //     // validate
    //     validationSchema
    // });

    // console.log('Visited Fields', formik.touched);

    return (
        <Box m="20px">
            <Header title="CREATE USER FOR CHANNEL" subtitle="Create a New User Channel" />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                // validateOnChange={false}
                // validateOnBlur={false}
                // validateOnMount      //it will help to initially validate the form while after load
            >
                {
                    formik => {
                        console.log('Formik props ', formik);
                        return (
                            <Form>
                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="name">Name</label>
                                    <Field 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        // onChange={formik.handleChange}
                                        // onBlur={formik.handleBlur}
                                        // value={formik.values.name}
                                        // {...formik.getFieldProps('name')}
                                        placeholder="Your name"
                                    />

                                    {/* {formik.touched.name && formik.errors.name ? <div style={{color : 'red'}}>{formik.errors.name}</div> : null} */}
                                    <ErrorMessage name='name' component={TextError}/>
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="email">Email</label>
                                    <Field 
                                        type="email" 
                                        name="email" 
                                        id="email" 
                                        // onChange={formik.handleChange}
                                        // onBlur={formik.handleBlur}
                                        // value={formik.values.email}
                                        // {...formik.getFieldProps('email')}
                                        placeholder="Your Email"
                                    />
                                    {/* {formik.touched.email && formik.errors.email ? <div style={{color : 'red'}}>{formik.errors.email}</div> : null} */}
                                    <ErrorMessage name='email'>
                                        {
                                            errorMsg => <div style={{color : 'red'}}>{errorMsg}</div>
                                        }
                                    </ErrorMessage>
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="channel">Channel</label>
                                    <Field 
                                        type="text" 
                                        name="channel" 
                                        id="channel" 
                                        // onChange={formik.handleChange}
                                        // onBlur={formik.handleBlur}
                                        // value={formik.values.channel}
                                        // {...formik.getFieldProps('channel')}
                                        placeholder="Youtube channel name"
                                    />
                                    {/* {formik.touched.channel && formik.errors.channel ? <div style={{color : 'red'}}>{formik.errors.channel}</div> : null} */}
                                    <ErrorMessage name='channel' component={TextError}/>
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="comments">Comments</label>
                                    <Field as='textarea' id='comments' name='comments' validate={validateComments} />
                                    {/* //? example of field level validation. it can be used in api call and then iterate over the json values to validate */}
                                    <ErrorMessage name='comments' component={TextError}/>
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="address">Address</label>
                                    <FastField name='address'>                   
                                    {/* //? render props pattern */}           
                                        {
                                            (props) => {
                                                const { field, form, meta } = props;
                                                // console.log('Render Props', props);
                                                // console.log('Field Render');
                                                return (
                                                    <div>
                                                        <input type='text' id='address' {...field}/>
                                                        {
                                                            meta.touched && meta.error ? <div>{meta.error}</div> : null
                                                        }
                                                    </div>
                                                )
                                            }
                                        }
                                    </FastField>
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="facebook">Facebook profile</label>
                                    <Field type='text' id='facebook' name='social.facebook' />
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="twitter">Twitter profile</label>
                                    <Field type='text' id='twitter' name='social.twitter' />
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="primaryPh">Primary Phone Number</label>
                                    <Field type='text' id='primaryPh' name='phoneNumbers[0]' />
                                </div>
                                
                                <div style={{marginBottom : "20px"}}>
                                    <label htmlFor="secondaryPh">Secondary Phone Number</label>
                                    <Field type='text' id='secondaryPh' name='phoneNumbers[1]' />
                                </div>

                                <div style={{marginBottom : "20px"}}>
                                    <label>List of Phone Numbers</label>
                                    <FieldArray name='phNumbers'>
                                        {
                                            (fieldArrayProps) => {
                                                // console.log('fieldArrayProps', fieldArrayProps);
                                                const { push, remove, form } = fieldArrayProps;
                                                const { values } = form;
                                                const { phNumbers } = values;
                                                console.log('form errors', form.errors);
                                                return (
                                                    <div>
                                                        {
                                                            phNumbers.map((phNumber, index ) => (
                                                                <div key={index}>
                                                                    <Field name={`phNumbers[${index}]`}/>
                                                                    {
                                                                        index > 0 && <button type='button' onClick={() => remove(index)}> {'   '}-{'   '} </button>
                                                                    }
                                                                    <button type='button' onClick={() => push('')}>{'   '}+{'   '}</button>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                        }
                                    </FieldArray>
                                </div>
                                <button type='button' onClick={() => formik.validateField('comments')}>Validate Comments</button>
                                <button type='button' onClick={() => formik.validateForm()}>Validate All</button>

                                <button type='submit' disabled={!(formik.dirty && formik.isValid)}>Submit</button>
                            </Form>
                        )
                    }
                }
                
            </Formik>
        </Box>
    );
};

export default Form2;