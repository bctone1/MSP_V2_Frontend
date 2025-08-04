'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
        phone: '',
        phoneCode:'',
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [secretCodePhone, setSecretCodePhone] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailVerification = async () => {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCode(code);
            console.log(code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendEmail`, {
                email: formData.email,
                secretCode: code,
            });
            if (response.status === 200) {
                alert(response.data.message);
                setEmailVerified(true);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending the verification email.');
        }
    };

    const handlePhoneVerification = async () => {
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCodePhone(code);
            console.log(code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Phonerequest`, {
                phone_number: formData.phone,
                phoneCode: code,
            });
            if (response.status === 200) {
                alert(response.data.message);
                setPhoneVerified(true);
            }
        } catch (error) {
            console.error('Error sending Phone:', error);
            alert('An error occurred while sending the verification Phone.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, emailCode, phone, phoneCode } = formData;
        if (!name || !email || !password || !confirmPassword ) {
            alert('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!emailVerified) {
            alert('Please verify your email.');
            return;
        }
        if (emailCode !== secretCode) {
            alert('Invalid email verification code.');
            return;
        }

        if (!phoneVerified) {
            alert('Please verify your phone.');
            return;
        }
        if (phoneCode !== secretCodePhone) {
            alert('Invalid Phone verification code.');
            return;
        }



        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, formData);
            if (response.status === 200) {
                alert('Registration successful!');
                router.push("/login");
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <CardTitle className="flex items-center gap-2 self-center font-large">META LLM MSP</CardTitle>



                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Create an Account</CardTitle>
                        <CardDescription className="text-center">Sign up to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <Button type="button" onClick={handleEmailVerification} disabled={emailVerified} className="w-full">
                                {emailVerified ? 'Email Verified' : 'Verify Email'}
                            </Button>
                            <div>
                                <Label>Email Verification Code</Label>
                                <Input type="text" name="emailCode" value={formData.emailCode} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Phone</Label>
                                <Input type="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <Button type="button" onClick={handlePhoneVerification} disabled={phoneVerified} className="w-full">
                                {phoneVerified ? 'Phone Verified' : 'Verify Phone'}
                            </Button>

                            <div>
                                <Label>Phone Verification Code</Label>
                                <Input type="text" name="phoneCode" value={formData.phoneCode} onChange={handleChange} />
                            </div>

                            <div>
                                <Label>Password</Label>
                                <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label>Confirm Password</Label>
                                <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="w-full">Register</Button>
                            {/* <Button type="button" className="w-full" onClick={() => window.location = "/"}>Login</Button> */}

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <a
                                    className="underline underline-offset-4 cursor-pointer"
                                    onClick={() => window.location = "/"}
                                >
                                    Login
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
