import axios, { AxiosError } from 'axios';


describe("User controller", () => {
    const baseURL = "http://localhost:8000/api/v1/users/register";
    beforeAll(async () => {
        // Reset the database before tests
        await axios.post("http://localhost:8000/api/v1/test-utils/reset-db");
    });
    
    // user registration test
    test("User registration successfully done", async () => {
        const userName = "ahmedtanjir";
        const fullName = "Ahmed Tanjir";
        const email = "tanjir@gmail.com";
        const password = "12345678";
        
        const response = await axios.post(baseURL,
            {
                userName,
                fullName,
                email,
                password
            });
    
        expect(response.status).toBe(201);
        expect(response.data.message).toBe("User created successfully");

    });

    test("should return 409 if trying to create a user with an existing email or username", async () => {
        const existingUser = {
            userName: "ahmedtanjir",
            fullName: "Ahmed Tanjir",
            email: "tanjir@gmail.com",
            password: "12345678",
        };
  
        try {
            await axios.post(baseURL, existingUser);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(409);
            } else {
                throw new Error("Unexpected error type");
            }
        }
    });

    test("should return 400 if trying to create a user without required field", async () => {
        const existingUser = {
            userName: "ahmedtanjir",
            fullName: "Ahmed Tanjir",
            password: "12345678",
        };
  
        try {
            await axios.post(baseURL, existingUser);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(400);
            } else {
                throw new Error("Unexpected error type");
            }
        }
    });

    test("should return 400 if trying to create a user with invalid email", async () => {
        const existingUser = {
            userName: "ahmedtanjir",
            fullName: "Ahmed Tanjir",
            email: "tanjir",
            password: "12345678",
        };
  
        try {
            await axios.post(baseURL, existingUser);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(400);
            } else {
                throw new Error("Unexpected error type");
            }
        }
    });

    test("should return 400 if trying to create a user with invalid length of password and userName", async () => {
        const existingUser = {
            userName: "ah",
            fullName: "Ahmed Tanjir",
            email: "tanjir",
            password: "12345678",
        };
  
        try {
            await axios.post(baseURL, existingUser);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(400);
            } else {
                throw new Error("Unexpected error type");
            }
        }

        const existingUser2 = {
            userName: "ahmedtanjir",
            fullName: "Ahmed Tanjir",
            email: "tanjir",
            password: "1234567",
        };
  
        try {
            await axios.post(baseURL, existingUser2);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(400);
            } else {
                throw new Error("Unexpected error type");
            }
        }
    });


    });
    



    

