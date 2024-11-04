import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';



const SignUpForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/register/", formData);
            setMessage("User registered successfully!");
        } catch (error) {
            setMessage("Registration failed.");
        }
    };

    return (
        <Container>
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>
                {message && <p>{message}</p>}
            </form>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <p className="text-center">
                        Already have an account? Then please, <Link to="/sign-in">Sign In.</Link>
                    </p>
                </Col>
            </Row>
            </div>
        </Container>
    );
}

export default SignUpForm;