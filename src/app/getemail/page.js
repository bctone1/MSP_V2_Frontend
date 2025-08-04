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

export default function GetEmailwordPage({ className }) {

    const [phoneVerified, setPhoneVerified] = useState(false);
    const [secretCode, setSecretCode] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        phoneCode: '',
    });


    const [step, setStep] = useState(1); // 1: 이메일 인증 단계, 2: 비밀번호 변경 단계

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, phone, phoneCode } = formData;
        if (!name) {
            alert('인증을 요청해주세요.');
            return;
        }
        if (!phone) {
            alert('인증을 요청해주세요.');
            return;
        }
        if (phoneCode !== secretCode) {
            alert('인증번호를 확인해주세요.');
            return;
        }
        setStep(2);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handlePhoneVerification = async () => {
        const { name, phone } = formData;
        if (!name) {
            alert("이름을 입력해주세요.");
            return;
        }
        if (!phone) {
            alert('번호를 입력해주세요.');
            return;
        }
        try {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setSecretCode(code);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/findemail`, {
                name: name,
                phone: phone,
                secretCode: code,
            });
            const data = response.data;
            if (response.status === 200) {
                if (data.message == "성공") {
                    setPhoneVerified(true);
                    // alert(data.message);
                    setCurrentEmail(data.email);
                } else {
                    alert(data.email);
                }

            } else {
                alert("가입되지 않은 번호입니다.");
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
                    {/* 1단계: 가입 인증 */}
                    {step === 1 && (
                        <div className={cn("flex flex-col", className)}>
                            <CardHeader className="text-center">
                                <CardDescription>Please enter your info</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label>name</Label>
                                        <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">phone</Label>
                                        <Input type="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                    <Button type="button" onClick={handlePhoneVerification} disabled={phoneVerified} className="w-full">
                                        {phoneVerified ? 'Phone Verified' : 'Verify Phone'}
                                    </Button>

                                    <div>
                                        <Label>Phone Verification Code</Label>
                                        <Input type="text" name="phoneCode" value={formData.phoneCode} onChange={handleChange} />
                                    </div>

                                    <Button className="w-full" onClick={handleSubmit}>Next</Button>
                                </div>
                            </CardContent>

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
                        </div>



                    )}

                    {/* 2단계: 이메일 공개 */}
                    {step === 2 && (
                        <div className={cn("flex flex-col", className)}>
                            <CardHeader className="text-center">
                                <CardDescription>가입된 이메일은 아래와 같습니다.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="flex justify-center items-center gap-2 text-sm text-gray-700">
                                    <p className="font-semibold">Email:</p>
                                    <span>{currentEmail}</span>
                                </div>
                            </CardContent>
                            <div className="text-center text-sm mb-4">
                                <a className="underline underline-offset-4 cursor-pointer"
                                    onClick={() => window.location = "/"}
                                >
                                    Login
                                </a>

                                <span className='mr-2 ml-2'> / </span>

                                <a className="underline underline-offset-4 cursor-pointer"
                                    onClick={() => window.location = "/getpassword"}
                                >
                                    FindPassword
                                </a>
                            </div>

                        </div>
                    )}


                </Card>



            </div>
        </div>
    );
}
