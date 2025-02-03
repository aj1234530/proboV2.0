"use server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../app/lib/auth";
import { POST } from "../app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";
// export const placeOrder = async (
//   eventName: string,
//   bidType: "yes" | "no",
//   bidQuantity: number,
//   price: number
// ) => {

//   const session: any = await getServerSession(NEXT_AUTH_CONFIG);
//   console.log(session);
//   const token = session?.accessToken;
//   //extracting cookies and server action don't send by themselves
//   //   const cookieStore = cookies();
//   //   const authCookie = (await cookieStore).get("next-auth.session-token")?.value;
//   // const authToken  = await getToken()
//   //   console.log("yourauthcookie", authCookie);
//   const response = await fetch(url, {
//     method: POST,
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: "auth-cookie",
//     },
//     body: JSON.stringify({
//       eventName: eventName,
//       bidQuantity: bidQuantity,
//       price: price,
//       bidType: bidType,
//     }),
//   });
//   //authorization is in cookie
//   const dataRecieved = await response.json();
//   return response;
// };
export const signupAction = async (formData: FormData) => {
  console.log(
    "code  at 1 url hit at :",
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signup`
  );
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    }
  );
  if (!response.ok) {
    const responseJson = await response.json();
    return {
      error: "signup failed",
    };
  }
  return {
    success: "Signup Success",
  };
};

export const rechargeAction = async (
  formData: FormData
): Promise<{ success?: string; error?: string }> => {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/recharge`;
  console.log("code  at 1 url hit at :", url, "seesion info:", session);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ balanceToAdd: formData.get("balance") }),
  });
  if (!response.ok) {
    const responseJson = await response.json();
    return {
      error: "signup failed",
    };
  }
  return {
    success: "Signup Success",
  };
};
//in server ,next js does not send cookies automatically
//
