import { createServerFn } from "@tanstack/react-start";

const getEnv = (key: string): string => {
  return process.env[key] || import.meta.env[key] || "";
}; 

const getApiUrl = (): string => {
  const apiUrl = getEnv("API_URL").trim();

  return apiUrl.replace(/\/+$/, "");
};

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    throw new Error(
      "API_URL is not configured. Please add your Render backend URL to Vercel environment variables.",
    );
  }

  const url = `${apiUrl}${endpoint}`;

  console.log("Calling backend:", url);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    const responseText = await response.text();

    let result: any = {};

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        result = {
          success: false,
          error: responseText,
        };
      }
    }

    if (!response.ok) {
      throw new Error(
        result?.error ||
          result?.message ||
          `Backend request failed with status ${response.status}.`,
      );
    }

    return result;
  } catch (error: any) {
    console.error("Backend request failed:", {
      url,
      message: error?.message,
    });

    throw new Error(
      error?.message ||
        "Unable to connect to the backend server.",
    );
  }
};

/* -------------------------------------------------------------------------- */
/* SIGN UP                                                                    */
/* -------------------------------------------------------------------------- */

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  occupation: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  personalIdNumber?: string | undefined;
}

export const signupServerFn = createServerFn({ method: "POST" })
  .validator((data: SignupInput) => data)
  .handler(async ({ data }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        occupation,
        address,
        city,
        state,
        zipCode,
        country,
        maritalStatus,
        personalIdNumber,
      } = data;

      if (!firstName || !lastName || !email || !password || !phone) {
        return {
          success: false,
          error: "Missing required fields",
        };
      }

      const result = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          dateOfBirth,
          gender,
          occupation,
          address,
          city,
          state,
          zipCode,
          country,
          maritalStatus,
          personalIdNumber,
        }),
      });

      return result;
    } catch (error: any) {
      console.error("Signup API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Unable to connect to the backend server.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* SIGN IN                                                                    */
/* -------------------------------------------------------------------------- */

export interface SigninInput {
  email: string;
  password: string;
}

export const signinServerFn = createServerFn({ method: "POST" })
  .validator((data: SigninInput) => data)
  .handler(async ({ data }) => {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required.",
        };
      }

      const result = await apiRequest("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      return result;
    } catch (error: any) {
      console.error("Signin API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Unable to connect to the backend server.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* FORGOT PASSWORD                                                            */
/* -------------------------------------------------------------------------- */

export const forgotPasswordServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { email } = data;

      if (!email) {
        return {
          success: false,
          error: "Email required",
        };
      }

      const result = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });

      return result;
    } catch (error: any) {
      console.error("Forgot password API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Failed to send reset email.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* RESET PASSWORD                                                             */
/* -------------------------------------------------------------------------- */

export const resetPasswordServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      newPassword: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const { token, newPassword } = data;

      if (!token || !newPassword) {
        return {
          success: false,
          error: "Token and new password required",
        };
      }

      if (newPassword.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters",
        };
      }

      const result = await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      return result;
    } catch (error: any) {
      console.error("Reset password API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Failed to reset password.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* GET USER PROFILE / DASHBOARD                                               */
/* -------------------------------------------------------------------------- */

export const getDashboardDataServerFn = createServerFn({
  method: "POST",
})
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { token } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      const result = await apiRequest("/api/grants/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return result;
    } catch (error: any) {
      console.error("Dashboard API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Failed to fetch dashboard data.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* GRANT PACKAGES                                                             */
/* -------------------------------------------------------------------------- */

export const getGrantPackagesServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const result = await apiRequest("/api/grants/packages", {
      method: "GET",
    });

    return result;
  } catch (error: any) {
    console.error("Grant packages API error:", error);

    return {
      success: false,
      error:
        error?.message ||
        "Failed to fetch grant packages.",
      packages: [],
    };
  }
});

/* -------------------------------------------------------------------------- */
/* SELECT PACKAGE                                                             */
/* -------------------------------------------------------------------------- */

export const selectPackageServerFn = createServerFn({
  method: "POST",
})
  .validator(
    (data: {
      token: string;
      packageName: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const { token, packageName } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      if (!packageName) {
        return {
          success: false,
          error: "Package name is required.",
        };
      }

      const result = await apiRequest("/api/grants/select-package", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageName,
        }),
      });

      return result;
    } catch (error: any) {
      console.error("Select package API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Failed to select package.",
      };
    }
  });

/* -------------------------------------------------------------------------- */
/* CONFIRM PAYMENT                                                            */
/* -------------------------------------------------------------------------- */
export const confirmPaymentServerFn = createServerFn({
  method: "POST",
})
  .validator(
    (data: {
      token: string;
      transactionId: string;
      receiptPath?: string | undefined;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const {
        token,
        transactionId,
        receiptPath,
      } = data;

      if (!token) {
        return {
          success: false,
          error: "No authorization token provided",
        };
      }

      if (!transactionId) {
        return {
          success: false,
          error: "Transaction ID or confirmation code is required",
        };
      }

      const result = await apiRequest(
        "/api/grants/confirm-payment",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transactionId,
            receiptPath,
          }),
        },
      );

      return result;
    } catch (error: any) {
      console.error("Confirm payment API error:", error);

      return {
        success: false,
        error:
          error?.message ||
          "Failed to submit payment confirmation.",
      };
    }
  });
