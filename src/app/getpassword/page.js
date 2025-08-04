"use client";
import axios from 'axios';


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


import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function GetpasswordPage({ className }) {
    // const [email, setEmail] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        emailCode: '',
    });



    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, email } = formData;
        if (!password || !confirmPassword) {
            alert('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }



        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/FindPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newPasswordData: password, email: email }),
        });
        if (response.ok) {
            const data = await response.json(); // 응답 파싱
            alert("변경되었습니다!");
            window.location.href = "/"
        } else {
            console.error("Failed to fetch data");
        }


    }

    const [step, setStep] = useState(1); // 1: 이메일 인증 단계, 2: 비밀번호 변경 단계

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { emailCode } = formData;
        if (!emailCode) {
            alert('Please verify your Code.');
            return;
        }
        if (emailCode !== secretCode) {
            alert('Invalid email verification code.');
            return;
        }

        // setFormData(prev => ({ ...prev, email }));
        setStep(2); // 다음 단계로 이동
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleEmailVerification = async () => {
        const { email } = formData;
        if (!email) {
            alert('Please verify your Email.');
            return;
        }
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCode(code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendEmail`, {
                email: email,
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


    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <CardTitle className="flex items-center gap-2 self-center font-large">META LLM MSP</CardTitle>

                <Card>
                    {/* 1단계: 이메일 인증 */}
                    {step === 1 && (
                        <div className={cn("flex flex-col", className)}>
                            <CardHeader className="text-center">
                                <CardDescription>Please enter your email</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                        {/* <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                        /> */}
                                    </div>
                                    <Button type="button" onClick={handleEmailVerification} disabled={emailVerified} className="w-full">
                                        {emailVerified ? 'Email Verified' : 'Verify Email'}
                                    </Button>

                                    <div>
                                        <Label>Email Verification Code</Label>
                                        <Input type="text" name="emailCode" value={formData.emailCode} onChange={handleChange} />
                                    </div>

                                    <Button className="w-full" onClick={handleSubmit}>Next</Button>
                                </div>
                            </CardContent>
                        </div>
                    )}

                    {/* 2단계: 비밀번호 변경 */}
                    {step === 2 && (
                        <div className={cn("flex flex-col", className)}>
                            <CardHeader className="text-center">
                                <CardDescription>새로운 비밀번호를 입력해주세요!</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmitNewPassword} className="space-y-4">
                                    <div>
                                        <Label>Password</Label>
                                        <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <Label>Confirm Password</Label>
                                        <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>

                                    <Button type="submit" className="w-full">Change</Button>
                                </form>
                            </CardContent>
                        </div>
                    )}

                    <div className="text-center text-sm mb-4">
                        Don't have an account?{" "}
                        <a
                            className="underline underline-offset-4 cursor-pointer"
                            onClick={() => window.location = "/register"}
                        >
                            Sign up
                        </a>

                        <p>or</p>

                        Already have an account?{" "}
                        <a
                            className="underline underline-offset-4 cursor-pointer"
                            onClick={() => window.location = "/"}
                        >
                            Login
                        </a>
                    </div>
                </Card>



            </div>
        </div>
    );
}
