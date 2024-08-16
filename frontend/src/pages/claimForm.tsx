import { useState } from "react";
import logo from "@/assets/logo.svg";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";

const ClaimForm = () => {
    const [formData, setFormData] = useState({
        policyNumber: '',
        policyholderName: '',
        vehicleMakeModel: '',
        vehicleYear: '',
        dateOfIncident: '',
        descriptionOfIncident: '',
        natureOfIncident: ''  // New field
    });

    const [loading, setLoading] = useState(false);
    const [responseStatus, setResponseStatus] = useState<'fraud' | 'warning' | 'success' | null>(null);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Simulate sending the data to the SageMaker endpoint
            const response = await fetch('https://8dojgwb3uk.execute-api.us-east-1.amazonaws.com/test/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)  // Send form data
            });

            const jsonResponse = await response.json();
            console.log(jsonResponse);  // Log the JSON data received from the API

            // Extract the body string
            const bodyString = jsonResponse.body;

            // Parse the body string to an object
            const bodyObject = JSON.parse(bodyString);

            // Extract the result value and parse it to a float
            const resultString = bodyObject.result;
            const result = parseFloat(resultString);

            if (result > 0.1) {
                setResponseStatus('fraud');
            } else if (result > 0.06) {
                setResponseStatus('warning');
            } else {
                setResponseStatus('success');
            }

        } catch (error: any) {
            setError('Failed to process the claim. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const renderResultPage = () => {
        switch (responseStatus) {
            case 'fraud':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-700">Fraud Detected!</h2>
                        <p className="text-lg mt-4">Your claim has been blocked due to suspected fraudulent activity.</p>
                    </div>
                );
            case 'warning':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-yellow-600">Warning: Potential Fraud!</h2>
                        <p className="text-lg mt-4">Your claim has been flagged for potential fraud. Please contact support for further assistance.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-700">Claim Submitted Successfully!</h2>
                        <p className="text-lg mt-4">Thank you for submitting your claim. We will review it and get back to you shortly.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex items-center justify-center relative">
            {/* Logo at the Top Left */}
            <div className="absolute top-4 left-4">
                <img src={logo} alt="Logo" className="h-12" />
            </div>

            <div className="w-full max-w-md p-4">
                {!responseStatus ? (
                    <Card className="border-green-600 border text-black w-full">
                        <CardHeader>
                            <CardTitle>Motor Vehicle Insurance Claim Form</CardTitle>
                            <CardDescription>Fill out your details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="policyNumber">Policy Number</Label>
                                        <Input
                                            id="policyNumber"
                                            name="policyNumber"
                                            placeholder="Enter your vehicle insurance policy number"
                                            value={formData.policyNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="vehicleMakeModel">Vehicle Make and Model</Label>
                                        <Input
                                            id="vehicleMakeModel"
                                            name="vehicleMakeModel"
                                            placeholder="Enter your vehicle's make and model"
                                            value={formData.vehicleMakeModel}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="vehicleYear">Vehicle Year</Label>
                                        <Input
                                            id="vehicleYear"
                                            name="vehicleYear"
                                            placeholder="Enter your vehicle's year"
                                            value={formData.vehicleYear}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="dateOfIncident">Date of Incident</Label>
                                        <Input
                                            id="dateOfIncident"
                                            name="dateOfIncident"
                                            type="date"
                                            placeholder="Enter the date of the incident"
                                            value={formData.dateOfIncident}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="natureOfIncident">Nature of Incident</Label>
                                        <select
                                            id="natureOfIncident"
                                            name="natureOfIncident"
                                            value={formData.natureOfIncident}
                                            onChange={handleInputChange}
                                            className="border rounded px-2 py-1"
                                        >
                                            <option value="">Select an option</option>
                                            <option value="theft">Theft</option>
                                            <option value="breakin">Break-in</option>
                                            <option value="accident">Accident</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="descriptionOfIncident">Description of Incident</Label>
                                        <Textarea
                                            id="descriptionOfIncident"
                                            name="descriptionOfIncident"
                                            placeholder="Describe what happened"
                                            value={formData.descriptionOfIncident}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 w-full text-lg">
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </CardFooter>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </Card>
                ) : (
                    renderResultPage()
                )}
            </div>
        </div>
    );
};

export default ClaimForm;
