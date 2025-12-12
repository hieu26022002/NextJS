import axios from "axios";
import Ajv, { ErrorObject } from "ajv";
import envConfig from "@/lib/config";

const ajv = new Ajv();

interface RegisterForm {
    email: string;
    password: string;
}

const registerSchema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
    },
    required: ["email", "password"],
    additionalProperties: false,
};

const validate = ajv.compile<RegisterForm>(registerSchema);

/**
 * Register a user.
 * - formData must match RegisterForm
 */
export async function registerUser(
    formData: RegisterForm
): Promise<{ success: boolean; data?: any; errors?: string[] }> {
    // Validate dữ liệu trước khi call API
    const valid = validate(formData);
    if (!valid) {
        const errs: ErrorObject[] = validate.errors ?? [];
        return {
            success: false,
            errors: errs.map((err) => {
                // instancePath can be empty string; format message clearly
                const path = err.instancePath ? `${err.instancePath} ` : "";
                const msg = err.message ?? "invalid";
                return `${path}${msg}`.trim();
            }),
        };
    }

    try {
        const response = await axios.post(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/register`, {
            email: formData.email,
            password: formData.password,
        });

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            errors: [
                error.response?.data?.message ?? error.response?.data ?? error.message ?? "Unknown error",
            ],
        };
    }
}