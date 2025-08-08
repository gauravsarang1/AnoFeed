import { Message } from "../models/User.models";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptMessage?: boolean;
    messages?: Array<Message>;
}