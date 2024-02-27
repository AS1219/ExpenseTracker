// LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

type LoginProps = {
    onLogin: (email: string, password: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid email format');
            return;
        }
        onLogin(email, password);
    };

    const validateEmail = (email: string) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#000000"
                keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    placeholderTextColor="#000000"
                />
                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={toggleShowPassword}>
                    <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        size={20}
                        color="#000000"
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleLogin} style={styles.btnContainer}>
                <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        marginBottom: 10,
        padding: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#000000',
        color: '#000000',
    },
    passwordContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#000000',
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        color: '#000000',
    },
    icon: {
        position: 'absolute',
        right: 15,
    },
    btnContainer: {
        width: '80%',
        height: 40,
        backgroundColor: '#9195F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        borderRadius: 30
    },
    btnText: {
        fontSize: 18,
        fontWeight: '300',
        color: 'white'
    }
});

export default Login;