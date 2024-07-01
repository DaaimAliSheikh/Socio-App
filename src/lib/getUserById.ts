import React from "react";
import { db } from "../db/db";

const getUserById = async (id: string | undefined) => {
    if(id)return await db.user.findUnique({ where: { id } });
};

export default getUserById;
