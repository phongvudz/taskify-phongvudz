import { z } from "zod";

import { Card } from "@prisma/client";
import { DeleteCard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type InputType = z.infer<typeof DeleteCard>;
export type OutputType = ActionState<InputType, Card>;
