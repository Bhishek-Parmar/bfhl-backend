const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const isPrime = (num) => {
    if (!Number.isInteger(num) || num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const decodeBase64File = (base64String) => {
    try {
        const buffer = Buffer.from(base64String, "base64");
        const mimeType = mime.getType(buffer);
        return {
            valid: !!mimeType,
            mimeType,
            sizeKB: Math.round(buffer.length / 1024),
        };
    } catch (error) {
        return { valid: false, mimeType: null, sizeKB: 0 };
    }
};


// app.post("/bfhl", (req, res) => {
//     const { data, file_b64 } = req.body;

//     const response = {
//         is_success: false,
//         user_id: "bhishek_parmar_21042003",
//         email: "bhishekparmar210169@acropolis.in",
//         roll_number: "0827CS211059",
//         numbers: [],
//         alphabets: [],
//         highest_lowercase_alphabet: [],
//         is_prime_found: false,
//         file_valid: false,
//         file_mime_type: null,
//         file_size_kb: 0,
//     };

//     if (!Array.isArray(data)) {
//         return res.status(400).json({ is_success: false, error: "Invalid input format." });
//     }

//     const numbers = [];
//     const alphabets = [];
//     const charFrequency = new Map();
//     let hasPrime = false;

//     data.forEach((item) => {
//         if (!isNaN(item) && Number.isFinite(+item)) {
//             const number = parseInt(item, 10);
//             if (Number.isInteger(number)) {
//                 numbers.push(number);
//                 if (isPrime(number)) hasPrime = true;
//             }
//         } else if (/^[a-zA-Z]$/.test(item)) {
//             alphabets.push(item);
//             if (item >= "a" && item <= "z") {
//                 charFrequency.set(item, (charFrequency.get(item) || 0) + 1);
//             }
//         }
//     });

//     console.log(hasPrime);
    
//     let mostFrequentChar = null;
//     let maxFrequency = 0;
//     charFrequency.forEach((frequency, char) => {
//         if (frequency > maxFrequency) {
//             mostFrequentChar = char;
//             maxFrequency = frequency;
//         }
//     });

//     response.numbers = numbers.map(String);
//     response.alphabets = alphabets;
//     response.highest_lowercase_alphabet = mostFrequentChar ? [mostFrequentChar] : [];
//     response.is_prime_found = hasPrime;

//     if (file_b64) {
//         const { valid, mimeType, sizeKB } = decodeBase64File(file_b64);
//         response.file_valid = valid;
//         response.file_mime_type = mimeType;
//         response.file_size_kb = sizeKB;
//     }

//     response.is_success = true;
//     return res.json(response);
// });

app.post("/bfhl", (req, res) => {
    const { data, file_b64 } = req.body;

    const response = {
        is_success: false,
        user_id: "bhishek_parmar_21042003",
        email: "bhishekparmar210169@acropolis.in",
        roll_number: "0827CS211059",
        numbers: [],
        alphabets: [],
        highest_lowercase_alphabet: [],
        is_prime_found: false,
        file_valid: false,
        file_mime_type: null,
        file_size_kb: 0,
    };

    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: "Invalid input format." });
    }

    const numbers = [];
    const alphabets = [];
    let hasPrime = false;
    let highestLowercase = null;

    data.forEach((item) => {
        if (!isNaN(item) && Number.isFinite(+item)) {
            const number = parseInt(item, 10);
            if (Number.isInteger(number)) {
                numbers.push(number);
                if (isPrime(number)) hasPrime = true;
            }
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (item >= "a" && item <= "z") {
                if (!highestLowercase || item > highestLowercase) {
                    highestLowercase = item;
                }
            }
        }
    });

    response.numbers = numbers.map(String);
    response.alphabets = alphabets;
    response.highest_lowercase_alphabet = highestLowercase ? [highestLowercase] : [];
    response.is_prime_found = hasPrime;

    if (file_b64) {
        const { valid, mimeType, sizeKB } = decodeBase64File(file_b64);
        response.file_valid = valid;
        response.file_mime_type = mimeType;
        response.file_size_kb = sizeKB;
    }

    response.is_success = true;
    return res.json(response);
});



app.get("/bfhl", (req, res) => {
    const response = {
        operation_code: 1,
    };
    res.status(200).json(response);
});

app.get("/", (req, res) => {
    const projectInfo = {
        project_name: "Bajaj Finserv Health Challenge",
        description: "This is a backend API for processing arrays of data, identifying numbers, alphabets, finding the highest lowercase alphabet, and checking for prime numbers.",
        author: {
            name: "Bhishek Parmar",
            email: "bhishekparmar210169@acropolis.in",
            roll_number: "0827CS211059",
        },
        endpoints: [
            {
                path: "/bfhl",
                method: "POST",
                description: "Processes the input JSON data and returns segregated numbers, alphabets, the highest lowercase alphabet",
                request_body_example: {
                    data: ["A", "b", "c", "1", "2", "3"],
                    file_b64: "BASE64_ENCODED_STRING",
                },
                response_example: {
                    is_success: true,
                    user_id: "bhishek_parmar_21042003",
                    email: "bhishekparmar210169@acropolis.in",
                    roll_number: "0827CS211059",
                    numbers: ["1", "2", "3"],
                    alphabets: ["A", "b", "c"],
                    highest_lowercase_alphabet: ["c"],
                    is_prime_found: true,
                    file_valid: true,
                    file_mime_type: "application/pdf",
                    file_size_kb: 124,
                },
            },
            {
                path: "/bfhl",
                method: "GET",
                description: "Returns a simple JSON object with a predefined operation code.",
                response_example: {
                    operation_code: 1,
                },
            },
        ],
    };

    res.status(200).json(projectInfo);
});

const PORT = 5555;
app.listen(PORT, () => console.log(`Bajaj Finserv Health Challenge Server running on http://localhost:${PORT}`));
