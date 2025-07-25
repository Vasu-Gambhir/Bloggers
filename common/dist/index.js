"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInput = exports.createBlogInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    email: zod_1.default.string().email("Invalid Email format"),
    password: zod_1.default.string().min(4, "Password should be of minimum 6 characters"),
    name: zod_1.default.string().trim().optional(),
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email("Invalid Email format"),
    password: zod_1.default.string(),
});
exports.createBlogInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
});
exports.updateBlogInput = zod_1.default.object({
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional(),
    id: zod_1.default.string(),
});
