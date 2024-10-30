import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';


const SignInForm = () => {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post("http://localhost:8000/api/token/", formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            setMessage("Logged in successfully!");
        } catch (error) {
            setMessage("Invalid username or password.");
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
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign In</button>
                {message && <p>{message}</p>}
            </form>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <p className="text-center">
                        Not registered yet? Then please, <Link to="/sign-up">Sign up.</Link>
                    </p>
                </Col>
            </Row>
        </div>
        </Container>
    );
}

export default SignInForm;