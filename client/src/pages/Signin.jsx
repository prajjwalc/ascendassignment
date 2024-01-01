// ** React Imports
import React, { useContext, useState } from 'react'

// ** Component Imports
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

// ** React Router V6 Imports
import { useNavigate } from 'react-router-dom'

// ** Context
import { AuthContext } from '@/context/AuthContext'

const Signin = () => {
    // ** Hooks
    const navigate = useNavigate()
    const { toast } = useToast()
    const { login } = useContext(AuthContext)

    // ** State
    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    })

    // Function to handle form values
    const handleFormChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    // Function to handle form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Check if form values are empty
        if (formValues.email.trim() === '' || formValues.password.trim() === '') {
            toast({
                variant: "destructive",
                description: "All fields are required",
            })
        }
        const { success, message } = await login(formValues);
        if (success) {
            toast({
                description: message,
            })
            navigate('/');
        } else {
            toast({
                variant: "destructive",
                description: message,
            })
        }
    }

    return (
        <section
            className="flex flex-col items-center pt-2"
            style={{ height: "calc(100vh - 66px)" }}
        >

            <div className="bg-white w-full max-w-[1440px] md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center " >

                <div className="w-full h-100">

                    <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Log in to your account</h1>

                    <form className="mt-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="text-sm block text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="johndoe@gmail.com"
                                className="mt-1 focus:border-black/70 focus:outline-none"
                                autoFocus
                                autoComplete="true"
                                required
                                name="email"
                                value={formValues.email}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="text-sm block text-gray-700">Password</label>
                            <Input
                                type="password"
                                placeholder="your strong password"
                                className="mt-1 focus:border-black/70 focus:outline-none"
                                required
                                name="password"
                                value={formValues.password}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div className="text-right mt-2">
                            <Button
                                variant="link"
                                type="button"
                                size="sm"
                                className="text-sm text-gray-700 hover:text-black/70 focus:text-black/70"
                            >
                                Forgot Password?
                            </Button>
                        </div>

                        <Button
                            variant="default"
                            type="submit"
                            size="sm"
                            className="w-full mt-4"
                        >
                            Log In
                        </Button>
                    </form>

                    <hr className="my-5 border-gray-300 w-full" />

                    <p className="text-sm mt-0">
                        Need an account?
                        <Button
                            variant="link"
                            type="button"
                            size="sm"
                            className="text-sm px-1 text-gray-700 hover:text-black/70 focus:text-black/70"
                            onClick={() => navigate('/signup')}
                        >
                            Create an account here
                        </Button>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Signin