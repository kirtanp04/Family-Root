import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Crypt } from "~/Common/Crypt";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const FamilySchema = z
    .object({
        userEmail: z.string(),
        familyName: z.string(),
        familyPic: z.string(),
        type: z.enum(["public", "private"]),
        key: z.string(),
        createdAt: z.date().default(new Date()),
        updatedAt: z.date().default(new Date()),
    })
    .refine(
        (data) => {
            if (data.type === "private" && !data.key) {
                return false;
            }
            return true;
        },
        {
            message: "Key is required when type is 'private'.",
            path: ["key"],
        },
    );






export const FamilyRoute = createTRPCRouter({
    getAllFamilies: protectedProcedure.query(async ({ ctx }) => {
        try {
            const Families = await ctx.db.family.findMany({});

            return Families;
        } catch (error: any) {
            throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        }
    }),

    getFamilyByID: protectedProcedure
        .input(
            z.object({
                familyID: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const Family = await ctx.db.family.findUnique({
                    where: {
                        id: input.familyID
                    }
                });

                if (Family === null) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Now such family, might wrong url or invalid credential." });
                }

                return Family;
            } catch (error: any) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
        }),

    validateFamily: protectedProcedure
        .input(
            z.object({
                familyKey: z.string(),
                familyID: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            try {
                const Family = await ctx.db.family.findUnique({
                    where: {
                        id: input.familyID,
                    },
                });

                if (Family === null) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Invalid Family credential, no such family found",
                    });
                }

                const isvalidKey = await Crypt.compareHash(
                    Family.key!,
                    input.familyKey,
                );

                if (isvalidKey.error !== "") {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Invalid credential, Enter valid key to View Family",
                    });
                }



                return Family;
            } catch (error: any) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
        }),

    CreateNewFamily: protectedProcedure
        .input(FamilySchema)
        .mutation(async ({ input, ctx }) => {
            try {
                const validationResult = FamilySchema.safeParse(input);
                if (!validationResult.success) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Validation failed.",
                    });
                }

                let newKey: string = input.key;

                if (input.type === "private") {
                    const HashPass = await Crypt.hashValue(input.key);

                    if (HashPass.error !== "") {
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: HashPass.error,
                        });
                    } else {
                        newKey = HashPass.data!;
                    }
                }

                await ctx.db.family.create({
                    data: {
                        familyName: input.familyName,
                        familyPic: input.familyPic,
                        type: input.type,
                        key: newKey,
                        createdAt: input.createdAt,
                        updatedAt: input.updatedAt,
                        userEmail: input.userEmail,
                        edge: [],
                        node: []

                    },
                });

                return "Success: Created new family";
            } catch (error: any) {
                throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
            }
        }),


    addNodeAndEdge: protectedProcedure.input(z.object({
        familyID: z.string(), node: z.any(),
        edge: z.any()
    })).mutation(async ({ ctx, input }) => {
        try {



            const Family = await ctx.db.family.findUnique({
                where: {
                    id: input.familyID
                }
            })

            if (Family === null) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid credential, Getting Family ID empty or url problem",
                });
            }

            await ctx.db.family.update({
                where: {
                    id: input.familyID
                },
                data: {
                    node: input.node,
                    edge: input.edge
                }
            })

            return "Success: Added new Member in" + " " + Family.familyName

        } catch (error: any) {
            throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
        }
    })
});
