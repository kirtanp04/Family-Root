import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Crypt } from "~/Common/Crypt";
import { Email } from "~/Common/Email";
import { Jwt } from "~/Common/JWT";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const UserSchema = z.object({
    email: z
        .string()
        .email("Email must be a valid email")
        .nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
    userName: z.string().nonempty("Name is required"),
});

export const UserRoute = createTRPCRouter({
    createNewUser: publicProcedure
        .input(UserSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const validationResult = UserSchema.safeParse(input);
                if (!validationResult.success) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Validation failed.",
                    });
                }
                const isUser = await ctx.db.user.findUnique({
                    where: {
                        email: input.email,
                    },
                });

                if (isUser !== null) {
                    if (isUser.provider === "GOOGLE") {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message:
                                "Email is already used as Google provider. Use new email id to create account.",
                        });
                    }

                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:
                            "Email id already exist. Use new email id to create account.",
                    });
                }

                const hashPass = await Crypt.hashValue(input.password);

                if (hashPass.error !== "") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Not abel to hash password. Please try after sometime.",
                    });
                }

                await ctx.db.user.create({
                    data: {
                        email: input.email,
                        name: input.userName,
                        password: hashPass.data!,
                        createdAt: new Date(),
                        isEmailVerified: false,
                        profileImg: "",
                        provider: "CREDENTIAL",
                    },
                });

                const token = Jwt.SignJwt({
                    name: input.userName,
                    email: input.email,
                    provider: "CREDENTIAL",

                }, '2m');

                const _Email = new Email();
                _Email.subject = "Email Verification";
                _Email.to = input.email;
                _Email.html = `
                                        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
                        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f7f7; padding: 20px;">
                        <tr>
                            <td>
                            <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);">
                                <!-- Header -->
                                <tr>
                                <td align="center" style="padding: 30px; background-color: #3b82f6; color: #ffffff;">
                                    <h1 style="margin: 0; font-size: 28px;">Welcome to Family Root</h1>
                                </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                <td style="padding: 30px; text-align: center;">
                                    <h2 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Verify Your Email Address</h2>
                                    <p style="font-size: 16px; color: #666666; line-height: 24px; margin-bottom: 30px;">
                                    Thank you for creating an account with Family Root! To complete your registration, please verify your email address by clicking the button below.
                                    </p>

                                    <!-- Verify Button -->
                                    <a href="http://localhost:3000/email-verification?token=${token.data}" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: #ffffff; background-color: #3b82f6; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    Verify Email
                                    </a>

                                    <p style="font-size: 14px; color: #999999; margin-top: 40px;">
                                    If you did not create an account with Family Root, please ignore this email.
                                    </p>
                                </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                <td style="background-color: #3b82f6; color: #ffffff; text-align: center; padding: 20px;">
                                    <p style="font-size: 14px; margin: 0;">
                                    &copy; 2024 Family Root. All rights reserved.
                                    </p>
                                  
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                             `;
                await _Email.sendEmail((err) => {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: err,
                    });
                });

                return "An email has been sent to your email id. Please verify to active your account";
            } catch (error: any) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
        }),

    verifyUserEmail: publicProcedure
        .input(
            z.object({
                token: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                if (
                    input.token === null ||
                    input.token === undefined ||
                    input.token === ""
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message:
                            "Invalid token request. Might invalid url or invalid token",
                    });
                }

                const decryptedToken = Jwt.VerifyJwt(input.token);

                if (decryptedToken.error !== "") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Crypto error: " + decryptedToken.error,
                    });
                }

                const token: {
                    name: string;
                    email: string;
                    provider: "CREDENTIAL";
                    createdOn: Date;
                } = decryptedToken.data;



                await ctx.db.user.update({
                    where: {
                        email: token.email,
                        name: token.name,
                        provider: "CREDENTIAL",
                    },
                    data: {
                        isEmailVerified: true,
                    },
                });

                return "Your Email has been verified successfully";

            } catch (error: any) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
        }),
});


