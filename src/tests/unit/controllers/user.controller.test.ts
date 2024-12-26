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
        const phone = "01999999999";
        
        const response = await axios.post(baseURL,
            {
                userName,
                fullName,
                email,
                phone,
                password
            });
    
        expect(response.status).toBe(201);
        expect(response.data.message).toBe("User created successfully");

    });

    test("should return 409 if trying to create a user with an existing email or username or phone", async () => {
        const existingUser = {
            userName: "ahmedtanjir",
            fullName: "Ahmed Tanjir",
            email: "tanjir@gmail.com",
            password: "12345678",
            phone : "01999999999",
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
            userName: "ahmedtanjirkhan",
            fullName: "Ahmed Tanjir",
            email: "tanjirahmed",
            password: "12345678",
            phone : "01999999998",
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
            userName: "ah", //invalid username length
            fullName: "Ahmed Tanjir",
            email: "tanjirahammed@gmail.com",
            password: "12345678",
            phone: "01345698256"
        };
  
        try {
            await axios.post(baseURL, existingUser);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.log(axiosError.response);
                expect(axiosError.response?.status).toBe(500);
            } else {
                throw new Error("Unexpected error type");
            }
        }

        const existingUser2 = {
            userName: "ahmedtanjirkha",
            fullName: "Ahmed Tanjir",
            email: "tanjirahh@gmail.com",
            password: "1234567", //invalid password length
            phone: "01345698257"
        };
  
        try {
            await axios.post(baseURL, existingUser2);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(500);
            } else {
                throw new Error("Unexpected error type");
            }
        }

    });

    test("should return 400 if trying to create a user with invalid Length of phone", async () => {
        const existingUser3 = {
            userName: "ahmedtanjirkhw",
            fullName: "Ahmed Tanjir",
            email: "tanjiraaa@gmail.com",
            password: "12345678",
            phone: "0134569825"
        };
  
        try {
            await axios.post(baseURL, existingUser3);
        } catch (error: unknown) {
           
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(500);
            } else {
                throw new Error("Unexpected error type");
            }
        }
    })


    });
    



    

